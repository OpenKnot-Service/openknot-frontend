import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Bell, User, Search, Menu, X } from 'lucide-react';
import { useApp } from '../../contexts/AppContext';
import NotificationCenter from './NotificationCenter';
import ThemeToggle from '../ui/ThemeToggle';

interface HeaderProps {
  onSearchClick?: () => void;
}

export default function Header({ onSearchClick }: HeaderProps) {
  const navigate = useNavigate();
  const { user, unreadNotificationsCount, isNotificationCenterOpen, setIsNotificationCenterOpen } = useApp();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  return (
    <>
      <header className="sticky top-0 z-40 border-b border-[color:var(--border)] bg-white/75 dark:bg-gray-950/65 supports-[backdrop-filter]:bg-white/55 supports-[backdrop-filter]:dark:bg-gray-950/45 backdrop-blur-md backdrop-saturate-150 transition-colors duration-200">
        <div className="mx-auto w-full max-w-7xl px-4">
          <div className="flex h-14 items-center justify-between md:h-16">
            {/* Logo */}
            <Link to="/" className="flex items-center gap-2">
              <div className="w-7 h-7 md:w-8 md:h-8 bg-gray-900 dark:bg-white rounded-lg flex items-center justify-center">
                <span className="text-white dark:text-gray-900 font-bold text-base md:text-lg">O</span>
              </div>
              <span className="text-lg font-semibold text-[color:var(--foreground)] md:text-xl">OpenKnot</span>
            </Link>

            {/* Desktop Navigation */}
            <nav className="hidden items-center gap-6 md:flex">
              {user ? (
                <>
                  <Link
                    to="/dashboard"
                    className="text-[color:var(--subtle-foreground)] transition-colors hover:text-[color:var(--foreground)]"
                  >
                    대시보드
                  </Link>
                  <Link
                    to="/projects"
                    className="text-[color:var(--subtle-foreground)] transition-colors hover:text-[color:var(--foreground)]"
                  >
                    프로젝트
                  </Link>
                  <Link
                    to="/explore"
                    className="text-[color:var(--subtle-foreground)] transition-colors hover:text-[color:var(--foreground)]"
                  >
                    둘러보기
                  </Link>
                </>
              ) : (
                <>
                  <Link
                    to="/explore"
                    className="text-[color:var(--subtle-foreground)] transition-colors hover:text-[color:var(--foreground)]"
                  >
                    둘러보기
                  </Link>
                  <Link
                    to="/features"
                    className="text-[color:var(--subtle-foreground)] transition-colors hover:text-[color:var(--foreground)]"
                  >
                    기능
                  </Link>
                  <Link
                    to="/pricing"
                    className="text-[color:var(--subtle-foreground)] transition-colors hover:text-[color:var(--foreground)]"
                  >
                    가격
                  </Link>
                </>
              )}
            </nav>

            {/* Right Section */}
            <div className="flex items-center gap-1 md:gap-2">
              {user ? (
                <>
                  <button
                    onClick={onSearchClick}
                    className="hidden rounded-full p-2 text-[color:var(--subtle-foreground)] transition-colors hover:bg-[color:var(--accent)] hover:text-[color:var(--foreground)] sm:flex"
                    title="검색 (Cmd+K)"
                  >
                    <Search className="w-5 h-5" />
                  </button>
                  <button
                    onClick={() => setIsNotificationCenterOpen(true)}
                    className="relative rounded-full p-2 text-[color:var(--subtle-foreground)] transition-colors hover:bg-[color:var(--accent)] hover:text-[color:var(--foreground)]"
                  >
                    <Bell className="w-5 h-5" />
                    {unreadNotificationsCount > 0 && (
                      <span className="absolute right-1.5 top-1.5 flex h-3.5 min-w-[14px] items-center justify-center rounded-full bg-[color:var(--danger)] px-1 text-[9px] font-semibold text-[color:var(--danger-foreground)] shadow-sm">
                        {unreadNotificationsCount > 9 ? '9+' : unreadNotificationsCount}
                      </span>
                    )}
                  </button>
                  <ThemeToggle />
                  <button
                    onClick={() => navigate('/profile')}
                    className="hidden rounded-full p-2 text-[color:var(--subtle-foreground)] transition-colors hover:bg-[color:var(--accent)] hover:text-[color:var(--foreground)] sm:flex"
                    title="프로필"
                  >
                    <User className="w-5 h-5" />
                  </button>
                </>
              ) : (
                <>
                  <ThemeToggle />
                  <Link
                    to="/login"
                    className="hidden rounded-lg px-4 py-2 text-sm font-medium text-[color:var(--subtle-foreground)] transition-colors hover:text-[color:var(--foreground)] sm:flex"
                  >
                    로그인
                  </Link>
                  <Link
                    to="/register"
                    className="hidden rounded-lg bg-[color:var(--primary)] px-4 py-2 text-sm font-medium text-[color:var(--primary-foreground)] transition-colors hover:bg-[color:var(--primary)]/90 sm:flex"
                  >
                    회원가입
                  </Link>
                </>
              )}

              {/* Mobile Menu Button */}
              <button
                onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
                className="rounded-full p-2 text-[color:var(--subtle-foreground)] transition-colors hover:bg-[color:var(--accent)] hover:text-[color:var(--foreground)] md:hidden"
              >
                {isMobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
              </button>
            </div>
          </div>

          {/* Mobile Menu */}
          {isMobileMenuOpen && (
            <nav className="border-t border-[color:var(--border)] py-4 md:hidden">
              <div className="flex flex-col space-y-2.5">
                {user ? (
                  <>
                    <Link
                      to="/dashboard"
                      onClick={() => setIsMobileMenuOpen(false)}
                      className="rounded-lg px-3 py-2 text-[color:var(--subtle-foreground)] transition-colors hover:bg-[color:var(--accent)] hover:text-[color:var(--foreground)]"
                    >
                      대시보드
                    </Link>
                    <Link
                      to="/projects"
                      onClick={() => setIsMobileMenuOpen(false)}
                      className="rounded-lg px-3 py-2 text-[color:var(--subtle-foreground)] transition-colors hover:bg-[color:var(--accent)] hover:text-[color:var(--foreground)]"
                    >
                      프로젝트
                    </Link>
                    <Link
                      to="/explore"
                      onClick={() => setIsMobileMenuOpen(false)}
                      className="rounded-lg px-3 py-2 text-[color:var(--subtle-foreground)] transition-colors hover:bg-[color:var(--accent)] hover:text-[color:var(--foreground)]"
                    >
                      둘러보기
                    </Link>
                    <button
                      onClick={() => {
                        onSearchClick?.();
                        setIsMobileMenuOpen(false);
                      }}
                      className="sm:hidden rounded-lg px-3 py-2 text-left text-[color:var(--subtle-foreground)] transition-colors hover:bg-[color:var(--accent)] hover:text-[color:var(--foreground)]"
                    >
                      검색
                    </button>
                    <button
                      onClick={() => {
                        navigate('/profile');
                        setIsMobileMenuOpen(false);
                      }}
                      className="sm:hidden rounded-lg px-3 py-2 text-left text-[color:var(--subtle-foreground)] transition-colors hover:bg-[color:var(--accent)] hover:text-[color:var(--foreground)]"
                    >
                      프로필
                    </button>
                  </>
                ) : (
                  <>
                    <Link
                      to="/explore"
                      onClick={() => setIsMobileMenuOpen(false)}
                      className="rounded-lg px-3 py-2 text-[color:var(--subtle-foreground)] transition-colors hover:bg-[color:var(--accent)] hover:text-[color:var(--foreground)]"
                    >
                      둘러보기
                    </Link>
                    <Link
                      to="/features"
                      onClick={() => setIsMobileMenuOpen(false)}
                      className="rounded-lg px-3 py-2 text-[color:var(--subtle-foreground)] transition-colors hover:bg-[color:var(--accent)] hover:text-[color:var(--foreground)]"
                    >
                      기능
                    </Link>
                    <Link
                      to="/pricing"
                      onClick={() => setIsMobileMenuOpen(false)}
                      className="rounded-lg px-3 py-2 text-[color:var(--subtle-foreground)] transition-colors hover:bg-[color:var(--accent)] hover:text-[color:var(--foreground)]"
                    >
                      가격
                    </Link>
                    <Link
                      to="/login"
                      onClick={() => setIsMobileMenuOpen(false)}
                      className="rounded-lg px-3 py-2 text-[color:var(--subtle-foreground)] transition-colors hover:bg-[color:var(--accent)] hover:text-[color:var(--foreground)]"
                    >
                      로그인
                    </Link>
                    <Link
                      to="/register"
                      onClick={() => setIsMobileMenuOpen(false)}
                      className="rounded-lg bg-[color:var(--primary)] px-3 py-2 text-center text-[color:var(--primary-foreground)] transition-colors hover:bg-[color:var(--primary)]/90"
                    >
                      회원가입
                    </Link>
                  </>
                )}
              </div>
            </nav>
          )}
        </div>
      </header>

      <NotificationCenter
        isOpen={isNotificationCenterOpen}
        onClose={() => setIsNotificationCenterOpen(false)}
      />
    </>
  );
}
