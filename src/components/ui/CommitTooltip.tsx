import { formatDistanceToNow } from 'date-fns';
import { Copy, Check } from 'lucide-react';
import { useState } from 'react';
import { GitHubCommit } from '../../types';

interface CommitTooltipProps {
  commit: GitHubCommit;
  onCopySHA?: (sha: string) => void;
}

export function CommitTooltip({ commit, onCopySHA }: CommitTooltipProps) {
  const [copied, setCopied] = useState(false);

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(commit.sha);
      setCopied(true);
      onCopySHA?.(commit.sha);
      setTimeout(() => setCopied(false), 2000);
    } catch (err) {
      console.error('Failed to copy SHA:', err);
    }
  };

  return (
    <div className="p-3 max-w-md bg-white dark:bg-gray-800 rounded-lg shadow-lg border border-gray-200 dark:border-gray-700">
      {/* Commit message */}
      <h4 className="font-semibold text-sm text-gray-900 dark:text-white mb-2">
        {commit.message}
      </h4>

      {/* Author and date */}
      <div className="flex items-center gap-2 text-xs text-gray-600 dark:text-gray-400 mb-2">
        <span>{commit.author.name}</span>
        <span>•</span>
        <span>{formatDistanceToNow(commit.date, { addSuffix: true })}</span>
      </div>

      {/* SHA with copy button */}
      <div className="flex items-center gap-2">
        <code className="text-xs font-mono bg-gray-100 dark:bg-gray-700 px-2 py-1 rounded text-gray-900 dark:text-gray-100">
          {commit.sha.substring(0, 7)}
        </code>
        <button
          onClick={handleCopy}
          className="p-1 rounded hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
          title={copied ? 'Copied!' : 'Copy SHA'}
        >
          {copied ? (
            <Check size={14} className="text-green-500" />
          ) : (
            <Copy size={14} className="text-gray-500 dark:text-gray-400" />
          )}
        </button>
      </div>

      {/* Branch info */}
      {commit.branch.length > 0 && (
        <div className="mt-2 pt-2 border-t border-gray-200 dark:border-gray-700">
          <div className="flex items-center gap-1 flex-wrap">
            <span className="text-xs text-gray-500 dark:text-gray-500">Branches:</span>
            {commit.branch.map((branch) => (
              <span
                key={branch}
                className="text-xs bg-blue-100 dark:bg-blue-900/30 text-blue-700 dark:text-blue-300 px-1.5 py-0.5 rounded"
              >
                {branch}
              </span>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
