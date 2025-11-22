import { useState, useEffect } from 'react';
import { X, Download } from 'lucide-react';
import Button from './Button';
import Card from './Card';

interface BeforeInstallPromptEvent extends Event {
  readonly platforms: string[];
  readonly userChoice: Promise<{
    outcome: 'accepted' | 'dismissed';
    platform: string;
  }>;
  prompt(): Promise<void>;
}

const PWAInstallPrompt = () => {
  const [deferredPrompt, setDeferredPrompt] = useState<BeforeInstallPromptEvent | null>(null);
  const [showPrompt, setShowPrompt] = useState(false);

  useEffect(() => {
    const handler = (e: Event) => {
      e.preventDefault();
      setDeferredPrompt(e as BeforeInstallPromptEvent);

      // 사용자가 이전에 설치 프롬프트를 닫은 경우 다시 표시하지 않음
      const dismissed = localStorage.getItem('pwa-install-dismissed');
      if (!dismissed) {
        setShowPrompt(true);
      }
    };

    window.addEventListener('beforeinstallprompt', handler);

    // iOS Safari 감지
    const isIos = () => {
      const userAgent = window.navigator.userAgent.toLowerCase();
      return /iphone|ipad|ipod/.test(userAgent);
    };

    const isInStandaloneMode = () =>
      ('standalone' in window.navigator && (window.navigator as any).standalone) ||
      window.matchMedia('(display-mode: standalone)').matches;

    // iOS이고 standalone 모드가 아닌 경우 프롬프트 표시
    if (isIos() && !isInStandaloneMode()) {
      const dismissed = localStorage.getItem('pwa-install-dismissed-ios');
      if (!dismissed) {
        setShowPrompt(true);
      }
    }

    return () => {
      window.removeEventListener('beforeinstallprompt', handler);
    };
  }, []);

  const handleInstall = async () => {
    if (!deferredPrompt) {
      return;
    }

    deferredPrompt.prompt();
    const { outcome } = await deferredPrompt.userChoice;

    if (outcome === 'accepted') {
      console.log('User accepted the install prompt');
    } else {
      console.log('User dismissed the install prompt');
    }

    setDeferredPrompt(null);
    setShowPrompt(false);
  };

  const handleDismiss = () => {
    setShowPrompt(false);
    localStorage.setItem('pwa-install-dismissed', 'true');
    localStorage.setItem('pwa-install-dismissed-ios', 'true');
  };

  if (!showPrompt) {
    return null;
  }

  // iOS Safari용 안내
  const isIos = /iphone|ipad|ipod/.test(window.navigator.userAgent.toLowerCase());

  return (
    <div className="fixed bottom-4 left-4 right-4 md:left-auto md:right-4 md:max-w-md z-50 animate-slide-up">
      <Card className="p-4 shadow-2xl border-2 border-blue-500 dark:border-blue-400">
        <div className="flex items-start gap-3">
          <div className="flex-shrink-0 p-2 bg-blue-100 dark:bg-blue-900/30 rounded-lg">
            <Download className="w-6 h-6 text-blue-600 dark:text-blue-400" />
          </div>

          <div className="flex-1 min-w-0">
            <h3 className="font-semibold text-gray-900 dark:text-white mb-1">
              앱 설치하기
            </h3>

            {isIos ? (
              <div className="text-sm text-gray-600 dark:text-gray-400 space-y-2">
                <p>OpenKnot을 홈 화면에 추가하세요:</p>
                <ol className="list-decimal list-inside space-y-1 text-xs">
                  <li>Safari 하단의 공유 버튼 탭</li>
                  <li>"홈 화면에 추가" 선택</li>
                  <li>"추가" 버튼 탭</li>
                </ol>
              </div>
            ) : (
              <p className="text-sm text-gray-600 dark:text-gray-400">
                OpenKnot을 앱처럼 설치하고 오프라인에서도 사용하세요!
              </p>
            )}

            <div className="flex items-center gap-2 mt-3">
              {!isIos && deferredPrompt && (
                <Button
                  onClick={handleInstall}
                  size="sm"
                  variant="primary"
                  className="text-sm"
                >
                  <Download className="w-4 h-4 mr-1" />
                  설치
                </Button>
              )}
              <Button
                onClick={handleDismiss}
                size="sm"
                variant="ghost"
                className="text-sm"
              >
                나중에
              </Button>
            </div>
          </div>

          <button
            onClick={handleDismiss}
            className="flex-shrink-0 text-gray-400 dark:text-gray-500 hover:text-gray-600 dark:hover:text-gray-300 transition-colors"
            aria-label="닫기"
          >
            <X className="w-5 h-5" />
          </button>
        </div>
      </Card>
    </div>
  );
};

export default PWAInstallPrompt;
