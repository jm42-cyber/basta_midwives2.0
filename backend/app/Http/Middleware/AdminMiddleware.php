<?php

namespace App\Http\Middleware;

use Closure;
use Illuminate\Http\Request;
use Symfony\Component\HttpFoundation\Response;

class AdminMiddleware
{
    public function handle(Request $request, Closure $next): Response
    {
        // Check if user is authenticated via Sanctum
        if (!$request->user()) {
            return response()->json(['message' => 'Unauthenticated'], 401);
        }

        // Check if user has admin role
        if ($request->user()->role !== 'admin') {
            return response()->json(['message' => 'Forbidden. Admin access required.'], 403);
        }

        return $next($request);
    }
}
