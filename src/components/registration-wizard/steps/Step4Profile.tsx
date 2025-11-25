import { useState, useRef } from 'react';
import { Upload, Github, Loader2, MapPin, Link as LinkIcon, User } from 'lucide-react';
import { RegistrationStep4Data } from '../../../types/registration';
import { importGitHubProfile, extractGitHubUsername } from '../../../lib/githubProfileImport';

interface Step4ProfileProps {
  data: RegistrationStep4Data;
  errors: Record<string, string>;
  onChange: (field: keyof RegistrationStep4Data, value: string | File | boolean) => void;
  onGitHubImport?: (skills: string[]) => void;
}

export default function Step4Profile({
  data,
  errors,
  onChange,
  onGitHubImport,
}: Step4ProfileProps) {
  const [isImporting, setIsImporting] = useState(false);
  const [importError, setImportError] = useState<string | null>(null);
  const [githubInputValue, setGithubInputValue] = useState('');
  const [previewImage, setPreviewImage] = useState<string | null>(
    data.profileImageUrl || null
  );
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleImageUpload = (file: File) => {
    // Validate file
    const maxSize = 5 * 1024 * 1024; // 5MB
    if (file.size > maxSize) {
      return;
    }

    const allowedTypes = ['image/jpeg', 'image/png', 'image/webp', 'image/gif'];
    if (!allowedTypes.includes(file.type)) {
      return;
    }

    // Create preview
    const reader = new FileReader();
    reader.onloadend = () => {
      setPreviewImage(reader.result as string);
    };
    reader.readAsDataURL(file);

    // Store file
    onChange('profileImageFile', file);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    const file = e.dataTransfer.files[0];
    if (file && file.type.startsWith('image/')) {
      handleImageUpload(file);
    }
  };

  const handleGitHubImport = async () => {
    const username = extractGitHubUsername(githubInputValue);

    if (!username) {
      setImportError('올바른 GitHub 사용자 이름 또는 URL을 입력해주세요');
      return;
    }

    setIsImporting(true);
    setImportError(null);

    try {
      const result = await importGitHubProfile(username);

      // Update profile fields
      if (result.profileImageUrl) {
        setPreviewImage(result.profileImageUrl);
        onChange('profileImageUrl', result.profileImageUrl);
      }
      if (result.bio) onChange('bio', result.bio);
      if (result.location) onChange('location', result.location);
      if (result.githubLink) onChange('githubLink', result.githubLink);
      if (result.githubUsername) onChange('githubUsername', result.githubUsername);
      if (result.portfolioUrl) onChange('portfolioUrl', result.portfolioUrl);

      onChange('githubImported', true);

      // Pass suggested skills to parent
      if (onGitHubImport && result.suggestedSkills.length > 0) {
        onGitHubImport(result.suggestedSkills);
      }

      setGithubInputValue('');
    } catch (error) {
      setImportError(
        error instanceof Error ? error.message : 'GitHub 프로필을 가져오지 못했습니다'
      );
    } finally {
      setIsImporting(false);
    }
  };

  return (
    <div className="space-y-8">
      {/* Optional Notice */}
      <div className="p-4 bg-amber-50 dark:bg-amber-900/20 border border-amber-200 dark:border-amber-800 rounded-lg">
        <p className="text-sm text-amber-800 dark:text-amber-200">
          <span className="font-semibold">선택 사항:</span> 이 단계는 건너뛰어도 됩니다. 나중에 프로필 설정에서 추가할 수 있습니다.
        </p>
      </div>

      {/* GitHub Import */}
      <div className="p-6 bg-gradient-to-r from-gray-900 to-gray-800 dark:from-gray-800 dark:to-gray-900 border border-gray-700 rounded-xl">
        <div className="flex items-start gap-4">
          <div className="p-3 bg-gray-800 dark:bg-gray-700 rounded-lg">
            <Github className="w-6 h-6 text-white" />
          </div>
          <div className="flex-1">
            <h3 className="text-lg font-semibold text-white mb-2">
              GitHub에서 프로필 가져오기
            </h3>
            <p className="text-sm text-gray-300 mb-4">
              GitHub 프로필 정보와 스킬을 자동으로 가져옵니다
            </p>

            <div className="flex gap-2">
              <input
                type="text"
                value={githubInputValue}
                onChange={(e) => setGithubInputValue(e.target.value)}
                onKeyDown={(e) => e.key === 'Enter' && !isImporting && handleGitHubImport()}
                placeholder="GitHub 사용자 이름 또는 URL"
                className="
                  flex-1 px-4 py-2.5 rounded-lg
                  border border-gray-600
                  bg-gray-800 dark:bg-gray-900
                  text-white
                  placeholder-gray-400
                  focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent
                  transition-all
                "
              />
              <button
                type="button"
                onClick={handleGitHubImport}
                disabled={!githubInputValue.trim() || isImporting}
                className="
                  px-6 py-2.5 rounded-lg font-medium
                  bg-blue-600 text-white
                  hover:bg-blue-700
                  disabled:opacity-50 disabled:cursor-not-allowed
                  transition-colors
                  flex items-center gap-2
                "
              >
                {isImporting ? (
                  <>
                    <Loader2 className="w-4 h-4 animate-spin" />
                    가져오는 중...
                  </>
                ) : (
                  '가져오기'
                )}
              </button>
            </div>

            {importError && (
              <p className="mt-2 text-sm text-red-400">{importError}</p>
            )}

            {data.githubImported && (
              <p className="mt-2 text-sm text-green-400">
                ✓ GitHub 프로필을 성공적으로 가져왔습니다
              </p>
            )}
          </div>
        </div>
      </div>

      {/* Profile Image */}
      <div>
        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
          프로필 이미지
        </label>
        <div
          onDrop={handleDrop}
          onDragOver={(e) => e.preventDefault()}
          onClick={() => fileInputRef.current?.click()}
          className={`
            relative border-2 border-dashed rounded-xl p-8
            ${
              previewImage
                ? 'border-blue-300 dark:border-blue-700'
                : 'border-gray-300 dark:border-gray-600'
            }
            hover:border-blue-400 dark:hover:border-blue-600
            transition-colors cursor-pointer
            bg-gray-50 dark:bg-gray-800/50
          `}
        >
          {previewImage ? (
            <div className="flex flex-col items-center">
              <img
                src={previewImage}
                alt="Profile preview"
                className="w-32 h-32 rounded-full object-cover mb-4 border-4 border-white dark:border-gray-700 shadow-lg"
              />
              <p className="text-sm text-gray-600 dark:text-gray-400">
                클릭하여 이미지 변경
              </p>
            </div>
          ) : (
            <div className="flex flex-col items-center text-center">
              <div className="p-4 bg-gray-200 dark:bg-gray-700 rounded-full mb-4">
                <Upload className="w-8 h-8 text-gray-500 dark:text-gray-400" />
              </div>
              <p className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                이미지를 드래그하거나 클릭하여 업로드
              </p>
              <p className="text-xs text-gray-500 dark:text-gray-400">
                JPG, PNG, WebP, GIF (최대 5MB)
              </p>
            </div>
          )}

          <input
            ref={fileInputRef}
            type="file"
            accept="image/jpeg,image/png,image/webp,image/gif"
            onChange={(e) => {
              const file = e.target.files?.[0];
              if (file) handleImageUpload(file);
            }}
            className="hidden"
          />
        </div>
        {errors.profileImageFile && (
          <p className="mt-1 text-sm text-red-500">{errors.profileImageFile}</p>
        )}
      </div>

      {/* Bio */}
      <div>
        <label
          htmlFor="bio"
          className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2"
        >
          <User className="w-4 h-4 inline mr-1" />
          자기소개 (최대 500자)
        </label>
        <textarea
          id="bio"
          value={data.bio || ''}
          onChange={(e) => onChange('bio', e.target.value)}
          maxLength={500}
          rows={4}
          className={`
            w-full px-4 py-3 rounded-lg
            border ${errors.bio ? 'border-red-500' : 'border-gray-300 dark:border-gray-600'}
            bg-white dark:bg-gray-700
            text-gray-900 dark:text-white
            placeholder-gray-400 dark:placeholder-gray-500
            focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent
            transition-all resize-none
          `}
          placeholder="자신을 소개하는 간단한 설명을 작성해주세요"
        />
        <div className="flex justify-between items-center mt-1">
          <div>
            {errors.bio && <p className="text-sm text-red-500">{errors.bio}</p>}
          </div>
          <p className="text-xs text-gray-500 dark:text-gray-400">
            {(data.bio || '').length} / 500
          </p>
        </div>
      </div>

      {/* GitHub Link */}
      <div>
        <label
          htmlFor="githubLink"
          className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2"
        >
          <Github className="w-4 h-4 inline mr-1" />
          GitHub 링크
        </label>
        <input
          type="url"
          id="githubLink"
          value={data.githubLink || ''}
          onChange={(e) => onChange('githubLink', e.target.value)}
          className={`
            w-full px-4 py-3 rounded-lg
            border ${errors.githubLink ? 'border-red-500' : 'border-gray-300 dark:border-gray-600'}
            bg-white dark:bg-gray-700
            text-gray-900 dark:text-white
            placeholder-gray-400 dark:placeholder-gray-500
            focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent
            transition-all
          `}
          placeholder="https://github.com/username"
        />
        {errors.githubLink && (
          <p className="mt-1 text-sm text-red-500">{errors.githubLink}</p>
        )}
      </div>

      {/* Portfolio URL */}
      <div>
        <label
          htmlFor="portfolioUrl"
          className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2"
        >
          <LinkIcon className="w-4 h-4 inline mr-1" />
          포트폴리오 URL
        </label>
        <input
          type="url"
          id="portfolioUrl"
          value={data.portfolioUrl || ''}
          onChange={(e) => onChange('portfolioUrl', e.target.value)}
          className={`
            w-full px-4 py-3 rounded-lg
            border ${errors.portfolioUrl ? 'border-red-500' : 'border-gray-300 dark:border-gray-600'}
            bg-white dark:bg-gray-700
            text-gray-900 dark:text-white
            placeholder-gray-400 dark:placeholder-gray-500
            focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent
            transition-all
          `}
          placeholder="https://yourportfolio.com"
        />
        {errors.portfolioUrl && (
          <p className="mt-1 text-sm text-red-500">{errors.portfolioUrl}</p>
        )}
      </div>

      {/* Location */}
      <div>
        <label
          htmlFor="location"
          className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2"
        >
          <MapPin className="w-4 h-4 inline mr-1" />
          위치
        </label>
        <input
          type="text"
          id="location"
          value={data.location || ''}
          onChange={(e) => onChange('location', e.target.value)}
          className="
            w-full px-4 py-3 rounded-lg
            border border-gray-300 dark:border-gray-600
            bg-white dark:bg-gray-700
            text-gray-900 dark:text-white
            placeholder-gray-400 dark:placeholder-gray-500
            focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent
            transition-all
          "
          placeholder="예: Seoul, South Korea"
        />
      </div>

      {/* Info Box */}
      <div className="mt-8 p-4 bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-lg">
        <p className="text-sm text-blue-800 dark:text-blue-200">
          <span className="font-semibold">완성된 프로필의 장점:</span> 프로젝트 초대를 3배 더 받으며, 팀 매칭 시 우선적으로 추천됩니다.
        </p>
      </div>
    </div>
  );
}
