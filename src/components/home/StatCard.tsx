import { NumberTicker } from '@/components/ui/number-ticker';

interface StatCardProps {
  number: string;
  label: string;
}

export function StatCard({ number, label }: StatCardProps) {
  // 숫자와 단위를 분리 (예: "10,000+" -> { value: 10000, suffix: "+" })
  const parseNumber = (numStr: string) => {
    const hasPlus = numStr.includes('+');
    const hasPercent = numStr.includes('%');
    const cleanNum = numStr.replace(/[+%,]/g, '');
    const value = parseInt(cleanNum, 10);

    let suffix = '';
    if (hasPlus) suffix = '+';
    if (hasPercent) suffix = '%';

    return { value, suffix };
  };

  const { value, suffix } = parseNumber(number);

  // 시작값을 목표값의 70%로 설정하여 애니메이션 속도 향상
  const startValue = Math.floor(value * 0.7);

  return (
    <div className="text-center">
      <div className="text-3xl sm:text-4xl md:text-5xl font-bold text-gray-900 dark:text-white mb-2 whitespace-nowrap">
        <NumberTicker
          value={value}
          startValue={startValue}
          delay={0.1}
          className="text-3xl sm:text-4xl md:text-5xl font-bold"
        />
        <span>{suffix}</span>
      </div>
      <div className="text-sm sm:text-base text-gray-600 dark:text-gray-400">
        {label}
      </div>
    </div>
  );
}
