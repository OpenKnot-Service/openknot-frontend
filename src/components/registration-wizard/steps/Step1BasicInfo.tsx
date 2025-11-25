import { useState } from 'react';
import { Eye, EyeOff, Shield } from 'lucide-react';
import { RegistrationStep1Data } from '../../../types/registration';

interface Step1BasicInfoProps {
  data: RegistrationStep1Data;
  errors: Record<string, string>;
  onChange: (field: keyof RegistrationStep1Data, value: string | boolean) => void;
}

export default function Step1BasicInfo({
  data,
  errors,
  onChange,
}: Step1BasicInfoProps) {
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const getPasswordStrength = () => {
    const password = data.password;
    if (!password) return null;

    let strength = 0;
    if (password.length >= 8) strength++;
    if (password.length >= 12) strength++;
    if (/[a-z]/.test(password)) strength++;
    if (/[A-Z]/.test(password)) strength++;
    if (/\d/.test(password)) strength++;
    if (/[^a-zA-Z\d]/.test(password)) strength++;

    if (strength <= 2) return { label: '약함', color: 'bg-red-500', width: 'w-1/3' };
    if (strength <= 4) return { label: '보통', color: 'bg-yellow-500', width: 'w-2/3' };
    return { label: '강함', color: 'bg-green-500', width: 'w-full' };
  };

  const passwordStrength = getPasswordStrength();

  return (
    <div className="space-y-6">
      {/* Name */}
      <div>
        <label
          htmlFor="name"
          className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2"
        >
          이름 <span className="text-red-500">*</span>
        </label>
        <input
          type="text"
          id="name"
          value={data.name}
          onChange={(e) => onChange('name', e.target.value)}
          className={`
            w-full px-4 py-3 rounded-lg
            border ${errors.name ? 'border-red-500' : 'border-gray-300 dark:border-gray-600'}
            bg-white dark:bg-gray-700
            text-gray-900 dark:text-white
            placeholder-gray-400 dark:placeholder-gray-500
            focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent
            transition-all
          `}
          placeholder="홍길동"
        />
        {errors.name && (
          <p className="mt-1 text-sm text-red-500">{errors.name}</p>
        )}
      </div>

      {/* Email */}
      <div>
        <label
          htmlFor="email"
          className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2"
        >
          이메일 <span className="text-red-500">*</span>
        </label>
        <input
          type="email"
          id="email"
          value={data.email}
          onChange={(e) => onChange('email', e.target.value)}
          className={`
            w-full px-4 py-3 rounded-lg
            border ${errors.email ? 'border-red-500' : 'border-gray-300 dark:border-gray-600'}
            bg-white dark:bg-gray-700
            text-gray-900 dark:text-white
            placeholder-gray-400 dark:placeholder-gray-500
            focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent
            transition-all
          `}
          placeholder="example@email.com"
        />
        {errors.email && (
          <p className="mt-1 text-sm text-red-500">{errors.email}</p>
        )}
      </div>

      {/* Password */}
      <div>
        <label
          htmlFor="password"
          className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2"
        >
          비밀번호 <span className="text-red-500">*</span>
        </label>
        <div className="relative">
          <input
            type={showPassword ? 'text' : 'password'}
            id="password"
            value={data.password}
            onChange={(e) => onChange('password', e.target.value)}
            className={`
              w-full px-4 py-3 rounded-lg pr-12
              border ${errors.password ? 'border-red-500' : 'border-gray-300 dark:border-gray-600'}
              bg-white dark:bg-gray-700
              text-gray-900 dark:text-white
              placeholder-gray-400 dark:placeholder-gray-500
              focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent
              transition-all
            `}
            placeholder="8자 이상, 대소문자 및 숫자 포함"
          />
          <button
            type="button"
            onClick={() => setShowPassword(!showPassword)}
            className="absolute right-3 top-1/2 -translate-y-1/2 p-2 text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-300"
          >
            {showPassword ? (
              <EyeOff className="w-5 h-5" />
            ) : (
              <Eye className="w-5 h-5" />
            )}
          </button>
        </div>

        {/* Password Strength Indicator */}
        {passwordStrength && (
          <div className="mt-2">
            <div className="flex items-center gap-2 mb-1">
              <Shield className="w-4 h-4 text-gray-500 dark:text-gray-400" />
              <span className="text-xs text-gray-600 dark:text-gray-400">
                비밀번호 강도: <span className="font-medium">{passwordStrength.label}</span>
              </span>
            </div>
            <div className="h-1.5 bg-gray-200 dark:bg-gray-700 rounded-full overflow-hidden">
              <div className={`h-full ${passwordStrength.color} ${passwordStrength.width} transition-all duration-300`} />
            </div>
          </div>
        )}

        {errors.password && (
          <p className="mt-1 text-sm text-red-500">{errors.password}</p>
        )}

        <p className="mt-2 text-xs text-gray-500 dark:text-gray-400">
          최소 8자 이상, 대문자, 소문자, 숫자를 포함해야 합니다
        </p>
      </div>

      {/* Confirm Password */}
      <div>
        <label
          htmlFor="confirmPassword"
          className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2"
        >
          비밀번호 확인 <span className="text-red-500">*</span>
        </label>
        <div className="relative">
          <input
            type={showConfirmPassword ? 'text' : 'password'}
            id="confirmPassword"
            value={data.confirmPassword}
            onChange={(e) => onChange('confirmPassword', e.target.value)}
            className={`
              w-full px-4 py-3 rounded-lg pr-12
              border ${errors.confirmPassword ? 'border-red-500' : 'border-gray-300 dark:border-gray-600'}
              bg-white dark:bg-gray-700
              text-gray-900 dark:text-white
              placeholder-gray-400 dark:placeholder-gray-500
              focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent
              transition-all
            `}
            placeholder="비밀번호를 다시 입력해주세요"
          />
          <button
            type="button"
            onClick={() => setShowConfirmPassword(!showConfirmPassword)}
            className="absolute right-3 top-1/2 -translate-y-1/2 p-2 text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-300"
          >
            {showConfirmPassword ? (
              <EyeOff className="w-5 h-5" />
            ) : (
              <Eye className="w-5 h-5" />
            )}
          </button>
        </div>
        {errors.confirmPassword && (
          <p className="mt-1 text-sm text-red-500">{errors.confirmPassword}</p>
        )}
      </div>

      {/* Terms Agreement */}
      <div className="pt-4">
        <label className="flex items-start gap-3 cursor-pointer group">
          <input
            type="checkbox"
            checked={data.agreedToTerms}
            onChange={(e) => onChange('agreedToTerms', e.target.checked)}
            className={`
              mt-0.5 w-5 h-5 rounded
              border ${errors.agreedToTerms ? 'border-red-500' : 'border-gray-300 dark:border-gray-600'}
              text-blue-600 focus:ring-2 focus:ring-blue-500 focus:ring-offset-0
              dark:bg-gray-700 dark:checked:bg-blue-600
              cursor-pointer
            `}
          />
          <div className="flex-1">
            <span className="text-sm text-gray-700 dark:text-gray-300">
              <a
                href="/terms"
                target="_blank"
                rel="noopener noreferrer"
                className="text-blue-600 dark:text-blue-400 hover:underline font-medium"
              >
                이용약관
              </a>
              {' '}및{' '}
              <a
                href="/privacy"
                target="_blank"
                rel="noopener noreferrer"
                className="text-blue-600 dark:text-blue-400 hover:underline font-medium"
              >
                개인정보처리방침
              </a>
              에 동의합니다 <span className="text-red-500">*</span>
            </span>
          </div>
        </label>
        {errors.agreedToTerms && (
          <p className="mt-1 text-sm text-red-500">{errors.agreedToTerms}</p>
        )}
      </div>

      {/* Info Box */}
      <div className="mt-8 p-4 bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-lg">
        <p className="text-sm text-blue-800 dark:text-blue-200">
          <span className="font-semibold">안전한 계정을 위해:</span> 이메일은 계정 복구와 중요 알림에 사용되며, 강력한 비밀번호를 사용하는 것을 권장합니다.
        </p>
      </div>
    </div>
  );
}
