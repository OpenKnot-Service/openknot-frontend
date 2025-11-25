import { useState, useEffect, useCallback } from 'react';
import {
  RegistrationFormData,
  RegistrationDraft,
  RegistrationStep,
  RegistrationStep1Data,
  RegistrationStep2Data,
  RegistrationStep3Data,
  RegistrationStep4Data,
} from '../types/registration';
import { useToast } from '../contexts/ToastContext';

const DRAFT_KEY = 'openknot-registration-draft';
const DRAFT_VERSION = 1;
const DRAFT_EXPIRY_DAYS = 7;
const DEBOUNCE_DELAY = 1000; // 1 second

// Default/empty form data
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

/**
 * Hook for managing registration draft auto-save and restore
 */
export function useRegistrationDraft() {
  const { showToast } = useToast();
  const [hasDraft, setHasDraft] = useState(false);
  const [draftLoaded, setDraftLoaded] = useState(false);

  /**
   * Check if draft exists and is not expired
   */
  const checkDraft = useCallback((): RegistrationDraft | null => {
    try {
      const stored = localStorage.getItem(DRAFT_KEY);
      if (!stored) return null;

      const draft: RegistrationDraft = JSON.parse(stored);

      // Check version compatibility
      if (draft.version !== DRAFT_VERSION) {
        console.warn('Draft version mismatch, ignoring');
        return null;
      }

      // Check expiry (7 days)
      const now = Date.now();
      const daysOld = (now - draft.timestamp) / (1000 * 60 * 60 * 24);
      if (daysOld > DRAFT_EXPIRY_DAYS) {
        console.log('Draft expired, ignoring');
        localStorage.removeItem(DRAFT_KEY);
        return null;
      }

      return draft;
    } catch (error) {
      console.error('Failed to load draft:', error);
      return null;
    }
  }, []);

  /**
   * Load draft from localStorage
   */
  const loadDraft = useCallback((): {
    formData: RegistrationFormData;
    currentStep: RegistrationStep;
    completedSteps: RegistrationStep[];
  } | null => {
    const draft = checkDraft();
    if (!draft) return null;

    setHasDraft(true);
    setDraftLoaded(true);

    return {
      formData: draft.data,
      currentStep: draft.currentStep,
      completedSteps: draft.completedSteps,
    };
  }, [checkDraft]);

  /**
   * Save draft to localStorage (debounced)
   */
  const saveDraft = useCallback(
    (
      formData: RegistrationFormData,
      currentStep: RegistrationStep,
      completedSteps: RegistrationStep[]
    ) => {
      try {
        const draft: RegistrationDraft = {
          data: formData,
          currentStep,
          completedSteps,
          timestamp: Date.now(),
          version: DRAFT_VERSION,
        };

        localStorage.setItem(DRAFT_KEY, JSON.stringify(draft));
      } catch (error) {
        console.error('Failed to save draft:', error);
      }
    },
    []
  );

  /**
   * Clear draft from localStorage
   */
  const clearDraft = useCallback(() => {
    try {
      localStorage.removeItem(DRAFT_KEY);
      setHasDraft(false);
    } catch (error) {
      console.error('Failed to clear draft:', error);
    }
  }, []);

  /**
   * Show confirmation toast if draft exists on mount
   */
  useEffect(() => {
    const draft = checkDraft();
    if (draft && !draftLoaded) {
      setHasDraft(true);
      showToast(
        '이전에 작성하던 회원가입 정보가 있습니다. 이어서 작성하시겠습니까?',
        'info'
      );
    }
  }, [checkDraft, draftLoaded, showToast]);

  return {
    hasDraft,
    loadDraft,
    saveDraft,
    clearDraft,
    draftLoaded,
  };
}

/**
 * Hook for debounced auto-save
 */
export function useAutoSaveDraft(
  formData: RegistrationFormData,
  currentStep: RegistrationStep,
  completedSteps: RegistrationStep[],
  enabled: boolean = true
) {
  const { saveDraft } = useRegistrationDraft();

  useEffect(() => {
    if (!enabled) return;

    // Debounce save
    const timeoutId = setTimeout(() => {
      saveDraft(formData, currentStep, completedSteps);
    }, DEBOUNCE_DELAY);

    return () => clearTimeout(timeoutId);
  }, [formData, currentStep, completedSteps, enabled, saveDraft]);
}
