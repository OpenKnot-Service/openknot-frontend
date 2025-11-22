import { useState } from 'react';
import { Sparkles, X, Plus, Check } from 'lucide-react';
import { WizardStep3Data, WizardStep1Data, WizardStep2Data, TechStackItem } from '../../../types/wizard';
import { getRecommendations, TECH_STACK_DATABASE } from '../../../lib/techStackRecommendations';
import TechStackInput from '../../ui/TechStackInput';

interface Step3TechStackProps {
  data: WizardStep3Data;
  step1Data?: WizardStep1Data;
  step2Data?: WizardStep2Data;
  onChange: (data: WizardStep3Data) => void;
}

export default function Step3TechStack({ data, step1Data, step2Data, onChange }: Step3TechStackProps) {
  const recommendations = getRecommendations(step1Data, step2Data);
  const [showCustomInput, setShowCustomInput] = useState(false);

  const handleRecommendationSelect = (recommendationId: string) => {
    const selected = recommendations.find(r => r.id === recommendationId);
    if (selected) {
      onChange({
        ...data,
        selectedRecommendation: recommendationId,
        techStack: selected.techStack,
      });
    }
  };

  const handleTechToggle = (tech: TechStackItem) => {
    const exists = data.techStack.some(t => t.id === tech.id);
    if (exists) {
      onChange({
        ...data,
        techStack: data.techStack.filter(t => t.id !== tech.id),
      });
    } else {
      onChange({
        ...data,
        techStack: [...data.techStack, tech],
      });
    }
  };

  const handleCustomTechChange = (techs: TechStackItem[]) => {
    onChange({
      ...data,
      customTech: techs,
    });
  };

  const isTechSelected = (techId: string) => {
    return data.techStack.some(t => t.id === techId);
  };

  // Group tech by category
  const groupedTech = data.techStack.reduce((acc, tech) => {
    if (!acc[tech.category]) {
      acc[tech.category] = [];
    }
    acc[tech.category].push(tech);
    return acc;
  }, {} as Record<string, TechStackItem[]>);

  const categoryLabels: Record<string, string> = {
    frontend: '프론트엔드',
    backend: '백엔드',
    database: '데이터베이스',
    devops: 'DevOps',
    mobile: '모바일',
    other: '기타',
  };

  return (
    <div className="space-y-6">
      {/* AI Recommendations */}
      <div>
        <div className="flex items-center gap-2 text-white font-medium mb-3">
          <Sparkles className="w-5 h-5 text-yellow-500" />
          AI 추천 기술 스택
        </div>
        <div className="grid gap-3">
          {recommendations.map((rec) => {
            const isSelected = data.selectedRecommendation === rec.id;
            return (
              <button
                key={rec.id}
                onClick={() => handleRecommendationSelect(rec.id)}
                className={`p-4 border rounded-lg text-left transition-all ${
                  isSelected
                    ? 'border-blue-500 bg-blue-500/10'
                    : 'border-gray-700 bg-gray-900 hover:border-gray-600'
                }`}
              >
                <div className="flex items-start justify-between mb-2">
                  <div>
                    <div className="flex items-center gap-2">
                      <h3 className="text-white font-medium">{rec.name}</h3>
                      <span className={`px-2 py-0.5 rounded text-xs ${
                        rec.difficulty === 'beginner'
                          ? 'bg-green-500/20 text-green-400'
                          : rec.difficulty === 'intermediate'
                          ? 'bg-yellow-500/20 text-yellow-400'
                          : 'bg-red-500/20 text-red-400'
                      }`}>
                        {rec.difficulty === 'beginner' && '초보자'}
                        {rec.difficulty === 'intermediate' && '중급'}
                        {rec.difficulty === 'advanced' && '고급'}
                      </span>
                    </div>
                    <p className="text-sm text-gray-400 mt-1">{rec.description}</p>
                  </div>
                  {isSelected && (
                    <div className="w-6 h-6 rounded-full bg-blue-500 flex items-center justify-center flex-shrink-0">
                      <Check className="w-4 h-4 text-white" />
                    </div>
                  )}
                </div>
                <div className="flex flex-wrap gap-2 mt-3 pl-2">
                  {rec.techStack.map((tech) => {
                    const Icon = tech.icon;
                    return (
                      <span
                        key={tech.id}
                        className="flex items-center gap-1.5 px-2 py-1 bg-gray-800 text-gray-300 rounded text-xs"
                      >
                        {Icon && <Icon className="w-3.5 h-3.5" />}
                        {tech.name}
                      </span>
                    );
                  })}
                </div>
                <div className="flex flex-wrap gap-1 mt-2">
                  {rec.tags.map((tag) => (
                    <span
                      key={tag}
                      className="text-xs text-gray-500"
                    >
                      #{tag}
                    </span>
                  ))}
                </div>
              </button>
            );
          })}
        </div>
      </div>

      {/* Selected Tech Stack */}
      {data.techStack.length > 0 && (
        <div>
          <div className="text-white font-medium mb-3">
            선택된 기술 스택 ({data.techStack.length}개)
          </div>
          <div className="p-4 bg-gray-900 border border-gray-700 rounded-lg">
            {Object.entries(groupedTech).map(([category, techs]) => (
              <div key={category} className="mb-4 last:mb-0">
                <div className="text-sm text-gray-400 mb-2 pl-2">
                  {categoryLabels[category] || category}
                </div>
                <div className="flex flex-wrap gap-2 pl-2">
                  {techs.map((tech) => {
                    const Icon = tech.icon;
                    return (
                      <div
                        key={tech.id}
                        className="flex items-center gap-2 px-3 py-1.5 bg-blue-500/20 text-blue-300 rounded-full"
                      >
                        {Icon && <Icon className="w-4 h-4" />}
                        <span className="text-sm">{tech.name}</span>
                        <button
                          onClick={() => handleTechToggle(tech)}
                          className="hover:bg-blue-500/30 rounded-full p-0.5 transition-colors"
                        >
                          <X className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    );
                  })}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Custom Tech Input */}
      <div>
        <div className="flex items-center justify-between mb-3">
          <div className="text-white font-medium">
            추가 기술 스택
          </div>
          {!showCustomInput && (
            <button
              onClick={() => setShowCustomInput(true)}
              className="text-sm text-blue-400 hover:text-blue-300 flex items-center gap-1"
            >
              <Plus className="w-4 h-4" />
              직접 추가
            </button>
          )}
        </div>
        {showCustomInput && (
          <div>
            <TechStackInput
              selectedTech={data.customTech}
              availableTech={TECH_STACK_DATABASE}
              onChange={handleCustomTechChange}
              placeholder="기술 스택을 검색하세요"
              maxItems={10}
            />
            <p className="mt-2 text-sm text-gray-500">
              검색을 통해 기술 스택을 추가하거나, 없는 경우 직접 입력할 수 있습니다
            </p>
          </div>
        )}
        {data.customTech.length > 0 && !showCustomInput && (
          <div className="mt-3 flex flex-wrap gap-2 pl-2">
            {data.customTech.map((tech) => {
              const Icon = tech.icon;
              return (
                <div
                  key={tech.id}
                  className="flex items-center gap-2 px-3 py-1.5 bg-purple-500/20 text-purple-300 rounded-full"
                >
                  {Icon && <Icon className="w-4 h-4" />}
                  <span className="text-sm">{tech.name}</span>
                  <button
                    onClick={() =>
                      handleCustomTechChange(data.customTech.filter(t => t.id !== tech.id))
                    }
                    className="hover:bg-purple-500/30 rounded-full p-0.5 transition-colors"
                  >
                    <X className="w-3.5 h-3.5" />
                  </button>
                </div>
              );
            })}
          </div>
        )}
      </div>

      {/* Individual Tech Browser (from selected recommendation) */}
      {data.selectedRecommendation && (
        <div>
          <div className="text-white font-medium mb-3">
            기술 스택 커스터마이즈
          </div>
          <p className="text-sm text-gray-400 mb-3 pl-2">
            추천 스택에서 필요한 기술만 선택하거나 제외할 수 있습니다
          </p>
          <div className="grid grid-cols-2 md:grid-cols-3 gap-2 pl-2">
            {recommendations
              .find(r => r.id === data.selectedRecommendation)
              ?.techStack.map((tech) => {
                const selected = isTechSelected(tech.id);
                const Icon = tech.icon;
                return (
                  <button
                    key={tech.id}
                    onClick={() => handleTechToggle(tech)}
                    className={`p-2 border rounded-lg text-sm transition-all flex items-center gap-2 ${
                      selected
                        ? 'border-blue-500 bg-blue-500/10 text-blue-300'
                        : 'border-gray-700 bg-gray-900 text-gray-400 hover:border-gray-600'
                    }`}
                  >
                    {Icon && <Icon className="w-4 h-4" />}
                    {tech.name}
                  </button>
                );
              })}
          </div>
        </div>
      )}

      {/* Tips */}
      <div className="p-4 bg-gray-900/50 border border-gray-700 rounded-lg">
        <div className="text-sm text-gray-400">
          <strong className="text-white">💡 팁:</strong> 처음 시작하는 프로젝트라면
          '초보자 친화적' 스택을 추천합니다. 나중에 프로젝트 설정에서 기술 스택을
          변경할 수 있습니다.
        </div>
      </div>
    </div>
  );
}
