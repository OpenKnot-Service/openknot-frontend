import { Check, X } from 'lucide-react';
import OnboardingHeader from '../components/layout/OnboardingHeader';
import Footer from '../components/layout/Footer';
import { useToast } from '../contexts/ToastContext';
import RainbowButton from '../components/ui/RainbowButton';
import { ShineBorder } from '@/components/ui/shine-border';

export default function PricingPage() {
  const { showToast } = useToast();

  const handleSelectPlan = (plan: string) => {
    showToast(`${plan} 플랜 선택 기능은 준비 중입니다`, 'info');
  };

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      <OnboardingHeader />

      {/* Hero Section */}
      <section className="bg-gradient-to-b from-gray-100 to-gray-50 dark:from-gray-800 dark:to-gray-900 py-20 pt-32">
        <div className="container mx-auto px-4">
          <div className="text-center max-w-3xl mx-auto">
            <div className="inline-block mb-4 px-4 py-2 bg-purple-100 dark:bg-purple-900/30 rounded-full">
              <span className="text-sm font-semibold text-purple-600 dark:text-purple-400">AI-Powered Pricing</span>
            </div>
            <h1 className="text-5xl font-bold text-gray-900 dark:text-white mb-6">
              팀 규모에 맞는<br />AI 프로젝트 관리 플랜
            </h1>
            <p className="text-xl text-gray-600 dark:text-gray-300">
              무료로 시작하고, 필요할 때 언제든 업그레이드하세요<br />
              모든 플랜에서 AI 기반 WBS 생성 기능을 제공합니다
            </p>
          </div>
        </div>
      </section>

      {/* Pricing Cards */}
      <section className="container mx-auto px-4 py-20">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-6xl mx-auto">
          {/* Free Plan */}
          <PricingCard
            name="Starter"
            price="0"
            description="AI 프로젝트 관리를 체험하고 싶은 팀"
            features={[
              { text: '최대 2개 프로젝트', included: true },
              { text: '3명까지 팀원 초대', included: true },
              { text: 'AI 기반 WBS 생성 (월 5회)', included: true },
              { text: '기본 태스크 자동 분배', included: true },
              { text: 'GitHub 연동', included: true },
              { text: '기본 진척도 대시보드', included: true },
              { text: 'PR 분석 & 보안 스캔', included: false },
              { text: '배포 & 모니터링', included: false },
            ]}
            buttonText="무료로 시작하기"
            onSelect={() => handleSelectPlan('Starter')}
          />

          {/* Pro Plan */}
          <PricingCard
            name="Pro"
            price="29,000"
            description="본격적인 AI 프로젝트 관리가 필요한 팀"
            features={[
              { text: '무제한 프로젝트', included: true },
              { text: '15명까지 팀원 초대', included: true },
              { text: 'AI 기반 WBS 생성 (무제한)', included: true },
              { text: 'AI 팀 배치 & 병목 감지', included: true },
              { text: 'GitHub 완전 통합', included: true },
              { text: 'PR 분석 & 품질 통제', included: true },
              { text: '보안 취약점 실시간 감시', included: true },
              { text: '원클릭 배포 & CI/CD', included: true },
            ]}
            buttonText="Pro 시작하기"
            onSelect={() => handleSelectPlan('Pro')}
            popular
          />

          {/* Enterprise Plan */}
          <PricingCard
            name="Enterprise"
            price="문의"
            description="대규모 조직을 위한 맞춤형 AI 솔루션"
            features={[
              { text: '무제한 프로젝트', included: true },
              { text: '무제한 팀원', included: true },
              { text: 'AI 맞춤형 WBS 학습', included: true },
              { text: 'AI 고급 분석 & 예측', included: true },
              { text: 'GitHub Enterprise 연동', included: true },
              { text: '고급 PR 분석 & 리팩토링 제안', included: true },
              { text: '전용 보안 대시보드 & 규정 준수', included: true },
              { text: '멀티 클라우드 배포 & SLA 보장', included: true },
            ]}
            buttonText="문의하기"
            onSelect={() => handleSelectPlan('Enterprise')}
          />
        </div>
      </section>

      {/* FAQ Section */}
      <section className="container mx-auto px-4 py-20">
        <div className="max-w-3xl mx-auto">
          <h2 className="text-3xl font-bold text-center text-gray-900 dark:text-white mb-12">
            자주 묻는 질문
          </h2>
          <div className="space-y-6">
            <FAQItem
              question="AI 기반 WBS 생성은 어떻게 작동하나요?"
              answer="프로젝트 아이디어와 기술스택을 입력하면 AI가 전체 작업 분해 구조(WBS)를 자동으로 생성합니다. 백엔드/프론트엔드/인프라 단위로 태스크를 나누고, 의존성과 일정까지 자동 배치됩니다."
            />
            <FAQItem
              question="무료 플랜에서 Pro로 업그레이드할 수 있나요?"
              answer="네, 언제든지 업그레이드 가능합니다. 기존 데이터는 모두 유지되며, 즉시 Pro 기능(무제한 WBS 생성, PR 분석, 보안 스캔, 배포 자동화 등)을 사용할 수 있습니다."
            />
            <FAQItem
              question="배포 자동화는 어떤 플랫폼을 지원하나요?"
              answer="Pro 플랜 이상에서 AWS, GCP, Azure 등 주요 클라우드 플랫폼을 지원합니다. GitHub Webhook 기반으로 CI/CD 파이프라인을 자동 구성하며, 원클릭 배포가 가능합니다."
            />
            <FAQItem
              question="보안 취약점 감시는 실시간으로 이루어지나요?"
              answer="Pro 플랜 이상에서 NVD/CVE 최신 취약점을 자동 수집하고 프로젝트 의존성과 실시간으로 매칭합니다. 영향 범위와 완화 조치를 즉시 알림으로 제공합니다."
            />
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="bg-white dark:bg-gray-800 py-20">
        <div className="container mx-auto px-4">
          <div className="text-center max-w-3xl mx-auto">
            <h2 className="text-3xl font-bold text-gray-900 dark:text-white mb-4">
              아직 고민 중이신가요?
            </h2>
            <p className="text-lg text-gray-600 dark:text-gray-400 mb-8">
              무료 플랜으로 시작해보세요. 신용카드 등록 없이 바로 사용할 수 있습니다.
            </p>
            <a
              href="/dashboard"
              className="inline-block px-8 py-3 bg-gray-900 dark:bg-white text-white dark:text-gray-900 rounded-lg hover:bg-gray-800 dark:hover:bg-gray-100 transition-colors font-medium"
            >
              무료로 시작하기
            </a>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
}

interface PricingCardProps {
  name: string;
  price: string;
  description: string;
  features: { text: string; included: boolean }[];
  buttonText: string;
  onSelect: () => void;
  popular?: boolean;
}

function PricingCard({
  name,
  price,
  description,
  features,
  buttonText,
  onSelect,
  popular,
}: PricingCardProps) {
  const cardContent = (
    <div
      className={`bg-white dark:bg-gray-800 rounded-xl p-8 shadow-sm flex flex-col ${
        popular ? 'relative' : 'border-2 border-gray-200 dark:border-gray-700'
      }`}
    >
      {popular && (
        <>
          <ShineBorder
            shineColor={['#272331ff', '#EC4899', '#F59E0B']}
          />
          <div className="absolute -top-3 left-1/2 -translate-x-1/2 z-20">
            <span className="bg-gradient-to-r from-purple-600 to-pink-600 text-white px-4 py-1 rounded-full text-sm font-medium shadow-lg">
              인기
            </span>
          </div>
        </>
      )}
      <div className="text-center mb-8">
        <h3 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">{name}</h3>
        <div className="mb-4">
          {price === '문의' ? (
            <span className="text-4xl font-bold text-gray-900 dark:text-white">{price}</span>
          ) : (
            <>
              <span className="text-4xl font-bold text-gray-900 dark:text-white">{price}</span>
              <span className="text-gray-600 dark:text-gray-400">원 / 월</span>
            </>
          )}
        </div>
        <p className="text-gray-600 dark:text-gray-400">{description}</p>
      </div>

      {/* 혜택과 버튼을 한 컨테이너로 묶어 space-between 적용 */}
      <div className="flex flex-col justify-between flex-1">
        <ul className="space-y-4 mb-8">
          {features.map((feature, index) => (
            <li key={index} className="flex items-start gap-3">
              {feature.included ? (
                <Check className="w-5 h-5 text-green-600 dark:text-green-400 flex-shrink-0 mt-0.5" />
              ) : (
                <X className="w-5 h-5 text-gray-400 dark:text-gray-600 flex-shrink-0 mt-0.5" />
              )}
              <span
                className={
                  feature.included
                    ? 'text-gray-700 dark:text-gray-300'
                    : 'text-gray-400 dark:text-gray-600'
                }
              >
                {feature.text}
              </span>
            </li>
          ))}
        </ul>

        {popular ? (
          <RainbowButton onClick={onSelect}>
            {buttonText}
          </RainbowButton>
        ) : (
          <button
            onClick={onSelect}
            className="w-full py-3 rounded-lg font-medium transition-colors bg-gray-100 dark:bg-gray-700 text-gray-900 dark:text-white hover:bg-gray-200 dark:hover:bg-gray-600"
          >
            {buttonText}
          </button>
        )}
      </div>
    </div>
  );

  // if (popular) {
  //   return (
  //     <div className='relative w-full overflow-hidden rounded-xl'>
  //       <ShineBorder
  //         // borderRadius={12}
  //         // borderWidth={2}
  //         // duration={14}
  //         shineColor={['#272331ff', '#EC4899', '#F59E0B']}
  //       />
  //       {cardContent}
  //     </div>
  //   );
  // }

  return cardContent;
}

interface FAQItemProps {
  question: string;
  answer: string;
}

function FAQItem({ question, answer }: FAQItemProps) {
  return (
    <div className="bg-white dark:bg-gray-800 rounded-lg p-6 border border-gray-200 dark:border-gray-700">
      <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">{question}</h3>
      <p className="text-gray-600 dark:text-gray-400">{answer}</p>
    </div>
  );
}
