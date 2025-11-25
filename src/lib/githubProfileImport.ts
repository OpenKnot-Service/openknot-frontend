import { GitHubImportResult } from '../types/registration';

/**
 * GitHub API base URL
 */
const GITHUB_API_BASE = 'https://api.github.com';

/**
 * Language to skill mapping
 */
const LANGUAGE_TO_SKILL_MAP: Record<string, string[]> = {
  JavaScript: ['JavaScript', 'Node.js', 'React'],
  TypeScript: ['TypeScript', 'Node.js', 'React'],
  Python: ['Python', 'Django', 'Flask'],
  Java: ['Java', 'Spring'],
  'C#': ['C#', '.NET'],
  Go: ['Go'],
  Rust: ['Rust'],
  Ruby: ['Ruby', 'Rails'],
  PHP: ['PHP', 'Laravel'],
  Swift: ['Swift', 'iOS'],
  Kotlin: ['Kotlin', 'Android'],
  Dart: ['Dart', 'Flutter'],
  HTML: ['HTML', 'CSS'],
  CSS: ['CSS', 'Tailwind CSS'],
  Vue: ['Vue.js'],
  Svelte: ['Svelte'],
  Shell: ['Linux', 'DevOps'],
  Dockerfile: ['Docker'],
};

/**
 * Framework/tool detection patterns
 */
const FRAMEWORK_PATTERNS: Record<string, string[]> = {
  React: ['react', 'next.js', 'gatsby'],
  'Vue.js': ['vue', 'nuxt'],
  Angular: ['angular'],
  'Next.js': ['next.js', 'nextjs'],
  'Node.js': ['node', 'express', 'nestjs'],
  Django: ['django'],
  Flask: ['flask'],
  Spring: ['spring'],
  Docker: ['docker', 'dockerfile'],
  Kubernetes: ['kubernetes', 'k8s'],
  PostgreSQL: ['postgres', 'postgresql'],
  MongoDB: ['mongodb', 'mongoose'],
  Redis: ['redis'],
  GraphQL: ['graphql'],
  'REST API': ['rest', 'api'],
  TensorFlow: ['tensorflow'],
  PyTorch: ['pytorch'],
};

/**
 * Fetch GitHub user profile
 */
async function fetchGitHubProfile(username: string): Promise<any> {
  const response = await fetch(`${GITHUB_API_BASE}/users/${username}`);

  if (!response.ok) {
    if (response.status === 404) {
      throw new Error('GitHub 사용자를 찾을 수 없습니다');
    }
    throw new Error('GitHub API 요청에 실패했습니다');
  }

  return response.json();
}

/**
 * Fetch user's repositories
 */
async function fetchGitHubRepos(username: string): Promise<any[]> {
  const response = await fetch(
    `${GITHUB_API_BASE}/users/${username}/repos?sort=updated&per_page=30`
  );

  if (!response.ok) {
    throw new Error('GitHub 저장소 정보를 가져오지 못했습니다');
  }

  return response.json();
}

/**
 * Extract skills from repositories
 */
function extractSkillsFromRepos(repos: any[]): string[] {
  const skillsSet = new Set<string>();

  // Extract languages
  repos.forEach((repo) => {
    if (repo.language) {
      const mappedSkills = LANGUAGE_TO_SKILL_MAP[repo.language] || [repo.language];
      mappedSkills.forEach((skill) => skillsSet.add(skill));
    }

    // Check repo name and description for frameworks
    const searchText = `${repo.name} ${repo.description || ''}`.toLowerCase();

    Object.entries(FRAMEWORK_PATTERNS).forEach(([framework, patterns]) => {
      if (patterns.some((pattern) => searchText.includes(pattern))) {
        skillsSet.add(framework);
      }
    });

    // Check topics
    if (repo.topics && Array.isArray(repo.topics)) {
      repo.topics.forEach((topic: string) => {
        const normalizedTopic = topic.toLowerCase();
        const capitalizedTopic = topic.charAt(0).toUpperCase() + topic.slice(1);
        let matchedFramework = false;

        // Check if topic matches known frameworks
        Object.entries(FRAMEWORK_PATTERNS).forEach(([framework, patterns]) => {
          if (patterns.includes(normalizedTopic)) {
            skillsSet.add(framework);
            matchedFramework = true;
          }
        });

        if (!matchedFramework) {
          skillsSet.add(capitalizedTopic);
        }
      });
    }
  });

  // Convert to array and limit to top 15
  return Array.from(skillsSet).slice(0, 15);
}

/**
 * Import GitHub profile and extract skills
 */
export async function importGitHubProfile(username: string): Promise<GitHubImportResult> {
  try {
    // Fetch profile
    const profile = await fetchGitHubProfile(username);

    // Fetch repositories
    const repos = await fetchGitHubRepos(username);

    // Extract skills
    const suggestedSkills = extractSkillsFromRepos(repos);

    // Build result
    const result: GitHubImportResult = {
      profileImageUrl: profile.avatar_url,
      bio: profile.bio || undefined,
      location: profile.location || undefined,
      githubLink: profile.html_url,
      githubUsername: profile.login,
      portfolioUrl: profile.blog || undefined,
      suggestedSkills,
      repos: profile.public_repos || 0,
      followers: profile.followers || 0,
    };

    return result;
  } catch (error) {
    if (error instanceof Error) {
      throw error;
    }
    throw new Error('GitHub 프로필을 가져오는 중 오류가 발생했습니다');
  }
}

/**
 * Validate GitHub username format
 */
export function isValidGitHubUsername(username: string): boolean {
  // GitHub username rules:
  // - Max 39 characters
  // - Alphanumeric and hyphens only
  // - Cannot start or end with hyphen
  // - Cannot have consecutive hyphens
  const githubUsernameRegex = /^[a-zA-Z0-9]([a-zA-Z0-9-]{0,37}[a-zA-Z0-9])?$/;
  return githubUsernameRegex.test(username);
}

/**
 * Extract GitHub username from URL
 */
export function extractGitHubUsername(input: string): string | null {
  // Remove trailing slash
  const cleaned = input.trim().replace(/\/$/, '');

  // Check if it's a URL
  if (cleaned.startsWith('http://') || cleaned.startsWith('https://')) {
    try {
      const url = new URL(cleaned);
      if (url.hostname === 'github.com') {
        const pathParts = url.pathname.split('/').filter(Boolean);
        if (pathParts.length >= 1) {
          return pathParts[0];
        }
      }
    } catch {
      return null;
    }
  }

  // Assume it's a username
  if (isValidGitHubUsername(cleaned)) {
    return cleaned;
  }

  return null;
}
