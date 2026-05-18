<?php

namespace App\Http\Controllers;

use App\Models\Barangay;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Cache;

class BarangayController extends Controller
{
    public function index()
    {
        // Cache barangays for 1 hour (3600 seconds)
        $barangays = Cache::remember('barangays_list', 3600, function () {
            return Barangay::orderBy('name')->get();
        });
        
        return response()->json([
            'data' => $barangays
        ]);
    }

    public function store(Request $request)
    {
        $validated = $request->validate([
            'name' => 'required|string|max:255|unique:barangays',
            'address' => 'nullable|string',
            'contact_number' => 'nullable|string',
            'barangay_captain' => 'nullable|string',
            'health_officer' => 'nullable|string',
            'population' => 'nullable|integer',
            'population_male' => 'nullable|integer',
            'population_female' => 'nullable|integer',
            'population_children' => 'nullable|integer',
            'latitude' => 'nullable|numeric',
            'longitude' => 'nullable|numeric',
        ]);

        $barangay = Barangay::create($validated);
        
        // Clear cache when new barangay is added
        Cache::forget('barangays_list');

        return response()->json($barangay, 201);
    }

    public function show($id)
    {
        $barangay = Barangay::findOrFail($id);
        
        return response()->json($barangay);
    }

    public function update(Request $request, $id)
    {
        $barangay = Barangay::findOrFail($id);

        $validated = $request->validate([
            'name' => 'sometimes|required|string|max:255|unique:barangays,name,' . $id,
            'address' => 'nullable|string',
            'contact_number' => 'nullable|string',
            'barangay_captain' => 'nullable|string',
            'health_officer' => 'nullable|string',
            'population' => 'nullable|integer',
            'population_male' => 'nullable|integer',
            'population_female' => 'nullable|integer',
            'population_children' => 'nullable|integer',
            'latitude' => 'nullable|numeric',
            'longitude' => 'nullable|numeric',
        ]);

        $barangay->update($validated);
        
        // Clear cache when barangay is updated
        Cache::forget('barangays_list');

        return response()->json($barangay);
    }

    public function destroy($id)
    {
        $barangay = Barangay::findOrFail($id);
        $barangay->delete();
        
        // Clear cache when barangay is deleted
        Cache::forget('barangays_list');

        return response()->json(['message' => 'Barangay deleted successfully']);
    }
}
