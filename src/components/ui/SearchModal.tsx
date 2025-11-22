import { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { useApp } from '../../contexts/AppContext';
import { Project, Task, User } from '../../types';
import { Search, X, FileText, FolderOpen, ArrowRight } from 'lucide-react';
import { cn } from '../../lib/utils';

interface SearchModalProps {
  isOpen: boolean;
  onClose: () => void;
}

type SearchResult = {
  type: 'project' | 'task' | 'user';
  id: string;
  title: string;
  subtitle?: string;
  icon: React.ReactNode;
  url: string;
  data: Project | Task | User;
};

const SearchModal: React.FC<SearchModalProps> = ({ isOpen, onClose }) => {
  const navigate = useNavigate();
  const { projects, tasks } = useApp();
  const [query, setQuery] = useState('');
  const [selectedIndex, setSelectedIndex] = useState(0);
  const [recentSearches, setRecentSearches] = useState<string[]>([]);
  const inputRef = useRef<HTMLInputElement>(null);

  // ESC 키로 모달 닫기
  useEffect(() => {
    const handleEsc = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        onClose();
      }
    };

    if (isOpen) {
      document.addEventListener('keydown', handleEsc);
      inputRef.current?.focus();
    }

    return () => {
      document.removeEventListener('keydown', handleEsc);
    };
  }, [isOpen, onClose]);

  // 검색 결과 필터링
  const searchResults: SearchResult[] = [];

  if (query.length >= 2) {
    const lowerQuery = query.toLowerCase();

    // 프로젝트 검색
    projects
      .filter(
        (p) =>
          p.name.toLowerCase().includes(lowerQuery) ||
          p.description.toLowerCase().includes(lowerQuery)
      )
      .forEach((project) => {
        searchResults.push({
          type: 'project',
          id: project.id,
          title: project.name,
          subtitle: project.description,
          icon: <FolderOpen className="h-5 w-5 text-[color:var(--primary)]" />,
          url: `/projects/${project.id}`,
          data: project,
        });
      });

    // Task 검색
    tasks
      .filter(
        (t) =>
          t.title.toLowerCase().includes(lowerQuery) ||
          t.description?.toLowerCase().includes(lowerQuery) ||
          t.labels.some((l) => l.toLowerCase().includes(lowerQuery))
      )
      .forEach((task) => {
        const project = projects.find((p) => p.id === task.projectId);
        searchResults.push({
          type: 'task',
          id: task.id,
          title: task.title,
          subtitle: project?.name,
          icon: <FileText className="h-5 w-5 text-[color:var(--success)]" />,
          url: `/tasks/${task.id}`,
          data: task,
        });
      });
  }

  // 키보드 네비게이션
  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'ArrowDown') {
      e.preventDefault();
      setSelectedIndex((prev) => (prev + 1) % searchResults.length);
    } else if (e.key === 'ArrowUp') {
      e.preventDefault();
      setSelectedIndex((prev) => (prev - 1 + searchResults.length) % searchResults.length);
    } else if (e.key === 'Enter' && searchResults[selectedIndex]) {
      handleSelect(searchResults[selectedIndex]);
    }
  };

  const handleSelect = (result: SearchResult) => {
    // 최근 검색어 저장
    if (!recentSearches.includes(query)) {
      setRecentSearches([query, ...recentSearches.slice(0, 4)]);
    }

    navigate(result.url);
    onClose();
    setQuery('');
  };

  const highlightMatch = (text: string, query: string) => {
    if (!query) return text;

    const parts = text.split(new RegExp(`(${query})`, 'gi'));
    return parts.map((part, index) =>
      part.toLowerCase() === query.toLowerCase() ? (
        <mark
          key={index}
          className="rounded-[4px] bg-[color:var(--primary-soft)] px-0.5 text-[color:var(--primary-strong)] dark:bg-[color:var(--primary-soft)]/25"
        >
          {part}
        </mark>
      ) : (
        part
      )
    );
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-start justify-center px-4 pt-24 sm:pt-28">
      {/* 배경 오버레이 */}
      <div
        className="fixed inset-0 bg-slate-950/65 backdrop-blur-lg transition-opacity"
        onClick={onClose}
      />

      {/* 검색 모달 */}
      <div className="relative w-full max-w-2xl overflow-hidden rounded-[var(--radius-lg)] border border-[color:var(--border)] bg-[color:var(--surface)] shadow-[var(--shadow-hard)] backdrop-blur-[18px]">
        {/* 검색 입력 */}
        <div className="flex items-center gap-3 border-b border-[color:var(--divider)] bg-[color:var(--surface-subtle)] px-5 py-4">
          <Search className="h-5 w-5 text-[color:var(--muted-foreground)]" />
          <input
            ref={inputRef}
            type="text"
            value={query}
            onChange={(e) => {
              setQuery(e.target.value);
              setSelectedIndex(0);
            }}
            onKeyDown={handleKeyDown}
            className="flex-1 bg-transparent text-lg text-[color:var(--foreground)] placeholder:text-[color:var(--muted-foreground)] outline-none"
            placeholder="프로젝트, Task, 팀원을 검색하세요… (Cmd+K)"
            aria-label="검색어 입력"
          />
          <button
            onClick={onClose}
            className="rounded-full p-2 text-[color:var(--muted-foreground)] transition-colors hover:bg-[color:var(--accent)] hover:text-[color:var(--foreground)]"
            aria-label="검색 닫기"
          >
            <X className="h-4 w-4" />
          </button>
        </div>

        {/* 검색 결과 */}
        <div className="max-h-96 overflow-y-auto">
          {query.length < 2 ? (
            <div className="px-8 py-10 text-center">
              <Search className="mx-auto mb-4 h-12 w-12 text-[color:var(--accent-foreground)]/35" />
              <p className="text-[color:var(--muted-foreground)]">
                최소 2글자 이상 입력하면 실시간으로 결과가 나타납니다.
              </p>

              {/* 최근 검색어 */}
              {recentSearches.length > 0 && (
                <div className="mt-6 text-left">
                  <p className="mb-2 text-sm font-medium text-[color:var(--subtle-foreground)]">
                    최근 검색어
                  </p>
                  <div className="flex flex-wrap gap-2">
                    {recentSearches.map((search, index) => (
                      <button
                        key={index}
                        onClick={() => setQuery(search)}
                        className="rounded-full bg-[color:var(--accent)] px-3 py-1 text-sm text-[color:var(--accent-foreground)] transition-colors hover:bg-[color:var(--background-muted)]"
                      >
                        {search}
                      </button>
                    ))}
                  </div>
                </div>
              )}
            </div>
          ) : searchResults.length === 0 ? (
            <div className="px-8 py-10 text-center">
              <FileText className="mx-auto mb-4 h-12 w-12 text-[color:var(--accent-foreground)]/35" />
              <p className="text-[color:var(--muted-foreground)]">
                ‘{query}’에 대한 결과가 없습니다. 다른 키워드를 시도해 보세요.
              </p>
            </div>
          ) : (
            <div className="py-3">
              {/* 섹션별 그룹화 */}
              {['project', 'task', 'user'].map((type) => {
                const typeResults = searchResults.filter((r) => r.type === type);
                if (typeResults.length === 0) return null;

                return (
                  <div key={type} className="mb-4">
                    <div className="px-5 pb-2 text-xs font-semibold uppercase tracking-wider text-[color:var(--muted-foreground)]">
                      {type === 'project' ? '프로젝트' : type === 'task' ? 'Task' : '사용자'}
                    </div>
                    {typeResults.map((result, _index) => {
                      const globalIndex = searchResults.indexOf(result);
                      const isSelected = globalIndex === selectedIndex;

                      return (
                        <button
                          key={result.id}
                          onClick={() => handleSelect(result)}
                          onMouseEnter={() => setSelectedIndex(globalIndex)}
                          className={cn(
                            'flex w-full items-center gap-3 px-5 py-3 text-left transition-colors',
                            isSelected
                              ? 'bg-[color:var(--accent)] text-[color:var(--foreground)]'
                              : 'hover:bg-[color:var(--background-muted)]'
                          )}
                        >
                          <div className="flex-shrink-0">{result.icon}</div>
                          <div className="min-w-0 flex-1">
                            <p className="truncate font-semibold text-[color:var(--foreground)]">
                              {highlightMatch(result.title, query)}
                            </p>
                            {result.subtitle && (
                              <p className="truncate text-sm text-[color:var(--muted-foreground)]">
                                {result.subtitle}
                              </p>
                            )}
                          </div>
                          <ArrowRight className="h-4 w-4 flex-shrink-0 text-[color:var(--muted-foreground)]" />
                        </button>
                      );
                    })}
                  </div>
                );
              })}
            </div>
          )}
        </div>

        {/* 푸터 (단축키 안내) */}
        <div className="flex items-center gap-4 border-t border-[color:var(--divider)] bg-[color:var(--surface-subtle)] px-5 py-3 text-xs text-[color:var(--muted-foreground)]">
          <div className="flex items-center gap-1">
            <kbd className="rounded border border-[color:var(--border)] bg-[color:var(--surface)] px-2 py-1 text-[color:var(--foreground)] shadow-sm">
              ↑↓
            </kbd>
            <span>이동</span>
          </div>
          <div className="flex items-center gap-1">
            <kbd className="rounded border border-[color:var(--border)] bg-[color:var(--surface)] px-2 py-1 text-[color:var(--foreground)] shadow-sm">
              Enter
            </kbd>
            <span>선택</span>
          </div>
          <div className="flex items-center gap-1">
            <kbd className="rounded border border-[color:var(--border)] bg-[color:var(--surface)] px-2 py-1 text-[color:var(--foreground)] shadow-sm">
              Esc
            </kbd>
            <span>닫기</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SearchModal;
