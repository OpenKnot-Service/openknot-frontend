/**
 * File utility functions for GitHub file browser
 */

/**
 * Download a file from GitHub
 */
export function downloadFile(content: string, filename: string, encoding: 'base64' | 'utf-8' = 'utf-8') {
  let blob: Blob;

  if (encoding === 'base64') {
    // Decode base64 content
    const binaryString = atob(content);
    const bytes = new Uint8Array(binaryString.length);
    for (let i = 0; i < binaryString.length; i++) {
      bytes[i] = binaryString.charCodeAt(i);
    }
    blob = new Blob([bytes]);
  } else {
    blob = new Blob([content], { type: 'text/plain;charset=utf-8' });
  }

  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = filename;
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
  URL.revokeObjectURL(url);
}

/**
 * Format file size in human-readable format
 */
export function formatFileSize(bytes: number): string {
  if (bytes === 0) return '0 B';
  const k = 1024;
  const sizes = ['B', 'KB', 'MB', 'GB', 'TB'];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  return `${Math.round((bytes / Math.pow(k, i)) * 100) / 100} ${sizes[i]}`;
}

/**
 * Get file extension from filename
 */
export function getFileExtension(filename: string): string {
  const parts = filename.split('.');
  return parts.length > 1 ? parts[parts.length - 1].toLowerCase() : '';
}

/**
 * Check if file is an image
 */
export function isImageFile(filename: string): boolean {
  const imageExtensions = ['png', 'jpg', 'jpeg', 'gif', 'svg', 'webp', 'bmp', 'ico'];
  const ext = getFileExtension(filename);
  return imageExtensions.includes(ext);
}

/**
 * Check if file is a text file
 */
export function isTextFile(filename: string): boolean {
  const textExtensions = [
    'txt', 'md', 'markdown', 'json', 'xml', 'html', 'css', 'scss', 'sass',
    'js', 'jsx', 'ts', 'tsx', 'vue', 'py', 'java', 'c', 'cpp', 'h', 'hpp',
    'rs', 'go', 'rb', 'php', 'sh', 'bash', 'yaml', 'yml', 'toml', 'ini',
    'sql', 'graphql', 'swift', 'kt', 'scala', 'r', 'lua', 'pl', 'cs',
  ];
  const ext = getFileExtension(filename);
  return textExtensions.includes(ext);
}

/**
 * Get programming language from filename
 */
export function getLanguageFromFilename(filename: string): string {
  const ext = getFileExtension(filename);

  const languageMap: Record<string, string> = {
    ts: 'TypeScript',
    tsx: 'TypeScript',
    js: 'JavaScript',
    jsx: 'JavaScript',
    py: 'Python',
    java: 'Java',
    go: 'Go',
    rs: 'Rust',
    html: 'HTML',
    css: 'CSS',
    scss: 'SCSS',
    json: 'JSON',
    yaml: 'YAML',
    yml: 'YAML',
    md: 'Markdown',
    sh: 'Shell',
    bash: 'Shell',
    sql: 'SQL',
    graphql: 'GraphQL',
    c: 'C',
    cpp: 'C++',
    cs: 'C#',
    php: 'PHP',
    rb: 'Ruby',
    swift: 'Swift',
    kt: 'Kotlin',
  };

  return languageMap[ext] || 'Text';
}

/**
 * Count lines in text content
 */
export function countLines(content: string): number {
  return content.split('\n').length;
}

/**
 * Truncate text to specified length
 */
export function truncateText(text: string, maxLength: number): string {
  if (text.length <= maxLength) return text;
  return text.substring(0, maxLength) + '...';
}

/**
 * Copy text to clipboard
 */
export async function copyToClipboard(text: string): Promise<boolean> {
  try {
    await navigator.clipboard.writeText(text);
    return true;
  } catch (err) {
    console.error('Failed to copy to clipboard:', err);
    return false;
  }
}

/**
 * Generate breadcrumb from file path
 */
export function generateBreadcrumb(path: string): string[] {
  return path.split('/').filter(Boolean);
}

/**
 * Get parent directory path
 */
export function getParentPath(path: string): string {
  const parts = path.split('/');
  parts.pop();
  return parts.join('/');
}

/**
 * Check if path matches search query
 */
export function matchesSearch(path: string, query: string): boolean {
  const lowerPath = path.toLowerCase();
  const lowerQuery = query.toLowerCase();
  return lowerPath.includes(lowerQuery);
}

/**
 * Filter files by type
 */
export function matchesFileType(filename: string, filter: string): boolean {
  if (!filter) return true;
  const extensions = filter.split(',').map((ext) => ext.trim().toLowerCase());
  const fileExt = `.${getFileExtension(filename)}`;
  return extensions.some((ext) => fileExt === ext);
}
