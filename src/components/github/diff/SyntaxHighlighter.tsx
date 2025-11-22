import { useEffect, useState } from 'react';
import { Highlight, themes, type Language } from 'prism-react-renderer';

interface SyntaxHighlighterProps {
  code: string;
  language?: string;
  fileName?: string;
  showLineNumbers?: boolean;
  highlightLines?: number[];
  startLineNumber?: number;
  onLineClick?: (lineNumber: number) => void;
}

// 파일 확장자에서 언어 감지
function getLanguageFromFileName(fileName?: string): Language {
  if (!fileName) return 'text';

  const ext = fileName.split('.').pop()?.toLowerCase();

  const languageMap: Record<string, Language> = {
    'ts': 'typescript',
    'tsx': 'tsx',
    'js': 'javascript',
    'jsx': 'jsx',
    'py': 'python',
    'java': 'java',
    'go': 'go',
    'rs': 'rust',
    'html': 'markup',
    'xml': 'markup',
    'css': 'css',
    'scss': 'scss',
    'json': 'json',
    'yaml': 'yaml',
    'yml': 'yaml',
    'md': 'markdown',
    'sh': 'bash',
    'bash': 'bash',
    'sql': 'sql',
    'graphql': 'graphql',
    'c': 'c',
    'cpp': 'cpp',
    'cs': 'csharp',
    'php': 'php',
    'rb': 'ruby',
    'swift': 'swift',
    'kt': 'kotlin',
  };

  return (ext && languageMap[ext]) || 'text';
}

export default function SyntaxHighlighter({
  code,
  language,
  fileName,
  showLineNumbers = true,
  highlightLines = [],
  startLineNumber = 1,
  onLineClick,
}: SyntaxHighlighterProps) {
  const [isDark, setIsDark] = useState(false);

  useEffect(() => {
    // 다크모드 감지
    const checkDarkMode = () => {
      setIsDark(document.documentElement.classList.contains('dark'));
    };

    checkDarkMode();

    // MutationObserver로 다크모드 변경 감지
    const observer = new MutationObserver(checkDarkMode);
    observer.observe(document.documentElement, {
      attributes: true,
      attributeFilter: ['class'],
    });

    return () => observer.disconnect();
  }, []);

  const detectedLanguage = language || getLanguageFromFileName(fileName);

  return (
    <Highlight
      theme={isDark ? themes.oneDark : themes.oneLight}
      code={code}
      language={detectedLanguage}
    >
      {({ className, style, tokens, getLineProps, getTokenProps }) => (
        <pre
          className={`${className} overflow-x-auto text-sm`}
          style={style}
        >
          {tokens.map((line, i) => {
            const lineNumber = startLineNumber + i;
            const isHighlighted = highlightLines.includes(lineNumber);
            const lineProps = getLineProps({ line });

            return (
              <div
                key={i}
                {...lineProps}
                className={`${lineProps.className} ${isHighlighted ? 'bg-yellow-100 dark:bg-yellow-900/30' : ''} ${
                  onLineClick ? 'hover:bg-gray-100 dark:hover:bg-gray-800 cursor-pointer' : ''
                } transition-colors`}
                onClick={() => onLineClick?.(lineNumber)}
              >
                {showLineNumbers && (
                  <span className="inline-block w-12 select-none text-right pr-4 text-gray-500 dark:text-gray-400">
                    {lineNumber}
                  </span>
                )}
                <span>
                  {line.map((token, key) => (
                    <span key={key} {...getTokenProps({ token })} />
                  ))}
                </span>
              </div>
            );
          })}
        </pre>
      )}
    </Highlight>
  );
}
