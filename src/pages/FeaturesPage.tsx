import {
  Brain,
  Users,
  Server,
  FileCode,
  Shield,
  Sparkles,
  AlertTriangle,
  Rocket,
  Target,
  BarChart3,
  Activity,
  GitBranch,
  Clock
} from 'lucide-react';
import { BentoGrid, BentoCard } from '../components/ui/BentoGrid';
import OnboardingHeader from '../components/layout/OnboardingHeader';
import Footer from '../components/layout/Footer';
import TransparentIcon from '../components/ui/TransparentIcon';
import { Link } from 'react-router-dom';

export default function FeaturesPage() {
  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      <OnboardingHeader />

      {/* Hero Section */}
      <section className="bg-gradient-to-b from-gray-100 to-gray-50 dark:from-gray-800 dark:to-gray-900 py-20 pt-32">
        <div className="container mx-auto px-4">
          <div className="text-center max-w-3xl mx-auto">
            <div className="inline-block mb-4 px-4 py-2 bg-purple-100 dark:bg-purple-900/30 rounded-full">
              <span className="text-sm font-semibold text-purple-600 dark:text-purple-400">AI-Powered Features</span>
            </div>
            <h1 className="text-5xl font-bold text-gray-900 dark:text-white mb-6">
              AI가 자동화하는<br />프로젝트 관리의 모든 것
            </h1>
            <p className="text-xl text-gray-600 dark:text-gray-300">
              계획 수립부터 배포, 운영, 보안까지<br />
              AI가 프로젝트 라이프사이클 전체를 관리합니다
            </p>
          </div>
        </div>
      </section>

      {/* Main Features */}
      <section className="container mx-auto px-4 py-20">
        <h2 className="text-3xl font-bold text-center text-gray-900 dark:text-white mb-12">
          핵심 기능
        </h2>
        <BentoGrid className="gap-6">
          <BentoCard
            name="AI 기반 WBS 자동 생성"
            className="md:col-span-2 md:row-span-2"
            Icon={Brain}
            description="프로젝트 아이디어와 기술스택만 입력하면 AI가 전체 작업 분해 구조(WBS)를 자동으로 생성합니다. 백엔드/프론트엔드/인프라 단위로 상세 태스크를 나누고, 의존성, 서브태스크, 예상 소요 시간, 담당 역할, 스프린트 배치까지 시니어 PM 수준의 계획을 즉시 확보하세요."
            background={
              <div className="absolute right-0 top-0 h-full w-full">
                <TransparentIcon
                  Icon={Brain}
                  lightColor="#9333ea"
                  darkColor="#c084fc"
                  baseOpacity={0.2}
                  hoverOpacity={1.0}
                  className="absolute right-8 top-8 h-40 w-40"
                />
                <TransparentIcon
                  Icon={Sparkles}
                  lightColor="#a855f7"
                  darkColor="#d8b4fe"
                  baseOpacity={0.2}
                  hoverOpacity={1.0}
                  className="absolute right-28 top-32 h-28 w-28"
                />
                <TransparentIcon
                  Icon={Target}
                  lightColor="#a855f7"
                  darkColor="#d8b4fe"
                  baseOpacity={0.2}
                  hoverOpacity={1.0}
                  className="absolute right-12 bottom-8 h-32 w-32"
                />
              </div>
            }
            cta="AI 계획 생성하기"
          />
          <BentoCard
            name="팀 협업 & PM 자동화"
            className="md:col-span-1"
            Icon={Users}
            description="AI가 생성한 태스크를 팀원에게 자동 분배하고 우선순위를 제시합니다. 진척률 대시보드와 병목 지점 힌트 제공으로 스크럼 마스터 역할을 자동화합니다."
            background={
              <div className="absolute right-0 top-0 h-full w-full">
                <TransparentIcon
                  Icon={Users}
                  lightColor="#2563eb"
                  darkColor="#60a5fa"
                  baseOpacity={0.2}
                  hoverOpacity={1.0}
                  className="absolute right-4 top-4 h-32 w-32"
                />
              </div>
            }
            cta="대시보드 보기"
          />
          <BentoCard
            name="DevOps & 배포 자동화"
            className="md:col-span-1"
            Icon={Server}
            description="원클릭 서비스 배포, 암호화된 환경 변수 관리, GitHub Webhook 기반 CI/CD 구성. 리소스 사용량과 에러율을 실시간 모니터링합니다."
            background={
              <div className="absolute right-0 top-0 h-full w-full">
                <TransparentIcon
                  Icon={Server}
                  lightColor="#16a34a"
                  darkColor="#4ade80"
                  baseOpacity={0.2}
                  hoverOpacity={1.0}
                  className="absolute right-4 top-4 h-32 w-32"
                />
              </div>
            }
            cta="배포하기"
          />
          <BentoCard
            name="PR 분석 & 품질 통제"
            className="md:col-span-1"
            Icon={FileCode}
            description="변경 코드의 의존성 영향도 분석, 보안 취약점 탐지, 리팩토링 제안. 코드리뷰 시간을 절감하고 품질을 표준화합니다."
            background={
              <div className="absolute right-0 top-0 h-full w-full">
                <TransparentIcon
                  Icon={FileCode}
                  lightColor="#ea580c"
                  darkColor="#fb923c"
                  baseOpacity={0.2}
                  hoverOpacity={1.0}
                  className="absolute right-4 top-4 h-32 w-32"
                />
              </div>
            }
            cta="분석 보기"
          />
          <BentoCard
            name="보안 취약점 실시간 감시"
            className="md:col-span-1"
            Icon={Shield}
            description="NVD/CVE 최신 취약점을 자동 수집하고 프로젝트 의존성과 매칭. 영향 범위와 완화 조치를 자동 제안하는 내장 SecOps 기능을 제공합니다."
            background={
              <div className="absolute right-0 top-0 h-full w-full">
                <TransparentIcon
                  Icon={Shield}
                  lightColor="#dc2626"
                  darkColor="#f87171"
                  baseOpacity={0.2}
                  hoverOpacity={1.0}
                  className="absolute right-4 top-4 h-32 w-32"
                />
              </div>
            }
            cta="보안 현황"
          />
          <BentoCard
            name="병목 자동 감지"
            className="md:col-span-1"
            Icon={AlertTriangle}
            description="일정 지연 시 단순 경고가 아니라 어디서 막혔는지, 무엇이 병목인지, 다음에 뭘 하면 풀리는지 AI가 힌트를 제공합니다."
            background={
              <div className="absolute right-0 top-0 h-full w-full">
                <TransparentIcon
                  Icon={AlertTriangle}
                  lightColor="#ca8a04"
                  darkColor="#facc15"
                  baseOpacity={0.2}
                  hoverOpacity={1.0}
                  className="absolute right-4 top-4 h-32 w-32"
                />
              </div>
            }
            cta="진행 현황"
          />
        </BentoGrid>
      </section>

      {/* Additional Features */}
      <section className="bg-white dark:bg-gray-800 py-20">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl font-bold text-center text-gray-900 dark:text-white mb-12">
            추가 기능
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <AdditionalFeature
              icon={<BarChart3 className="w-8 h-8 text-indigo-600 dark:text-indigo-400" />}
              title="고급 분석 대시보드"
              description="프로젝트 진척도, 팀 생산성, 리소스 사용량을 데이터 기반으로 분석합니다"
            />
            <AdditionalFeature
              icon={<Activity className="w-8 h-8 text-green-600 dark:text-green-400" />}
              title="실시간 모니터링"
              description="배포된 서비스의 상태를 실시간으로 관제하고 이상 징후를 자동 감지합니다"
            />
            <AdditionalFeature
              icon={<GitBranch className="w-8 h-8 text-purple-600 dark:text-purple-400" />}
              title="GitHub 완전 통합"
              description="저장소, PR, Issue를 실시간으로 연동하고 AI가 자동으로 분석합니다"
            />
            <AdditionalFeature
              icon={<Clock className="w-8 h-8 text-blue-600 dark:text-blue-400" />}
              title="일정 자동 최적화"
              description="AI가 팀의 작업 패턴을 학습하여 가장 현실적인 일정을 제안합니다"
            />
            <AdditionalFeature
              icon={<Rocket className="w-8 h-8 text-orange-600 dark:text-orange-400" />}
              title="CI/CD 자동 구성"
              description="GitHub Webhook 기반으로 배포 파이프라인을 자동으로 설정합니다"
            />
            <AdditionalFeature
              icon={<Sparkles className="w-8 h-8 text-yellow-600 dark:text-yellow-400" />}
              title="AI 어시스턴트"
              description="프로젝트 관련 질문에 즉시 답변하고 최적의 해결책을 제안합니다"
            />
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="container mx-auto px-4 py-20">
        <div className="bg-gradient-to-r from-purple-900 via-blue-900 to-purple-900 dark:from-purple-800 dark:via-blue-800 dark:to-purple-800 rounded-2xl p-12 text-center border border-transparent dark:border-gray-700">
          <h2 className="text-4xl font-bold text-white mb-4">
            AI가 계획하는 프로젝트, 지금 시작하세요
          </h2>
          <p className="text-xl text-gray-100 dark:text-gray-200 mb-8">
            5분 안에 전문가 수준의 프로젝트 계획을 확보하세요
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link
              to="/register"
              className="px-8 py-3 bg-white dark:bg-gray-200 text-gray-900 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-300 transition-colors font-medium"
            >
              무료로 시작하기
            </Link>
            <Link
              to="/pricing"
              className="px-8 py-3 border-2 border-white text-white rounded-lg hover:bg-white hover:text-gray-900 transition-colors font-medium"
            >
              요금제 보기
            </Link>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
}

interface AdditionalFeatureProps {
  icon: React.ReactNode;
  title: string;
  description: string;
}

function AdditionalFeature({ icon, title, description }: AdditionalFeatureProps) {
  return (
    <div className="text-center">
      <div className="inline-flex items-center justify-center w-16 h-16 bg-gray-100 dark:bg-gray-700 rounded-full mb-4">
        {icon}
      </div>
      <h4 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">{title}</h4>
      <p className="text-gray-600 dark:text-gray-400">{description}</p>
    </div>
  );
}
