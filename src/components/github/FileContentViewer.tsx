import { useState, useMemo } from 'react';
import {
  X,
  Download,
  Copy,
  ExternalLink,
  FileCode,
  Check,
  FileText,
  Eye,
  Code,
} from 'lucide-react';
import { GitHubFileContent } from '../../types';
import SyntaxHighlighter from './diff/SyntaxHighlighter';
import { downloadFile } from '../../utils/fileUtils';

interface FileContentViewerProps {
  file: GitHubFileContent | null;
  onClose?: () => void;
  repositoryUrl?: string;
}

export function FileContentViewer({ file, onClose, repositoryUrl }: FileContentViewerProps) {
  const [viewMode, setViewMode] = useState<'code' | 'raw'>('code');
  const [copied, setCopied] = useState(false);

  // Determine file types (needs to be before early return to avoid hook order issues)
  const isMarkdown = file?.language === 'markdown';
  const isImage = file ? ['png', 'jpg', 'jpeg', 'gif', 'svg', 'webp'].some((ext) =>
    file.name.toLowerCase().endsWith(`.${ext}`)
  ) : false;

  const formatSize = (bytes: number): string => {
    const k = 1024;
    const sizes = ['B', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return `${Math.round((bytes / Math.pow(k, i)) * 10) / 10} ${sizes[i]}`;
  };

  const handleCopy = async () => {
    if (!file) return;
    try {
      await navigator.clipboard.writeText(file.content);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (err) {
      console.error('Failed to copy:', err);
    }
  };

  const handleDownload = () => {
    if (!file) return;
    downloadFile(file.content, file.name, file.encoding);
  };

  const handleOpenInGitHub = () => {
    if (!file || !repositoryUrl) return;
    const fileUrl = `${repositoryUrl}/blob/main/${file.path}`;
    window.open(fileUrl, '_blank');
  };

  // Render markdown content - must be called on every render
  const renderMarkdown = useMemo(() => {
    if (!isMarkdown || !file) return null;

    // Simple markdown rendering (for demo purposes)
    // In production, you might want to use a library like react-markdown
    const lines = file.content.split('\n');
    return (
      <div className="prose dark:prose-invert max-w-none p-6">
        {lines.map((line, i) => {
          // Headers
          if (line.startsWith('# ')) {
            return (
              <h1 key={i} className="text-3xl font-bold mb-4 mt-6">
                {line.substring(2)}
              </h1>
            );
          }
          if (line.startsWith('## ')) {
            return (
              <h2 key={i} className="text-2xl font-bold mb-3 mt-5">
                {line.substring(3)}
              </h2>
            );
          }
          if (line.startsWith('### ')) {
            return (
              <h3 key={i} className="text-xl font-bold mb-2 mt-4">
                {line.substring(4)}
              </h3>
            );
          }

          // Lists
          if (line.startsWith('- ')) {
            return (
              <li key={i} className="ml-4">
                {line.substring(2)}
              </li>
            );
          }

          // Code blocks
          if (line.startsWith('```')) {
            return <div key={i} className="bg-gray-100 dark:bg-gray-800 p-1" />;
          }

          // Empty lines
          if (line.trim() === '') {
            return <br key={i} />;
          }

          // Regular paragraphs
          return (
            <p key={i} className="mb-3">
              {line}
            </p>
          );
        })}
      </div>
    );
  }, [file?.content, isMarkdown, file]);

  // Early return after all hooks
  if (!file) {
    return (
      <div className="flex items-center justify-center h-full bg-white dark:bg-gray-900 rounded-tr rounded-br border-y border-r border-gray-300 dark:border-gray-700">
        <div className="text-center text-gray-500 dark:text-gray-400">
          <FileCode className="w-16 h-16 mx-auto mb-4 opacity-50" />
          <p className="text-lg font-medium mb-2">파일을 선택해주세요</p>
          <p className="text-sm">왼쪽에서 파일을 클릭하여 내용을 확인하세요</p>
        </div>
      </div>
    );
  }

  return (
    <div className="flex flex-col h-full bg-white dark:bg-gray-900 rounded-tr rounded-br border-y border-r border-gray-300 dark:border-gray-700 overflow-hidden">
      {/* Header */}
      <div className="flex items-center justify-between px-4 py-3 border-b border-gray-300 dark:border-gray-700 bg-gray-50 dark:bg-gray-800">
        <div className="flex items-center gap-3 flex-1 min-w-0">
          <FileText className="w-5 h-5 text-gray-600 dark:text-gray-400 flex-shrink-0" />
          <div className="min-w-0 flex-1">
            <h3 className="text-sm font-medium text-gray-900 dark:text-white truncate">
              {file.name}
            </h3>
            <p className="text-xs text-gray-500 dark:text-gray-400">
              {formatSize(file.size)} · {file.lines || 0} lines
              {file.language && ` · ${file.language}`}
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2 flex-shrink-0">
          {/* View Mode Toggle (for code files) */}
          {!isImage && !isMarkdown && (
            <div className="flex items-center gap-1 bg-gray-200 dark:bg-gray-700 rounded-lg p-1">
              <button
                onClick={() => setViewMode('code')}
                className={`px-2 py-1 text-xs rounded transition ${
                  viewMode === 'code'
                    ? 'bg-white dark:bg-gray-600 text-gray-900 dark:text-white shadow-sm'
                    : 'text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white'
                }`}
              >
                <Code className="w-3 h-3" />
              </button>
              <button
                onClick={() => setViewMode('raw')}
                className={`px-2 py-1 text-xs rounded transition ${
                  viewMode === 'raw'
                    ? 'bg-white dark:bg-gray-600 text-gray-900 dark:text-white shadow-sm'
                    : 'text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white'
                }`}
              >
                <Eye className="w-3 h-3" />
              </button>
            </div>
          )}

          {/* Action Buttons */}
          <button
            onClick={handleCopy}
            className="p-2 text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white hover:bg-gray-200 dark:hover:bg-gray-700 rounded transition"
            title="복사"
          >
            {copied ? (
              <Check className="w-4 h-4 text-green-600" />
            ) : (
              <Copy className="w-4 h-4" />
            )}
          </button>
          <button
            onClick={handleDownload}
            className="p-2 text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white hover:bg-gray-200 dark:hover:bg-gray-700 rounded transition"
            title="다운로드"
          >
            <Download className="w-4 h-4" />
          </button>
          {repositoryUrl && (
            <button
              onClick={handleOpenInGitHub}
              className="p-2 text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white hover:bg-gray-200 dark:hover:bg-gray-700 rounded transition"
              title="GitHub에서 열기"
            >
              <ExternalLink className="w-4 h-4" />
            </button>
          )}
          {onClose && (
            <button
              onClick={onClose}
              className="p-2 text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white hover:bg-gray-200 dark:hover:bg-gray-700 rounded transition md:hidden"
              title="닫기"
            >
              <X className="w-4 h-4" />
            </button>
          )}
        </div>
      </div>

      {/* Content */}
      <div className="flex-1 overflow-auto">
        {isImage ? (
          /* Image Preview */
          <div className="flex items-center justify-center p-8 bg-gray-50 dark:bg-gray-800/50 h-full">
            <div className="max-w-full max-h-full">
              <img
                src={`data:image/${file.name.split('.').pop()};base64,${file.content}`}
                alt={file.name}
                className="max-w-full max-h-full object-contain shadow-lg"
              />
            </div>
          </div>
        ) : isMarkdown ? (
          /* Markdown Rendered View */
          <div className="bg-white dark:bg-gray-900">{renderMarkdown}</div>
        ) : viewMode === 'code' ? (
          /* Code with Syntax Highlighting */
          <SyntaxHighlighter
            code={file.content}
            language={file.language}
            fileName={file.name}
            showLineNumbers={true}
          />
        ) : (
          /* Raw Text View */
          <pre className="text-sm text-gray-900 dark:text-gray-100 font-mono whitespace-pre-wrap break-words p-4">
            {file.content}
          </pre>
        )}
      </div>
    </div>
  );
}
