import { useState, useEffect, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  RegistrationStep,
  RegistrationFormData,
  RegistrationStep1Data,
  RegistrationStep2Data,
  RegistrationStep3Data,
  RegistrationStep4Data,
  EnhancedRegisterPayload,
} from '../types/registration';
import { TechStackItem } from '../types';
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
  calculateProfileCompleteness,
} from '../lib/registrationWizard';
import { convertSkillsToTechStack } from '../lib/skillRecommendations';
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
  const { register } = useApp();
  const { showToast } = useToast();
  const { hasDraft, loadDraft, clearDraft, draftLoaded } = useRegistrationDraft();

  const [currentStep, setCurrentStep] = useState<RegistrationStep>(1);
  const [completedSteps, setCompletedSteps] = useState<RegistrationStep[]>([]);
  const [formData, setFormData] = useState<RegistrationFormData>(getEmptyFormData());
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [isLoading, setIsLoading] = useState(false);

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
    (field: keyof RegistrationStep3Data, value: TechStackItem[]) => {
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

  // Handle GitHub import (add suggested skills to step 3)
  const handleGitHubImport = useCallback((suggestedSkills: string[]) => {
    const skillItems = convertSkillsToTechStack(suggestedSkills);
    setFormData((prev) => ({
      ...prev,
      step3: { ...prev.step3, skills: [...prev.step3.skills, ...skillItems] },
    }));
    showToast(`${suggestedSkills.length}개의 스킬이 추가되었습니다`, 'success');
  }, [showToast]);

  // Navigate to next step
  const handleNext = async () => {
    setIsLoading(true);
    setErrors({});

    try {
      // Validate current step
      const validation = await validateStep(currentStep, formData);

      if (!validation.isValid) {
        setErrors(validation.errors);
        showToast('입력 정보를 확인해주세요', 'error');
        setIsLoading(false);
        return;
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
      // Build registration payload
      const payload: EnhancedRegisterPayload = {
        // Step 1 - Required
        email: formData.step1.email,
        password: formData.step1.password,
        name: formData.step1.name,

        // Step 2 - Required
        role: formData.step2.role,
        experienceLevel: formData.step2.experienceLevel,
        specialization: formData.step2.specialization || undefined,
        roleDescription: formData.step2.roleDescription || undefined,

        // Step 3 - Optional
        skills: formData.step3.skills.map((s) => s.name),
        interests: formData.step3.interests,

        // Step 4 - Optional
        profileImageUrl: formData.step4.profileImageUrl || undefined,
        bio: formData.step4.bio || undefined,
        githubLink: formData.step4.githubLink || undefined,
        githubUsername: formData.step4.githubUsername || undefined,
        portfolioUrl: formData.step4.portfolioUrl || undefined,
        location: formData.step4.location || undefined,

        // Metadata
        profileCompleteness: calculateProfileCompleteness(formData),
      };

      // Call registration API
      await register(payload.email, payload.password, payload.name);

      // Clear draft
      clearDraft();

      // Show success message
      showToast('회원가입이 완료되었습니다! 🎉', 'success');

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
        return (
          <Step2Role
            data={formData.step2}
            errors={errors}
            onChange={handleStep2Change}
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
            onGitHubImport={handleGitHubImport}
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
        onSkip={isStepOptional(currentStep) ? handleSkip : undefined}
        isNextDisabled={isLoading}
        isLoading={isLoading}
        showPrevious={currentStep > 1}
        showNext={true}
      >
        {renderStepContent()}
      </RegistrationWizardLayout>
    </>
  );
}
