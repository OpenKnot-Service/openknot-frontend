import { useState, KeyboardEvent, useRef, useEffect } from 'react';
import { X } from 'lucide-react';

export interface TagInputProps {
  tags: string[];
  onChange?: (nextTags: string[]) => void;
  onTagsChange?: (nextTags: string[]) => void;
  placeholder?: string;
  maxTags?: number;
  suggestions?: string[];
  className?: string;
}

export default function TagInput({
  tags,
  onChange,
  onTagsChange,
  placeholder = '태그를 입력하세요',
  maxTags = 5,
  suggestions = [],
  className = '',
}: TagInputProps) {
  const [inputValue, setInputValue] = useState('');
  const [showSuggestions, setShowSuggestions] = useState(false);
  const [focusedSuggestionIndex, setFocusedSuggestionIndex] = useState(-1);
  const inputRef = useRef<HTMLInputElement>(null);
  const emitChange = (nextTags: string[]) => {
    if (onChange) {
      onChange(nextTags);
    } else if (onTagsChange) {
      onTagsChange(nextTags);
    }
  };

  // 입력값에 따라 필터링된 제안 목록
  const filteredSuggestions = suggestions.filter(
    (suggestion) =>
      !tags.includes(suggestion) &&
      suggestion.toLowerCase().includes(inputValue.toLowerCase())
  );

  useEffect(() => {
    setShowSuggestions(inputValue.length > 0 && filteredSuggestions.length > 0);
  }, [inputValue, filteredSuggestions.length]);

  const addTag = (tag: string) => {
    const trimmedTag = tag.trim();
    if (
      trimmedTag &&
      !tags.includes(trimmedTag) &&
      tags.length < maxTags
    ) {
      emitChange([...tags, trimmedTag]);
      setInputValue('');
      setShowSuggestions(false);
      setFocusedSuggestionIndex(-1);
    }
  };

  const removeTag = (indexToRemove: number) => {
    emitChange(tags.filter((_, index) => index !== indexToRemove));
  };

  const handleKeyDown = (e: KeyboardEvent<HTMLInputElement>) => {
    // Enter 또는 쉼표로 태그 추가
    if (e.key === 'Enter' || e.key === ',') {
      e.preventDefault();

      // 제안 목록에서 선택된 항목이 있으면 그것을 추가
      if (showSuggestions && focusedSuggestionIndex >= 0) {
        addTag(filteredSuggestions[focusedSuggestionIndex]);
      } else if (inputValue.trim()) {
        addTag(inputValue);
      }
    }
    // Backspace로 마지막 태그 삭제
    else if (e.key === 'Backspace' && !inputValue && tags.length > 0) {
      removeTag(tags.length - 1);
    }
    // 화살표 키로 제안 목록 탐색
    else if (e.key === 'ArrowDown' && showSuggestions) {
      e.preventDefault();
      setFocusedSuggestionIndex((prev) =>
        prev < filteredSuggestions.length - 1 ? prev + 1 : prev
      );
    } else if (e.key === 'ArrowUp' && showSuggestions) {
      e.preventDefault();
      setFocusedSuggestionIndex((prev) => (prev > 0 ? prev - 1 : -1));
    }
    // Escape로 제안 목록 닫기
    else if (e.key === 'Escape') {
      setShowSuggestions(false);
      setFocusedSuggestionIndex(-1);
    }
  };

  const handleInputChange = (value: string) => {
    // 쉼표가 입력되면 즉시 태그로 변환
    if (value.includes(',')) {
      const newTag = value.replace(',', '').trim();
      if (newTag) {
        addTag(newTag);
      }
    } else {
      setInputValue(value);
    }
  };

  return (
    <div className={`relative ${className}`}>
      <div
        className="flex flex-wrap gap-2 p-2 border border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-900 rounded-lg focus-within:ring-2 focus-within:ring-gray-900 dark:focus-within:ring-gray-500 min-h-[42px]"
        onClick={() => inputRef.current?.focus()}
      >
        {/* 태그 칩 */}
        {tags.map((tag, index) => (
          <span
            key={index}
            className="inline-flex items-center gap-1 px-2 py-1 bg-gray-100 dark:bg-gray-800 text-gray-800 dark:text-gray-200 rounded-md text-sm"
          >
            {tag}
            <button
              type="button"
              onClick={(e) => {
                e.stopPropagation();
                removeTag(index);
              }}
              className="hover:text-red-600 dark:hover:text-red-400 transition-colors"
            >
              <X className="w-3 h-3" />
            </button>
          </span>
        ))}

        {/* 입력 필드 */}
        {tags.length < maxTags && (
          <input
            ref={inputRef}
            type="text"
            value={inputValue}
            onChange={(e) => handleInputChange(e.target.value)}
            onKeyDown={handleKeyDown}
            placeholder={tags.length === 0 ? placeholder : ''}
            className="flex-1 min-w-[120px] outline-none bg-transparent text-gray-900 dark:text-white placeholder-gray-400 dark:placeholder-gray-500"
          />
        )}
      </div>

      {/* 태그 개수 제한 표시 */}
      {tags.length >= maxTags && (
        <p className="mt-1 text-xs text-orange-600 dark:text-orange-400">
          최대 {maxTags}개까지 추가할 수 있습니다
        </p>
      )}

      {/* 자동완성 제안 드롭다운 */}
      {showSuggestions && (
        <div className="absolute z-10 w-full mt-1 bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-700 rounded-lg shadow-lg max-h-48 overflow-y-auto">
          {filteredSuggestions.map((suggestion, index) => (
            <button
              key={suggestion}
              type="button"
              onClick={() => addTag(suggestion)}
              className={`w-full px-4 py-2 text-left text-sm transition-colors ${
                index === focusedSuggestionIndex
                  ? 'bg-gray-100 dark:bg-gray-700 text-gray-900 dark:text-white'
                  : 'text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700/50'
              }`}
            >
              {suggestion}
            </button>
          ))}
        </div>
      )}

      {/* 도움말 텍스트 */}
      <p className="mt-1 text-xs text-gray-500 dark:text-gray-400">
        Enter 또는 쉼표(,)로 구분하여 입력하세요
      </p>
    </div>
  );
}
