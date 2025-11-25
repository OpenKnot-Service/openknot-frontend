import { useState, useEffect, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { ShieldCheck, Sparkles } from 'lucide-react';
import {
  RegistrationStep,
  RegistrationFormData,
  RegistrationStep1Data,
  RegistrationStep2Data,
  RegistrationStep3Data,
  RegistrationStep4Data,
} from '../types/registration';
import { TechStackItem } from '../types/wizard';
import { useApp } from '../contexts/AppContext';
import { useToast } from '../contexts/ToastContext';
import {
  useRegistrationDraft,
  useAutoSaveDraft,
} from '../hooks/useRegistrationDraft';
import {
  validateStep,
  getStepTitle,
  getStepDescription,
  isStepOptional,
} from '../lib/registrationWizard';
import {
  saveRegistrationStep2,
  saveRegistrationStep3,
  saveRegistrationStep4,
} from '../lib/apiClient';
import RegistrationWizardLayout from '../components/registration-wizard/RegistrationWizardLayout';
import RegistrationStepIndicator from '../components/registration-wizard/RegistrationStepIndicator';
import Step1BasicInfo from '../components/registration-wizard/steps/Step1BasicInfo';
import Step2Role from '../components/registration-wizard/steps/Step2Role';
import Step3Skills from '../components/registration-wizard/steps/Step3Skills';
import Step4Profile from '../components/registration-wizard/steps/Step4Profile';
import Step5Review from '../components/registration-wizard/steps/Step5Review';

// Available tech stack (simplified for now)
const AVAILABLE_TECH: TechStackItem[] = [
  { id: 'react', name: 'React', category: 'frontend' },
  { id: 'vue', name: 'Vue.js', category: 'frontend' },
  { id: 'angular', name: 'Angular', category: 'frontend' },
  { id: 'nextjs', name: 'Next.js', category: 'frontend' },
  { id: 'typescript', name: 'TypeScript', category: 'language' },
  { id: 'javascript', name: 'JavaScript', category: 'language' },
  { id: 'python', name: 'Python', category: 'language' },
  { id: 'java', name: 'Java', category: 'language' },
  { id: 'nodejs', name: 'Node.js', category: 'backend' },
  { id: 'express', name: 'Express', category: 'backend' },
  { id: 'django', name: 'Django', category: 'backend' },
  { id: 'spring', name: 'Spring', category: 'backend' },
  { id: 'postgresql', name: 'PostgreSQL', category: 'database' },
  { id: 'mongodb', name: 'MongoDB', category: 'database' },
  { id: 'redis', name: 'Redis', category: 'database' },
  { id: 'docker', name: 'Docker', category: 'devops' },
  { id: 'kubernetes', name: 'Kubernetes', category: 'devops' },
  { id: 'aws', name: 'AWS', category: 'devops' },
  { id: 'figma', name: 'Figma', category: 'design' },
  { id: 'tailwind', name: 'Tailwind CSS', category: 'frontend' },
];

interface PostSignupPromptProps {
  email: string;
  onContinue: () => void;
  onSkip: () => void;
}

function PostSignupPrompt({ email, onContinue, onSkip }: PostSignupPromptProps) {
  return (
    <div className="text-center space-y-6 py-10">
      <div className="mx-auto w-20 h-20 rounded-full bg-blue-100 dark:bg-blue-900/30 flex items-center justify-center text-blue-600 dark:text-blue-300">
        <ShieldCheck className="w-10 h-10" />
      </div>
      <div>
        <p className="text-sm uppercase tracking-wide text-blue-500 font-semibold mb-2">
          회원가입 완료
        </p>
        <h3 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">
          {email} 계정이 생성되었습니다!
        </h3>
        <p className="text-gray-600 dark:text-gray-300 max-w-2xl mx-auto">
          역할·스킬·프로필 정보를 추가로 입력하면 팀 추천과 프로젝트 매칭이 더욱 정확해집니다.
          계속 진행하시겠습니까?
        </p>
      </div>
      <div className="flex flex-wrap justify-center gap-4">
        <button
          type="button"
          onClick={onContinue}
          className="px-6 py-3 rounded-xl bg-gradient-to-r from-blue-500 to-purple-500 text-white font-semibold shadow-lg shadow-blue-500/30 flex items-center gap-2"
        >
          <Sparkles className="w-5 h-5" />
          추가 정보 입력 시작
        </button>
        <button
          type="button"
          onClick={onSkip}
          className="px-6 py-3 rounded-xl border border-gray-300 dark:border-gray-700 text-gray-700 dark:text-gray-200 font-semibold"
        >
          나중에 할게요
        </button>
      </div>
    </div>
  );
}

// Empty form data
const getEmptyFormData = (): RegistrationFormData => ({
  step1: {
    name: '',
    email: '',
    password: '',
    confirmPassword: '',
    agreedToTerms: false,
  },
  step2: {
    role: 'developer',
    experienceLevel: 'intermediate',
    specialization: '',
    roleDescription: '',
  },
  step3: {
    skills: [],
    interests: [],
  },
  step4: {
    profileImageUrl: '',
    bio: '',
    githubLink: '',
    githubUsername: '',
    portfolioUrl: '',
    location: '',
    githubImported: false,
  },
});

export default function RegisterPage() {
  const navigate = useNavigate();
  const { register, login, user } = useApp();
  const { showToast } = useToast();
  const { hasDraft, loadDraft, clearDraft, draftLoaded } = useRegistrationDraft();

  const [currentStep, setCurrentStep] = useState<RegistrationStep>(1);
  const [completedSteps, setCompletedSteps] = useState<RegistrationStep[]>([]);
  const [formData, setFormData] = useState<RegistrationFormData>(getEmptyFormData());
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [isLoading, setIsLoading] = useState(false);
  const [isRegistered, setIsRegistered] = useState(false);
  const [showPostSignupScreen, setShowPostSignupScreen] = useState(false);
  const [showAdditionalFlowNotice, setShowAdditionalFlowNotice] = useState(false);

  // Auto-save draft (debounced)
  useAutoSaveDraft(formData, currentStep, completedSteps, currentStep < 5);

  // Load draft on mount
  useEffect(() => {
    if (hasDraft && !draftLoaded) {
      const draft = loadDraft();
      if (draft) {
        setFormData(draft.formData);
        setCurrentStep(draft.currentStep);
        setCompletedSteps(draft.completedSteps);
      }
    }
  }, [hasDraft, draftLoaded, loadDraft]);

  useEffect(() => {
    if (user) {
      setIsRegistered(true);
    }
  }, [user]);

  // Keyboard shortcuts
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        handleCancel();
      }
      if ((e.ctrlKey || e.metaKey) && e.key === 'Enter') {
        e.preventDefault();
        if (currentStep === 5) {
          handleSubmit();
        } else {
          handleNext();
        }
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [currentStep, formData]);

  // Handle field changes for step 1
  const handleStep1Change = useCallback(
    (field: keyof RegistrationStep1Data, value: string | boolean) => {
      setFormData((prev) => ({
        ...prev,
        step1: { ...prev.step1, [field]: value },
      }));
      // Clear error for this field
      if (errors[field]) {
        setErrors((prev) => {
          const newErrors = { ...prev };
          delete newErrors[field];
          return newErrors;
        });
      }
    },
    [errors]
  );

  // Handle field changes for step 2
  const handleStep2Change = useCallback(
    (field: keyof RegistrationStep2Data, value: string) => {
      setFormData((prev) => ({
        ...prev,
        step2: { ...prev.step2, [field]: value },
      }));
      if (errors[field]) {
        setErrors((prev) => {
          const newErrors = { ...prev };
          delete newErrors[field];
          return newErrors;
        });
      }
    },
    [errors]
  );

  // Handle field changes for step 3
  const handleStep3Change = useCallback(
    (
      field: keyof RegistrationStep3Data,
      value: RegistrationStep3Data[keyof RegistrationStep3Data]
    ) => {
      setFormData((prev) => ({
        ...prev,
        step3: { ...prev.step3, [field]: value },
      }));
    },
    []
  );

  // Handle field changes for step 4
  const handleStep4Change = useCallback(
    (field: keyof RegistrationStep4Data, value: string | File | boolean) => {
      setFormData((prev) => ({
        ...prev,
        step4: { ...prev.step4, [field]: value },
      }));
      if (errors[field]) {
        setErrors((prev) => {
          const newErrors = { ...prev };
          delete newErrors[field];
          return newErrors;
        });
      }
    },
    [errors]
  );

  const handleStartAdditionalInfo = useCallback(() => {
    setShowPostSignupScreen(false);
    showToast('추가 정보를 입력해 주세요.', 'info');
  }, [showToast]);

  const handleSkipAdditionalInfo = useCallback(() => {
    clearDraft();
    showToast('언제든지 설정에서 추가 정보를 입력할 수 있습니다.', 'info');
    navigate('/dashboard');
  }, [clearDraft, navigate, showToast]);

  // Navigate to next step
  const handleNext = async () => {
    setIsLoading(true);
    setErrors({});

    try {
      if (currentStep === 2 && showPostSignupScreen) {
        setIsLoading(false);
        return;
      }
      // Validate current step
      const validation = await validateStep(currentStep, formData);

      if (!validation.isValid) {
        setErrors(validation.errors);
        showToast('입력 정보를 확인해주세요', 'error');
        setIsLoading(false);
        return;
      }

      if (currentStep === 1 && !isRegistered) {
        await register(formData.step1.email, formData.step1.password, formData.step1.name);
        await login(formData.step1.email, formData.step1.password);
        setIsRegistered(true);
        setShowAdditionalFlowNotice(true);
        showToast('기본 회원가입이 완료되었습니다. 추가 정보를 이어서 입력해보세요.', 'success');
      } else if (currentStep === 2) {
        await saveRegistrationStep2({
          role: formData.step2.role,
          experienceLevel: formData.step2.experienceLevel,
          specialization: formData.step2.specialization || undefined,
          roleDescription: formData.step2.roleDescription || undefined,
          customRole: formData.step2.customRole || undefined,
        });
        setShowAdditionalFlowNotice(false);
        showToast('역할 정보가 저장되었습니다.', 'success');
      } else if (currentStep === 3) {
        await saveRegistrationStep3({
          skills: formData.step3.skills.map((s) => s.name),
          interests: formData.step3.interests,
        });
        showToast('스킬 정보가 저장되었습니다.', 'success');
      } else if (currentStep === 4) {
        await saveRegistrationStep4({
          bio: formData.step4.bio || undefined,
          githubLink: formData.step4.githubLink || undefined,
          githubUsername: formData.step4.githubUsername || undefined,
          portfolioUrl: formData.step4.portfolioUrl || undefined,
          location: formData.step4.location || undefined,
          profileImageUrl: formData.step4.profileImageUrl || undefined,
        });
        showToast('프로필 정보가 저장되었습니다.', 'success');
      }

      // Mark step as completed
      if (!completedSteps.includes(currentStep)) {
        setCompletedSteps((prev) => [...prev, currentStep]);
      }

      // Move to next step
      if (currentStep < 5) {
        setCurrentStep((prev) => (prev + 1) as RegistrationStep);
      }
    } catch (error) {
      showToast('검증 중 오류가 발생했습니다', 'error');
      console.error('Validation error:', error);
    } finally {
      setIsLoading(false);
    }
  };

  // Navigate to previous step
  const handlePrevious = () => {
    if (currentStep > 1) {
      setCurrentStep((prev) => (prev - 1) as RegistrationStep);
    }
  };

  // Skip current step (for optional steps)
  const handleSkip = () => {
    if (isStepOptional(currentStep)) {
      if (!completedSteps.includes(currentStep)) {
        setCompletedSteps((prev) => [...prev, currentStep]);
      }
      setCurrentStep((prev) => (prev + 1) as RegistrationStep);
    }
  };

  // Cancel registration
  const handleCancel = () => {
    if (window.confirm('회원가입을 취소하시겠습니까? 입력한 정보는 임시 저장됩니다.')) {
      navigate('/login');
    }
  };

  // Submit registration
  const handleSubmit = async () => {
    setIsLoading(true);

    try {
      // Clear draft
      clearDraft();

      // Show success message
      showToast('추가 정보 입력이 완료되었습니다! 🎉', 'success');

      // Navigate to dashboard
      navigate('/dashboard');
    } catch (error) {
      showToast(
        error instanceof Error ? error.message : '회원가입에 실패했습니다',
        'error'
      );
      console.error('Registration error:', error);
    } finally {
      setIsLoading(false);
    }
  };

  // Handle step click from indicator
  const handleStepClick = (step: RegistrationStep) => {
    // Only allow clicking on completed steps or current step
    if (completedSteps.includes(step) || step < currentStep) {
      setCurrentStep(step);
    }
  };

  const isPostSignupPrompt = currentStep === 2 && showPostSignupScreen;

  // Render current step component
  const renderStepContent = () => {
    switch (currentStep) {
      case 1:
        return (
          <Step1BasicInfo
            data={formData.step1}
            errors={errors}
            onChange={handleStep1Change}
          />
        );
      case 2:
        if (showPostSignupScreen) {
          return (
            <PostSignupPrompt
              email={formData.step1.email}
              onContinue={handleStartAdditionalInfo}
              onSkip={handleSkipAdditionalInfo}
            />
          );
        }
        return (
          <Step2Role
            data={formData.step2}
            errors={errors}
            onChange={handleStep2Change}
            showAdditionalFlowNotice={showAdditionalFlowNotice}
          />
        );
      case 3:
        return (
          <Step3Skills
            data={formData.step3}
            errors={errors}
            onChange={handleStep3Change}
            role={formData.step2.role}
            experienceLevel={formData.step2.experienceLevel}
            specialization={formData.step2.specialization}
            availableTech={AVAILABLE_TECH}
          />
        );
      case 4:
        return (
          <Step4Profile
            data={formData.step4}
            errors={errors}
            onChange={handleStep4Change}
          />
        );
      case 5:
        return <Step5Review data={formData} onEdit={handleStepClick} />;
      default:
        return null;
    }
  };

  return (
    <>
      {/* Step Indicator */}
      <RegistrationStepIndicator
        currentStep={currentStep}
        completedSteps={completedSteps}
        onStepClick={handleStepClick}
      />

      {/* Wizard Layout */}
      <RegistrationWizardLayout
        currentStep={currentStep}
        totalSteps={5}
        title={getStepTitle(currentStep)}
        description={getStepDescription(currentStep)}
        onPrevious={handlePrevious}
        onNext={currentStep === 5 ? handleSubmit : handleNext}
        onCancel={handleCancel}
        onSkip={isStepOptional(currentStep) && !isPostSignupPrompt ? handleSkip : undefined}
        isNextDisabled={isLoading}
        isLoading={isLoading}
        showPrevious={!isPostSignupPrompt}
        showNext={!isPostSignupPrompt}
        loggedInUserEmail={isRegistered ? formData.step1.email : undefined}
        showCancelButton={!isPostSignupPrompt}
      >
        {renderStepContent()}
      </RegistrationWizardLayout>
    </>
  );
}
