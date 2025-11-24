import { useEffect, useRef, useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { useApp } from '../contexts/AppContext';
import { useToast } from '../contexts/ToastContext';
import UserAvatar from '../components/ui/UserAvatar';
import Button from '../components/ui/Button';
import Card from '../components/ui/Card';
import TagInput from '../components/ui/TagInput';
import { Pencil, Github, Calendar, Award, CheckCircle2, Clock } from 'lucide-react';
import { buildGithubOAuthUrl } from '../lib/apiClient';

const ProfilePage = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { projects, tasks, user, isUserLoading, refreshUser, accessToken } = useApp();
  const { showToast } = useToast();

  const [isEditing, setIsEditing] = useState(false);
  const [formData, setFormData] = useState({
    name: user?.name ?? '',
    email: user?.email ?? '',
    bio: user?.bio || user?.description || '',
    role: user?.role ?? 'developer',
    skills: user?.skills ?? [],
  });
  const [isLinkingGithub, setIsLinkingGithub] = useState(false);

  const githubCheckIntervalRef = useRef<number | null>(null);

  useEffect(() => {
    if (user) {
      setFormData({
        name: user.name,
        email: user.email,
        bio: user.bio || user.description || '',
        role: user.role ?? 'developer',
        skills: user.skills ?? [],
      });
    }
  }, [user]);

  useEffect(() => {
    const params = new URLSearchParams(location.search);
    const githubLinked = params.get('githubLinked');
    if (githubLinked === 'success') {
      refreshUser();
      showToast('GitHub 계정이 연동되었습니다.', 'success');
      navigate(location.pathname, { replace: true });
    } else if (githubLinked === 'error') {
      const reason = params.get('reason');
      showToast(reason || 'GitHub 연동에 실패했습니다. 다시 시도해주세요.', 'error');
      navigate(location.pathname, { replace: true });
    }
  }, [location.pathname, location.search, navigate, refreshUser, showToast]);

  useEffect(() => {
    return () => {
      if (githubCheckIntervalRef.current) {
        window.clearInterval(githubCheckIntervalRef.current);
      }
    };
  }, []);

  // 활동 통계 계산
  const userProjects = user
    ? projects.filter((p) => p.members.some((m) => m.userId === user.id))
    : [];
  const userTasks = user ? tasks.filter((t) => t.assigneeId === user.id) : [];
  const completedTasks = userTasks.filter(t => t.status === 'done');
  const inProgressTasks = userTasks.filter(t => t.status === 'in_progress');

  // 최근 수정한 Task (최대 5개)
  const recentTasks = [...userTasks]
    .sort((a, b) => b.updatedAt.getTime() - a.updatedAt.getTime())
    .slice(0, 5);

  if (isUserLoading && !user) {
    return (
      <div className="max-w-6xl mx-auto p-4 md:p-6 text-gray-600 dark:text-gray-300">
        사용자 정보를 불러오는 중입니다...
      </div>
    );
  }

  if (!user) {
    return (
      <div className="max-w-6xl mx-auto p-4 md:p-6 text-gray-600 dark:text-gray-300">
        사용자 정보가 없습니다. 다시 로그인해주세요.
      </div>
    );
  }

  const handleSave = () => {
    // TODO: 백엔드 연동 시 실제 API 호출
    console.log('Profile updated:', formData);
    showToast('프로필이 업데이트되었습니다.', 'success');
    setIsEditing(false);
  };

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      // TODO: 로컬 스토리지에 이미지 저장 (Base64)
      const reader = new FileReader();
      reader.onloadend = () => {
        console.log('Image uploaded:', reader.result);
        showToast('아바타가 업데이트되었습니다.', 'success');
      };
      reader.readAsDataURL(file);
    }
  };

  const handleGithubConnect = () => {
    if (!user) return;
    if (!accessToken) {
      showToast('로그인 세션이 만료되었습니다. 다시 로그인 후 GitHub 연동을 시도해주세요.', 'warning');
      return;
    }

    const oauthUrl = `${buildGithubOAuthUrl()}?token=${encodeURIComponent(accessToken)}`;
    const popup = window.open(oauthUrl, 'github-oauth', 'width=1024,height=800');
    if (!popup) {
      showToast('팝업이 차단되었습니다. 브라우저 팝업을 허용한 뒤 다시 시도해주세요.', 'warning');
      return;
    }

    const previousGithub = user.githubUsername;
    setIsLinkingGithub(true);

    githubCheckIntervalRef.current = window.setInterval(async () => {
      if (popup.closed) {
        if (githubCheckIntervalRef.current) {
          window.clearInterval(githubCheckIntervalRef.current);
          githubCheckIntervalRef.current = null;
        }

        try {
          const refreshed = await refreshUser();
          if (refreshed?.githubUsername) {
            const isNewAccount = previousGithub !== refreshed.githubUsername;
            showToast(
              isNewAccount ? 'GitHub 계정이 새로 연동되었습니다.' : 'GitHub 계정 정보가 갱신되었습니다.',
              'success'
            );
          } else {
            showToast('GitHub 연동이 완료되지 않았습니다. 다시 시도해주세요.', 'warning');
          }
        } catch (error) {
          showToast('GitHub 연동 상태를 확인하는 중 오류가 발생했습니다.', 'error');
        } finally {
          setIsLinkingGithub(false);
        }
      }
    }, 1000);
  };

  return (
    <div className="max-w-6xl mx-auto p-4 md:p-6 space-y-6">
      {/* 프로필 헤더 */}
      <Card className="p-6">
        <div className="flex flex-col md:flex-row gap-6">
          {/* 아바타 */}
          <div className="flex flex-col items-center gap-2">
            <UserAvatar name={user.name} size="xl" />
            {isEditing && (
              <label className="cursor-pointer">
                <input
                  type="file"
                  accept="image/*"
                  className="hidden"
                  onChange={handleImageUpload}
                />
                <span className="text-sm text-blue-600 dark:text-blue-400 hover:underline">
                  사진 변경
                </span>
              </label>
            )}
          </div>

          {/* 프로필 정보 */}
          <div className="flex-1 space-y-4">
            <div className="flex items-center justify-between">
              <div>
                {isEditing ? (
                  <input
                    type="text"
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    className="text-2xl font-bold bg-transparent border-b-2 border-gray-300 dark:border-gray-600 focus:border-blue-500 dark:focus:border-blue-400 outline-none"
                  />
                ) : (
                  <h1 className="text-2xl font-bold text-gray-900 dark:text-white">
                    {user.name}
                  </h1>
                )}
                {!isEditing && (
                  <p className="text-gray-600 dark:text-gray-400 mt-1">
                    {user.email}
                  </p>
                )}
              </div>
              <Button
                variant={isEditing ? 'primary' : 'secondary'}
                onClick={() => {
                  if (isEditing) {
                    handleSave();
                  } else {
                    setIsEditing(true);
                  }
                }}
              >
                {isEditing ? '저장' : (
                  <>
                    <Pencil className="w-4 h-4 mr-2" />
                    프로필 수정
                  </>
                )}
              </Button>
            </div>

            {/* 이메일 (편집 모드) */}
            {isEditing && (
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                  이메일
                </label>
                <input
                  type="email"
                  value={formData.email}
                  onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-white"
                />
              </div>
            )}

            {/* 자기소개 */}
            <div>
              {isEditing ? (
                <>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                    자기소개
                  </label>
                  <textarea
                    value={formData.bio}
                    onChange={(e) => setFormData({ ...formData, bio: e.target.value })}
                    rows={3}
                    className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-white resize-none"
                    placeholder="자기소개를 입력하세요..."
                  />
                </>
              ) : (
                <p className="text-gray-700 dark:text-gray-300">
                  {user.bio || user.description || '자기소개가 없습니다.'}
                </p>
              )}
            </div>

            {/* 역할 */}
            <div className="flex items-center gap-4">
              <label className="text-sm font-medium text-gray-700 dark:text-gray-300">
                역할:
              </label>
              {isEditing ? (
                <select
                  value={formData.role}
                  onChange={(e) => setFormData({ ...formData, role: e.target.value as any })}
                  className="px-3 py-1 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-white"
                >
                  <option value="developer">개발자</option>
                  <option value="designer">디자이너</option>
                  <option value="planner">기획자</option>
                  <option value="other">기타</option>
                </select>
              ) : (
                <span className="px-3 py-1 bg-blue-100 dark:bg-blue-900/30 text-blue-800 dark:text-blue-300 rounded-full text-sm">
                  {user.role === 'developer' ? '개발자' :
                   user.role === 'designer' ? '디자이너' :
                   user.role === 'planner' ? '기획자' : '기타'}
                </span>
              )}
            </div>

            {/* GitHub */}
            <div className="flex items-center gap-3 text-gray-700 dark:text-gray-300">
              <div className="flex items-center gap-2 flex-1 min-w-0">
                <Github className="w-5 h-5" />
                <div className="flex flex-col">
                  <span className="text-sm text-gray-600 dark:text-gray-400">GitHub 연동</span>
                  {user.githubUsername ? (
                    <div className="flex items-center gap-2">
                      <a
                        href={`https://github.com/${user.githubUsername}`}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-blue-600 dark:text-blue-400 hover:underline truncate"
                      >
                        @{user.githubUsername}
                      </a>
                      <span className="px-2 py-0.5 text-xs rounded-full bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-300">
                        연동됨
                      </span>
                    </div>
                  ) : (
                    <span className="text-gray-500 dark:text-gray-400">
                      연동된 GitHub 계정이 없습니다
                    </span>
                  )}
                </div>
              </div>
              {isEditing && (
                <Button
                  variant="outline"
                  size="sm"
                  loading={isLinkingGithub}
                  onClick={handleGithubConnect}
                >
                  {user.githubUsername ? 'GitHub 재연동' : 'GitHub 연동'}
                </Button>
              )}
            </div>

            {/* 기술 스택 */}
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                기술 스택
              </label>
              {isEditing ? (
                <TagInput
                  tags={formData.skills}
                  onChange={(skills: string[]) => setFormData((prev) => ({ ...prev, skills }))}
                  placeholder="기술 스택 입력 (Enter로 추가)"
                />
              ) : (
                <div className="flex flex-wrap gap-2">
                  {(user.skills ?? []).map((skill) => (
                    <span
                      key={skill}
                      className="px-3 py-1 bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-300 rounded-full text-sm"
                    >
                      {skill}
                    </span>
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>
      </Card>

      {/* 활동 통계 */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card className="p-4">
          <div className="flex items-center gap-3">
            <div className="p-3 bg-blue-100 dark:bg-blue-900/30 rounded-lg">
              <Award className="w-6 h-6 text-blue-600 dark:text-blue-400" />
            </div>
            <div>
              <p className="text-2xl font-bold text-gray-900 dark:text-white">
                {userProjects.length}
              </p>
              <p className="text-sm text-gray-600 dark:text-gray-400">
                참여 중인 프로젝트
              </p>
            </div>
          </div>
        </Card>

        <Card className="p-4">
          <div className="flex items-center gap-3">
            <div className="p-3 bg-green-100 dark:bg-green-900/30 rounded-lg">
              <CheckCircle2 className="w-6 h-6 text-green-600 dark:text-green-400" />
            </div>
            <div>
              <p className="text-2xl font-bold text-gray-900 dark:text-white">
                {completedTasks.length}
              </p>
              <p className="text-sm text-gray-600 dark:text-gray-400">
                완료한 Task
              </p>
            </div>
          </div>
        </Card>

        <Card className="p-4">
          <div className="flex items-center gap-3">
            <div className="p-3 bg-yellow-100 dark:bg-yellow-900/30 rounded-lg">
              <Clock className="w-6 h-6 text-yellow-600 dark:text-yellow-400" />
            </div>
            <div>
              <p className="text-2xl font-bold text-gray-900 dark:text-white">
                {inProgressTasks.length}
              </p>
              <p className="text-sm text-gray-600 dark:text-gray-400">
                진행 중인 Task
              </p>
            </div>
          </div>
        </Card>

        <Card className="p-4">
          <div className="flex items-center gap-3">
            <div className="p-3 bg-purple-100 dark:bg-purple-900/30 rounded-lg">
              <Calendar className="w-6 h-6 text-purple-600 dark:text-purple-400" />
            </div>
            <div>
              <p className="text-2xl font-bold text-gray-900 dark:text-white">
                {Math.floor((Date.now() - user.createdAt.getTime()) / (1000 * 60 * 60 * 24))}일
              </p>
              <p className="text-sm text-gray-600 dark:text-gray-400">
                가입 기간
              </p>
            </div>
          </div>
        </Card>
      </div>

      {/* 최근 활동 히스토리 */}
      <Card className="p-6">
        <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-4">
          최근 수정한 Task
        </h2>
        <div className="space-y-3">
          {recentTasks.length === 0 ? (
            <p className="text-gray-600 dark:text-gray-400 text-center py-8">
              최근 활동이 없습니다.
            </p>
          ) : (
            recentTasks.map((task) => {
              const project = projects.find(p => p.id === task.projectId);
              return (
                <div
                  key={task.id}
                  onClick={() => navigate(`/projects/${task.projectId}`)}
                  className="flex items-center justify-between p-4 bg-gray-50 dark:bg-gray-800 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700 cursor-pointer transition-colors"
                >
                  <div className="flex-1">
                    <h3 className="font-medium text-gray-900 dark:text-white">
                      {task.title}
                    </h3>
                    <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">
                      {project?.name} • {task.status === 'done' ? '완료' :
                       task.status === 'in_progress' ? '진행 중' :
                       task.status === 'review' ? '리뷰' : '할 일'}
                    </p>
                  </div>
                  <div className="text-sm text-gray-500 dark:text-gray-400">
                    {new Date(task.updatedAt).toLocaleDateString('ko-KR')}
                  </div>
                </div>
              );
            })
          )}
        </div>
      </Card>

      {/* 참여 중인 프로젝트 */}
      <Card className="p-6">
        <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-4">
          참여 중인 프로젝트
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {userProjects.map((project) => {
            const myRole = project.members.find(m => m.userId === user.id)?.role;
            const projectTasks = tasks.filter(t => t.projectId === project.id);
            const completedCount = projectTasks.filter(t => t.status === 'done').length;
            const progress = projectTasks.length > 0
              ? Math.round((completedCount / projectTasks.length) * 100)
              : 0;

            return (
              <div
                key={project.id}
                onClick={() => navigate(`/projects/${project.id}`)}
                className="p-4 bg-gray-50 dark:bg-gray-800 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700 cursor-pointer transition-colors"
              >
                <div className="flex items-center justify-between mb-2">
                  <h3 className="font-medium text-gray-900 dark:text-white">
                    {project.name}
                  </h3>
                  <span className="text-xs px-2 py-1 bg-blue-100 dark:bg-blue-900/30 text-blue-800 dark:text-blue-300 rounded-full">
                    {myRole === 'owner' ? 'Owner' : myRole === 'admin' ? 'Admin' : 'Member'}
                  </span>
                </div>
                <p className="text-sm text-gray-600 dark:text-gray-400 mb-3">
                  {project.description}
                </p>
                <div className="space-y-2">
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-gray-600 dark:text-gray-400">진행률</span>
                    <span className="text-gray-900 dark:text-white font-medium">{progress}%</span>
                  </div>
                  <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2">
                    <div
                      className="bg-blue-600 dark:bg-blue-500 h-2 rounded-full transition-all"
                      style={{ width: `${progress}%` }}
                    />
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </Card>
    </div>
  );
};

export default ProfilePage;
