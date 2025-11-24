import { useState } from 'react'
import { Link, useNavigate, useSearchParams } from 'react-router-dom'
import { Github, Mail, Lock, Eye, EyeOff } from 'lucide-react'
import { useToast } from '../contexts/ToastContext'
import Button from '../components/ui/Button'
import { useApp } from '../contexts/AppContext'
import { ApiError, buildGithubOAuthUrl } from '../lib/apiClient'

export default function LoginPage() {
  const navigate = useNavigate()
  const [searchParams] = useSearchParams()
  const { showToast } = useToast()
  const { login, accessToken } = useApp()

  const [formData, setFormData] = useState({
    email: '',
    password: '',
  })
  const [showPassword, setShowPassword] = useState(false)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [errors, setErrors] = useState<{ email?: string; password?: string }>({})

  const validateForm = () => {
    const newErrors: { email?: string; password?: string } = {}

    // 이메일 검증
    if (!formData.email) {
      newErrors.email = '이메일을 입력해주세요'
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      newErrors.email = '올바른 이메일 형식이 아닙니다'
    }

    // 비밀번호 검증
    if (!formData.password) {
      newErrors.password = '비밀번호를 입력해주세요'
    } else if (formData.password.length < 6) {
      newErrors.password = '비밀번호는 최소 6자 이상이어야 합니다'
    }

    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    if (!validateForm()) {
      return
    }

    setIsSubmitting(true)

    try {
      await login(formData.email, formData.password)
      showToast('로그인에 성공했습니다.', 'success')

      // Redirect to the original intended page or dashboard
      const redirectTo = searchParams.get('redirect') || '/dashboard'
      navigate(redirectTo)
    } catch (error) {
      if (error instanceof ApiError) {
        showToast(error.message || '로그인에 실패했습니다.', 'error')
      } else {
        showToast('로그인에 실패했습니다. 다시 시도해주세요.', 'error')
      }
    } finally {
      setIsSubmitting(false)
    }
  }

  const handleGithubLogin = () => {
    if (!accessToken) {
      showToast('이메일 로그인 후 GitHub OAuth를 진행해주세요.', 'warning')
      return
    }
    window.location.href = buildGithubOAuthUrl()
  }

  const handleGoogleLogin = () => {
    showToast('Google 로그인 기능은 준비 중입니다', 'info')
  }

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 flex flex-col justify-center px-4 py-8 sm:px-6 lg:px-8">
      {/* 헤더 - 모바일 최적화 */}
      <div className="w-full max-w-md mx-auto">
        {/* 로고 - 반응형 크기 */}
        <div className="flex justify-center">
          <div className="w-10 h-10 sm:w-12 sm:h-12 bg-blue-600 rounded-lg flex items-center justify-center">
            <span className="text-white font-bold text-lg sm:text-xl">OK</span>
          </div>
        </div>

        {/* 제목 - 반응형 텍스트 */}
        <h2 className="mt-4 sm:mt-6 text-center text-2xl sm:text-3xl font-bold text-gray-900 dark:text-white">
          OpenKnot에 로그인
        </h2>

        {/* 부제목 - 반응형 텍스트 */}
        <p className="mt-2 text-center text-sm sm:text-base text-gray-600 dark:text-gray-400">
          아직 계정이 없으신가요?{' '}
          <Link
            to="/register"
            className="font-medium text-blue-600 hover:text-blue-500 dark:text-blue-400 underline-offset-4 hover:underline"
          >
            회원가입
          </Link>
        </p>
      </div>

      {/* 폼 컨테이너 - 모바일 최적화 */}
      <div className="mt-6 sm:mt-8 w-full max-w-md mx-auto">
        <div className="bg-white dark:bg-gray-800 py-6 px-6 shadow-lg rounded-xl sm:py-8 sm:px-10">
          {/* 소셜 로그인 - 터치 친화적 버튼 크기 */}
          <div className="space-y-3">
            <Button
              variant="outline"
              className="w-full flex items-center justify-center gap-2 sm:gap-3 min-h-[44px] text-sm sm:text-base"
              onClick={handleGithubLogin}
            >
              <Github size={18} className="sm:w-5 sm:h-5" />
              <span className="hidden sm:inline">GitHub으로 로그인</span>
              <span className="sm:hidden">GitHub 로그인</span>
            </Button>
            <Button
              variant="outline"
              className="w-full flex items-center justify-center gap-2 sm:gap-3 min-h-[44px] text-sm sm:text-base"
              onClick={handleGoogleLogin}
            >
              <svg className="w-[18px] h-[18px] sm:w-5 sm:h-5" viewBox="0 0 24 24">
                <path
                  fill="currentColor"
                  d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                />
                <path
                  fill="currentColor"
                  d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                />
                <path
                  fill="currentColor"
                  d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
                />
                <path
                  fill="currentColor"
                  d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
                />
              </svg>
              <span className="hidden sm:inline">Google로 로그인</span>
              <span className="sm:hidden">Google 로그인</span>
            </Button>
          </div>

          {/* 구분선 - 모바일 최적화 */}
          <div className="mt-5 sm:mt-6">
            <div className="relative">
              <div className="absolute inset-0 flex items-center">
                <div className="w-full border-t border-gray-300 dark:border-gray-600" />
              </div>
              <div className="relative flex justify-center text-xs sm:text-sm">
                <span className="px-2 bg-white dark:bg-gray-800 text-gray-500 dark:text-gray-400">
                  또는 이메일로 로그인
                </span>
              </div>
            </div>
          </div>

          {/* 이메일 로그인 폼 - 모바일 최적화 */}
          <form className="mt-5 sm:mt-6 space-y-4 sm:space-y-5" onSubmit={handleSubmit}>
            {/* 이메일 */}
            <div>
              <label
                htmlFor="email"
                className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1.5"
              >
                이메일
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <Mail className="h-4 w-4 sm:h-5 sm:w-5 text-gray-400" />
                </div>
                <input
                  id="email"
                  name="email"
                  type="email"
                  autoComplete="email"
                  inputMode="email"
                  value={formData.email}
                  onChange={(e) =>
                    setFormData({ ...formData, email: e.target.value })
                  }
                  className={`block w-full pl-9 sm:pl-10 pr-3 py-2.5 sm:py-3 text-sm sm:text-base border rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:text-white transition-colors ${
                    errors.email
                      ? 'border-red-500 dark:border-red-500 focus:ring-red-500'
                      : 'border-gray-300 dark:border-gray-600'
                  }`}
                  placeholder="your@email.com"
                />
              </div>
              {errors.email && (
                <p className="mt-1.5 text-xs sm:text-sm text-red-600 dark:text-red-400">
                  {errors.email}
                </p>
              )}
            </div>

            {/* 비밀번호 */}
            <div>
              <label
                htmlFor="password"
                className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1.5"
              >
                비밀번호
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <Lock className="h-4 w-4 sm:h-5 sm:w-5 text-gray-400" />
                </div>
                <input
                  id="password"
                  name="password"
                  type={showPassword ? 'text' : 'password'}
                  autoComplete="current-password"
                  value={formData.password}
                  onChange={(e) =>
                    setFormData({ ...formData, password: e.target.value })
                  }
                  className={`block w-full pl-9 sm:pl-10 pr-10 sm:pr-11 py-2.5 sm:py-3 text-sm sm:text-base border rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:text-white transition-colors ${
                    errors.password
                      ? 'border-red-500 dark:border-red-500 focus:ring-red-500'
                      : 'border-gray-300 dark:border-gray-600'
                  }`}
                  placeholder="••••••••"
                />
                {/* 비밀번호 표시/숨기기 버튼 - 터치 친화적 크기 */}
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute inset-y-0 right-0 pr-3 flex items-center min-w-[44px] min-h-[44px] justify-center"
                  aria-label={showPassword ? '비밀번호 숨기기' : '비밀번호 표시'}
                >
                  {showPassword ? (
                    <EyeOff className="h-4 w-4 sm:h-5 sm:w-5 text-gray-400 hover:text-gray-600 dark:hover:text-gray-300 transition-colors" />
                  ) : (
                    <Eye className="h-4 w-4 sm:h-5 sm:w-5 text-gray-400 hover:text-gray-600 dark:hover:text-gray-300 transition-colors" />
                  )}
                </button>
              </div>
              {errors.password && (
                <p className="mt-1.5 text-xs sm:text-sm text-red-600 dark:text-red-400">
                  {errors.password}
                </p>
              )}
            </div>

            {/* 로그인 상태 유지 & 비밀번호 찾기 - 모바일 최적화 */}
            <div className="flex items-center justify-between">
              {/* 체크박스 - 터치 친화적 */}
              <div className="flex items-center">
                <input
                  id="remember-me"
                  name="remember-me"
                  type="checkbox"
                  className="h-4 w-4 sm:h-[18px] sm:w-[18px] text-blue-600 focus:ring-blue-500 border-gray-300 rounded cursor-pointer"
                />
                <label
                  htmlFor="remember-me"
                  className="ml-2 block text-sm sm:text-base text-gray-700 dark:text-gray-300 cursor-pointer select-none"
                >
                  로그인 상태 유지
                </label>
              </div>

              {/* 비밀번호 찾기 링크 */}
              <div className="text-sm sm:text-base">
                <Link
                  to="/forgot-password"
                  className="text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white transition-colors"
                >
                  비밀번호 찾기
                </Link>
              </div>
            </div>

            {/* 로그인 버튼 - 구분감 있는 디자인 */}
            <div className="pt-2">
              <Button
                type="submit"
                variant="primary"
                className="w-full min-h-[44px] sm:min-h-[48px] text-sm sm:text-base font-semibold shadow-lg hover:shadow-xl transform hover:scale-[1.02] active:scale-[0.98] transition-all duration-200 bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 dark:from-blue-500 dark:to-blue-600 dark:hover:from-blue-600 dark:hover:to-blue-700 !outline-none !ring-0 !ring-offset-0 !border-0 focus:!outline-none focus:!ring-0 focus-visible:!outline-none focus-visible:!ring-0"
                disabled={isSubmitting}
              >
                {isSubmitting ? (
                  <div className="flex items-center justify-center gap-2">
                    <div className="w-4 h-4 sm:w-5 sm:h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                    로그인 중...
                  </div>
                ) : (
                  <span className="flex items-center justify-center gap-2">
                    로그인
                    <svg className="w-4 h-4 sm:w-5 sm:h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M13 7l5 5m0 0l-5 5m5-5H6" />
                    </svg>
                  </span>
                )}
              </Button>
            </div>
          </form>
        </div>

        {/* 추가 링크 - 모바일 최적화 */}
        <p className="mt-4 sm:mt-6 text-center text-xs sm:text-sm text-gray-600 dark:text-gray-400">
          계정 생성에 문제가 있나요?{' '}
          <a
            href="mailto:support@openknot.com"
            className="text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white transition-colors"
          >
            고객 지원
          </a>
        </p>
      </div>
    </div>
  )
}
