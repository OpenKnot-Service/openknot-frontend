import { useState, KeyboardEvent, useRef, useEffect } from 'react';
import { X } from 'lucide-react';
import { TechStackItem } from '../../types/wizard';

export interface TechStackInputProps {
  selectedTech: TechStackItem[];
  availableTech: TechStackItem[];
  onChange: (nextTech: TechStackItem[]) => void;
  placeholder?: string;
  maxItems?: number;
  className?: string;
}

export default function TechStackInput({
  selectedTech,
  availableTech,
  onChange,
  placeholder = '기술 스택을 검색하세요',
  maxItems = 10,
  className = '',
}: TechStackInputProps) {
  const [inputValue, setInputValue] = useState('');
  const [showSuggestions, setShowSuggestions] = useState(false);
  const [focusedIndex, setFocusedIndex] = useState(-1);
  const inputRef = useRef<HTMLInputElement>(null);

  // 입력값에 따라 필터링된 제안 목록
  const filteredSuggestions = availableTech.filter(
    (tech) =>
      !selectedTech.some(s => s.id === tech.id) &&
      (tech.name.toLowerCase().includes(inputValue.toLowerCase()) ||
       tech.category.toLowerCase().includes(inputValue.toLowerCase()))
  );

  // 인기도로 정렬
  const sortedSuggestions = [...filteredSuggestions].sort(
    (a, b) => (b.popularity || 0) - (a.popularity || 0)
  );

  useEffect(() => {
    setShowSuggestions(inputValue.length > 0 && sortedSuggestions.length > 0);
  }, [inputValue, sortedSuggestions.length]);

  const addTech = (tech: TechStackItem) => {
    if (selectedTech.length < maxItems) {
      onChange([...selectedTech, tech]);
      setInputValue('');
      setShowSuggestions(false);
      setFocusedIndex(-1);
    }
  };

  const removeTech = (techId: string) => {
    onChange(selectedTech.filter(t => t.id !== techId));
  };

  const handleKeyDown = (e: KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') {
      e.preventDefault();
      if (showSuggestions && focusedIndex >= 0) {
        addTech(sortedSuggestions[focusedIndex]);
      }
    } else if (e.key === 'Backspace' && !inputValue && selectedTech.length > 0) {
      removeTech(selectedTech[selectedTech.length - 1].id);
    } else if (e.key === 'ArrowDown' && showSuggestions) {
      e.preventDefault();
      setFocusedIndex(prev =>
        prev < sortedSuggestions.length - 1 ? prev + 1 : prev
      );
    } else if (e.key === 'ArrowUp' && showSuggestions) {
      e.preventDefault();
      setFocusedIndex(prev => prev > 0 ? prev - 1 : -1);
    } else if (e.key === 'Escape') {
      setShowSuggestions(false);
      setFocusedIndex(-1);
    }
  };

  // 카테고리 레이블
  const categoryLabels: Record<string, string> = {
    frontend: '프론트엔드',
    backend: '백엔드',
    database: '데이터베이스',
    devops: 'DevOps',
    mobile: '모바일',
    other: '기타',
  };

  return (
    <div className={`relative ${className}`}>
      <div
        className="flex flex-wrap gap-2 p-2 border border-gray-700 bg-gray-900 rounded-lg focus-within:ring-2 focus-within:ring-blue-500 min-h-[42px]"
        onClick={() => inputRef.current?.focus()}
      >
        {/* 선택된 기술 스택 칩 (아이콘 포함) */}
        {selectedTech.map((tech) => {
          const Icon = tech.icon;
          return (
            <span
              key={tech.id}
              className="inline-flex items-center gap-1.5 px-2.5 py-1.5 bg-blue-500/20 text-blue-300 rounded-md text-sm border border-blue-500/30"
            >
              {Icon && <Icon className="w-3.5 h-3.5" />}
              {tech.name}
              <button
                type="button"
                onClick={(e) => {
                  e.stopPropagation();
                  removeTech(tech.id);
                }}
                className="hover:text-red-400 transition-colors ml-0.5"
              >
                <X className="w-3 h-3" />
              </button>
            </span>
          );
        })}

        {/* 입력 필드 */}
        {selectedTech.length < maxItems && (
          <input
            ref={inputRef}
            type="text"
            value={inputValue}
            onChange={(e) => setInputValue(e.target.value)}
            onKeyDown={handleKeyDown}
            placeholder={selectedTech.length === 0 ? placeholder : ''}
            className="flex-1 min-w-[150px] outline-none bg-transparent text-white placeholder-gray-500"
          />
        )}
      </div>

      {/* 제한 메시지 */}
      {selectedTech.length >= maxItems && (
        <p className="mt-1 text-xs text-orange-400">
          최대 {maxItems}개까지 선택할 수 있습니다
        </p>
      )}

      {/* 자동완성 드롭다운 */}
      {showSuggestions && (
        <div className="absolute z-50 w-full mt-1 bg-gray-800 border border-gray-700 rounded-lg shadow-xl max-h-64 overflow-y-auto">
          {sortedSuggestions.map((tech, index) => {
            const Icon = tech.icon;
            const isFocused = index === focusedIndex;

            return (
              <button
                key={tech.id}
                type="button"
                onClick={() => addTech(tech)}
                onMouseEnter={() => setFocusedIndex(index)}
                className={`w-full px-4 py-2.5 text-left transition-colors flex items-center gap-3 ${
                  isFocused
                    ? 'bg-blue-500/20 text-white'
                    : 'text-gray-300 hover:bg-gray-700/50'
                }`}
              >
                {/* 아이콘 */}
                <div className="flex-shrink-0 w-5 h-5 flex items-center justify-center">
                  {Icon ? (
                    <Icon className="w-5 h-5" />
                  ) : (
                    <div className="w-4 h-4 rounded bg-gray-600" />
                  )}
                </div>

                {/* 기술 이름 및 메타정보 */}
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2">
                    <span className="font-medium">{tech.name}</span>
                    {tech.popularity && tech.popularity >= 85 && (
                      <span className="text-xs px-1.5 py-0.5 bg-yellow-500/20 text-yellow-300 rounded">
                        인기
                      </span>
                    )}
                  </div>
                  <div className="text-xs text-gray-400">
                    {categoryLabels[tech.category]}
                  </div>
                </div>
              </button>
            );
          })}
        </div>
      )}

      {/* 도움말 */}
      <p className="mt-1 text-xs text-gray-400">
        기술 이름을 입력하고 Enter로 선택하세요
      </p>
    </div>
  );
}
