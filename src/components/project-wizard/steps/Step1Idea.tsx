import { useState } from 'react';
import { Lightbulb, Sparkles, FileText } from 'lucide-react';
import { WizardStep1Data } from '../../../types/wizard';
import { parseIdea } from '../../../lib/techStackRecommendations';

interface Step1IdeaProps {
  data: WizardStep1Data;
  onChange: (data: WizardStep1Data) => void;
}

const IDEA_TEMPLATES = [
  {
    id: 'web-service',
    title: '웹 서비스',
    icon: '🌐',
    example: '실시간 채팅 기능이 있는 소셜 네트워킹 플랫폼을 만들고 싶습니다. 사용자들이 서로 메시지를 주고받고, 프로필을 관리하며, 친구를 추가할 수 있는 기능이 필요합니다.',
  },
  {
    id: 'mobile-app',
    title: '모바일 앱',
    icon: '📱',
    example: '건강 관리를 위한 모바일 앱을 개발하려고 합니다. 운동 기록, 식단 관리, 수면 패턴 분석 등의 기능을 포함하고, 사용자의 건강 목표를 추적합니다.',
  },
  {
    id: 'ecommerce',
    title: '이커머스',
    icon: '🛒',
    example: '중고 거래 플랫폼을 만들고 싶습니다. 판매자와 구매자를 연결하고, 안전한 결제 시스템과 리뷰 기능을 제공하며, 지역 기반 검색을 지원합니다.',
  },
  {
    id: 'productivity',
    title: '생산성 도구',
    icon: '✅',
    example: '팀 협업을 위한 프로젝트 관리 도구를 개발하려고 합니다. 칸반 보드, 간트 차트, 태스크 관리, 팀원 간 실시간 협업 기능이 필요합니다.',
  },
];

export default function Step1Idea({ data, onChange }: Step1IdeaProps) {
  const [isAnalyzing, setIsAnalyzing] = useState(false);

  const handleIdeaChange = (value: string) => {
    onChange({
      ...data,
      idea: value,
    });
  };

  const handleAnalyze = async () => {
    if (!data.idea.trim()) return;

    setIsAnalyzing(true);

    // Simulate AI analysis delay
    await new Promise(resolve => setTimeout(resolve, 1500));

    const parsedData = parseIdea(data.idea);
    onChange({
      ...data,
      parsedData,
    });

    setIsAnalyzing(false);
  };

  const handleTemplateSelect = (template: typeof IDEA_TEMPLATES[0]) => {
    onChange({
      idea: template.example,
      parsedData: undefined,
    });
  };

  return (
    <div className="space-y-6">
      {/* Idea Input */}
      <div>
        <label className="flex items-center gap-2 text-gray-900 dark:text-white font-medium mb-3">
          <Lightbulb className="w-5 h-5 text-yellow-500" />
          프로젝트 아이디어 또는 기획서
        </label>
        <textarea
          value={data.idea}
          onChange={(e) => handleIdeaChange(e.target.value)}
          placeholder="만들고 싶은 프로젝트에 대해 자유롭게 작성해주세요. AI가 분석하여 자동으로 프로젝트 정보를 추출합니다.&#10;&#10;예시:&#10;- 어떤 문제를 해결하고 싶은가요?&#10;- 주요 기능은 무엇인가요?&#10;- 타겟 사용자는 누구인가요?&#10;- 어떤 플랫폼에서 사용되나요?"
          className="w-full h-64 px-4 py-3 bg-white border border-gray-300 rounded-lg text-gray-900 placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-500 resize-none dark:bg-gray-900 dark:border-gray-700 dark:text-white"
        />
      </div>

      {/* Analyze Button */}
      {data.idea.trim() && !data.parsedData && (
        <button
          onClick={handleAnalyze}
          disabled={isAnalyzing}
          className="w-full py-3 px-4 bg-gradient-to-r from-blue-500 to-purple-500 text-white rounded-lg font-medium hover:shadow-lg hover:shadow-blue-500/50 transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
        >
          <Sparkles className={`w-5 h-5 ${isAnalyzing ? 'animate-spin' : ''}`} />
          {isAnalyzing ? 'AI가 분석 중...' : 'AI로 아이디어 분석하기'}
        </button>
      )}

      {/* Analysis Results */}
      {data.parsedData && (
        <div className="p-4 bg-blue-50 border border-blue-100 rounded-lg dark:bg-blue-500/10 dark:border-blue-500/30">
          <div className="flex items-center gap-2 text-blue-600 font-medium mb-3 dark:text-blue-400">
            <Sparkles className="w-5 h-5" />
            AI 분석 결과
          </div>
          <div className="space-y-2 text-sm">
            {data.parsedData.suggestedName && (
              <div>
                <span className="text-gray-600 dark:text-gray-400">프로젝트 이름 제안:</span>{' '}
                <span className="text-gray-900 font-medium dark:text-white">
                  {data.parsedData.suggestedName}
                </span>
              </div>
            )}
            {data.parsedData.suggestedType && (
              <div>
                <span className="text-gray-600 dark:text-gray-400">프로젝트 타입:</span>{' '}
                <span className="text-gray-900 font-medium dark:text-white">
                  {data.parsedData.suggestedType === 'web' && '웹 애플리케이션'}
                  {data.parsedData.suggestedType === 'mobile' && '모바일 앱'}
                  {data.parsedData.suggestedType === 'desktop' && '데스크톱 앱'}
                  {data.parsedData.suggestedType === 'library' && '라이브러리'}
                  {data.parsedData.suggestedType === 'other' && '기타'}
                </span>
              </div>
            )}
            {data.parsedData.keywords && data.parsedData.keywords.length > 0 && (
              <div>
                <span className="text-gray-600 dark:text-gray-400">핵심 키워드:</span>{' '}
                <div className="flex flex-wrap gap-2 mt-1">
                  {data.parsedData.keywords.map((keyword) => (
                    <span
                      key={keyword}
                      className="px-2 py-1 bg-blue-100 text-blue-700 rounded text-xs dark:bg-blue-500/20 dark:text-blue-300"
                    >
                      {keyword}
                    </span>
                  ))}
                </div>
              </div>
            )}
          </div>
          <button
            onClick={handleAnalyze}
            className="mt-3 text-sm text-blue-600 hover:text-blue-500 transition-colors dark:text-blue-400 dark:hover:text-blue-300"
          >
            다시 분석하기
          </button>
        </div>
      )}

      {/* Templates */}
      <div>
        <div className="flex items-center gap-2 text-gray-600 text-sm mb-3 dark:text-gray-400">
          <FileText className="w-4 h-4" />
          템플릿으로 시작하기
        </div>
        <div className="grid grid-cols-2 gap-3">
          {IDEA_TEMPLATES.map((template) => (
            <button
              key={template.id}
              onClick={() => handleTemplateSelect(template)}
              className="p-4 bg-white border border-gray-200 rounded-lg text-left hover:border-blue-500 hover:bg-blue-50 transition-all group dark:bg-gray-900 dark:border-gray-700 dark:hover:bg-gray-800"
            >
              <div className="text-2xl mb-2">{template.icon}</div>
              <div className="text-gray-900 font-medium mb-1 group-hover:text-blue-500 transition-colors dark:text-white dark:group-hover:text-blue-400">
                {template.title}
              </div>
              <div className="text-xs text-gray-500 line-clamp-2 dark:text-gray-500">
                {template.example}
              </div>
            </button>
          ))}
        </div>
      </div>

      {/* Tips */}
      <div className="p-4 bg-gray-50 border border-gray-200 rounded-lg dark:bg-gray-900/50 dark:border-gray-700">
        <div className="text-sm text-gray-600 dark:text-gray-400">
          <strong className="text-gray-900 dark:text-white">💡 팁:</strong> 프로젝트에 대해 구체적으로
          작성할수록 AI가 더 정확한 기술 스택을 추천할 수 있습니다.
        </div>
      </div>
    </div>
  );
}
