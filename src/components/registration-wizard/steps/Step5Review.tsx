import { Edit2, Check, Mail, User, Briefcase, Code, Image, Github, Link as LinkIcon, MapPin } from 'lucide-react';
import { RegistrationFormData, RegistrationStep } from '../../../types/registration';
import { calculateProfileCompleteness, ROLE_OPTIONS, EXPERIENCE_LEVEL_OPTIONS } from '../../../lib/registrationWizard';

interface Step5ReviewProps {
  data: RegistrationFormData;
  onEdit: (step: RegistrationStep) => void;
}

export default function Step5Review({ data, onEdit }: Step5ReviewProps) {
  const completeness = calculateProfileCompleteness(data);
  const roleOption = ROLE_OPTIONS.find((r) => r.id === data.step2.role);
  const experienceOption = EXPERIENCE_LEVEL_OPTIONS.find(
    (e) => e.id === data.step2.experienceLevel
  );

  return (
    <div className="space-y-6">
      {/* Profile Completeness */}
      <div className="p-6 bg-gradient-to-r from-blue-50 to-purple-50 dark:from-blue-900/20 dark:to-purple-900/20 border border-blue-200 dark:border-blue-800 rounded-xl">
        <div className="flex items-center justify-between mb-4">
          <div>
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
              프로필 완성도
            </h3>
            <p className="text-sm text-gray-600 dark:text-gray-400">
              {completeness >= 75
                ? '훌륭합니다! 완성도가 높은 프로필입니다 🎉'
                : completeness >= 50
                ? '좋습니다! 더 많은 정보를 추가하면 더욱 좋습니다'
                : '프로필을 더 완성하면 더 많은 기회를 얻을 수 있습니다'}
            </p>
          </div>
          <div className="text-3xl font-bold text-blue-600 dark:text-blue-400">
            {completeness}%
          </div>
        </div>
        <div className="h-3 bg-gray-200 dark:bg-gray-700 rounded-full overflow-hidden">
          <div
            className="h-full bg-gradient-to-r from-blue-500 to-purple-500 transition-all duration-500"
            style={{ width: `${completeness}%` }}
          />
        </div>
      </div>

      {/* Step 1: Basic Info */}
      <div className="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-xl p-6">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-blue-100 dark:bg-blue-900/30 rounded-lg">
              <User className="w-5 h-5 text-blue-600 dark:text-blue-400" />
            </div>
            <div>
              <h3 className="font-semibold text-gray-900 dark:text-white">기본 정보</h3>
              <p className="text-sm text-gray-500 dark:text-gray-400">Step 1</p>
            </div>
          </div>
          <button
            type="button"
            onClick={() => onEdit(1)}
            className="p-2 text-gray-500 dark:text-gray-400 hover:text-blue-600 dark:hover:text-blue-400 hover:bg-blue-50 dark:hover:bg-blue-900/30 rounded-lg transition-colors"
          >
            <Edit2 className="w-4 h-4" />
          </button>
        </div>

        <div className="space-y-3">
          <div className="flex items-start gap-3">
            <User className="w-4 h-4 text-gray-400 mt-0.5" />
            <div>
              <div className="text-sm text-gray-500 dark:text-gray-400">이름</div>
              <div className="font-medium text-gray-900 dark:text-white">{data.step1.name}</div>
            </div>
          </div>
          <div className="flex items-start gap-3">
            <Mail className="w-4 h-4 text-gray-400 mt-0.5" />
            <div>
              <div className="text-sm text-gray-500 dark:text-gray-400">이메일</div>
              <div className="font-medium text-gray-900 dark:text-white">{data.step1.email}</div>
            </div>
          </div>
          <div className="flex items-center gap-2 mt-3 text-green-600 dark:text-green-400">
            <Check className="w-4 h-4" />
            <span className="text-sm">비밀번호 설정 완료</span>
          </div>
        </div>
      </div>

      {/* Step 2: Role */}
      <div className="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-xl p-6">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-purple-100 dark:bg-purple-900/30 rounded-lg">
              <Briefcase className="w-5 h-5 text-purple-600 dark:text-purple-400" />
            </div>
            <div>
              <h3 className="font-semibold text-gray-900 dark:text-white">역할 & 경력</h3>
              <p className="text-sm text-gray-500 dark:text-gray-400">Step 2</p>
            </div>
          </div>
          <button
            type="button"
            onClick={() => onEdit(2)}
            className="p-2 text-gray-500 dark:text-gray-400 hover:text-purple-600 dark:hover:text-purple-400 hover:bg-purple-50 dark:hover:bg-purple-900/30 rounded-lg transition-colors"
          >
            <Edit2 className="w-4 h-4" />
          </button>
        </div>

        <div className="space-y-3">
          <div>
            <div className="text-sm text-gray-500 dark:text-gray-400 mb-1">역할</div>
            <div className="font-medium text-gray-900 dark:text-white">
              {roleOption?.label || data.step2.customRole || '-'}
              {data.step2.specialization && ` (${data.step2.specialization})`}
            </div>
          </div>
          <div>
            <div className="text-sm text-gray-500 dark:text-gray-400 mb-1">경력 레벨</div>
            <div className="font-medium text-gray-900 dark:text-white">
              {experienceOption?.label} ({experienceOption?.yearsRange})
            </div>
          </div>
          {data.step2.roleDescription && (
            <div>
              <div className="text-sm text-gray-500 dark:text-gray-400 mb-1">역할 설명</div>
              <div className="text-sm text-gray-700 dark:text-gray-300">
                {data.step2.roleDescription}
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Step 3: Skills */}
      <div className="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-xl p-6">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-green-100 dark:bg-green-900/30 rounded-lg">
              <Code className="w-5 h-5 text-green-600 dark:text-green-400" />
            </div>
            <div>
              <h3 className="font-semibold text-gray-900 dark:text-white">스킬 & 기술스택</h3>
              <p className="text-sm text-gray-500 dark:text-gray-400">Step 3 (선택)</p>
            </div>
          </div>
          <button
            type="button"
            onClick={() => onEdit(3)}
            className="p-2 text-gray-500 dark:text-gray-400 hover:text-green-600 dark:hover:text-green-400 hover:bg-green-50 dark:hover:bg-green-900/30 rounded-lg transition-colors"
          >
            <Edit2 className="w-4 h-4" />
          </button>
        </div>

        {data.step3.skills.length > 0 ? (
          <div>
            <div className="text-sm text-gray-500 dark:text-gray-400 mb-2">
              선택한 스킬 ({data.step3.skills.length})
            </div>
            <div className="flex flex-wrap gap-2">
              {data.step3.skills.map((skill) => (
                <span
                  key={skill.id}
                  className="px-3 py-1.5 bg-green-50 dark:bg-green-900/30 text-green-700 dark:text-green-300 border border-green-200 dark:border-green-700 rounded-lg text-sm font-medium"
                >
                  {skill.name}
                </span>
              ))}
            </div>
          </div>
        ) : (
          <p className="text-sm text-gray-500 dark:text-gray-400 italic">
            스킬이 선택되지 않았습니다
          </p>
        )}
      </div>

      {/* Step 4: Profile */}
      <div className="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-xl p-6">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-amber-100 dark:bg-amber-900/30 rounded-lg">
              <Image className="w-5 h-5 text-amber-600 dark:text-amber-400" />
            </div>
            <div>
              <h3 className="font-semibold text-gray-900 dark:text-white">프로필 정보</h3>
              <p className="text-sm text-gray-500 dark:text-gray-400">Step 4 (선택)</p>
            </div>
          </div>
          <button
            type="button"
            onClick={() => onEdit(4)}
            className="p-2 text-gray-500 dark:text-gray-400 hover:text-amber-600 dark:hover:text-amber-400 hover:bg-amber-50 dark:hover:bg-amber-900/30 rounded-lg transition-colors"
          >
            <Edit2 className="w-4 h-4" />
          </button>
        </div>

        <div className="space-y-4">
          {/* Profile Image */}
          {data.step4.profileImageUrl && (
            <div className="flex items-center gap-3">
              <img
                src={data.step4.profileImageUrl}
                alt="Profile"
                className="w-16 h-16 rounded-full object-cover border-2 border-gray-200 dark:border-gray-700"
              />
              <span className="text-sm text-gray-700 dark:text-gray-300">프로필 이미지 설정됨</span>
            </div>
          )}

          {/* Bio */}
          {data.step4.bio && (
            <div>
              <div className="text-sm text-gray-500 dark:text-gray-400 mb-1">자기소개</div>
              <div className="text-sm text-gray-700 dark:text-gray-300">{data.step4.bio}</div>
            </div>
          )}

          {/* Links */}
          <div className="space-y-2">
            {data.step4.githubLink && (
              <div className="flex items-center gap-2">
                <Github className="w-4 h-4 text-gray-400" />
                <a
                  href={data.step4.githubLink}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-sm text-blue-600 dark:text-blue-400 hover:underline"
                >
                  {data.step4.githubLink}
                </a>
              </div>
            )}
            {data.step4.portfolioUrl && (
              <div className="flex items-center gap-2">
                <LinkIcon className="w-4 h-4 text-gray-400" />
                <a
                  href={data.step4.portfolioUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-sm text-blue-600 dark:text-blue-400 hover:underline"
                >
                  {data.step4.portfolioUrl}
                </a>
              </div>
            )}
            {data.step4.location && (
              <div className="flex items-center gap-2">
                <MapPin className="w-4 h-4 text-gray-400" />
                <span className="text-sm text-gray-700 dark:text-gray-300">{data.step4.location}</span>
              </div>
            )}
          </div>

          {!data.step4.profileImageUrl &&
            !data.step4.bio &&
            !data.step4.githubLink &&
            !data.step4.portfolioUrl &&
            !data.step4.location && (
              <p className="text-sm text-gray-500 dark:text-gray-400 italic">
                프로필 정보가 추가되지 않았습니다
              </p>
            )}
        </div>
      </div>

      {/* Final Notice */}
      <div className="p-6 bg-gradient-to-r from-green-50 to-blue-50 dark:from-green-900/20 dark:to-blue-900/20 border border-green-200 dark:border-green-800 rounded-xl">
        <h3 className="font-semibold text-gray-900 dark:text-white mb-2">
          모든 준비가 완료되었습니다! 🎉
        </h3>
        <p className="text-sm text-gray-700 dark:text-gray-300 mb-4">
          "계정 생성" 버튼을 클릭하여 OpenKnot 커뮤니티에 참여하세요.
        </p>
        <ul className="space-y-2 text-sm text-gray-600 dark:text-gray-400">
          <li className="flex items-center gap-2">
            <Check className="w-4 h-4 text-green-600 dark:text-green-400" />
            다양한 프로젝트 탐색 및 참여
          </li>
          <li className="flex items-center gap-2">
            <Check className="w-4 h-4 text-green-600 dark:text-green-400" />
            같은 관심사를 가진 팀원 찾기
          </li>
          <li className="flex items-center gap-2">
            <Check className="w-4 h-4 text-green-600 dark:text-green-400" />
            포트폴리오 구축 및 경력 개발
          </li>
        </ul>
      </div>
    </div>
  );
}
