/**
 * Merapikan input nomor telepon / WhatsApp yang diinput fleksibel (+62, 08, spasi, tanda hubung)
 * menjadi format bersih (misal: 081234567890).
 */
export function sanitizePhoneNumber(phone: string): string {
  if (!phone) return '';
  let cleaned = phone.trim().replace(/[^\d+]/g, ''); // Hapus karakter selain angka dan +
  
  if (cleaned.startsWith('+62')) {
    cleaned = '0' + cleaned.slice(3);
  } else if (cleaned.startsWith('62')) {
    cleaned = '0' + cleaned.slice(2);
  }
  
  return cleaned;
}

/**
 * Menghitung kriteria kekuatan kata sandi
 */
export interface PasswordRequirements {
  minLength: boolean;
  hasNumber: boolean;
  hasUpper: boolean;
  passwordsMatch: boolean;
}

export function validatePasswordRequirements(
  password: string,
  confirmation: string
): PasswordRequirements {
  return {
    minLength: password.length >= 8,
    hasNumber: /\d/.test(password),
    hasUpper: /[A-Z]/.test(password),
    passwordsMatch: Boolean(password && confirmation && password === confirmation),
  };
}

export function getPasswordStrength(reqs: PasswordRequirements): {
  label: string;
  color: string;
  percent: number;
} {
  const metCount = [reqs.minLength, reqs.hasNumber, reqs.hasUpper].filter(Boolean).length;

  if (metCount === 0) return { label: 'Sangat Lemah', color: 'bg-red-500', percent: 15 };
  if (metCount === 1) return { label: 'Lemah', color: 'bg-orange-500', percent: 35 };
  if (metCount === 2) return { label: 'Sedang', color: 'bg-amber-500', percent: 70 };
  return { label: 'Kuat', color: 'bg-[#407E8C]', percent: 100 };
}
