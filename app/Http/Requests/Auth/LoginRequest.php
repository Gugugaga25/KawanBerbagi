<?php

namespace App\Http\Requests\Auth;

use Illuminate\Auth\Events\Lockout;
use Illuminate\Contracts\Validation\ValidationRule;
use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\RateLimiter;
use Illuminate\Support\Str;
use Illuminate\Validation\ValidationException;

class LoginRequest extends FormRequest
{
    /**
     * Determine if the user is authorized to make this request.
     */
    public function authorize(): bool
    {
        return true;
    }

    /**
     * Get the validation rules that apply to the request.
     *
     * @return array<string, ValidationRule|array<mixed>|string>
     */
    public function rules(): array
    {
        return [
            'email' => ['required', 'string', 'email'],
            'password' => ['required', 'string'],
        ];
    }

    /**
     * Attempt to authenticate the request's credentials.
     *
     * @throws ValidationException
     */
    public function authenticate(): void
    {
        $this->ensureIsNotRateLimited();

        // Cek jika email terdaftar milik akun Panti (RL02PAN) dengan status Pending / Inactive
        $user = \App\Models\User::where('email', $this->email)->first();
        if ($user && $user->id_role_user === 'RL02PAN') {
            $shelter = \App\Models\Shelter::where('id_user', $user->id_user)->first();
            if ($shelter && $shelter->status !== 'Active') {
                $statusMsg = $shelter->status === 'Inactive'
                    ? 'Mohon maaf, pendaftaran panti asuhan Anda ditolak / belum aktif. Silakan periksa email/WhatsApp Anda.'
                    : 'Akun panti asuhan Anda masih dalam proses verifikasi Admin (Pending). Silakan periksa email/WhatsApp Anda.';

                throw ValidationException::withMessages([
                    'email' => $statusMsg,
                ]);
            }
        }

        // Cek jika email terdaftar milik akun Donatur (RL03DON)
        if ($user && $user->id_role_user === 'RL03DON') {
            $donor = \App\Models\Donor::where('id_user', $user->id_user)->first();
            
            if ($donor && $donor->status === 'Inactive') {
                throw ValidationException::withMessages([
                    'email' => 'Mohon maaf, akun Donatur Anda telah dinonaktifkan (Inactive). Silakan hubungi admin KawanBerbagi.',
                ]);
            }

            if (($donor && $donor->status === 'Pending') || !$user->email_verified_at) {
                throw ValidationException::withMessages([
                    'email' => 'Akun Donatur Anda masih berstatus Pending (belum diverifikasi). Silakan periksa inbox Mailtrap Anda dan klik tombol verifikasi untuk mengaktifkan akun.',
                ]);
            }
        }

        if (! Auth::attempt($this->only('email', 'password'), $this->boolean('remember'))) {
            RateLimiter::hit($this->throttleKey());

            throw ValidationException::withMessages([
                'email' => trans('auth.failed'),
            ]);
        }

        RateLimiter::clear($this->throttleKey());
    }

    /**
     * Ensure the login request is not rate limited.
     *
     * @throws ValidationException
     */
    public function ensureIsNotRateLimited(): void
    {
        if (! RateLimiter::tooManyAttempts($this->throttleKey(), 5)) {
            return;
        }

        event(new Lockout($this));

        $seconds = RateLimiter::availableIn($this->throttleKey());

        throw ValidationException::withMessages([
            'email' => trans('auth.throttle', [
                'seconds' => $seconds,
                'minutes' => ceil($seconds / 60),
            ]),
        ]);
    }

    /**
     * Get the rate limiting throttle key for the request.
     */
    public function throttleKey(): string
    {
        return Str::transliterate(Str::lower($this->string('email')).'|'.$this->ip());
    }
}
