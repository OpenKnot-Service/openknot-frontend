import { OrbitingCircles } from '../ui/orbiting-circles';
import { Network } from 'lucide-react';

export function IntegrationCircles() {
  return (
    <div className='relative flex h-[500px] w-full flex-col items-center justify-center overflow-hidden rounded-lg bg-gradient-to-b from-gray-50 to-white dark:from-gray-900 dark:to-gray-800 p-10'>
      {/* 중앙에서 빛나는 효과 */}
      <div className='absolute inset-0 flex items-center justify-center'>
        <div className='absolute h-64 w-64 rounded-full bg-blue-500/10 dark:bg-blue-400/10 blur-3xl animate-pulse' />
        <div className='absolute h-48 w-48 rounded-full bg-purple-500/10 dark:bg-purple-400/10 blur-2xl animate-pulse' style={{ animationDelay: '1s' }} />
      </div>

      {/* 연결선 효과 */}
      <svg className='absolute inset-0 w-full h-full pointer-events-none'>
        <defs>
          <linearGradient id='lineGradient' x1='0%' y1='0%' x2='100%' y2='0%'>
            <stop offset='0%' stopColor='rgb(59, 130, 246)' stopOpacity='0' />
            <stop offset='50%' stopColor='rgb(59, 130, 246)' stopOpacity='0.7' />
            <stop offset='100%' stopColor='rgb(59, 130, 246)' stopOpacity='0' />
          </linearGradient>
          <linearGradient id='lineGradientDark' x1='0%' y1='0%' x2='100%' y2='0%'>
            <stop offset='0%' stopColor='rgb(147, 197, 253)' stopOpacity='0' />
            <stop offset='50%' stopColor='rgb(147, 197, 253)' stopOpacity='0.6' />
            <stop offset='100%' stopColor='rgb(147, 197, 253)' stopOpacity='0' />
          </linearGradient>
        </defs>
        {/* 9개의 서비스를 위한 연결선 */}
        {[...Array(9)].map((_, i) => {
          const angle = (360 / 9) * i;
          const radian = (angle * Math.PI) / 180;
          const radius = 160;
          const x = 50 + Math.cos(radian) * radius;
          const y = 50 + Math.sin(radian) * radius;
          return (
            <line
              key={i}
              x1='50%'
              y1='50%'
              x2={`${x}%`}
              y2={`${y}%`}
              stroke='url(#lineGradient)'
              strokeWidth='2'
              className='dark:hidden animate-pulse'
              style={{ animationDelay: `${i * 0.2}s` }}
            />
          );
        })}
        {/* 다크모드용 연결선 */}
        {[...Array(9)].map((_, i) => {
          const angle = (360 / 9) * i;
          const radian = (angle * Math.PI) / 180;
          const radius = 160;
          const x = 50 + Math.cos(radian) * radius;
          const y = 50 + Math.sin(radian) * radius;
          return (
            <line
              key={`dark-${i}`}
              x1='50%'
              y1='50%'
              x2={`${x}%`}
              y2={`${y}%`}
              stroke='url(#lineGradientDark)'
              strokeWidth='2'
              className='hidden dark:block animate-pulse'
              style={{ animationDelay: `${i * 0.2}s` }}
            />
          );
        })}
      </svg>

      {/* 중앙 OpenKnot 아이콘 */}
      <div className='relative z-10 flex items-center justify-center'>
        <div className='absolute h-32 w-32 rounded-full bg-gradient-to-br from-blue-500 to-purple-600 dark:from-blue-400 dark:to-purple-500 opacity-20 blur-xl animate-pulse' />
        <div className='relative flex h-24 w-24 items-center justify-center rounded-full bg-gradient-to-br from-blue-500 to-purple-600 dark:from-blue-400 dark:to-purple-500 shadow-xl'>
          <Network className='h-12 w-12 text-white' strokeWidth={2} />
        </div>
      </div>

      {/* 궤도를 도는 서비스 아이콘들 */}
      <OrbitingCircles iconSize={60}>
        <div className='flex items-center justify-center rounded-full bg-white dark:bg-gray-800 p-3 shadow-lg ring-1 ring-black/5 dark:ring-white/10 hover:scale-110 transition-transform'>
          <img
            className='h-8 w-8 dark:brightness-0 dark:invert'
            src='https://upload.wikimedia.org/wikipedia/commons/9/91/Octicons-mark-github.svg'
            alt='GitHub'
          />
        </div>
        <div className='flex items-center justify-center rounded-full bg-white dark:bg-gray-800 p-3 shadow-lg ring-1 ring-black/5 dark:ring-white/10 hover:scale-110 transition-transform'>
          <img
            className='h-8 w-8'
            src='https://cdn.worldvectorlogo.com/logos/jira-1.svg'
            alt='Jira'
          />
        </div>
        <div className='flex items-center justify-center rounded-full bg-white dark:bg-gray-800 p-3 shadow-lg ring-1 ring-black/5 dark:ring-white/10 hover:scale-110 transition-transform'>
          <img
            className='h-8 w-8'
            src='https://upload.wikimedia.org/wikipedia/commons/d/d5/Slack_icon_2019.svg'
            alt='Slack'
          />
        </div>
        <div className='flex items-center justify-center rounded-full bg-white dark:bg-gray-800 p-3 shadow-lg ring-1 ring-black/5 dark:ring-white/10 hover:scale-110 transition-transform'>
          <img
            className='h-8 w-8'
            src='https://upload.wikimedia.org/wikipedia/commons/e/e9/Notion-logo.svg'
            alt='Notion'
          />
        </div>
        <div className='flex items-center justify-center rounded-full bg-white dark:bg-gray-800 p-3 shadow-lg ring-1 ring-black/5 dark:ring-white/10 hover:scale-110 transition-transform'>
          <img
            className='h-8 w-8'
            src='https://www.svgrepo.com/show/354332/sentry-icon.svg'
            alt='Sentry'
          />
        </div>
        <div className='flex items-center justify-center rounded-full bg-white dark:bg-gray-800 p-3 shadow-lg ring-1 ring-black/5 dark:ring-white/10 hover:scale-110 transition-transform'>
          <img
            className='h-8 w-8'
            src='https://upload.wikimedia.org/wikipedia/commons/thumb/a/a5/Google_Calendar_icon_%282020%29.svg/512px-Google_Calendar_icon_%282020%29.svg.png?20221106121915'
            alt='Google Calendar'
          />
        </div>
        <div className='flex items-center justify-center rounded-full bg-white dark:bg-gray-800 p-3 shadow-lg ring-1 ring-black/5 dark:ring-white/10 hover:scale-110 transition-transform'>
          <img
            className='h-8 w-8'
            src='https://www.svgrepo.com/show/354202/postman-icon.svg'
            alt='Postman'
          />
        </div>
        <div className='flex items-center justify-center rounded-full bg-white dark:bg-gray-800 p-3 shadow-lg ring-1 ring-black/5 dark:ring-white/10 hover:scale-110 transition-transform'>
          <img
            className='h-8 w-8'
            src='https://upload.wikimedia.org/wikipedia/commons/thumb/e/e9/Jenkins_logo.svg/226px-Jenkins_logo.svg.png?20120629215426'
            alt='Jenkins'
          />
        </div>
        <div className='flex items-center justify-center rounded-full bg-white dark:bg-gray-800 p-3 shadow-lg ring-1 ring-black/5 dark:ring-white/10 hover:scale-110 transition-transform'>
          <img
            className='h-8 w-8'
            src='https://upload.wikimedia.org/wikipedia/commons/thumb/1/12/Google_Drive_icon_%282020%29.svg/512px-Google_Drive_icon_%282020%29.svg.png'
            alt='Google Drive'
          />
        </div>
      </OrbitingCircles>
    </div>
  );
}
