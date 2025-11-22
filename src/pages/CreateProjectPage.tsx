import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { WizardFormData, WizardStep, StepValidation } from '../types/wizard';
import { Project } from '../types';
import { useApp } from '../contexts/AppContext';
import { useToast } from '../contexts/ToastContext';
import StepIndicator from '../components/project-wizard/StepIndicator';
import WizardLayout from '../components/project-wizard/WizardLayout';
import Step1Idea from '../components/project-wizard/steps/Step1Idea';
import Step2BasicInfo from '../components/project-wizard/steps/Step2BasicInfo';
import Step3TechStack from '../components/project-wizard/steps/Step3TechStack';
import Step4Team from '../components/project-wizard/steps/Step4Team';
import Step5Review from '../components/project-wizard/steps/Step5Review';

const STORAGE_KEY = 'openknot-wizard-draft';

export default function CreateProjectPage() {
  const navigate = useNavigate();
  const { user, addProject } = useApp();
  const { showToast } = useToast();

  const [currentStep, setCurrentStep] = useState<WizardStep>(1);
  const [completedSteps, setCompletedSteps] = useState<WizardStep[]>([]);
  const [isCreating, setIsCreating] = useState(false);
  const [validationErrors, setValidationErrors] = useState<Record<string, string>>({});

  const [formData, setFormData] = useState<WizardFormData>({
    step1: {
      idea: '',
    },
    step2: {
      name: '',
      description: '',
      type: 'web',
      visibility: 'public',
      status: 'recruiting',
    },
    step3: {
      techStack: [],
      customTech: [],
    },
    step4: {
      positions: [],
    },
  });

  // Load draft from localStorage
  useEffect(() => {
    const draft = localStorage.getItem(STORAGE_KEY);
    if (draft) {
      try {
        const parsed = JSON.parse(draft);
        setFormData(parsed);
        showToast('임시 저장된 내용을 불러왔습니다', 'info');
      } catch (error) {
        console.error('Failed to load draft:', error);
      }
    }
  }, [showToast]);

  // Save draft to localStorage
  useEffect(() => {
    const timeout = setTimeout(() => {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(formData));
    }, 1000);
    return () => clearTimeout(timeout);
  }, [formData]);

  // Keyboard shortcuts
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        handleCancel();
      } else if (e.key === 'Enter' && (e.metaKey || e.ctrlKey)) {
        handleNext();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [currentStep, formData]);

  const validateStep = (step: WizardStep): StepValidation => {
    const errors: Record<string, string> = {};

    switch (step) {
      case 1:
        if (!formData.step1.idea.trim()) {
          errors.idea = '프로젝트 아이디어를 입력해주세요';
        }
        break;
      case 2:
        if (!formData.step2.name.trim()) {
          errors.name = '프로젝트 이름을 입력해주세요';
        }
        if (!formData.step2.description.trim()) {
          errors.description = '프로젝트 설명을 입력해주세요';
        }
        break;
      case 3:
        if (formData.step3.techStack.length === 0 && formData.step3.customTech.length === 0) {
          errors.techStack = '최소 1개 이상의 기술 스택을 선택해주세요';
        }
        break;
      case 4:
        // Team is optional
        break;
      case 5:
        // Review step has no validation
        break;
    }

    return {
      isValid: Object.keys(errors).length === 0,
      errors,
    };
  };

  const handleNext = () => {
    const validation = validateStep(currentStep);
    setValidationErrors(validation.errors);

    if (!validation.isValid) {
      showToast('필수 항목을 입력해주세요', 'error');
      return;
    }

    // Mark current step as completed
    if (!completedSteps.includes(currentStep)) {
      setCompletedSteps([...completedSteps, currentStep]);
    }

    if (currentStep < 5) {
      setCurrentStep((prev) => (prev + 1) as WizardStep);
    } else {
      handleCreate();
    }
  };

  const handlePrevious = () => {
    if (currentStep > 1) {
      setCurrentStep((prev) => (prev - 1) as WizardStep);
    }
  };

  const handleStepClick = (step: WizardStep) => {
    setCurrentStep(step);
  };

  const handleCancel = () => {
    if (confirm('프로젝트 생성을 취소하시겠습니까? 입력한 내용은 임시 저장됩니다.')) {
      navigate('/projects');
    }
  };

  const handleCreate = async () => {
    setIsCreating(true);

    try {
      // Simulate API call
      await new Promise((resolve) => setTimeout(resolve, 1500));

      // Create project object
      const newProject: Project = {
        id: `proj-${Date.now()}`,
        name: formData.step2.name,
        description: formData.step2.description,
        ownerId: user.id,
        status: formData.step2.status,
        visibility: formData.step2.visibility,
        techStack: [
          ...formData.step3.techStack.map((t) => t.name),
          ...formData.step3.customTech.map((t) => t.name),
        ],
        members: [
          {
            userId: user.id,
            role: 'owner',
            position: 'Owner',
            joinedAt: new Date(),
          },
        ],
        positions: formData.step4.positions.map((pos) => ({
          id: pos.id,
          role: pos.role,
          title: pos.title,
          count: pos.count,
          filled: 0,
          requirements: pos.requirements,
          description: pos.description,
        })),
        startDate: formData.step2.startDate ? new Date(formData.step2.startDate) : undefined,
        endDate: formData.step2.endDate ? new Date(formData.step2.endDate) : undefined,
        createdAt: new Date(),
        updatedAt: new Date(),
      };

      addProject(newProject);

      // Clear draft
      localStorage.removeItem(STORAGE_KEY);

      showToast('프로젝트가 성공적으로 생성되었습니다!', 'success');
      navigate(`/projects/${newProject.id}`);
    } catch (error) {
      console.error('Failed to create project:', error);
      showToast('프로젝트 생성에 실패했습니다', 'error');
    } finally {
      setIsCreating(false);
    }
  };

  const getStepContent = () => {
    switch (currentStep) {
      case 1:
        return (
          <Step1Idea
            data={formData.step1}
            onChange={(data) => setFormData({ ...formData, step1: data })}
          />
        );
      case 2:
        return (
          <Step2BasicInfo
            data={formData.step2}
            step1Data={formData.step1}
            onChange={(data) => setFormData({ ...formData, step2: data })}
            errors={validationErrors}
          />
        );
      case 3:
        return (
          <Step3TechStack
            data={formData.step3}
            step1Data={formData.step1}
            step2Data={formData.step2}
            onChange={(data) => setFormData({ ...formData, step3: data })}
          />
        );
      case 4:
        return (
          <Step4Team
            data={formData.step4}
            step1Data={formData.step1}
            step2Data={formData.step2}
            step3Data={formData.step3}
            onChange={(data) => setFormData({ ...formData, step4: data })}
          />
        );
      case 5:
        return (
          <Step5Review
            formData={formData}
            onEditStep={(step) => setCurrentStep(step)}
          />
        );
      default:
        return null;
    }
  };

  const getStepTitle = () => {
    switch (currentStep) {
      case 1:
        return '프로젝트 아이디어';
      case 2:
        return '기본 정보';
      case 3:
        return '기술 스택 선택';
      case 4:
        return '팀 구성';
      case 5:
        return '최종 확인';
      default:
        return '';
    }
  };

  const getStepDescription = () => {
    switch (currentStep) {
      case 1:
        return '프로젝트 아이디어를 자유롭게 작성해주세요. AI가 분석하여 자동으로 정보를 추출합니다.';
      case 2:
        return '프로젝트의 기본 정보를 입력해주세요.';
      case 3:
        return 'AI가 추천하는 기술 스택을 선택하거나 직접 추가하세요.';
      case 4:
        return '프로젝트에 필요한 팀 구성을 정의하세요. (선택사항)';
      case 5:
        return '입력한 내용을 확인하고 프로젝트를 생성하세요.';
      default:
        return '';
    }
  };

  const isNextDisabled = () => {
    switch (currentStep) {
      case 1:
        return !formData.step1.idea.trim();
      case 2:
        return !formData.step2.name.trim() || !formData.step2.description.trim();
      case 3:
        return formData.step3.techStack.length === 0 && formData.step3.customTech.length === 0;
      case 4:
      case 5:
        return false;
      default:
        return true;
    }
  };

  return (
    <>
      <StepIndicator
        currentStep={currentStep}
        completedSteps={completedSteps}
        onStepClick={handleStepClick}
      />
      <WizardLayout
        currentStep={currentStep}
        totalSteps={5}
        title={getStepTitle()}
        description={getStepDescription()}
        onPrevious={handlePrevious}
        onNext={handleNext}
        onCancel={handleCancel}
        isNextDisabled={isNextDisabled()}
        isLoading={isCreating}
        showPrevious={currentStep > 1}
        showNext={true}
      >
        {getStepContent()}
      </WizardLayout>
    </>
  );
}
