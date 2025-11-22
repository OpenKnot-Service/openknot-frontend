import { useRef } from 'react';
import { AnimatedBeam } from '../magicui/animated-beam';
import { Circle } from '../magicui/circle';

export function IntegrationBeam() {
  const containerRef = useRef<HTMLDivElement>(null);
  const userRef = useRef<HTMLDivElement>(null);
  const winterCloudRef = useRef<HTMLDivElement>(null);
  const githubRef = useRef<HTMLDivElement>(null);
  const jiraRef = useRef<HTMLDivElement>(null);
  const linearRef = useRef<HTMLDivElement>(null);
  const slackRef = useRef<HTMLDivElement>(null);
  const notionRef = useRef<HTMLDivElement>(null);
  const vercelRef = useRef<HTMLDivElement>(null);
  const sentryRef = useRef<HTMLDivElement>(null);
  const googleCalendarRef = useRef<HTMLDivElement>(null);
  const postmanRef = useRef<HTMLDivElement>(null);
  const jenkinsRef = useRef<HTMLDivElement>(null);
  const googleDriveRef = useRef<HTMLDivElement>(null);

  return (
    <div
      ref={containerRef}
      className="relative flex h-[700px] md:h-[500px] w-full items-center justify-center overflow-hidden rounded-lg bg-gradient-to-b from-gray-50 to-white dark:from-gray-900 dark:to-gray-800 p-10"
    >
      <div className='flex size-full max-w-6xl flex-row items-stretch justify-between gap-10'>
        {/* Layer 1 */}
        <div className="flex flex-col justify-center">
          <Circle ref={userRef} className="size-16 border-gray-300 dark:border-gray-600">
            <img
              className='dark:brightness-0 dark:invert h-7 w-7'
              src='https://brandeps.com/icon-download/U/User-icon-vector-05.svg'
            />
          </Circle>
        </div>

        {/* Layer 2 */}
        <div className='flex flex-col justify-center'>
          <Circle ref={winterCloudRef} className="size-16 border-gray-300 dark:border-gray-600 p-2">
            <img
              src='https://media.lordicon.com/icons/wired/gradient/815-snow-flake.svg'
            />
          </Circle>
        </div>

        {/* Layer 3 */}
        <div className="flex flex-col justify-center gap-2">
          <Circle ref={githubRef} className="size-13 border-gray-300 dark:border-gray-600">
            <img
              className='dark:brightness-0 dark:invert'
              src='https://upload.wikimedia.org/wikipedia/commons/9/91/Octicons-mark-github.svg'
            />
          </Circle>
          <Circle ref={jiraRef} className="size-13 border-gray-300 dark:border-gray-600">
            <img
              className='mr-1'
              src='https://cdn.worldvectorlogo.com/logos/jira-1.svg'
            />
          </Circle>
          <Circle ref={linearRef} className="size-13 border-gray-300 dark:border-gray-600">
            <img
              className='dark:brightness-0 dark:invert'
              src='https://cdn.brandfetch.io/iduDa181eM/theme/dark/symbol.svg?c=1dxbfHSJFAPEGdCLU4o5B'
            />
          </Circle>
          <Circle ref={slackRef} className="size-13 border-gray-300 dark:border-gray-600">
            <img
              src='https://upload.wikimedia.org/wikipedia/commons/d/d5/Slack_icon_2019.svg'
            />
          </Circle>
          <Circle ref={jenkinsRef} className="size-13 border-gray-300 dark:border-gray-600">
            <img
              // className='h-6 w-6'
              src='https://upload.wikimedia.org/wikipedia/commons/thumb/e/e9/Jenkins_logo.svg/226px-Jenkins_logo.svg.png?20120629215426'
            />
          </Circle>
          <Circle ref={notionRef} className="size-13 border-gray-300 dark:border-gray-600">
            <img
              src='https://upload.wikimedia.org/wikipedia/commons/e/e9/Notion-logo.svg'
            />
          </Circle>
        </div>

        {/* Layer 4 */}
        <div className="flex flex-col justify-center gap-2 -ml-40">
          <Circle ref={vercelRef} className="size-13 border-gray-300 dark:border-gray-600">
            <img
              className='dark:brightness-0 dark:invert'
              src='https://www.svgrepo.com/show/354513/vercel-icon.svg'
            />
          </Circle>
          <Circle ref={sentryRef} className="size-13 border-gray-300 dark:border-gray-600">
            <img
              src='https://www.svgrepo.com/show/354332/sentry-icon.svg'
            />
          </Circle>
          <Circle ref={googleCalendarRef} className="size-13 border-gray-300 dark:border-gray-600">
            <img
              src='https://upload.wikimedia.org/wikipedia/commons/thumb/a/a5/Google_Calendar_icon_%282020%29.svg/512px-Google_Calendar_icon_%282020%29.svg.png?20221106121915'
            />
          </Circle>
          <Circle ref={postmanRef} className="size-13 border-gray-300 dark:border-gray-600">
            <img
              src='https://www.svgrepo.com/show/354202/postman-icon.svg'
            />
          </Circle>
          <Circle ref={googleDriveRef} className="size-13 border-gray-300 dark:border-gray-600">
            <img
              src='https://upload.wikimedia.org/wikipedia/commons/thumb/1/12/Google_Drive_icon_%282020%29.svg/512px-Google_Drive_icon_%282020%29.svg.png'
            />
          </Circle>
        </div>
      </div>

      {/* Animated Beams */}
      {/* Layer 1 */}
      <AnimatedBeam
        containerRef={containerRef}
        fromRef={winterCloudRef}
        toRef={userRef}
        duration={3}
        startYOffset={10}
        endYOffset={10}
      />

      {/* Layer 2-1 */}
      <AnimatedBeam
        containerRef={containerRef}
        fromRef={githubRef}
        toRef={winterCloudRef}
        duration={3}
      />
      <AnimatedBeam
        containerRef={containerRef}
        fromRef={jiraRef}
        toRef={winterCloudRef}
        duration={3}
      />
      <AnimatedBeam
        containerRef={containerRef}
        fromRef={linearRef}
        toRef={winterCloudRef}
        duration={3}
      />
      <AnimatedBeam
        containerRef={containerRef}
        fromRef={slackRef}
        toRef={winterCloudRef}
        duration={3}
      />
      <AnimatedBeam
        containerRef={containerRef}
        fromRef={jenkinsRef}
        toRef={winterCloudRef}
        duration={3}
      />
      <AnimatedBeam
        containerRef={containerRef}
        fromRef={notionRef}
        toRef={winterCloudRef}
        duration={3}
      />

      {/* Layer 2-2 */}
      <AnimatedBeam
        containerRef={containerRef}
        fromRef={vercelRef}
        toRef={winterCloudRef}
        duration={3}
        curvature={36}
      />
      <AnimatedBeam
        containerRef={containerRef}
        fromRef={sentryRef}
        toRef={winterCloudRef}
        duration={3}
        curvature={19}
      />
      <AnimatedBeam
        containerRef={containerRef}
        fromRef={googleCalendarRef}
        toRef={winterCloudRef}
        duration={3}
      />
      <AnimatedBeam
        containerRef={containerRef}
        fromRef={postmanRef}
        toRef={winterCloudRef}
        duration={3}
        curvature={-19}
      />
      <AnimatedBeam
        containerRef={containerRef}
        fromRef={googleDriveRef}
        toRef={winterCloudRef}
        duration={3}
        curvature={-36}
      />
    </div>
  );
}
