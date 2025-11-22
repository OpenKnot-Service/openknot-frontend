interface TestimonialCardProps {
  quote: string;
  author: string;
  role: string;
  avatar: string;
}

export function TestimonialCard({ quote, author, role, avatar }: TestimonialCardProps) {
  const getAvatarColor = (name: string) => {
    const colors = [
      'bg-gradient-to-br from-blue-500 to-blue-600',
      'bg-gradient-to-br from-green-500 to-green-600',
      'bg-gradient-to-br from-purple-500 to-purple-600',
      'bg-gradient-to-br from-orange-500 to-orange-600',
      'bg-gradient-to-br from-pink-500 to-pink-600',
      'bg-gradient-to-br from-indigo-500 to-indigo-600',
    ];
    const index = name.charCodeAt(0) % colors.length;
    return colors[index];
  };

  return (
    <div className="relative bg-white dark:bg-gray-900 rounded-2xl p-8 shadow-lg hover:shadow-xl transition-shadow duration-300 border border-gray-100 dark:border-gray-700 flex flex-col w-[380px] md:w-[420px] h-[250px] mx-4 group">
      {/* Quote Icon */}
      <div className="absolute top-6 right-6 opacity-10 dark:opacity-5 pointer-events-none">
        <svg className="w-12 h-12 text-gray-900 dark:text-white" fill="currentColor" viewBox="0 0 24 24">
          <path d="M14.017 21v-7.391c0-5.704 3.731-9.57 8.983-10.609l.995 2.151c-2.432.917-3.995 3.638-3.995 5.849h4v10h-9.983zm-14.017 0v-7.391c0-5.704 3.748-9.57 9-10.609l.996 2.151c-2.433.917-3.996 3.638-3.996 5.849h3.983v10h-9.983z" />
        </svg>
      </div>

      {/* Quote Text - Flex-grow to fill space */}
      <div className="relative z-10 flex-1 pr-8 flex items-start">
        <div className="flex items-start">
          <span className="text-gray-800 dark:text-gray-200 leading-relaxed text-base md:text-lg font-medium line-clamp-4">
            {quote}
          </span>
        </div>
      </div>

      {/* Author Info - Fixed at bottom */}
      <div className="flex items-center gap-4 pt-3 border-t border-gray-100 dark:border-gray-800 mt-2">
        <div className={`w-14 h-14 rounded-full ${getAvatarColor(avatar)} flex items-center justify-center text-white font-bold text-lg shadow-md flex-shrink-0`}>
          {avatar}
        </div>
        <div>
          <div className="font-bold text-gray-900 dark:text-white text-lg">{author}</div>
          <div className="text-sm text-gray-500 dark:text-gray-400 font-medium">{role}</div>
        </div>
      </div>

      {/* Decorative gradient overlay on hover */}
      <div className="absolute inset-0 rounded-2xl bg-gradient-to-br from-blue-500/0 to-purple-500/0 group-hover:from-blue-500/5 group-hover:to-purple-500/5 dark:group-hover:from-blue-500/10 dark:group-hover:to-purple-500/10 transition-all duration-300 pointer-events-none"></div>
    </div>
  );
}
