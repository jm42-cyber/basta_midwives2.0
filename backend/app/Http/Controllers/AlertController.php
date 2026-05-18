<?php

namespace App\Http\Controllers;

use App\Models\Alert;
use App\Models\User;
use Illuminate\Http\Request;
use Illuminate\Http\JsonResponse;
use Illuminate\Support\Facades\Validator;
use Illuminate\Support\Facades\Log;

class AlertController extends Controller
{
    public function index(Request $request): JsonResponse
    {
        try {
            $user = $request->user();

            if ($user->role === 'admin') {
                $alerts = Alert::orderBy('created_at', 'desc')->get();
                return response()->json($alerts);
            }

            // Get midwife's barangay IDs
            $barangayIds = [];
            try {
                $barangayIds = $user->barangays()->pluck('barangays.id')->toArray();
            } catch (\Exception $e) {
                \Log::warning('Could not fetch barangay IDs for user ' . $user->id . ': ' . $e->getMessage());
            }

            $midwifeId = $user->id;

            $alerts = Alert::where(function ($query) use ($barangayIds, $midwifeId) {
                // All midwives broadcast from admin
                $query->where(function ($q) {
                    $q->where('recipient_type', 'all')
                      ->where('sender_role', 'admin');
                });

                // By barangay from admin
                if (!empty($barangayIds)) {
                    $query->orWhere(function ($q) use ($barangayIds) {
                        $q->where('recipient_type', 'barangay')
                          ->where('sender_role', 'admin')
                          ->where(function ($q2) use ($barangayIds) {
                              foreach ($barangayIds as $id) {
                                  $q2->orWhereRaw('JSON_CONTAINS(recipient_ids, ?)', [json_encode((int)$id)]);
                              }
                          });
                    });
                }

                // Specific midwife from admin
                $query->orWhere(function ($q) use ($midwifeId) {
                    $q->where('recipient_type', 'specific')
                      ->where('sender_role', 'admin')
                      ->whereRaw('JSON_CONTAINS(recipient_ids, ?)', [json_encode((int)$midwifeId)]);
                });

                // Midwife's own sent messages
                $query->orWhere(function ($q) use ($midwifeId) {
                    $q->where('sender_id', $midwifeId)
                      ->where('sender_role', 'midwife');
                });
            })
            ->orderBy('created_at', 'desc')
            ->get();

            // Safely append sender info
            $alerts->transform(function ($alert) {
                if ($alert->sender_role === 'midwife') {
                    try {
                        $sender = \App\Models\User::find($alert->sender_id);
                        if ($sender) {
                            $alert->sender_name = trim("{$sender->first_name} {$sender->last_name}");
                            $barangay = $sender->barangays()->first();
                            $alert->sender_barangay = $barangay ? $barangay->name : 'N/A';
                        } else {
                            $alert->sender_name = 'Unknown';
                            $alert->sender_barangay = 'N/A';
                        }
                    } catch (\Exception $e) {
                        $alert->sender_name = 'Unknown';
                        $alert->sender_barangay = 'N/A';
                    }
                }
                return $alert;
            });

            return response()->json($alerts);

        } catch (\Exception $e) {
            \Log::error('AlertController::index failed: ' . $e->getMessage() . ' at ' . $e->getFile() . ':' . $e->getLine());
            return response()->json([
                'error' => 'Failed to fetch alerts',
                'message' => $e->getMessage()
            ], 500);
        }
    }

    public function count(Request $request): JsonResponse
    {
        try {
            $user = $request->user();

            if ($user->role === 'admin') {
                $count = Alert::where('sender_role', 'midwife')
                    ->whereNull('reply')
                    ->count();
                return response()->json(['count' => $count]);
            }

            // Cache barangay IDs for 5 minutes instead of querying every poll
            $barangayIds = cache()->remember(
                "user_{$user->id}_barangay_ids",
                300, // 5 minutes
                fn() => $user->barangays()->pluck('barangays.id')->toArray()
            );

            $midwifeId = $user->id;

            $count = Alert::where('sender_role', 'admin')
                ->whereNull('read_at')
                ->where(function ($query) use ($barangayIds, $midwifeId) {
                    $query->where('recipient_type', 'all');

                    if (!empty($barangayIds)) {
                        $query->orWhere(function ($q) use ($barangayIds) {
                            $q->where('recipient_type', 'barangay')
                              ->where(function ($q2) use ($barangayIds) {
                                  foreach ($barangayIds as $id) {
                                      $q2->orWhereRaw('JSON_CONTAINS(recipient_ids, ?)', [json_encode((int)$id)]);
                                  }
                              });
                        });
                    }

                    $query->orWhere(function ($q) use ($midwifeId) {
                        $q->where('recipient_type', 'specific')
                          ->whereRaw('JSON_CONTAINS(recipient_ids, ?)', [json_encode((int)$midwifeId)]);
                    });
                })
                ->count();

            return response()->json(['count' => $count]);

        } catch (\Exception $e) {
            \Log::error('AlertController::count failed: ' . $e->getMessage());
            return response()->json(['count' => 0]);
        }
    }

    public function store(Request $request): JsonResponse
    {
        try {
            $user = $request->user();
            
            if ($user->role === 'admin') {
                $validator = Validator::make($request->all(), [
                    'title' => 'required|string|max:255',
                    'message' => 'required|string',
                    'type' => 'required|in:info,warning,success,error',
                    'priority' => 'required|in:low,medium,high,urgent',
                    'recipient_type' => 'required|in:all,barangay,specific',
                    'recipient_ids' => 'nullable|array',
                    'recipient_ids.*' => 'integer',
                    'expires_at' => 'nullable|date',
                ]);
                
                if ($validator->fails()) {
                    return response()->json(['errors' => $validator->errors()], 422);
                }
                
                $alert = Alert::create([
                    'title' => $request->title,
                    'message' => $request->message,
                    'type' => $request->type,
                    'priority' => $request->priority,
                    'sender_role' => 'admin',
                    'sender_id' => $user->id,
                    'recipient_type' => $request->recipient_type,
                    'recipient_ids' => $request->recipient_ids,
                    'expires_at' => $request->expires_at,
                ]);
            } else {
                // Midwife sending message to admin
                $validator = Validator::make($request->all(), [
                    'title' => 'required|string|max:255',
                    'message' => 'required|string',
                    'type' => 'required|in:info,warning,success,error',
                    'priority' => 'required|in:low,medium,high,urgent',
                ]);
                
                if ($validator->fails()) {
                    return response()->json(['errors' => $validator->errors()], 422);
                }
                
                $alert = Alert::create([
                    'title' => $request->title,
                    'message' => $request->message,
                    'type' => $request->type,
                    'priority' => $request->priority,
                    'sender_role' => 'midwife',
                    'sender_id' => $user->id,
                    'recipient_type' => 'admin',
                    'recipient_ids' => null,
                ]);
            }
            
            return response()->json($alert, 201);
            
        } catch (\Exception $e) {
            Log::error('Alert store error: ' . $e->getMessage());
            return response()->json(['error' => 'Failed to create alert', 'details' => $e->getMessage()], 500);
        }
    }

    public function destroy(Request $request, $id): JsonResponse
    {
        try {
            $user = $request->user();
            $alert = Alert::findOrFail($id);
            
            // Only allow deletion of own alerts
            if ($alert->sender_id !== $user->id) {
                return response()->json(['message' => 'Unauthorized'], 403);
            }
            
            // Midwives can only delete messages with no reply
            if ($user->role === 'midwife' && $alert->reply !== null) {
                return response()->json(['message' => 'Cannot delete messages with replies'], 403);
            }
            
            $alert->delete();
            
            return response()->json(['message' => 'Alert deleted successfully']);
            
        } catch (\Exception $e) {
            Log::error('Alert destroy error: ' . $e->getMessage());
            return response()->json(['error' => 'Failed to delete alert', 'details' => $e->getMessage()], 500);
        }
    }

    public function reply(Request $request, $id): JsonResponse
    {
        try {
            $user = $request->user();
            
            if ($user->role !== 'admin') {
                return response()->json(['message' => 'Unauthorized'], 403);
            }
            
            $validator = Validator::make($request->all(), [
                'reply' => 'required|string',
            ]);
            
            if ($validator->fails()) {
                return response()->json(['errors' => $validator->errors()], 422);
            }
            
            $alert = Alert::findOrFail($id);
            
            if ($alert->sender_role !== 'midwife') {
                return response()->json(['message' => 'Can only reply to midwife messages'], 400);
            }
            
            $alert->update([
                'reply' => $request->reply,
                'reply_at' => now(),
            ]);
            
            return response()->json($alert);
            
        } catch (\Exception $e) {
            Log::error('Alert reply error: ' . $e->getMessage());
            return response()->json(['error' => 'Failed to send reply', 'details' => $e->getMessage()], 500);
        }
    }

    public function markRead(Request $request, $id): JsonResponse
    {
        try {
            $alert = Alert::findOrFail($id);
            
            $alert->update([
                'read_at' => now(),
            ]);
            
            return response()->json($alert);
            
        } catch (\Exception $e) {
            Log::error('Alert markRead error: ' . $e->getMessage());
            return response()->json(['error' => 'Failed to mark as read', 'details' => $e->getMessage()], 500);
        }
    }

    public function getMidwivesList(Request $request): JsonResponse
    {
        try {
            $user = $request->user();
            
            if ($user->role !== 'admin') {
                return response()->json(['message' => 'Unauthorized'], 403);
            }
            
            $midwives = User::where('role', 'midwife')
                ->where('status', 'approved')
                ->with('barangays')
                ->get()
                ->map(function ($midwife) {
                    $barangay = $midwife->barangays->first();
                    return [
                        'id' => $midwife->id,
                        'full_name' => $midwife->full_name,
                        'barangay_name' => $barangay ? $barangay->name : 'No barangay assigned',
                    ];
                });
            
            return response()->json($midwives);
            
        } catch (\Exception $e) {
            Log::error('Alert getMidwivesList error: ' . $e->getMessage());
            return response()->json(['error' => 'Failed to fetch midwives list', 'details' => $e->getMessage()], 500);
        }
    }
}
