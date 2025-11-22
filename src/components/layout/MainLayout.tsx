import { useState, useEffect } from 'react';
import { Outlet } from 'react-router-dom';
import Header from './Header';
import SearchModal from '../ui/SearchModal';

export default function MainLayout() {
  const [isSearchOpen, setIsSearchOpen] = useState(false);

  // Cmd+K / Ctrl+K 단축키로 검색 모달 열기
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key === 'k') {
        e.preventDefault();
        setIsSearchOpen(true);
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => {
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, []);

  return (
    <div className="relative flex min-h-screen flex-col bg-[color:var(--background)] text-[color:var(--foreground)]">
      <Header onSearchClick={() => setIsSearchOpen(true)} />
      <main className="relative flex-1">
        <div
          aria-hidden="true"
          className="pointer-events-none absolute inset-0 -z-10 overflow-hidden"
        >
          <div className="absolute -top-48 left-1/2 h-[420px] w-[620px] -translate-x-1/2 rounded-[50%] bg-[image:var(--gradient-primary)] opacity-50 blur-3xl" />
          <div className="absolute bottom-0 left-1/4 h-[360px] w-[480px] rounded-[50%] bg-[image:var(--gradient-accent)] opacity-40 blur-[160px]" />
        </div>
        <div className="relative pb-14">
          <Outlet />
        </div>
      </main>
      <SearchModal isOpen={isSearchOpen} onClose={() => setIsSearchOpen(false)} />
    </div>
  );
}
