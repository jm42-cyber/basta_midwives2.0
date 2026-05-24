<?php

namespace App\Http\Controllers;

use App\Models\User;
use App\Models\AuditLog;
use App\Models\UserSession;
use App\Mail\RegistrationPendingMail;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Facades\Mail;
use Illuminate\Support\Facades\Validator;
use Illuminate\Validation\ValidationException;

class AuthController extends Controller
{
    public function register(Request $request)
    {
        $validator = Validator::make($request->all(), [
            'first_name' => 'required|string|max:50|regex:/^[a-zA-Z\s]+$/',
            'middle_name' => 'nullable|string|max:50|regex:/^[a-zA-Z\s]+$/',
            'last_name' => 'required|string|max:50|regex:/^[a-zA-Z\s]+$/',
            'username' => 'required|string|min:4|max:50|unique:users',
            'email' => 'required|email|max:100|unique:users',
            'password' => 'required|string|min:8|confirmed',
            'contact_number' => 'required|digits:11|unique:users',
            'barangays' => 'nullable|array|max:3',
            'barangays.*' => 'exists:barangays,id',
        ]);

        if ($validator->fails()) {
            return response()->json(['errors' => $validator->errors()], 422);
        }

        $user = User::create([
            'first_name' => ucwords(trim($request->first_name)),
            'middle_name' => $request->middle_name ? ucwords(trim($request->middle_name)) : null,
            'last_name' => ucwords(trim($request->last_name)),
            'username' => trim($request->username),
            'email' => strtolower(trim($request->email)),
            'password' => Hash::make($request->password),
            'contact_number' => $request->contact_number,
            'role' => 'midwife',
            'status' => 'pending',
            'email_verified' => false,
        ]);

        if ($request->barangays) {
            $user->barangays()->attach($request->barangays);
        }

        AuditLog::create([
            'user_id' => $user->id,
            'action' => "New midwife registration: {$user->username} - Email: {$user->email}",
        ]);

        // Send registration pending email
        Mail::to($user->email)->send(new RegistrationPendingMail($user));

        return response()->json([
            'message' => 'Registration successful! Please wait for admin approval.',
            'user' => $user->load('barangays'),
        ], 201);
    }

    public function login(Request $request)
    {
        $validator = Validator::make($request->all(), [
            'username_or_email' => 'required|string',
            'password' => 'required|string',
        ]);

        if ($validator->fails()) {
            return response()->json(['errors' => $validator->errors()], 422);
        }

        $user = User::where('username', $request->username_or_email)
            ->orWhere('email', $request->username_or_email)
            ->first();

        if (!$user || !Hash::check($request->password, $user->password)) {
            throw ValidationException::withMessages([
                'username_or_email' => ['Invalid credentials'],
            ]);
        }

        if ($user->role === 'midwife' && !$user->email_verified) {
            return response()->json(['message' => 'Please verify your email first.'], 403);
        }

        if ($user->role === 'midwife' && $user->status !== 'approved') {
            return response()->json(['message' => 'Your account is ' . $user->status], 403);
        }

        $user->update(['last_login' => now()]);
        $token = $user->createToken('auth-token')->plainTextToken;

        // Create user session record
        $session = UserSession::create([
            'user_id' => $user->id,
            'session_type' => 'login',
            'ip_address' => $request->ip(),
            'user_agent' => $request->userAgent(),
            'session_time' => now(),
        ]);

        // Create audit log with session reference
        AuditLog::create([
            'user_id' => $user->id,
            'action' => 'login',
            'table_name' => 'user_sessions',
            'record_id' => $session->id,
            'timestamp' => now(),
        ]);

        return response()->json([
            'message' => 'Login successful',
            'user' => $user->load('barangays'),
            'token' => $token,
        ]);
    }

    public function logout(Request $request)
    {
        // Create user session record
        $session = UserSession::create([
            'user_id' => $request->user()->id,
            'session_type' => 'logout',
            'ip_address' => $request->ip(),
            'user_agent' => $request->userAgent(),
            'session_time' => now(),
        ]);

        // Create audit log with session reference
        AuditLog::create([
            'user_id' => $request->user()->id,
            'action' => 'logout',
            'table_name' => 'user_sessions',
            'record_id' => $session->id,
            'timestamp' => now(),
        ]);

        $request->user()->currentAccessToken()->delete();
        return response()->json(['message' => 'Logged out successfully']);
    }

    public function me(Request $request)
    {
        return response()->json($request->user()->load('barangays'));
    }

    public function verifyPassword(Request $request)
    {
        $validator = Validator::make($request->all(), [
            'password' => 'required|string',
        ]);

        if ($validator->fails()) {
            return response()->json(['errors' => $validator->errors()], 422);
        }

        $user = $request->user();

        if (!Hash::check($request->password, $user->password)) {
            return response()->json([
                'message' => 'Incorrect password',
                'valid' => false
            ], 401);
        }

        return response()->json([
            'message' => 'Password verified',
            'valid' => true
        ]);
    }

    public function getUserBarangays(Request $request)
    {
        $user = $request->user();
        $barangays = $user->barangays;

        return response()->json([
            'barangays' => $barangays
        ]);
    }
}
