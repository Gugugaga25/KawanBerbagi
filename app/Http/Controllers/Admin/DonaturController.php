<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\Donor;
use App\Models\User;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Hash;
use Illuminate\Validation\Rules;

class DonaturController extends Controller
{
    /**
     * Store a newly created resource in storage.
     */
    public function store(Request $request)
    {
        $request->validate([
            'name' => 'required|string|max:255',
            'email' => 'required|string|email|max:255|unique:users,email',
            'phone' => 'required|string|max:20',
            'city' => 'required|string|max:255',
            'password' => ['required', 'confirmed', Rules\Password::defaults()],
        ]);

        $user = User::create([
            'id_role_user' => 'RL03DON',
            'name' => $request->name,
            'email' => $request->email,
            'password' => Hash::make($request->password),
        ]);

        Donor::create([
            'id_user' => $user->id_user,
            'nama_lengkap' => $request->name,
            'no_wa' => $request->phone,
            'kota' => $request->city,
        ]);

        return redirect()->route('admin.dashboard', ['tab' => 'donatur'])->with('success', 'Donatur berhasil ditambahkan.');
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(Request $request, $id)
    {
        $donor = Donor::findOrFail($id);
        $user = $donor->user;

        $rules = [
            'name' => 'required|string|max:255',
            'email' => 'required|string|email|max:255|unique:users,email,' . $user->id_user . ',id_user',
            'phone' => 'required|string|max:20',
            'city' => 'required|string|max:255',
        ];

        if ($request->filled('password')) {
            $rules['password'] = ['required', 'confirmed', Rules\Password::defaults()];
        }

        $request->validate($rules);

        $user->update([
            'name' => $request->name,
            'email' => $request->email,
        ]);

        if ($request->filled('password')) {
            $user->update([
                'password' => Hash::make($request->password),
            ]);
        }

        $donor->update([
            'nama_lengkap' => $request->name,
            'no_wa' => $request->phone,
            'kota' => $request->city,
        ]);

        return redirect()->route('admin.dashboard', ['tab' => 'donatur'])->with('success', 'Data donatur berhasil diperbarui.');
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy($id)
    {
        $donor = Donor::findOrFail($id);
        $user = $donor->user;

        $donor->delete();
        if ($user) {
            $user->delete();
        }

        return redirect()->route('admin.dashboard', ['tab' => 'donatur'])->with('success', 'Data donatur berhasil dihapus.');
    }
}
