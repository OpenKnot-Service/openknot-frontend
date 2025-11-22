import { Check } from 'lucide-react';
import { WizardStep } from '../../types/wizard';

interface StepInfo {
  number: WizardStep;
  title: string;
  description: string;
}

const STEPS: StepInfo[] = [
  { number: 1, title: '아이디어', description: '프로젝트 구상' },
  { number: 2, title: '기본 정보', description: '프로젝트 설정' },
  { number: 3, title: '기술 스택', description: 'AI 추천' },
  { number: 4, title: '팀 구성', description: '역할 정의' },
  { number: 5, title: '확인', description: '최종 검토' },
];

interface StepIndicatorProps {
  currentStep: WizardStep;
  completedSteps: WizardStep[];
  onStepClick?: (step: WizardStep) => void;
}

export default function StepIndicator({
  currentStep,
  completedSteps,
  onStepClick,
}: StepIndicatorProps) {
  return (
    <div className="w-full py-8">
      <div className="flex items-center justify-between max-w-4xl mx-auto">
        {STEPS.map((step, index) => {
          const isCompleted = completedSteps.includes(step.number);
          const isCurrent = currentStep === step.number;
          const isClickable = isCompleted || step.number < currentStep;

          return (
            <div key={step.number} className="flex-1 flex items-center">
              {/* Step Circle */}
              <div className="flex flex-col items-center flex-1">
                <button
                  onClick={() => isClickable && onStepClick?.(step.number)}
                  disabled={!isClickable}
                  className={`
                    w-12 h-12 rounded-full flex items-center justify-center
                    font-semibold text-sm transition-all duration-200
                    ${
                      isCompleted
                        ? 'bg-blue-500 text-white shadow-lg shadow-blue-500/50'
                        : isCurrent
                        ? 'bg-gradient-to-r from-blue-500 to-purple-500 text-white shadow-xl shadow-blue-500/50 scale-110 dark:shadow-blue-500/50 shadow-blue-500/20'
                        : 'bg-white text-gray-500 border-2 border-gray-200 dark:bg-gray-800 dark:text-gray-400 dark:border-gray-700'
                    }
                    ${isClickable ? 'cursor-pointer hover:scale-105' : 'cursor-not-allowed'}
                  `}
                >
                  {isCompleted ? (
                    <Check className="w-6 h-6" />
                  ) : (
                    <span>{step.number}</span>
                  )}
                </button>

                {/* Step Label */}
                <div className="mt-3 text-center">
                  <div
                    className={`
                      text-sm font-medium transition-colors
                      ${isCurrent ? 'text-gray-900 dark:text-white' : 'text-gray-500 dark:text-gray-400'}
                    `}
                  >
                    {step.title}
                  </div>
                  <div className="text-xs text-gray-500 dark:text-gray-500 mt-0.5">
                    {step.description}
                  </div>
                </div>
              </div>

              {/* Connector Line */}
              {index < STEPS.length - 1 && (
                <div className="flex-1 h-0.5 mx-2 -mt-12">
                  <div
                    className={`
                      h-full transition-all duration-300
                      ${
                        completedSteps.includes(STEPS[index + 1].number)
                          ? 'bg-blue-500'
                          : 'bg-gray-200 dark:bg-gray-700'
                      }
                    `}
                  />
                </div>
              )}
            </div>
          );
        })}
      </div>

      {/* Progress Bar */}
      <div className="mt-6 max-w-4xl mx-auto">
        <div className="h-1 bg-gray-200 dark:bg-gray-800 rounded-full overflow-hidden">
          <div
            className="h-full bg-gradient-to-r from-blue-500 to-purple-500 transition-all duration-500"
            style={{
              width: `${((currentStep - 1) / (STEPS.length - 1)) * 100}%`,
            }}
          />
        </div>
      </div>
    </div>
  );
}
