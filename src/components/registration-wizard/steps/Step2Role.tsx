import { Code, Palette, Target, Users } from 'lucide-react';
import { RegistrationStep2Data, UserRole, ExperienceLevel } from '../../../types/registration';
import { ROLE_OPTIONS, EXPERIENCE_LEVEL_OPTIONS } from '../../../lib/registrationWizard';

interface Step2RoleProps {
  data: RegistrationStep2Data;
  errors: Record<string, string>;
  onChange: (field: keyof RegistrationStep2Data, value: string) => void;
}

// Icon mapping
const ICON_MAP = {
  Code: Code,
  Palette: Palette,
  Target: Target,
  Users: Users,
};

export default function Step2Role({
  data,
  errors,
  onChange,
}: Step2RoleProps) {
  const selectedRoleOption = ROLE_OPTIONS.find((r) => r.id === data.role);

  return (
    <div className="space-y-8">
      {/* Role Selection */}
      <div>
        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-4">
          당신의 역할을 선택해주세요 <span className="text-red-500">*</span>
        </label>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          {ROLE_OPTIONS.map((role) => {
            const Icon = ICON_MAP[role.icon as keyof typeof ICON_MAP];
            const isSelected = data.role === role.id;

            return (
              <button
                key={role.id}
                type="button"
                onClick={() => onChange('role', role.id)}
                className={`
                  p-6 rounded-xl border-2 transition-all text-left
                  ${
                    isSelected
                      ? 'border-blue-500 bg-blue-50 dark:bg-blue-900/20 shadow-lg shadow-blue-500/20'
                      : 'border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 hover:border-blue-300 dark:hover:border-blue-700 hover:shadow-md'
                  }
                `}
              >
                <div className="flex items-start gap-4">
                  <div
                    className={`
                      p-3 rounded-lg
                      ${
                        isSelected
                          ? 'bg-blue-500 text-white'
                          : 'bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-300'
                      }
                    `}
                  >
                    <Icon className="w-6 h-6" />
                  </div>
                  <div className="flex-1">
                    <div className="font-semibold text-gray-900 dark:text-white mb-1">
                      {role.label}
                    </div>
                    <div className="text-sm text-gray-600 dark:text-gray-400">
                      {role.description}
                    </div>
                  </div>
                </div>
              </button>
            );
          })}
        </div>
        {errors.role && (
          <p className="mt-2 text-sm text-red-500">{errors.role}</p>
        )}
      </div>

      {/* Custom Role (if role === 'other') */}
      {data.role === 'other' && (
        <div>
          <label
            htmlFor="customRole"
            className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2"
          >
            역할 입력 <span className="text-red-500">*</span>
          </label>
          <input
            type="text"
            id="customRole"
            value={data.customRole || ''}
            onChange={(e) => onChange('customRole', e.target.value)}
            className={`
              w-full px-4 py-3 rounded-lg
              border ${errors.customRole ? 'border-red-500' : 'border-gray-300 dark:border-gray-600'}
              bg-white dark:bg-gray-700
              text-gray-900 dark:text-white
              placeholder-gray-400 dark:placeholder-gray-500
              focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent
              transition-all
            `}
            placeholder="예: 프로젝트 매니저, 데이터 분석가"
          />
          {errors.customRole && (
            <p className="mt-1 text-sm text-red-500">{errors.customRole}</p>
          )}
        </div>
      )}

      {/* Specialization (optional, shown if role has specializations) */}
      {selectedRoleOption?.specializations && (
        <div>
          <label
            htmlFor="specialization"
            className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2"
          >
            전문 분야 (선택)
          </label>
          <select
            id="specialization"
            value={data.specialization || ''}
            onChange={(e) => onChange('specialization', e.target.value)}
            className="
              w-full px-4 py-3 rounded-lg
              border border-gray-300 dark:border-gray-600
              bg-white dark:bg-gray-700
              text-gray-900 dark:text-white
              focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent
              transition-all
            "
          >
            <option value="">선택하지 않음</option>
            {selectedRoleOption.specializations.map((spec) => (
              <option key={spec} value={spec}>
                {spec}
              </option>
            ))}
          </select>
        </div>
      )}

      {/* Experience Level */}
      <div>
        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-4">
          경력 레벨 <span className="text-red-500">*</span>
        </label>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          {EXPERIENCE_LEVEL_OPTIONS.map((level) => {
            const isSelected = data.experienceLevel === level.id;

            return (
              <button
                key={level.id}
                type="button"
                onClick={() => onChange('experienceLevel', level.id)}
                className={`
                  p-4 rounded-lg border-2 transition-all text-left
                  ${
                    isSelected
                      ? 'border-blue-500 bg-blue-50 dark:bg-blue-900/20 shadow-md'
                      : 'border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 hover:border-blue-300 dark:hover:border-blue-700'
                  }
                `}
              >
                <div className="flex items-center justify-between mb-1">
                  <div className="font-semibold text-gray-900 dark:text-white">
                    {level.label}
                  </div>
                  <div className="text-xs text-gray-500 dark:text-gray-400 bg-gray-100 dark:bg-gray-700 px-2 py-1 rounded">
                    {level.yearsRange}
                  </div>
                </div>
                <div className="text-sm text-gray-600 dark:text-gray-400">
                  {level.description}
                </div>
              </button>
            );
          })}
        </div>
        {errors.experienceLevel && (
          <p className="mt-2 text-sm text-red-500">{errors.experienceLevel}</p>
        )}
      </div>

      {/* Role Description (optional) */}
      <div>
        <label
          htmlFor="roleDescription"
          className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2"
        >
          역할 설명 (선택, 최대 200자)
        </label>
        <textarea
          id="roleDescription"
          value={data.roleDescription || ''}
          onChange={(e) => onChange('roleDescription', e.target.value)}
          maxLength={200}
          rows={3}
          className={`
            w-full px-4 py-3 rounded-lg
            border ${errors.roleDescription ? 'border-red-500' : 'border-gray-300 dark:border-gray-600'}
            bg-white dark:bg-gray-700
            text-gray-900 dark:text-white
            placeholder-gray-400 dark:placeholder-gray-500
            focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent
            transition-all resize-none
          `}
          placeholder="예: 3년차 프론트엔드 개발자로, React와 TypeScript를 주로 사용합니다."
        />
        <div className="flex justify-between items-center mt-1">
          <div>
            {errors.roleDescription && (
              <p className="text-sm text-red-500">{errors.roleDescription}</p>
            )}
          </div>
          <p className="text-xs text-gray-500 dark:text-gray-400">
            {(data.roleDescription || '').length} / 200
          </p>
        </div>
      </div>

      {/* Info Box */}
      <div className="mt-8 p-4 bg-purple-50 dark:bg-purple-900/20 border border-purple-200 dark:border-purple-800 rounded-lg">
        <p className="text-sm text-purple-800 dark:text-purple-200">
          <span className="font-semibold">팁:</span> 역할과 경력 레벨은 맞춤형 프로젝트 추천과 팀 매칭에 활용됩니다.
        </p>
      </div>
    </div>
  );
}
