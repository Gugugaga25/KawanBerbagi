<?php

namespace App\Http\Controllers;

use App\Models\Chat;
use App\Models\Message;
use App\Models\Donor;
use App\Models\Shelter;
use App\Services\GeminiService;
use Illuminate\Http\Request;
use Inertia\Inertia;

class ChatController extends Controller
{
    public function donorIndex(Request $request)
    {
        $donor = Donor::where('id_user', auth()->id())->firstOrFail();

        $chats = Chat::where('id_donor', $donor->id_donor)
            ->with(['shelter.user', 'admin', 'messages' => function ($query) {
                $query->orderBy('created_at', 'asc');
            }])
            ->get()
            ->map(function ($chat) {
                $lastMessage = $chat->messages->last();
                $unreadCount = $chat->messages
                    ->where('id_sender', '!=', auth()->id())
                    ->where('is_read', false)
                    ->count();

                $shelterData = null;
                if ($chat->shelter) {
                    $shelterData = [
                        'id_shelter' => $chat->shelter->id_shelter,
                        'nama_yayasan' => $chat->shelter->nama_yayasan,
                        'foto_profil' => $chat->shelter->foto_profil ? asset('storage/' . $chat->shelter->foto_profil) : null,
                        'username' => $chat->shelter->username ?? $chat->shelter->user->name,
                    ];
                } elseif ($chat->id_admin) {
                    $shelterData = [
                        'id_shelter' => 'admin-' . $chat->id_admin,
                        'nama_yayasan' => 'Admin KawanBerbagi',
                        'foto_profil' => null,
                        'username' => 'admin',
                    ];
                }

                return [
                    'id_chat' => $chat->id_chat,
                    'shelter' => $shelterData,
                    'last_message' => $lastMessage ? $lastMessage->message : null,
                    'last_message_time' => $lastMessage ? $lastMessage->created_at->toIso8601String() : null,
                    'unread_count' => $unreadCount,
                ];
            });

        return Inertia::render('Donatur/DonaturChat', [
            'chats' => $chats,
            'activeChatId' => $request->query('active_chat') ? (is_numeric($request->query('active_chat')) ? (int) $request->query('active_chat') : $request->query('active_chat')) : null,

            'donaturData' => [
                'id_donor' => $donor->id_donor,
                'nama_lengkap' => $donor->nama_lengkap,
                'foto_profil' => $donor->foto_profil ? asset('storage/' . $donor->foto_profil) : null,
            ],
        ]);
    }

    public function shelterIndex(Request $request)
    {
        $shelter = Shelter::where('id_user', auth()->id())->firstOrFail();

        $chats = Chat::where('id_shelter', $shelter->id_shelter)
            ->with(['donor.user', 'admin', 'messages' => function ($query) {
                $query->orderBy('created_at', 'asc');
            }])
            ->get()
            ->map(function ($chat) {
                $lastMessage = $chat->messages->last();
                $unreadCount = $chat->messages
                    ->where('id_sender', '!=', auth()->id())
                    ->where('is_read', false)
                    ->count();

                $donorData = null;
                if ($chat->donor) {
                    $donorData = [
                        'id_donor' => $chat->donor->id_donor,
                        'nama_lengkap' => $chat->donor->nama_lengkap,
                        'foto_profil' => $chat->donor->foto_profil ? asset('storage/' . $chat->donor->foto_profil) : null,
                    ];
                } elseif ($chat->id_admin) {
                    $donorData = [
                        'id_donor' => 'admin-' . $chat->id_admin,
                        'nama_lengkap' => 'Admin KawanBerbagi',
                        'foto_profil' => null,
                    ];
                }

                return [
                    'id_chat' => $chat->id_chat,
                    'donor' => $donorData,
                    'last_message' => $lastMessage ? $lastMessage->message : null,
                    'last_message_time' => $lastMessage ? $lastMessage->created_at->toIso8601String() : null,
                    'unread_count' => $unreadCount,
                ];
            });

        return Inertia::render('Panti/PantiChat', [
            'chats' => $chats,
            'activeChatId' => $request->query('active_chat') ? (int) $request->query('active_chat') : null,
            'pantiData' => $shelter,
        ]);
    }

    public function initChat($id_shelter)
    {
        $donor = Donor::where('id_user', auth()->id())->firstOrFail();

        // Cari atau buat chat baru
        $chat = Chat::firstOrCreate([
            'id_donor' => $donor->id_donor,
            'id_shelter' => $id_shelter,
        ]);

        return redirect()->route('donatur.chat', ['active_chat' => $chat->id_chat]);
    }

    public function getMessages($id_chat)
    {
        $chat = Chat::findOrFail($id_chat);

        // Verifikasi kepemilikan
        $donor = Donor::where('id_user', auth()->id())->first();
        $shelter = Shelter::where('id_user', auth()->id())->first();

        $authorized = false;
        if ($donor && $chat->id_donor === $donor->id_donor) {
            $authorized = true;
        } elseif ($shelter && $chat->id_shelter === $shelter->id_shelter) {
            $authorized = true;
        } elseif ($chat->id_admin === auth()->id()) {
            $authorized = true;
        }

        if (!$authorized) {
            abort(403, 'Unauthorized chat access');
        }

        // Tandai pesan dari lawan bicara sebagai read
        Message::where('id_chat', $id_chat)
            ->where('id_sender', '!=', auth()->id())
            ->where('is_read', false)
            ->update(['is_read' => true]);

        $messages = Message::where('id_chat', $id_chat)
            ->orderBy('created_at', 'asc')
            ->get()
            ->map(function ($msg) {
                return [
                    'id_message' => $msg->id_message,
                    'id_chat' => $msg->id_chat,
                    'id_sender' => $msg->id_sender,
                    'message' => $msg->message,
                    'is_read' => $msg->is_read,
                    'created_at' => $msg->created_at->toIso8601String(),
                ];
            });

        return response()->json([
            'messages' => $messages,
        ]);
    }

    public function sendMessage(Request $request, $id_chat)
    {
        $chat = Chat::findOrFail($id_chat);

        // Verifikasi kepemilikan
        $donor = Donor::where('id_user', auth()->id())->first();
        $shelter = Shelter::where('id_user', auth()->id())->first();

        $authorized = false;
        if ($donor && $chat->id_donor === $donor->id_donor) {
            $authorized = true;
        } elseif ($shelter && $chat->id_shelter === $shelter->id_shelter) {
            $authorized = true;
        } elseif ($chat->id_admin === auth()->id()) {
            $authorized = true;
        }

        if (!$authorized) {
            abort(403, 'Unauthorized chat access');
        }

        $request->validate([
            'message' => 'required|string',
        ]);

        $message = Message::create([
            'id_chat' => $id_chat,
            'id_sender' => auth()->id(),
            'message' => $request->message,
            'is_read' => false,
        ]);

        return response()->json([
            'success' => true,
            'message' => [
                'id_message' => $message->id_message,
                'id_chat' => $message->id_chat,
                'id_sender' => $message->id_sender,
                'message' => $message->message,
                'is_read' => $message->is_read,
                'created_at' => $message->created_at->toIso8601String(),
            ]
        ]);
    }

    public function getUnreadCount()
    {
        $unreadChatCount = 0;
        $user = auth()->user();
        if ($user) {
            if ($user->id_role_user === 'RL03DON') {
                $donor = Donor::where('id_user', $user->id_user)->first();
                if ($donor) {
                    $unreadChatCount = Message::whereIn('id_chat', function ($query) use ($donor) {
                        $query->select('id_chat')->from('chats')->where('id_donor', $donor->id_donor);
                    })->where('id_sender', '!=', $user->id_user)
                      ->where('is_read', false)
                      ->count();
                }
            } elseif ($user->id_role_user === 'RL02PAN') {
                $shelter = Shelter::where('id_user', $user->id_user)->first();
                if ($shelter) {
                    $unreadChatCount = Message::whereIn('id_chat', function ($query) use ($shelter) {
                        $query->select('id_chat')->from('chats')->where('id_shelter', $shelter->id_shelter);
                    })->where('id_sender', '!=', $user->id_user)
                      ->where('is_read', false)
                      ->count();
                }
            } elseif ($user->id_role_user === 'RL01ADM') {
                $unreadChatCount = Message::whereIn('id_chat', function ($query) use ($user) {
                    $query->select('id_chat')->from('chats')->where('id_admin', $user->id_user);
                })->where('id_sender', '!=', $user->id_user)
                  ->where('is_read', false)
                  ->count();
            }
        }

        return response()->json([
            'unread_chat_count' => $unreadChatCount,
        ]);
    }

    public function sendBotMessage(Request $request)
    {
        $request->validate([
            'message' => 'required|string',
            'history' => 'nullable|array',
        ]);

        $userMessage = $request->input('message');
        $history = $request->input('history', []);
        $gemini = new GeminiService();

        // 1. Ekstrak parameter pencarian menggunakan AI
        $searchParams = $gemini->extractSearchParams($history);
        $item = $searchParams['item'] ?? null;
        $location = $searchParams['location'] ?? null;
        $kategori = $searchParams['kategori'] ?? null;

        $shelters = collect();
        $isFallback = false;

        // 2. Lakukan pencarian jika ada item atau lokasi yang dicari
        if ($item || $location) {
            // Coba pencarian utama: cari panti yang butuh item spesifik di lokasi tersebut
            $query = Shelter::where('status', 'Active');

            if ($location) {
                $query->where('alamat', 'like', '%' . $location . '%');
            }

            if ($item) {
                $query->whereHas('needs', function($q) use ($item) {
                    $q->where('nama_kebutuhan', 'like', '%' . $item . '%');
                });
            }

            $shelters = $query->with(['needs' => function($q) use ($item) {
                if ($item) {
                    $q->where('nama_kebutuhan', 'like', '%' . $item . '%');
                }
            }])->get();

            // 3. Jika pencarian utama kosong dan ada pencarian barang spesifik, lakukan fallback ke kategori umum
            if ($shelters->isEmpty() && $item) {
                $fallbackCategory = $kategori ?? 'Sandang'; // default ke Sandang jika tidak terdeteksi
                
                $fallbackQuery = Shelter::where('status', 'Active');
                
                if ($location) {
                    $fallbackQuery->where('alamat', 'like', '%' . $location . '%');
                }

                $fallbackQuery->whereHas('needs', function($q) use ($fallbackCategory) {
                    $q->where('kategori', 'like', '%' . $fallbackCategory . '%');
                });

                $shelters = $fallbackQuery->with(['needs' => function($q) use ($fallbackCategory) {
                    $q->where('kategori', 'like', '%' . $fallbackCategory . '%');
                }])->get();

                $isFallback = true;
            }
        }

        // 4. Petakan data panti asuhan untuk dikembalikan ke frontend
        $mappedShelters = $shelters->map(function($shelter) {
            return [
                'id_shelter' => $shelter->id_shelter,
                'nama_yayasan' => $shelter->nama_yayasan,
                'alamat' => $shelter->alamat,
                'foto_profil' => $shelter->foto_profil ? asset('storage/' . $shelter->foto_profil) : null,
                'username' => $shelter->username ?? ($shelter->user->name ?? ''),
                'needs' => $shelter->needs->map(function($need) {
                    return [
                        'id_needs' => $need->id_needs,
                        'nama_kebutuhan' => $need->nama_kebutuhan,
                        'jumlah' => $need->jumlah,
                        'terkumpul' => $need->terkumpul,
                        'satuan' => $need->satuan,
                        'kategori' => $need->kategori,
                    ];
                })->toArray()
            ];
        })->toArray();

        // 5. Sintesis jawaban AI berdasarkan hasil pencarian database
        $aiResponseText = $gemini->synthesizeResponse($history, $searchParams, $mappedShelters, $isFallback);

        return response()->json([
            'success' => true,
            'message' => $aiResponseText,
            'shelters' => $mappedShelters,
            'is_fallback' => $isFallback,
            'search_params' => $searchParams,
        ]);
    }

    public function adminIndex(Request $request)
    {
        $chats = Chat::where('id_admin', auth()->id())
            ->with(['donor.user', 'shelter.user', 'messages' => function ($query) {
                $query->orderBy('created_at', 'asc');
            }])
            ->get()
            ->map(function ($chat) {
                $lastMessage = $chat->messages->last();
                $unreadCount = $chat->messages
                    ->where('id_sender', '!=', auth()->id())
                    ->where('is_read', false)
                    ->count();

                $participantName = 'Pengguna';
                $participantPhoto = null;
                $participantType = '';
                $participantUsername = '';

                if ($chat->shelter) {
                    $participantName = $chat->shelter->nama_yayasan;
                    $participantPhoto = $chat->shelter->foto_profil ? asset('storage/' . $chat->shelter->foto_profil) : null;
                    $participantType = 'Panti';
                    $participantUsername = $chat->shelter->username ?? ($chat->shelter->user->name ?? '');
                } elseif ($chat->donor) {
                    $participantName = $chat->donor->nama_lengkap;
                    $participantPhoto = $chat->donor->foto_profil ? asset('storage/' . $chat->donor->foto_profil) : null;
                    $participantType = 'Donatur';
                    $participantUsername = $chat->donor->user->email ?? '';
                }

                return [
                    'id_chat' => $chat->id_chat,
                    'participant' => [
                        'name' => $participantName,
                        'foto_profil' => $participantPhoto,
                        'type' => $participantType,
                        'username' => $participantUsername,
                    ],
                    'last_message' => $lastMessage ? $lastMessage->message : null,
                    'last_message_time' => $lastMessage ? $lastMessage->created_at->toIso8601String() : null,
                    'unread_count' => $unreadCount,
                ];
            });

        return Inertia::render('Admin/AdminChat', [
            'chats' => $chats,
            'activeChatId' => $request->query('active_chat') ? (int) $request->query('active_chat') : null,
        ]);
    }

    public function initAdminPantiChat($id_panti)
    {
        $chat = Chat::firstOrCreate([
            'id_admin' => auth()->id(),
            'id_shelter' => $id_panti,
            'id_donor' => null,
        ]);

        return redirect()->route('admin.chat', ['active_chat' => $chat->id_chat]);
    }

    public function initAdminDonaturChat($id_donatur)
    {
        $chat = Chat::firstOrCreate([
            'id_admin' => auth()->id(),
            'id_donor' => $id_donatur,
            'id_shelter' => null,
        ]);

        return redirect()->route('admin.chat', ['active_chat' => $chat->id_chat]);
    }
}
