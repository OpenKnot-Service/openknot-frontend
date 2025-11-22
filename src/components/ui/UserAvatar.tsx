interface UserAvatarProps {
  name: string;
  size?: 'sm' | 'md' | 'lg' | 'xl';
  className?: string;
}

export default function UserAvatar({ name, size = 'md', className = '' }: UserAvatarProps) {
  // 이름에서 이니셜 추출 (예: "김철수" -> "김", "John Doe" -> "JD")
  const getInitials = (name: string) => {
    const parts = name.trim().split(' ');
    if (parts.length === 1) {
      return parts[0].charAt(0).toUpperCase();
    }
    return (parts[0].charAt(0) + parts[parts.length - 1].charAt(0)).toUpperCase();
  };

  // 이름을 기반으로 일관된 색상 생성
  const getColorFromName = (name: string) => {
    let hash = 0;
    for (let i = 0; i < name.length; i++) {
      hash = name.charCodeAt(i) + ((hash << 5) - hash);
    }

    const colors = [
      'bg-blue-500',
      'bg-green-500',
      'bg-yellow-500',
      'bg-red-500',
      'bg-purple-500',
      'bg-pink-500',
      'bg-indigo-500',
      'bg-teal-500',
    ];

    return colors[Math.abs(hash) % colors.length];
  };

  const sizeClasses: Record<NonNullable<UserAvatarProps['size']>, string> = {
    sm: 'w-6 h-6 text-xs',
    md: 'w-8 h-8 text-sm',
    lg: 'w-10 h-10 text-base',
    xl: 'w-12 h-12 text-lg',
  };

  return (
    <div
      className={`${sizeClasses[size]} ${getColorFromName(name)} ${className} rounded-full flex items-center justify-center text-white font-semibold`}
    >
      {getInitials(name)}
    </div>
  );
}
