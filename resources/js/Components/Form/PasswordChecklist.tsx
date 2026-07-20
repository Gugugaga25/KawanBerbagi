import React from 'react';
import { CheckCircle2, Circle } from 'lucide-react';
import { validatePasswordRequirements, getPasswordStrength } from '@/Utils/formUtils';

interface PasswordChecklistProps {
  password: string;
  confirmation: string;
}

export default function PasswordChecklist({ password, confirmation }: PasswordChecklistProps) {
  if (!password) return null;

  const reqs = validatePasswordRequirements(password, confirmation);
  const strength = getPasswordStrength(reqs);

  const criteria = [
    { label: 'Minimal 8 karakter', valid: reqs.minLength },
    { label: 'Mengandung angka (0-9)', valid: reqs.hasNumber },
    { label: 'Mengandung huruf besar (A-Z)', valid: reqs.hasUpper },
    { label: 'Konfirmasi kata sandi cocok', valid: reqs.passwordsMatch },
  ];

  return (
    <div className="mt-3 p-4 bg-gray-50 border border-gray-100 rounded-2xl space-y-3 transition-all">
      {/* Strength Bar */}
      <div className="space-y-1">
        <div className="flex justify-between items-center text-xs">
          <span className="text-gray-500 font-medium">Kekuatan Kata Sandi:</span>
          <span className="font-bold text-[#124354]">{strength.label}</span>
        </div>
        <div className="w-full bg-gray-200 h-1.5 rounded-full overflow-hidden">
          <div className={`h-full ${strength.color} transition-all duration-300`} style={{ width: `${strength.percent}%` }} />
        </div>
      </div>

      {/* Criteria Checklist */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 pt-1">
        {criteria.map((item, idx) => (
          <div key={idx} className="flex items-center gap-2 text-xs">
            {item.valid ? (
              <CheckCircle2 size={15} className="text-emerald-600 shrink-0" />
            ) : (
              <Circle size={15} className="text-gray-300 shrink-0" />
            )}
            <span className={item.valid ? 'text-emerald-700 font-semibold' : 'text-gray-400'}>
              {item.label}
            </span>
          </div>
        ))}
      </div>
    </div>
  );
}
