<?php

namespace App\Http\Controllers;

use App\Models\User;
use App\Mail\EmailChangedMail;
use App\Mail\PasswordChangedMail;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Facades\Mail;

class UserController extends Controller
{
    public function index(Request $request)
    {
        $query = User::query();
        
        if ($request->has('role')) {
            $query->where('role', $request->role);
        }
        
        if ($request->has('status')) {
            $query->where('status', $request->status);
        }
        
        if ($request->has('search')) {
            $search = $request->search;
            $query->where(function($q) use ($search) {
                $q->where('first_name', 'like', "%{$search}%")
                  ->orWhere('last_name', 'like', "%{$search}%")
                  ->orWhere('email', 'like', "%{$search}%")
                  ->orWhere('username', 'like', "%{$search}%");
            });
        }
        
        $users = $query->orderBy('created_at', 'desc')->paginate(15);
        
        return response()->json($users);
    }
    
    public function show($id)
    {
        $user = User::findOrFail($id);
        return response()->json($user);
    }
    
    public function store(Request $request)
    {
        $validated = $request->validate([
            'first_name' => 'required|string|max:255',
            'middle_name' => 'nullable|string|max:255',
            'last_name' => 'required|string|max:255',
            'username' => 'required|string|unique:users|max:255',
            'email' => 'required|email|unique:users',
            'password' => 'required|string|min:8',
            'contact_number' => 'nullable|string|max:20',
            'role' => 'required|in:admin,midwife',
            'status' => 'required|in:pending,approved,rejected,inactive',
        ]);
        
        $validated['password'] = Hash::make($validated['password']);
        
        $user = User::create($validated);
        
        return response()->json($user, 201);
    }
    
    public function update(Request $request, $id)
    {
        $user = User::findOrFail($id);
        
        $validated = $request->validate([
            'first_name' => 'sometimes|string|max:255',
            'middle_name' => 'nullable|string|max:255',
            'last_name' => 'sometimes|string|max:255',
            'username' => 'sometimes|string|unique:users,username,' . $id . '|max:255',
            'email' => 'sometimes|email|unique:users,email,' . $id,
            'password' => 'sometimes|string|min:8',
            'contact_number' => 'nullable|string|max:20',
            'role' => 'sometimes|in:admin,midwife',
            'status' => 'sometimes|in:pending,approved,rejected,inactive',
        ]);
        
        // Check if email is being changed
        if (isset($validated['email']) && $validated['email'] !== $user->email) {
            $oldEmail = $user->email;
            $newEmail = $validated['email'];
            
            // Send notification to old email
            Mail::to($oldEmail)->send(new EmailChangedMail($user, $oldEmail, $newEmail));
        }
        
        // Check if password is being changed
        if (isset($validated['password'])) {
            $validated['password'] = Hash::make($validated['password']);
            
            // Send password changed notification
            Mail::to($user->email)->send(new PasswordChangedMail($user));
        }
        
        $user->update($validated);
        
        return response()->json($user);
    }
    
    public function destroy($id)
    {
        $user = User::findOrFail($id);
        $user->delete();
        
        return response()->json(['message' => 'User deleted successfully']);
    }
    
    public function approve(Request $request, $id)
    {
        $request->validate([
            'barangays'   => 'required|array|min:1|max:3',
            'barangays.*' => 'exists:barangays,id',
        ]);

        $user = User::findOrFail($id);

        $user->update([
            'status'      => 'approved',
            'approved_by' => auth()->id(),
            'approved_at' => now(),
        ]);

        $user->barangays()->sync($request->barangays);

        return response()->json(['message' => 'User approved successfully', 'user' => $user->load('barangays')]);
    }
    
    public function reject($id)
    {
        $user = User::findOrFail($id);
        
        $user->update([
            'status' => 'rejected',
        ]);
        
        return response()->json(['message' => 'User rejected successfully', 'user' => $user]);
    }
    
    public function toggleStatus($id)
    {
        $user = User::findOrFail($id);
        
        $newStatus = $user->status === 'approved' ? 'rejected' : 'approved';
        
        $user->update([
            'status' => $newStatus,
            'approved_by' => $newStatus === 'approved' ? auth()->id() : null,
            'approved_at' => $newStatus === 'approved' ? now() : null,
        ]);
        
        return response()->json(['message' => 'User status updated successfully', 'user' => $user]);
    }
}
