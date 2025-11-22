import { Link } from 'react-router-dom';
import { Users, Shield, Target, Rocket, Sparkles, FileCode, Brain, Server, AlertTriangle } from 'lucide-react';
import Marquee from 'react-fast-marquee';
import { BentoGrid, BentoCard } from '../components/ui/BentoGrid';
import OnboardingHeader from '../components/layout/OnboardingHeader';
import Footer from '../components/layout/Footer';
import TransparentIcon from '../components/ui/TransparentIcon';
import { StatCard } from '../components/home/StatCard';
import { StepCard } from '../components/home/StepCard';
import { UseCaseCard } from '../components/home/UseCaseCard';
import { TestimonialCard } from '../components/home/TestimonialCard';
import { IntegrationCircles } from '@/components/home/IntegrationCircles';
import { useEffect, useRef, useState } from 'react';

export default function HomePage() {
  const [isTimelineVisible, setIsTimelineVisible] = useState(false);
  const timelineRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          // When timeline enters viewport, activate it
          if (entry.isIntersecting) {
            setIsTimelineVisible(true);
          } else {
            // When timeline leaves viewport, reset it
            setIsTimelineVisible(false);
          }
        });
      },
      {
        threshold: 0.3, // Trigger when 30% of the section is visible
        rootMargin: '0px'
      }
    );

    if (timelineRef.current) {
      observer.observe(timelineRef.current);
    }

    return () => {
      if (timelineRef.current) {
        observer.unobserve(timelineRef.current);
      }
    };
  }, []);
  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-50 to-gray-100 dark:from-gray-900 dark:to-gray-800">
      <OnboardingHeader />
      {/* Hero Section */}
      <section className="container mx-auto px-4 py-12 sm:py-16 md:py-20 pt-24 sm:pt-28 md:pt-32">
        <div className="text-center max-w-5xl mx-auto">
          <div className="inline-block mb-4 px-4 py-2 bg-blue-100 dark:bg-blue-900/30 rounded-full">
            <span className="text-sm font-semibold text-blue-600 dark:text-blue-400">AI-Powered Project Management</span>
          </div>
          <h1 className="text-4xl sm:text-5xl md:text-6xl font-bold text-gray-900 dark:text-white mb-4 md:mb-6">
            아이디어에서 배포까지,<br />AI가 계획하는 프로젝트
          </h1>
          <p className="text-lg sm:text-xl md:text-2xl text-gray-600 dark:text-gray-300 mb-6 md:mb-8 px-4">
            프로젝트 아이디어만 입력하면 AI가 전체 개발 계획(WBS)을 자동 생성하고,<br className="hidden md:block" />
            팀 협업부터 배포, 운영까지 End-to-End로 관리합니다
          </p>
          <div className="flex flex-col sm:flex-row gap-3 sm:gap-4 justify-center px-4">
            <Link
              to="/projects"
              className="px-6 sm:px-8 py-3 bg-gray-900 dark:bg-white text-white dark:text-gray-900 rounded-lg hover:bg-gray-800 dark:hover:bg-gray-100 transition-colors font-medium text-center"
            >
              AI로 프로젝트 계획 생성하기
            </Link>
            <Link
              to="/explore"
              className="px-6 sm:px-8 py-3 border-2 border-gray-900 dark:border-white text-gray-900 dark:text-white rounded-lg hover:bg-gray-900 dark:hover:bg-white hover:text-white dark:hover:text-gray-900 transition-colors font-medium text-center"
            >
              데모 보기
            </Link>
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="container mx-auto px-4 py-12 sm:py-16 md:py-20">
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-6 md:gap-8">
          <StatCard number="1,000+" label="AI 생성 프로젝트 계획" />
          <StatCard number="40%" label="개발 시간 단축" />
          <StatCard number="10,000+" label="자동 생성된 태스크" />
          <StatCard number="95%" label="일정 정확도" />
        </div>
      </section>

      {/* Features Section */}
      <section className="container mx-auto px-4 py-12 sm:py-16 md:py-20">
        <h2 className="text-3xl sm:text-4xl font-bold text-center text-gray-900 dark:text-white mb-10 sm:mb-12 md:mb-16">
          AI가 자동화하는 프로젝트 관리
        </h2>
        <BentoGrid>
          <BentoCard
            name="AI 기반 작업 분해 & 일정 계획"
            className="md:col-span-2"
            Icon={Brain}
            description="프로젝트 아이디어와 기술스택만 입력하면 AI가 백엔드/프론트엔드/인프라 단위로 상세 태스크를 자동 생성합니다. 의존성, 서브태스크, 예상 소요 시간, 담당 역할, 스프린트 배치까지 시니어 PM 수준의 WBS를 즉시 확보하세요."
            background={
              <div className="absolute right-0 top-0 h-full w-full">
                <TransparentIcon
                  Icon={Brain}
                  lightColor="#9333ea"
                  darkColor="#c084fc"
                  baseOpacity={0.2}
                  hoverOpacity={1.0}
                  className="absolute right-8 top-8 h-36 w-36"
                />
                <TransparentIcon
                  Icon={Sparkles}
                  lightColor="#a855f7"
                  darkColor="#d8b4fe"
                  baseOpacity={0.2}
                  hoverOpacity={1.0}
                  className="absolute right-32 top-28 h-24 w-24"
                />
              </div>
            }
            cta="AI 계획 생성하기"
          />
          <BentoCard
            name="팀 협업 & PM 자동화"
            className="md:col-span-1"
            Icon={Users}
            description="생성된 태스크를 팀원에게 자동 분배하고 우선순위를 제시합니다. 진척률 대시보드와 병목 지점 힌트 제공으로 스크럼 마스터 역할을 자동화합니다."
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
        </BentoGrid>
      </section>

      {/* Integration Section */}
      <section className="bg-white dark:bg-gray-800 py-12 sm:py-16 md:py-20">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl sm:text-4xl font-bold text-center text-gray-900 dark:text-white mb-4">
            개발 라이프사이클 전체를 하나의 플랫폼에서
          </h2>
          <p className="text-center text-gray-600 dark:text-gray-400 mb-10 sm:mb-12 md:mb-16 max-w-2xl mx-auto">
            프로젝트 생성 → 작업 계획 확보 → 진행 관리 → 배포/운영 관제까지<br />
            모든 단계를 AI가 자동화하고 통합 관리합니다
          </p>
          <IntegrationCircles />
        </div>
      </section>

      {/* How it Works Section */}
      <section ref={timelineRef} className="bg-white dark:bg-gray-800 py-12 sm:py-16 md:py-20 bg-gray-50 dark:bg-gray-900">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl sm:text-4xl font-bold text-center text-gray-900 dark:text-white mb-10 sm:mb-12 md:mb-16">
            3단계로 시작하는 AI 프로젝트 관리
          </h2>
          {/* Timeline Container */}
          <div
            key={isTimelineVisible ? 'visible' : 'hidden'}
            className="flex flex-col md:flex-row md:justify-center md:items-start gap-12 md:gap-16 lg:gap-24 max-w-6xl mx-auto px-4"
          >
            <StepCard
              step="1"
              icon={<Brain className="w-10 h-10 text-purple-600" />}
              title="아이디어 입력"
              description="서비스 개요와 기술스택을 입력하면 AI가 즉시 전체 WBS와 일정 계획을 생성합니다."
              delay={0.2}
              isVisible={isTimelineVisible}
            />
            <StepCard
              step="2"
              icon={<Users className="w-10 h-10 text-blue-600" />}
              title="팀 배치 & 진행"
              description="AI가 태스크를 자동 분배하고 우선순위를 제시. 대시보드에서 진척도를 실시간 관리합니다."
              delay={0.8}
              isVisible={isTimelineVisible}
            />
            <StepCard
              step="3"
              icon={<Rocket className="w-10 h-10 text-green-600" />}
              title="배포 & 운영"
              description="원클릭 배포와 CI/CD 자동 구성. 리소스 모니터링과 보안 감시까지 통합 제공합니다."
              delay={1.4}
              isLast={true}
              isVisible={isTimelineVisible}
            />
          </div>
        </div>
      </section>

      {/* Benefits Section */}
      <section className="container mx-auto px-4 py-12 sm:py-16 md:py-20">
        <h2 className="text-3xl sm:text-4xl font-bold text-center text-gray-900 dark:text-white mb-10 sm:mb-12 md:mb-16">
          기존 도구와의 차별점
        </h2>
        <BentoGrid>
          <BentoCard
            name="시니어 PM 없이도 가능"
            className="md:col-span-2"
            Icon={Brain}
            description="Jira/Asana는 사람이 계획을 입력하는 도구일 뿐입니다. 저희는 AI가 계획을 수립하고 관리합니다. 시니어 PM이 없어도 프로 수준의 WBS와 일정표를 즉시 확보할 수 있습니다."
            background={
              <div className="absolute right-0 top-0 h-full w-full">
                <TransparentIcon
                  Icon={Brain}
                  lightColor="#9333ea"
                  darkColor="#c084fc"
                  baseOpacity={0.2}
                  hoverOpacity={1.0}
                  className="absolute right-8 top-8 h-36 w-36"
                />
                <TransparentIcon
                  Icon={Sparkles}
                  lightColor="#a855f7"
                  darkColor="#d8b4fe"
                  baseOpacity={0.2}
                  hoverOpacity={1.0}
                  className="absolute right-32 top-28 h-24 w-24"
                />
              </div>
            }
            cta="AI 계획 체험"
          />
          <BentoCard
            name="현실성 있는 자동화"
            className="md:col-span-1"
            Icon={Target}
            description="단순히 계획만 보여주는 게 아니라, 팀이 실제로 실행하고 운영까지 갈 수 있게 만드는 End-to-End 자동화를 제공합니다."
            background={
              <div className="absolute right-0 top-0 h-full w-full">
                <TransparentIcon
                  Icon={Target}
                  lightColor="#2563eb"
                  darkColor="#60a5fa"
                  baseOpacity={0.2}
                  hoverOpacity={1.0}
                  className="absolute right-4 top-4 h-32 w-32"
                />
              </div>
            }
          />
          <BentoCard
            name="병목 자동 감지"
            className="md:col-span-1"
            Icon={AlertTriangle}
            description="일정 지연 시 단순 경고가 아니라 '어디서 막혔는지 / 무엇이 병목인지 / 다음에 뭘 하면 풀리는지' 힌트를 제공합니다."
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
          />
          <BentoCard
            name="개발부터 배포까지 통합"
            className="md:col-span-1"
            Icon={Rocket}
            description="계획, 진행, 배포, 모니터링, 보안까지 개발 라이프사이클 전체를 하나의 플랫폼에서 완결합니다."
            background={
              <div className="absolute right-0 top-0 h-full w-full">
                <TransparentIcon
                  Icon={Rocket}
                  lightColor="#16a34a"
                  darkColor="#4ade80"
                  baseOpacity={0.2}
                  hoverOpacity={1.0}
                  className="absolute right-4 top-4 h-32 w-32"
                />
              </div>
            }
          />
          <BentoCard
            name="보안도 자동화"
            className="md:col-span-1"
            Icon={Shield}
            description="CVE/NVD 최신 취약점을 자동 매칭하고 영향 범위와 완화 조치를 제안하는 내장 SecOps 기능을 제공합니다."
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
          />
        </BentoGrid>
      </section>

      {/* Use Cases Section */}
      <section className="bg-white dark:bg-gray-800 py-12 sm:py-16 md:py-20">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl sm:text-4xl font-bold text-center text-gray-900 dark:text-white mb-10 sm:mb-12 md:mb-16">
            누가 사용하나요?
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 md:gap-10 max-w-5xl mx-auto">
            <UseCaseCard
              title="PM이 없는 스타트업"
              description="시니어 PM을 고용할 여력이 없는 초기 스타트업도 AI로 전문가 수준의 프로젝트 계획을 확보할 수 있습니다."
              features={[
                "AI 기반 WBS 자동 생성",
                "태스크 자동 분배 및 우선순위 제시",
                "병목 지점 자동 감지 및 힌트 제공"
              ]}
            />
            <UseCaseCard
              title="기술 부채 관리가 필요한 팀"
              description="PR 분석과 보안 취약점 자동 감시로 코드 품질과 보안을 동시에 관리할 수 있습니다."
              features={[
                "PR 의존성 영향도 자동 분석",
                "보안 취약점 실시간 매칭 알림",
                "리팩토링 제안 및 코드 일관성 검사"
              ]}
            />
            <UseCaseCard
              title="DevOps 리소스가 부족한 팀"
              description="원클릭 배포와 CI/CD 자동 구성으로 DevOps 엔지니어 없이도 운영이 가능합니다."
              features={[
                "원클릭 서비스 배포",
                "GitHub Webhook 기반 자동 CI/CD",
                "리소스 사용량 실시간 모니터링"
              ]}
            />
            <UseCaseCard
              title="교육 & 학습 프로젝트"
              description="학생과 초보 개발자도 전문가 수준의 프로젝트 관리 경험을 얻을 수 있습니다."
              features={[
                "프로젝트 계획 수립 학습",
                "팀 협업 경험 축적",
                "실전 배포 및 운영 경험"
              ]}
            />
          </div>
        </div>
      </section>

      {/* Testimonials Section */}
      <section className="py-12 sm:py-16 md:py-20 overflow-hidden bg-gray-100 dark:bg-gray-800">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl sm:text-4xl font-bold text-center text-gray-900 dark:text-white mb-10 sm:mb-12 md:mb-16">
            사용자 후기
          </h2>
        </div>

        <div className="flex flex-col gap-6">
          {/* First Row - Scroll to Left */}
          <Marquee
            direction="left"
            speed={40}
            pauseOnHover
            gradient
            gradientColor="rgb(243,244,246)"
            gradientWidth={100}
            className="dark:[--gradient-color:31,41,55]"
          >
            <TestimonialCard
              quote="AI가 생성한 WBS가 시니어 PM이 만든 것처럼 정교해서 놀랐어요. 이제 PM 없이도 프로젝트를 시작할 수 있습니다."
              author="김민수"
              role="CTO, 초기 스타트업"
              avatar="KM"
            />
            <TestimonialCard
              quote="프로젝트 계획 수립에 2주 걸리던 시간이 5분으로 단축되었습니다. 개발에 집중할 수 있게 되었어요."
              author="이지은"
              role="풀스택 개발자"
              avatar="LJ"
            />
            <TestimonialCard
              quote="병목 지점을 자동으로 감지해서 알려주니 일정 지연을 사전에 방지할 수 있었습니다."
              author="박준형"
              role="테크 리드"
              avatar="PJ"
            />
            <TestimonialCard
              quote="PR 분석 기능이 코드리뷰 시간을 절반으로 줄여줬어요. 의존성 영향도까지 자동으로 보여줍니다."
              author="최수진"
              role="시니어 개발자"
              avatar="CS"
            />
            <TestimonialCard
              quote="보안 취약점을 자동으로 매칭해주니 CVE 공지를 일일이 확인할 필요가 없어졌어요."
              author="정현우"
              role="백엔드 개발자"
              avatar="JH"
            />
          </Marquee>

          {/* Second Row - Scroll to Right */}
          <Marquee
            direction="right"
            speed={40}
            pauseOnHover
            gradient
            gradientColor="rgb(243,244,246)"
            gradientWidth={100}
            className="dark:[--gradient-color:31,41,55]"
          >
            <TestimonialCard
              quote="원클릭 배포 기능 덕분에 DevOps 엔지니어 없이도 서비스를 운영하고 있습니다."
              author="강서연"
              role="프로덕트 오너"
              avatar="KS"
            />
            <TestimonialCard
              quote="학생 프로젝트인데도 전문가처럼 계획을 세울 수 있어서 팀원들이 놀랐어요!"
              author="윤태영"
              role="컴퓨터공학과 학생"
              avatar="YT"
            />
            <TestimonialCard
              quote="CI/CD 파이프라인을 자동으로 구성해주니 GitHub Actions 설정할 시간을 아낄 수 있었어요."
              author="한지민"
              role="DevOps 엔지니어"
              avatar="HJ"
            />
            <TestimonialCard
              quote="태스크 자동 분배 기능이 정말 똑똑해요. 누가 뭘 해야 할지 고민할 시간이 없어졌습니다."
              author="송민호"
              role="팀 리더"
              avatar="SM"
            />
            <TestimonialCard
              quote="모니터링 대시보드까지 제공해서 서비스 운영 현황을 실시간으로 파악할 수 있어요."
              author="임하늘"
              role="프론트엔드 개발자"
              avatar="IH"
            />
          </Marquee>
        </div>
      </section>

      {/* CTA Section */}
      <section className="container mx-auto px-4 py-12 sm:py-16 md:py-20">
        <div className="bg-gradient-to-r from-purple-900 via-blue-900 to-purple-900 dark:bg-gradient-to-r dark:from-purple-800 dark:via-blue-800 dark:to-purple-800 rounded-xl md:rounded-2xl p-8 sm:p-10 md:p-12 text-center border border-transparent dark:border-gray-700">
          <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold text-white mb-3 md:mb-4">
            AI가 계획하는 프로젝트, 지금 시작하세요
          </h2>
          <p className="text-base sm:text-lg md:text-xl text-gray-100 dark:text-gray-200 mb-6 md:mb-8 px-4">
            아이디어만 입력하면 5분 안에 전문가 수준의 프로젝트 계획을 확보할 수 있습니다
          </p>
          <Link
            to="/register"
            className="inline-block px-6 sm:px-8 py-3 bg-white dark:bg-gray-200 text-gray-900 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-300 transition-colors font-medium"
          >
            무료로 AI 계획 생성하기
          </Link>
        </div>
      </section>

      <Footer />
    </div>
  );
}
