import { CheckCircle } from 'lucide-react';

interface UseCaseCardProps {
  title: string;
  description: string;
  features: string[];
}

export function UseCaseCard({ title, description, features }: UseCaseCardProps) {
  return (
    <div className="bg-gray-50 dark:bg-gray-900 rounded-xl p-6 md:p-8 border border-gray-200 dark:border-gray-700">
      <h3 className="text-xl md:text-2xl font-bold text-gray-900 dark:text-white mb-3">{title}</h3>
      <p className="text-gray-600 dark:text-gray-400 mb-4">{description}</p>
      <ul className="space-y-2">
        {features.map((feature, index) => (
          <li key={index} className="flex items-start gap-2">
            <CheckCircle className="w-5 h-5 text-green-600 dark:text-green-400 flex-shrink-0 mt-0.5" />
            <span className="text-gray-700 dark:text-gray-300">{feature}</span>
          </li>
        ))}
      </ul>
    </div>
  );
}
