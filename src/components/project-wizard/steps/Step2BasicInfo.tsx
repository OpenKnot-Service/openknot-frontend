import { Info, Calendar, Eye, EyeOff } from 'lucide-react';
import { WizardStep2Data, ProjectType, WizardStep1Data } from '../../../types/wizard';
import { ProjectStatus } from '../../../types';

interface Step2BasicInfoProps {
  data: WizardStep2Data;
  step1Data?: WizardStep1Data;
  onChange: (data: WizardStep2Data) => void;
  errors?: Record<string, string>;
}

const PROJECT_TYPES: { value: ProjectType; label: string; icon: string; description: string }[] = [
  { value: 'web', label: '웹 애플리케이션', icon: '🌐', description: '웹사이트 또는 웹 앱' },
  { value: 'mobile', label: '모바일 앱', icon: '📱', description: 'iOS, Android 앱' },
  { value: 'desktop', label: '데스크톱 앱', icon: '💻', description: 'Windows, macOS, Linux' },
  { value: 'library', label: '라이브러리', icon: '📦', description: '재사용 가능한 패키지' },
  { value: 'other', label: '기타', icon: '🔧', description: '그 외 프로젝트' },
];

const PROJECT_STATUSES: { value: ProjectStatus; label: string; color: string }[] = [
  { value: 'recruiting', label: '팀원 모집 중', color: 'text-green-400 bg-green-500/20' },
  { value: 'in_progress', label: '진행 중', color: 'text-blue-400 bg-blue-500/20' },
];

export default function Step2BasicInfo({ data, step1Data, onChange, errors = {} }: Step2BasicInfoProps) {
  const handleChange = (field: keyof WizardStep2Data, value: any) => {
    onChange({
      ...data,
      [field]: value,
    });
  };

  // Auto-fill from AI analysis
  const handleUseSuggestedName = () => {
    if (step1Data?.parsedData?.suggestedName) {
      handleChange('name', step1Data.parsedData.suggestedName);
    }
  };

  const handleUseSuggestedType = () => {
    if (step1Data?.parsedData?.suggestedType) {
      handleChange('type', step1Data.parsedData.suggestedType);
    }
  };

  return (
    <div className="space-y-6">
      {/* AI Suggestions */}
      {step1Data?.parsedData && (
        <div className="p-4 bg-blue-500/10 border border-blue-500/30 rounded-lg">
          <div className="text-sm text-blue-400 mb-2 font-medium">
            AI 제안 사항
          </div>
          <div className="flex flex-wrap gap-2">
            {step1Data.parsedData.suggestedName && (
              <button
                onClick={handleUseSuggestedName}
                className="px-3 py-1 bg-blue-500/20 text-blue-300 rounded text-sm hover:bg-blue-500/30 transition-colors"
              >
                프로젝트 이름: {step1Data.parsedData.suggestedName}
              </button>
            )}
            {step1Data.parsedData.suggestedType && (
              <button
                onClick={handleUseSuggestedType}
                className="px-3 py-1 bg-blue-500/20 text-blue-300 rounded text-sm hover:bg-blue-500/30 transition-colors"
              >
                타입: {PROJECT_TYPES.find(t => t.value === step1Data.parsedData!.suggestedType)?.label}
              </button>
            )}
          </div>
        </div>
      )}

      {/* Project Name */}
      <div>
        <label className="flex items-center gap-2 text-gray-900 dark:text-white font-medium mb-2">
          <Info className="w-4 h-4" />
          프로젝트 이름 <span className="text-red-400">*</span>
        </label>
        <input
          type="text"
          value={data.name}
          onChange={(e) => handleChange('name', e.target.value)}
          placeholder="예: OpenKnot"
          className={`w-full px-4 py-3 rounded-lg text-gray-900 placeholder-gray-500 bg-white border focus:outline-none focus:ring-2 dark:text-white dark:bg-gray-900 ${
            errors.name
              ? 'border-red-500 focus:ring-red-500'
              : 'border-gray-300 focus:ring-blue-500 dark:border-gray-700'
          }`}
        />
        {errors.name && (
          <p className="mt-1 text-sm text-red-400">{errors.name}</p>
        )}
      </div>

      {/* Project Description */}
      <div>
        <label className="flex items-center gap-2 text-gray-900 dark:text-white font-medium mb-2">
          프로젝트 설명 <span className="text-red-400">*</span>
        </label>
        <textarea
          value={data.description}
          onChange={(e) => handleChange('description', e.target.value)}
          placeholder="프로젝트에 대한 간단한 설명을 작성해주세요"
          rows={4}
          className={`w-full px-4 py-3 rounded-lg text-gray-900 placeholder-gray-500 bg-white border focus:outline-none focus:ring-2 resize-none dark:text-white dark:bg-gray-900 ${
            errors.description
              ? 'border-red-500 focus:ring-red-500'
              : 'border-gray-300 focus:ring-blue-500 dark:border-gray-700'
          }`}
        />
        {errors.description && (
          <p className="mt-1 text-sm text-red-400">{errors.description}</p>
        )}
      </div>

      {/* Project Type */}
      <div>
        <label className="text-gray-900 dark:text-white font-medium mb-3 block">
          프로젝트 타입 <span className="text-red-400">*</span>
        </label>
        <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
          {PROJECT_TYPES.map((type) => (
            <button
              key={type.value}
              onClick={() => handleChange('type', type.value)}
              className={`p-4 border rounded-lg text-left transition-all ${
                data.type === type.value
                  ? 'border-blue-500 bg-blue-500/10'
                  : 'border-gray-200 bg-white hover:border-gray-400 dark:border-gray-700 dark:bg-gray-900 dark:hover:border-gray-600'
              }`}
            >
              <div className="text-2xl mb-2">{type.icon}</div>
              <div className="text-gray-900 dark:text-white font-medium text-sm mb-1">
                {type.label}
              </div>
              <div className="text-gray-500 dark:text-gray-500 text-xs">{type.description}</div>
            </button>
          ))}
        </div>
      </div>

      {/* Project Visibility */}
      <div>
        <label className="text-gray-900 dark:text-white font-medium mb-3 block">
          프로젝트 공개 범위
        </label>
        <div className="grid grid-cols-2 gap-3">
          <button
            onClick={() => handleChange('visibility', 'public')}
            className={`p-4 border rounded-lg text-left transition-all flex items-start gap-3 ${
              data.visibility === 'public'
                ? 'border-blue-500 bg-blue-500/10'
                : 'border-gray-200 bg-white hover:border-gray-400 dark:border-gray-700 dark:bg-gray-900 dark:hover:border-gray-600'
            }`}
          >
            <Eye className="w-5 h-5 text-blue-400 mt-0.5" />
            <div>
              <div className="text-gray-900 dark:text-white font-medium text-sm mb-1">공개</div>
              <div className="text-gray-500 dark:text-gray-500 text-xs">
                모든 사람이 볼 수 있습니다
              </div>
            </div>
          </button>
          <button
            onClick={() => handleChange('visibility', 'private')}
            className={`p-4 border rounded-lg text-left transition-all flex items-start gap-3 ${
              data.visibility === 'private'
                ? 'border-blue-500 bg-blue-500/10'
                : 'border-gray-200 bg-white hover:border-gray-400 dark:border-gray-700 dark:bg-gray-900 dark:hover:border-gray-600'
            }`}
          >
            <EyeOff className="w-5 h-5 text-gray-400 mt-0.5" />
            <div>
              <div className="text-gray-900 dark:text-white font-medium text-sm mb-1">비공개</div>
              <div className="text-gray-500 dark:text-gray-500 text-xs">
                팀원만 볼 수 있습니다
              </div>
            </div>
          </button>
        </div>
      </div>

      {/* Project Status */}
      <div>
        <label className="text-gray-900 dark:text-white font-medium mb-3 block">
          프로젝트 상태
        </label>
        <div className="grid grid-cols-2 gap-3">
          {PROJECT_STATUSES.map((status) => (
            <button
              key={status.value}
              onClick={() => handleChange('status', status.value)}
              className={`p-3 border rounded-lg text-left transition-all ${
                data.status === status.value
                  ? 'border-blue-500 bg-blue-500/10'
                  : 'border-gray-200 bg-white hover:border-gray-400 dark:border-gray-700 dark:bg-gray-900 dark:hover:border-gray-600'
              }`}
            >
              <div className={`inline-block px-2 py-1 rounded text-xs font-medium ${status.color}`}>
                {status.label}
              </div>
            </button>
          ))}
        </div>
      </div>

      {/* Dates */}
      <div className="grid grid-cols-2 gap-4">
        <div>
          <label className="flex items-center gap-2 text-gray-900 dark:text-white font-medium mb-2">
            <Calendar className="w-4 h-4" />
            시작일
          </label>
          <input
            type="date"
            value={data.startDate || ''}
            onChange={(e) => handleChange('startDate', e.target.value)}
            className="w-full px-4 py-3 rounded-lg bg-white border border-gray-300 text-gray-900 focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-gray-900 dark:border-gray-700 dark:text-white"
          />
        </div>
        <div>
          <label className="flex items-center gap-2 text-gray-900 dark:text-white font-medium mb-2">
            <Calendar className="w-4 h-4" />
            종료일 (목표)
          </label>
          <input
            type="date"
            value={data.endDate || ''}
            onChange={(e) => handleChange('endDate', e.target.value)}
            min={data.startDate}
            className="w-full px-4 py-3 rounded-lg bg-white border border-gray-300 text-gray-900 focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-gray-900 dark:border-gray-700 dark:text-white"
          />
        </div>
      </div>
    </div>
  );
}
