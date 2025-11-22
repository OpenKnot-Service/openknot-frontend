import { useMemo, useState } from 'react';
import { Users, Plus, X, Trash2, Code, Palette, FileText, Wrench, Sparkles } from 'lucide-react';
import {
  WizardStep4Data,
  PositionDefinition,
  WizardStep1Data,
  WizardStep2Data,
  WizardStep3Data,
  TechStackItem,
  TechCategory
} from '../../../types/wizard';

interface Step4TeamProps {
  data: WizardStep4Data;
  onChange: (data: WizardStep4Data) => void;
  step1Data?: WizardStep1Data;
  step2Data?: WizardStep2Data;
  step3Data?: WizardStep3Data;
}

const ROLE_OPTIONS = [
  { value: 'developer' as const, label: '개발자', icon: Code, color: 'text-blue-400' },
  { value: 'designer' as const, label: '디자이너', icon: Palette, color: 'text-pink-400' },
  { value: 'planner' as const, label: '기획자', icon: FileText, color: 'text-green-400' },
  { value: 'other' as const, label: '기타', icon: Wrench, color: 'text-gray-400' },
];

interface TeamRecommendation {
  id: string;
  role: PositionDefinition['role'];
  title: string;
  count: number;
  reason: string;
  skills: string[];
}

const combineTechItems = (step3Data?: WizardStep3Data): TechStackItem[] => {
  if (!step3Data) return [];
  const combined = [...(step3Data.techStack || []), ...(step3Data.customTech || [])];
  const map = new Map<string, TechStackItem>();
  combined.forEach((item) => {
    if (!map.has(item.id)) {
      map.set(item.id, item);
    }
  });
  return Array.from(map.values());
};

const pickSkills = (items: TechStackItem[], categories: TechCategory[], limit = 3) => {
  const skills: string[] = [];
  items.forEach((item) => {
    if (categories.includes(item.category) && !skills.includes(item.name)) {
      skills.push(item.name);
    }
  });
  return skills.slice(0, limit);
};

const buildTeamRecommendations = ({
  step1Data,
  step2Data,
  step3Data,
}: {
  step1Data?: WizardStep1Data;
  step2Data?: WizardStep2Data;
  step3Data?: WizardStep3Data;
}): TeamRecommendation[] => {
  const items = combineTechItems(step3Data);
  const categoryCounts: Record<TechCategory, number> = {
    frontend: 0,
    backend: 0,
    database: 0,
    devops: 0,
    mobile: 0,
    other: 0,
  };

  items.forEach((item) => {
    categoryCounts[item.category] = (categoryCounts[item.category] || 0) + 1;
  });

  const backendTotal = categoryCounts.backend + categoryCounts.database;
  const projectType = step2Data?.type || 'web';
  const ideaLength = step1Data?.idea?.length || 0;
  const keywords = step1Data?.parsedData?.keywords || [];
  const recommendations: TeamRecommendation[] = [];

  if (categoryCounts.frontend > 0) {
    recommendations.push({
      id: 'frontend',
      role: 'developer',
      title: '프론트엔드 개발자',
      count: Math.max(1, Math.round(categoryCounts.frontend / 2)),
      reason: `프론트엔드 관련 기술 ${categoryCounts.frontend}개를 선택한 것을 기준으로 추천합니다.`,
      skills: pickSkills(items, ['frontend']),
    });
  }

  if (backendTotal > 0) {
    recommendations.push({
      id: 'backend',
      role: 'developer',
      title: '백엔드 개발자',
      count: Math.max(1, Math.round(backendTotal / 2)),
      reason: `백엔드/데이터베이스 기술 ${backendTotal}개가 포함되어 있어 서버 역할을 분리하는 것이 좋습니다.`,
      skills: pickSkills(items, ['backend', 'database']),
    });
  }

  if (categoryCounts.mobile > 0 || projectType === 'mobile') {
    recommendations.push({
      id: 'mobile',
      role: 'developer',
      title: '모바일 개발자',
      count: Math.max(1, Math.round(Math.max(categoryCounts.mobile, 1) / 2)),
      reason: '모바일 기술 스택이 포함되어 있어 전담 모바일 개발자가 필요합니다.',
      skills: pickSkills(items, ['mobile']),
    });
  }

  if (categoryCounts.devops > 0) {
    recommendations.push({
      id: 'devops',
      role: 'other',
      title: 'DevOps / 인프라 엔지니어',
      count: 1,
      reason: '배포 · 인프라 관련 기술이 포함되어 있어 안정적인 운영을 위한 전담 인력이 있으면 좋습니다.',
      skills: pickSkills(items, ['devops']),
    });
  }

  const needsDesigner = projectType !== 'library';
  if (needsDesigner) {
    recommendations.push({
      id: 'designer',
      role: 'designer',
      title: 'UI/UX 디자이너',
      count: projectType === 'mobile' ? 2 : 1,
      reason: '사용자 경험과 화면 설계를 위해 디자이너를 구성에 포함하는 것을 권장합니다.',
      skills: keywords.slice(0, 3),
    });
  }

  const needsPlanner = ideaLength > 250 || projectType !== 'library';
  if (needsPlanner) {
    recommendations.push({
      id: 'planner',
      role: 'planner',
      title: '프로덕트 매니저',
      count: 1,
      reason: '기획/커뮤니케이션을 담당할 인원이 있으면 프로젝트 진행이 원활합니다.',
      skills: keywords.slice(0, 3),
    });
  }

  if (!recommendations.some((rec) => rec.role === 'developer')) {
    recommendations.unshift({
      id: 'fullstack',
      role: 'developer',
      title: '풀스택 개발자',
      count: Math.max(2, Math.ceil((items.length || 2) / 2)),
      reason: '다양한 기술 스택을 균형 있게 다룰 수 있는 인력이 필요합니다.',
      skills: items.slice(0, 3).map((item) => item.name),
    });
  }

  return recommendations;
};
export default function Step4Team({ data, onChange, step1Data, step2Data, step3Data }: Step4TeamProps) {
  const [newPosition, setNewPosition] = useState<Partial<PositionDefinition>>({
    role: 'developer',
    title: '',
    count: 1,
    requirements: [],
  });
  const [requirementInput, setRequirementInput] = useState('');

  const teamRecommendations = useMemo(
    () => buildTeamRecommendations({ step1Data, step2Data, step3Data }),
    [step1Data, step2Data, step3Data]
  );

  const hasPosition = (title: string) => data.positions.some((p) => p.title === title);

  const handleApplyRecommendation = (rec: TeamRecommendation) => {
    if (hasPosition(rec.title)) return;
    const position: PositionDefinition = {
      id: `rec-${rec.id}-${Date.now()}`,
      role: rec.role,
      title: rec.title,
      count: rec.count,
      requirements: rec.skills,
      description: rec.reason,
    };
    onChange({
      ...data,
      positions: [...data.positions, position],
    });
  };

  const handleApplyAllRecommendations = () => {
    const nextPositions = [...data.positions];
    teamRecommendations.forEach((rec) => {
      if (!nextPositions.some((p) => p.title === rec.title)) {
        nextPositions.push({
          id: `rec-${rec.id}-${Date.now()}`,
          role: rec.role,
          title: rec.title,
          count: rec.count,
          requirements: rec.skills,
          description: rec.reason,
        });
      }
    });
    if (nextPositions.length !== data.positions.length) {
      onChange({
        ...data,
        positions: nextPositions,
      });
    }
  };

  const allRecommendationsApplied =
    teamRecommendations.length > 0 && teamRecommendations.every((rec) => hasPosition(rec.title));

  const handleAddPosition = () => {
    if (!newPosition.title?.trim()) return;

    const position: PositionDefinition = {
      id: `pos-${Date.now()}`,
      role: newPosition.role as any,
      title: newPosition.title,
      count: newPosition.count || 1,
      requirements: newPosition.requirements || [],
      description: newPosition.description,
    };

    onChange({
      ...data,
      positions: [...data.positions, position],
    });

    // Reset form
    setNewPosition({
      role: 'developer',
      title: '',
      count: 1,
      requirements: [],
    });
    setRequirementInput('');
  };

  const handleRemovePosition = (id: string) => {
    onChange({
      ...data,
      positions: data.positions.filter(p => p.id !== id),
    });
  };

  const handleAddRequirement = () => {
    if (!requirementInput.trim()) return;

    setNewPosition({
      ...newPosition,
      requirements: [...(newPosition.requirements || []), requirementInput.trim()],
    });
    setRequirementInput('');
  };

  const handleRemoveRequirement = (index: number) => {
    setNewPosition({
      ...newPosition,
      requirements: (newPosition.requirements || []).filter((_, i) => i !== index),
    });
  };

  const handleInviteEmailsChange = (value: string) => {
    onChange({
      ...data,
      inviteEmails: value.split(',').map(e => e.trim()).filter(Boolean),
    });
  };

  const getRoleIcon = (role: PositionDefinition['role']) => {
    const option = ROLE_OPTIONS.find(o => o.value === role);
    return option ? <option.icon className={`w-5 h-5 ${option.color}`} /> : null;
  };

  const getRoleLabel = (role: PositionDefinition['role']) => {
    return ROLE_OPTIONS.find(o => o.value === role)?.label || role;
  };

  return (
    <div className="space-y-6">
      {/* Info */}
      <div className="p-4 bg-blue-50 border border-blue-100 rounded-lg dark:bg-blue-500/10 dark:border-blue-500/30">
        <div className="text-sm text-blue-700 dark:text-blue-300">
          팀 구성은 나중에도 변경할 수 있습니다. 현재 필요한 역할과 인원을 정의해주세요.
        </div>
      </div>

      {/* AI Recommendations */}
      {teamRecommendations.length > 0 && (
        <div className="p-4 bg-white border border-gray-200 rounded-xl shadow-sm dark:bg-gray-900/40 dark:border-gray-700">
          <div className="flex items-start justify-between gap-4">
            <div>
              <div className="flex items-center gap-2 text-sm font-semibold text-gray-900 dark:text-white">
                <Sparkles className="w-4 h-4 text-yellow-500" />
                AI 추천 팀 구성
              </div>
              <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">
                프로젝트 유형과 선택한 기술 스택을 기반으로 추천 인원을 제안합니다.
              </p>
            </div>
            <button
              onClick={handleApplyAllRecommendations}
              disabled={allRecommendationsApplied}
              className="px-3 py-1.5 rounded-lg text-sm font-medium bg-blue-500 text-white hover:bg-blue-600 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            >
              전체 적용
            </button>
          </div>
          <div className="grid gap-3 mt-4 md:grid-cols-2">
            {teamRecommendations.map((rec) => {
              const exists = hasPosition(rec.title);
              return (
                <div
                  key={rec.id}
                  className="p-4 border border-gray-200 rounded-lg bg-gray-50 dark:bg-gray-900/60 dark:border-gray-700"
                >
                  <div className="flex items-start justify-between gap-2">
                    <div>
                      <div className="text-base font-semibold text-gray-900 dark:text-white">
                        {rec.title}
                      </div>
                      <div className="text-sm text-gray-600 dark:text-gray-400">
                        {ROLE_OPTIONS.find((r) => r.value === rec.role)?.label} · 추천 {rec.count}명
                      </div>
                    </div>
                    <span className="text-xs px-2 py-1 rounded-full bg-blue-100 text-blue-700 dark:bg-blue-500/20 dark:text-blue-200">
                      AI 추천
                    </span>
                  </div>
                  <p className="text-sm text-gray-600 dark:text-gray-400 mt-2">{rec.reason}</p>
                  {rec.skills.length > 0 && (
                    <div className="flex flex-wrap gap-1.5 mt-3">
                      {rec.skills.map((skill) => (
                        <span
                          key={skill}
                          className="px-2 py-0.5 text-xs rounded-full bg-white text-gray-700 border border-gray-200 dark:bg-gray-800 dark:text-gray-300 dark:border-gray-700"
                        >
                          {skill}
                        </span>
                      ))}
                    </div>
                  )}
                  <button
                    onClick={() => handleApplyRecommendation(rec)}
                    disabled={exists}
                    className="mt-3 w-full py-2 text-sm font-medium rounded-lg border border-blue-500 text-blue-600 hover:bg-blue-50 transition-colors disabled:opacity-50 disabled:cursor-not-allowed dark:text-blue-300 dark:hover:bg-blue-500/10"
                  >
                    {exists ? '이미 추가됨' : '이 포지션 추가'}
                  </button>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* Existing Positions */}
      {data.positions.length > 0 && (
        <div>
          <div className="flex items-center gap-2 text-gray-900 dark:text-white font-medium mb-3">
            <Users className="w-5 h-5" />
            정의된 포지션 ({data.positions.length}개)
          </div>
          <div className="space-y-3">
            {data.positions.map((position) => (
              <div
                key={position.id}
                className="p-4 bg-white border border-gray-200 rounded-lg dark:bg-gray-900 dark:border-gray-700"
              >
                <div className="flex items-start justify-between mb-3">
                  <div className="flex items-center gap-3">
                    {getRoleIcon(position.role)}
                    <div>
                      <div className="text-gray-900 dark:text-white font-medium">{position.title}</div>
                      <div className="text-sm text-gray-600 dark:text-gray-400">
                        {getRoleLabel(position.role)} · {position.count}명 필요
                      </div>
                    </div>
                  </div>
                  <button
                    onClick={() => handleRemovePosition(position.id)}
                    className="p-1 text-red-500 hover:text-red-400 hover:bg-red-500/10 rounded transition-colors"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
                {position.description && (
                  <p className="text-sm text-gray-600 dark:text-gray-400 mb-2">{position.description}</p>
                )}
                {position.requirements.length > 0 && (
                  <div className="flex flex-wrap gap-2">
                    {position.requirements.map((req, index) => (
                      <span
                        key={index}
                        className="px-2 py-1 bg-gray-100 text-gray-700 rounded text-xs dark:bg-gray-800 dark:text-gray-300"
                      >
                        {req}
                      </span>
                    ))}
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Add New Position Form */}
      <div className="p-4 bg-white border border-gray-200 rounded-lg shadow-sm dark:bg-gray-900 dark:border-gray-700">
        <div className="text-gray-900 dark:text-white font-medium mb-4">새 포지션 추가</div>

        <div className="space-y-4">
          {/* Role Selection */}
          <div>
            <label className="text-sm text-gray-700 dark:text-gray-400 mb-2 block">역할</label>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-2">
              {ROLE_OPTIONS.map((option) => (
                <button
                  key={option.value}
                  onClick={() => setNewPosition({ ...newPosition, role: option.value })}
                  className={`p-3 border rounded-lg flex items-center gap-2 transition-all ${
                    newPosition.role === option.value
                      ? 'border-blue-500 bg-blue-500/10'
                      : 'border-gray-200 hover:border-gray-400 dark:border-gray-700 dark:hover:border-gray-600'
                  }`}
                >
                  <option.icon className={`w-4 h-4 ${option.color}`} />
                  <span className="text-sm text-gray-900 dark:text-white">{option.label}</span>
                </button>
              ))}
            </div>
          </div>

          {/* Title */}
          <div>
            <label className="text-sm text-gray-700 dark:text-gray-400 mb-2 block">
              포지션 이름 <span className="text-red-400">*</span>
            </label>
            <input
              type="text"
              value={newPosition.title}
              onChange={(e) => setNewPosition({ ...newPosition, title: e.target.value })}
              placeholder="예: 프론트엔드 개발자, UI/UX 디자이너"
              className="w-full px-3 py-2 bg-white border border-gray-300 rounded-lg text-gray-900 placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-gray-800 dark:border-gray-700 dark:text-white"
            />
          </div>

          {/* Count */}
          <div>
            <label className="text-sm text-gray-700 dark:text-gray-400 mb-2 block">필요 인원</label>
            <input
              type="number"
              min="1"
              value={newPosition.count}
              onChange={(e) => setNewPosition({ ...newPosition, count: parseInt(e.target.value) || 1 })}
              className="w-full px-3 py-2 bg-white border border-gray-300 rounded-lg text-gray-900 focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-gray-800 dark:border-gray-700 dark:text-white"
            />
          </div>

          {/* Description */}
          <div>
            <label className="text-sm text-gray-700 dark:text-gray-400 mb-2 block">설명 (선택)</label>
            <textarea
              value={newPosition.description || ''}
              onChange={(e) => setNewPosition({ ...newPosition, description: e.target.value })}
              placeholder="포지션에 대한 간단한 설명"
              rows={2}
              className="w-full px-3 py-2 bg-white border border-gray-300 rounded-lg text-gray-900 placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-500 resize-none dark:bg-gray-800 dark:border-gray-700 dark:text-white"
            />
          </div>

          {/* Requirements */}
          <div>
            <label className="text-sm text-gray-700 dark:text-gray-400 mb-2 block">요구사항 (선택)</label>
            <div className="flex gap-2 mb-2">
              <input
                type="text"
                value={requirementInput}
                onChange={(e) => setRequirementInput(e.target.value)}
                onKeyPress={(e) => {
                  if (e.key === 'Enter') {
                    e.preventDefault();
                    handleAddRequirement();
                  }
                }}
                placeholder="요구사항을 입력하고 Enter"
                className="flex-1 px-3 py-2 bg-white border border-gray-300 rounded-lg text-gray-900 placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-gray-800 dark:border-gray-700 dark:text-white"
              />
              <button
                onClick={handleAddRequirement}
                className="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors"
              >
                <Plus className="w-4 h-4" />
              </button>
            </div>
            {newPosition.requirements && newPosition.requirements.length > 0 && (
              <div className="flex flex-wrap gap-2">
                {newPosition.requirements.map((req, index) => (
                  <div
                    key={index}
                    className="flex items-center gap-2 px-2 py-1 bg-gray-100 text-gray-700 rounded dark:bg-gray-800 dark:text-gray-300"
                  >
                    <span className="text-sm">{req}</span>
                    <button
                      onClick={() => handleRemoveRequirement(index)}
                      className="text-gray-500 hover:text-red-500 transition-colors dark:text-gray-400"
                    >
                      <X className="w-3.5 h-3.5" />
                    </button>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Add Button */}
          <button
            onClick={handleAddPosition}
            disabled={!newPosition.title?.trim()}
            className="w-full py-2 px-4 bg-blue-500 text-white rounded-lg font-medium hover:bg-blue-600 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
          >
            <Plus className="w-4 h-4" />
            포지션 추가
          </button>
        </div>
      </div>

      {/* Team Invite (Optional) */}
      <div>
        <div className="text-gray-900 dark:text-white font-medium mb-2">팀원 초대 (선택)</div>
        <p className="text-sm text-gray-600 dark:text-gray-400 mb-3">
          초대할 팀원의 이메일을 쉼표로 구분하여 입력하세요
        </p>
        <input
          type="text"
          value={data.inviteEmails?.join(', ') || ''}
          onChange={(e) => handleInviteEmailsChange(e.target.value)}
          placeholder="email1@example.com, email2@example.com"
          className="w-full px-4 py-3 bg-white border border-gray-300 rounded-lg text-gray-900 placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-gray-900 dark:border-gray-700 dark:text-white"
        />
      </div>

      {/* Skip Option */}
      <div className="p-4 bg-gray-50 border border-gray-200 rounded-lg dark:bg-gray-900/50 dark:border-gray-700">
        <div className="text-sm text-gray-600 dark:text-gray-400">
          <strong className="text-gray-900 dark:text-white">💡 팁:</strong> 혼자 시작하거나 팀 구성이
          확정되지 않았다면 이 단계를 건너뛰어도 됩니다. 나중에 프로젝트 설정에서
          팀원을 추가할 수 있습니다.
        </div>
      </div>
    </div>
  );
}
