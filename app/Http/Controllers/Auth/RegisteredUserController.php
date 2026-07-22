<?php

namespace App\Http\Controllers\Auth;

use App\Http\Controllers\Controller;
use App\Models\User;
use Illuminate\Auth\Events\Registered;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Hash;
use Illuminate\Validation\Rules;
use Illuminate\Validation\ValidationException;
use Inertia\Inertia;
use Inertia\Response;

class RegisteredUserController extends Controller
{
    /**
     * Display the registration view.
     */
    public function create(): Response
    {
        return Inertia::render('Auth/Register');
    }

    /**
     * Handle an incoming registration request.
     *
     * @throws ValidationException
     */
    public function store(Request $request)
    {
        $request->validate([
            'role' => 'required|in:donatur,yayasan',
            'email' => 'required|string|lowercase|email|max:255|unique:'.User::class,
            'password' => ['required', 'confirmed', Rules\Password::defaults()],
        ]);

        if ($request->role === 'donatur') {
            $request->validate([
                'name' => 'required|string|max:255',
                'phone' => 'required|string|max:20',
                'city' => 'required|string|max:100',
            ]);

            $user = User::create([
                'id_role_user' => 'RL03DON',
                'name' => $request->name,
                'email' => $request->email,
                'password' => Hash::make($request->password),
            ]);

            \App\Models\Donor::create([
                'id_user' => $user->id_user,
                'nama_lengkap' => $request->name,
                'no_wa' => $request->phone,
                'kota' => $request->city,
                'status' => 'Pending',
            ]);

            // Send Email Verification via Mailtrap for Donatur
            try {
                \Illuminate\Support\Facades\Mail::to($user->email)->send(
                    new \App\Mail\DonorVerificationMail($user)
                );
            } catch (\Exception $e) {
                \Illuminate\Support\Facades\Log::error("Gagal mengirim email verifikasi donatur: " . $e->getMessage());
            }
        } else {
            // Role Yayasan
            $request->validate([
                'orgName' => 'required|string|max:255',
                'picName' => 'required|string|max:255',
                'phone' => 'required|string|max:20',
                'address' => 'required|string',
                'aktaDoc' => 'nullable|file|mimes:pdf,jpg,jpeg,png|max:5120',
                'skDoc' => 'required|file|mimes:pdf,jpg,jpeg,png|max:5120',
                'izinDoc' => 'required|file|mimes:pdf,jpg,jpeg,png|max:5120',
                'npwpDoc' => 'nullable|file|mimes:pdf,jpg,jpeg,png|max:5120',
                'orgPhoto' => 'nullable|file|mimes:jpg,jpeg,png|max:5120',
            ]);

            $aktaPath = $request->hasFile('aktaDoc') ? $request->file('aktaDoc')->store('legal_docs/akta', 'public') : null;
            $skPath = $request->file('skDoc')->store('legal_docs/sk', 'public');
            $izinPath = $request->file('izinDoc')->store('legal_docs/izin', 'public');
            $npwpPath = $request->hasFile('npwpDoc') ? $request->file('npwpDoc')->store('legal_docs/npwp', 'public') : null;
            $orgPhotoPath = $request->hasFile('orgPhoto') ? $request->file('orgPhoto')->store('org_photos', 'public') : null;

            $user = User::create([
                'id_role_user' => 'RL02PAN',
                'name' => $request->orgName, // Gunakan nama organisasi sebagai nama user
                'email' => $request->email,
                'password' => Hash::make($request->password),
            ]);

            $username = strtolower(str_replace(' ', '', $request->orgName));

            \App\Models\Shelter::create([
                'id_user' => $user->id_user,
                'nama_yayasan' => $request->orgName,
                'nama_penanggung_jawab' => $request->picName,
                'alamat' => $request->address,
                'no_telepon' => $request->phone,
                'jumlah_anak' => (int) $request->beneficiaries,
                'status' => 'Pending',
                'akta_yayasan' => $aktaPath,
                'sk_kemenkumham' => $skPath,
                'izin_operasional' => $izinPath,
                'npwp_yayasan' => $npwpPath,
                'dokumentasi_panti' => $orgPhotoPath,
                'username' => $username,
            ]);
        }

        event(new Registered($user));

        return Inertia::render('Auth/Register', ['registered' => true]);
    }
}
