import { ReactNode } from 'react';
import { ArrowLeft, ArrowRight, Check, X } from 'lucide-react';
import { RegistrationStep } from '../../types/registration';
import Button from '../ui/Button';

interface RegistrationWizardLayoutProps {
  currentStep: RegistrationStep;
  totalSteps: number;
  title: string;
  description?: string;
  children: ReactNode;
  onPrevious?: () => void;
  onNext?: () => void;
  onCancel?: () => void;
  isNextDisabled?: boolean;
  isLoading?: boolean;
  showPrevious?: boolean;
  showNext?: boolean;
  nextButtonText?: string;
  skipButtonText?: string;
  onSkip?: () => void;
  loggedInUserEmail?: string;
  showCancelButton?: boolean;
}

export default function RegistrationWizardLayout({
  currentStep,
  totalSteps,
  title,
  description,
  children,
  onPrevious,
  onNext,
  onCancel,
  isNextDisabled = false,
  isLoading = false,
  showPrevious = true,
  showNext = true,
  nextButtonText,
  skipButtonText,
  onSkip,
  loggedInUserEmail,
  showCancelButton = true,
}: RegistrationWizardLayoutProps) {
  const isLastStep = currentStep === totalSteps;

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-white to-gray-100 dark:from-gray-900 dark:via-gray-900 dark:to-gray-800">
      <div className="container mx-auto px-4 py-8">
        {/* Header */}
        <div className="max-w-4xl mx-auto mb-8">
          <div className="flex items-center justify-between gap-4">
            <div className="flex-1">
              <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">
                회원가입
              </h1>
              <p className="text-gray-600 dark:text-gray-400">
                OpenKnot에서 함께 프로젝트를 시작하세요
              </p>
            </div>
            <div className="flex items-center gap-3">
              {loggedInUserEmail && (
                <div className="px-3 py-1.5 rounded-full bg-blue-100 text-blue-800 dark:bg-blue-900/40 dark:text-blue-200 text-sm font-medium">
                  로그인됨 · {loggedInUserEmail}
                </div>
              )}
              {showCancelButton && (
                <button
                  onClick={onCancel}
                  className="p-2 text-gray-500 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white hover:bg-gray-100 dark:hover:bg-gray-800 rounded-lg transition-colors flex-shrink-0"
                  title="취소"
                >
                  <X className="w-6 h-6" />
                </button>
              )}
            </div>
          </div>
        </div>

        {/* Step Content */}
        <div className="max-w-4xl mx-auto">
          {/* Step Title & Description */}
          <div className="mb-8">
            <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">{title}</h2>
            {description && (
              <p className="text-gray-600 dark:text-gray-400">{description}</p>
            )}
          </div>

          {/* Main Content */}
          <div className="bg-white/90 dark:bg-gray-800/50 backdrop-blur-sm border border-gray-200 dark:border-gray-700 rounded-xl p-8 mb-8 shadow-sm dark:shadow-none">
            {children}
          </div>

          {/* Navigation Buttons */}
          <div className="flex items-center justify-between">
            <div>
              {showPrevious && currentStep > 1 && (
                <Button
                  variant="secondary"
                  onClick={onPrevious}
                  disabled={isLoading}
                >
                  <ArrowLeft className="w-4 h-4 mr-2" />
                  이전
                </Button>
              )}
            </div>

            <div className="flex items-center gap-3">
              {/* Skip Button (for optional steps) */}
              {onSkip && (
                <Button
                  variant="secondary"
                  onClick={onSkip}
                  disabled={isLoading}
                >
                  {skipButtonText || '건너뛰기'}
                </Button>
              )}

              {showCancelButton && (
                <Button variant="secondary" onClick={onCancel} disabled={isLoading}>
                  취소
                </Button>
              )}

              {showNext && (
                <Button
                  variant="primary"
                  onClick={onNext}
                  disabled={isNextDisabled || isLoading}
                  loading={isLoading}
                >
                  {nextButtonText || (
                    <>
                      {isLastStep ? (
                        <>
                          <Check className="w-4 h-4 mr-2" />
                          완료
                        </>
                      ) : (
                        <>
                          다음
                          <ArrowRight className="w-4 h-4 ml-2" />
                        </>
                      )}
                    </>
                  )}
                </Button>
              )}
            </div>
          </div>

          {/* Keyboard Shortcuts Hint */}
          <div className="mt-4 text-center text-sm text-gray-500 dark:text-gray-500">
            <kbd className="px-2 py-1 bg-gray-100 text-gray-700 border border-gray-200 rounded dark:bg-gray-800 dark:text-gray-300 dark:border-gray-700">
              ESC
            </kbd>{' '}
            취소
            {showNext && (
              <>
                {' · '}
                <kbd className="px-2 py-1 bg-gray-100 text-gray-700 border border-gray-200 rounded dark:bg-gray-800 dark:text-gray-300 dark:border-gray-700">
                  Ctrl + Enter
                </kbd>{' '}
                {isLastStep ? '생성' : '다음'}
              </>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
