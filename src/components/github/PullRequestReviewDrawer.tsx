import { FormEvent, useEffect, useState } from 'react';
import { X, GitPullRequest, GitBranch, CheckCircle2, AlertCircle, MessageSquare } from 'lucide-react';
import type { GitHubPullRequest, PullRequestReviewStatus } from '../../types';

interface PullRequestReviewDrawerProps {
  pullRequest: GitHubPullRequest | null;
  isOpen: boolean;
  onClose: () => void;
  currentReviewerUsername: string;
  onSubmit: (status: PullRequestReviewStatus, comment: string) => void;
}

type ReviewSelection = PullRequestReviewStatus;

export default function PullRequestReviewDrawer({
  pullRequest,
  isOpen,
  onClose,
  currentReviewerUsername,
  onSubmit,
}: PullRequestReviewDrawerProps) {
  const [selection, setSelection] = useState<ReviewSelection>('approved');
  const [comment, setComment] = useState('');
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!isOpen) {
      setSelection('approved');
      setComment('');
      setError(null);
    } else if (pullRequest) {
      const existingReview = pullRequest.reviewers.find((reviewer) => reviewer.username === currentReviewerUsername);
      if (existingReview && existingReview.status !== 'pending') {
        setSelection(
          existingReview.status === 'approved'
            ? 'approved'
            : existingReview.status === 'changes_requested'
            ? 'changes_requested'
            : 'commented'
        );
      }
    }
  }, [isOpen, pullRequest, currentReviewerUsername]);

  if (!isOpen || !pullRequest) {
    return null;
  }

  const handleSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    if (selection === 'changes_requested' && comment.trim().length === 0) {
      setError('수정 요청을 위해서는 코멘트를 작성해야 합니다.');
      return;
    }

    onSubmit(selection, comment.trim());
    onClose();
  };

  const reviewerStatus = pullRequest.reviewers.find((reviewer) => reviewer.username === currentReviewerUsername);

  return (
    <>
      <div className="fixed inset-0 z-[70] bg-black/40" onClick={onClose} />
      <div className="fixed inset-x-0 bottom-0 z-[80] w-full rounded-t-3xl border border-gray-200 bg-white shadow-2xl dark:border-gray-700 dark:bg-gray-800 md:inset-0 md:m-auto md:max-w-lg md:rounded-2xl">
        <div className="flex items-center justify-between border-b border-gray-200 px-5 py-4 dark:border-gray-700">
          <div className="flex items-center gap-2 text-gray-900 dark:text-white">
            <GitPullRequest className="h-5 w-5 text-blue-600 dark:text-blue-300" />
            <h2 className="text-lg font-semibold">리뷰 제출</h2>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="rounded-md p-1 text-gray-500 transition hover:bg-gray-100 dark:text-gray-400 dark:hover:bg-gray-700"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="max-h-[80vh] overflow-y-auto px-5 py-6">
          <div className="space-y-5">
            <div>
              <h3 className="text-base font-semibold text-gray-900 dark:text-white">
                {pullRequest.title}
              </h3>
              <div className="mt-2 flex flex-wrap items-center gap-2 text-sm text-gray-600 dark:text-gray-400">
                <GitBranch className="h-4 w-4" />
                <span className="font-medium text-gray-900 dark:text-white">{pullRequest.headBranch}</span>
                <span>→</span>
                <span className="font-medium text-gray-900 dark:text-white">{pullRequest.baseBranch}</span>
              </div>
              {reviewerStatus && reviewerStatus.status !== 'pending' && (
                <p className="mt-2 text-xs text-blue-600 dark:text-blue-300">
                  현재 상태: {reviewerStatus.status === 'approved' ? '승인됨' : reviewerStatus.status === 'changes_requested' ? '수정 요청됨' : '코멘트 남김'}
                </p>
              )}
            </div>

            <div className="space-y-3">
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-200">
                리뷰 결과 선택
              </label>
              <div className="space-y-2">
                <label className="flex items-center gap-3 rounded-lg border border-gray-200 p-3 text-sm transition hover:border-blue-300 dark:border-gray-700 dark:hover:border-blue-500/40">
                  <input
                    type="radio"
                    name="review-status"
                    value="approved"
                    checked={selection === 'approved'}
                    onChange={() => {
                      setSelection('approved');
                      setError(null);
                    }}
                    className="h-4 w-4 text-blue-600 focus:ring-blue-500"
                  />
                  <div>
                    <div className="flex items-center gap-2 font-medium text-gray-900 dark:text-white">
                      <CheckCircle2 className="h-4 w-4 text-emerald-500" />
                      승인 (Approve)
                    </div>
                    <p className="text-xs text-gray-500 dark:text-gray-400">
                      변경사항이 문제 없다고 판단되면 승인하세요.
                    </p>
                  </div>
                </label>

                <label className="flex items-center gap-3 rounded-lg border border-gray-200 p-3 text-sm transition hover:border-amber-300 dark:border-gray-700 dark:hover:border-amber-500/40">
                  <input
                    type="radio"
                    name="review-status"
                    value="changes_requested"
                    checked={selection === 'changes_requested'}
                    onChange={() => {
                      setSelection('changes_requested');
                      setError(null);
                    }}
                    className="h-4 w-4 text-amber-600 focus:ring-amber-500"
                  />
                  <div>
                    <div className="flex items-center gap-2 font-medium text-gray-900 dark:text-white">
                      <AlertCircle className="h-4 w-4 text-amber-500" />
                      수정 요청 (Request changes)
                    </div>
                    <p className="text-xs text-gray-500 dark:text-gray-400">
                      병합 전 수정이 필요한 사항을 코멘트와 함께 남겨주세요.
                    </p>
                  </div>
                </label>

                <label className="flex items-center gap-3 rounded-lg border border-gray-200 p-3 text-sm transition hover:border-blue-300 dark:border-gray-700 dark:hover:border-blue-500/40">
                  <input
                    type="radio"
                    name="review-status"
                    value="commented"
                    checked={selection === 'commented'}
                    onChange={() => {
                      setSelection('commented');
                      setError(null);
                    }}
                    className="h-4 w-4 text-blue-600 focus:ring-blue-500"
                  />
                  <div>
                    <div className="flex items-center gap-2 font-medium text-gray-900 dark:text-white">
                      <MessageSquare className="h-4 w-4 text-blue-500" />
                      코멘트만 남기기
                    </div>
                    <p className="text-xs text-gray-500 dark:text-gray-400">
                      승인 여부 없이 의견만 남기고 싶을 때 선택하세요.
                    </p>
                  </div>
                </label>
              </div>
            </div>

            <div>
              <label className="mb-2 block text-sm font-medium text-gray-700 dark:text-gray-200">
                리뷰 코멘트
              </label>
              <textarea
                value={comment}
                onChange={(event) => {
                  setComment(event.target.value);
                  if (error) setError(null);
                }}
                rows={6}
                placeholder="리뷰 내용을 작성하세요. 수정 요청 시에는 필수입니다."
                className="w-full rounded-lg border border-gray-200 bg-white px-3 py-2 text-sm focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-500/20 dark:border-gray-700 dark:bg-gray-800 dark:text-white"
              />
            </div>

            {error && <p className="text-sm text-red-500 dark:text-red-400">{error}</p>}
          </div>

          <div className="mt-6 flex items-center justify-end gap-2 border-t border-gray-200 pt-4 pb-2 dark:border-gray-700">
            <button
              type="button"
              onClick={onClose}
              className="rounded-lg border border-gray-200 px-4 py-2 text-sm font-medium text-gray-700 transition hover:bg-gray-100 dark:border-gray-700 dark:text-gray-300 dark:hover:bg-gray-700"
            >
              취소
            </button>
            <button
              type="submit"
              className="rounded-lg bg-blue-600 px-4 py-2 text-sm font-semibold text-white transition hover:bg-blue-700"
            >
              리뷰 제출
            </button>
          </div>
        </form>
      </div>
    </>
  );
}
