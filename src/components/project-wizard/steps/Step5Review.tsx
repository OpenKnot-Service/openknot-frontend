import { useMemo } from 'react';
import { Check, Edit2, Calendar, Users, Code, Eye, EyeOff, ListTree } from 'lucide-react';
import { WizardFormData } from '../../../types/wizard';
import TaskPyramid from '../TaskPyramid';
import { getMockTaskTree } from '../../../lib/mockTaskTree';

interface Step5ReviewProps {
  formData: WizardFormData;
  onEditStep: (step: 1 | 2 | 3 | 4) => void;
}

export default function Step5Review({ formData, onEditStep }: Step5ReviewProps) {
  const { step1, step2, step3, step4 } = formData;

  const allTechStack = [
    ...step3.techStack,
    ...step3.customTech,
  ];

  const totalTeamSize = step4.positions.reduce((sum, pos) => sum + pos.count, 0);
  const taskTree = useMemo(
    () => getMockTaskTree(step2.type, step1.parsedData?.keywords || []),
    [step1.parsedData?.keywords, step2.type]
  );

  return (
    <div className="space-y-6">
      {/* Success Message */}
      <div className="p-6 bg-gradient-to-r from-green-500/10 to-blue-500/10 border border-green-500/30 rounded-lg text-center">
        <div className="w-16 h-16 bg-green-500 rounded-full flex items-center justify-center mx-auto mb-4">
          <Check className="w-8 h-8 text-white" />
        </div>
        <h3 className="text-xl font-bold text-white mb-2">
          프로젝트 준비 완료!
        </h3>
        <p className="text-gray-400">
          아래 내용을 확인하고 프로젝트를 생성하세요
        </p>
      </div>

      {/* Idea Summary */}
      {step1.idea && (
        <div className="p-4 bg-gray-900 border border-gray-700 rounded-lg">
          <div className="flex items-center justify-between mb-3">
            <h4 className="text-white font-medium">💡 프로젝트 아이디어</h4>
            <button
              onClick={() => onEditStep(1)}
              className="text-sm text-blue-400 hover:text-blue-300 flex items-center gap-1"
            >
              <Edit2 className="w-3.5 h-3.5" />
              수정
            </button>
          </div>
          <p className="text-sm text-gray-400 line-clamp-3">{step1.idea}</p>
          {step1.parsedData?.keywords && step1.parsedData.keywords.length > 0 && (
            <div className="flex flex-wrap gap-2 mt-3">
              {step1.parsedData.keywords.map((keyword) => (
                <span
                  key={keyword}
                  className="px-2 py-1 bg-blue-500/20 text-blue-400 rounded text-xs"
                >
                  {keyword}
                </span>
              ))}
            </div>
          )}
        </div>
      )}

      {/* Basic Info */}
      <div className="p-4 bg-gray-900 border border-gray-700 rounded-lg">
        <div className="flex items-center justify-between mb-3">
          <h4 className="text-white font-medium">📋 기본 정보</h4>
          <button
            onClick={() => onEditStep(2)}
            className="text-sm text-blue-400 hover:text-blue-300 flex items-center gap-1"
          >
            <Edit2 className="w-3.5 h-3.5" />
            수정
          </button>
        </div>
        <div className="space-y-3">
          <div className="flex items-start gap-3">
            <div className="text-2xl">
              {step2.type === 'web' && '🌐'}
              {step2.type === 'mobile' && '📱'}
              {step2.type === 'desktop' && '💻'}
              {step2.type === 'library' && '📦'}
              {step2.type === 'other' && '🔧'}
            </div>
            <div className="flex-1">
              <div className="text-lg font-semibold text-white mb-1">
                {step2.name}
              </div>
              <div className="text-sm text-gray-400 mb-2">
                {step2.description}
              </div>
              <div className="flex items-center gap-4 text-sm">
                <div className="flex items-center gap-1.5 text-gray-400">
                  {step2.visibility === 'public' ? (
                    <><Eye className="w-4 h-4" /> 공개</>
                  ) : (
                    <><EyeOff className="w-4 h-4" /> 비공개</>
                  )}
                </div>
                {(step2.startDate || step2.endDate) && (
                  <div className="flex items-center gap-1.5 text-gray-400">
                    <Calendar className="w-4 h-4" />
                    {step2.startDate && new Date(step2.startDate).toLocaleDateString('ko-KR')}
                    {step2.startDate && step2.endDate && ' ~ '}
                    {step2.endDate && new Date(step2.endDate).toLocaleDateString('ko-KR')}
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Tech Stack */}
      {allTechStack.length > 0 && (
        <div className="p-4 bg-gray-900 border border-gray-700 rounded-lg">
          <div className="flex items-center justify-between mb-3">
            <h4 className="text-white font-medium flex items-center gap-2">
              <Code className="w-5 h-5" />
              기술 스택 ({allTechStack.length}개)
            </h4>
            <button
              onClick={() => onEditStep(3)}
              className="text-sm text-blue-400 hover:text-blue-300 flex items-center gap-1"
            >
              <Edit2 className="w-3.5 h-3.5" />
              수정
            </button>
          </div>
          <div className="flex flex-wrap gap-2 pl-2">
            {step3.techStack.map((tech) => {
              const Icon = tech.icon;
              return (
                <span
                  key={tech.id}
                  className="flex items-center gap-1.5 px-3 py-1.5 bg-blue-500/20 text-blue-300 rounded-full text-sm"
                >
                  {Icon && <Icon className="w-4 h-4" />}
                  {tech.name}
                </span>
              );
            })}
            {step3.customTech.map((tech) => {
              const Icon = tech.icon;
              return (
                <span
                  key={tech.id}
                  className="flex items-center gap-1.5 px-3 py-1.5 bg-purple-500/20 text-purple-300 rounded-full text-sm"
                >
                  {Icon && <Icon className="w-4 h-4" />}
                  {tech.name}
                </span>
              );
            })}
          </div>
          {step3.selectedRecommendation && (
            <div className="mt-3 text-sm text-gray-400">
              AI 추천을 기반으로 선택되었습니다
            </div>
          )}
        </div>
      )}

      {/* Team */}
      {step4.positions.length > 0 && (
        <div className="p-4 bg-gray-900 border border-gray-700 rounded-lg">
          <div className="flex items-center justify-between mb-3">
            <h4 className="text-white font-medium flex items-center gap-2">
              <Users className="w-5 h-5" />
              팀 구성 ({totalTeamSize}명)
            </h4>
            <button
              onClick={() => onEditStep(4)}
              className="text-sm text-blue-400 hover:text-blue-300 flex items-center gap-1"
            >
              <Edit2 className="w-3.5 h-3.5" />
              수정
            </button>
          </div>
          <div className="space-y-2">
            {step4.positions.map((position) => (
              <div
                key={position.id}
                className="flex items-center justify-between p-2 bg-gray-800 rounded"
              >
                <div className="flex items-center gap-2">
                  <span className="text-white text-sm font-medium">
                    {position.title}
                  </span>
                  <span className="text-xs text-gray-400">
                    ({position.count}명)
                  </span>
                </div>
                {position.requirements.length > 0 && (
                  <span className="text-xs text-gray-500">
                    {position.requirements.length}개 요구사항
                  </span>
                )}
              </div>
            ))}
          </div>
          {step4.inviteEmails && step4.inviteEmails.length > 0 && (
            <div className="mt-3 text-sm text-gray-400">
              {step4.inviteEmails.length}명에게 초대 이메일이 발송됩니다
            </div>
          )}
        </div>
      )}

      {/* Task Tree */}
      {taskTree.length > 0 && (
        <div className="p-4 bg-white border border-gray-200 rounded-lg shadow-sm dark:bg-gray-900 dark:border-gray-700">
          <div className="flex items-center justify-between mb-2">
            <h4 className="text-gray-900 dark:text-white font-medium flex items-center gap-2">
              <ListTree className="w-5 h-5" />
              AI 태스크 트리
            </h4>
            <span className="text-xs text-gray-500 dark:text-gray-500">Mock 데이터</span>
          </div>
          <p className="text-sm text-gray-600 dark:text-gray-400 mb-4">
            아이디어와 기술 스택을 기반으로 생성된 예시 업무 분해 구조입니다. 실제 API 연동 전까지는
            이 뷰로 전체 작업 흐름을 미리 참고할 수 있습니다.
          </p>
          <TaskPyramid tasks={taskTree} />
        </div>
      )}

      {/* Summary Stats */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
        <div className="p-4 bg-gradient-to-br from-blue-500/10 to-blue-500/5 border border-blue-500/20 rounded-lg">
          <div className="text-2xl font-bold text-blue-400">
            {step2.type === 'web' && '🌐'}
            {step2.type === 'mobile' && '📱'}
            {step2.type === 'desktop' && '💻'}
            {step2.type === 'library' && '📦'}
            {step2.type === 'other' && '🔧'}
          </div>
          <div className="text-sm text-gray-400 mt-1">
            {step2.type === 'web' && '웹'}
            {step2.type === 'mobile' && '모바일'}
            {step2.type === 'desktop' && '데스크톱'}
            {step2.type === 'library' && '라이브러리'}
            {step2.type === 'other' && '기타'}
          </div>
        </div>
        <div className="p-4 bg-gradient-to-br from-purple-500/10 to-purple-500/5 border border-purple-500/20 rounded-lg">
          <div className="text-2xl font-bold text-purple-400">
            {allTechStack.length}
          </div>
          <div className="text-sm text-gray-400 mt-1">기술 스택</div>
        </div>
        <div className="p-4 bg-gradient-to-br from-green-500/10 to-green-500/5 border border-green-500/20 rounded-lg">
          <div className="text-2xl font-bold text-green-400">
            {step4.positions.length}
          </div>
          <div className="text-sm text-gray-400 mt-1">포지션</div>
        </div>
        <div className="p-4 bg-gradient-to-br from-yellow-500/10 to-yellow-500/5 border border-yellow-500/20 rounded-lg">
          <div className="text-2xl font-bold text-yellow-400">
            {totalTeamSize}
          </div>
          <div className="text-sm text-gray-400 mt-1">팀 규모</div>
        </div>
      </div>

      {/* Final Note */}
      <div className="p-4 bg-gray-900/50 border border-gray-700 rounded-lg">
        <div className="text-sm text-gray-400">
          <strong className="text-white">✨ 알림:</strong> 프로젝트를 생성한 후에도
          모든 정보를 수정할 수 있습니다. 언제든지 프로젝트 설정에서 변경하세요.
        </div>
      </div>
    </div>
  );
}
