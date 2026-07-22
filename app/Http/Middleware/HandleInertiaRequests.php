<?php

namespace App\Http\Middleware;

use Illuminate\Http\Request;
use Inertia\Middleware;

class HandleInertiaRequests extends Middleware
{
    /**
     * The root template that is loaded on the first page visit.
     *
     * @var string
     */
    protected $rootView = 'app';

    /**
     * Determine the current asset version.
     */
    public function version(Request $request): ?string
    {
        return parent::version($request);
    }

    /**
     * Define the props that are shared by default.
     *
     * @return array<string, mixed>
     */
    public function share(Request $request): array
    {
        $unreadChatCount = 0;
        $user = $request->user();
        if ($user) {
            if ($user->id_role_user === 'RL03DON') {
                $donor = \App\Models\Donor::where('id_user', $user->id_user)->first();
                if ($donor) {
                    $unreadChatCount = \App\Models\Message::whereIn('id_chat', function ($query) use ($donor) {
                        $query->select('id_chat')->from('chats')->where('id_donor', $donor->id_donor);
                    })->where('id_sender', '!=', $user->id_user)
                      ->where('is_read', false)
                      ->count();
                }
            } elseif ($user->id_role_user === 'RL02PAN') {
                $shelter = \App\Models\Shelter::where('id_user', $user->id_user)->first();
                if ($shelter) {
                    $unreadChatCount = \App\Models\Message::whereIn('id_chat', function ($query) use ($shelter) {
                        $query->select('id_chat')->from('chats')->where('id_shelter', $shelter->id_shelter);
                    })->where('id_sender', '!=', $user->id_user)
                      ->where('is_read', false)
                      ->count();
                }
            } elseif ($user->id_role_user === 'RL01ADM') {
                $unreadChatCount = \App\Models\Message::whereIn('id_chat', function ($query) use ($user) {
                    $query->select('id_chat')->from('chats')->where('id_admin', $user->id_user);
                })->where('id_sender', '!=', $user->id_user)
                  ->where('is_read', false)
                  ->count();
            }
        }

        return [
            ...parent::share($request),
            'auth' => [
                'user' => $user,
                'unread_chat_count' => $unreadChatCount,
            ],
            'flash' => [
                'success' => fn () => $request->session()->get('success'),
                'warning' => fn () => $request->session()->get('warning'),
                'error' => fn () => $request->session()->get('error'),
                'wa_link' => fn () => $request->session()->get('wa_link'),
                'wa_phone' => fn () => $request->session()->get('wa_phone'),
            ],
        ];
    }
}
