import Skeleton from '../Skeleton';

const TaskCardSkeleton = () => {
  return (
    <div className="p-4 bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700">
      <div className="flex items-start justify-between mb-3">
        <Skeleton width="70%" height="1.25rem" />
        <Skeleton variant="circular" width="1.5rem" height="1.5rem" />
      </div>

      <Skeleton count={2} className="mb-3" />

      <div className="flex items-center gap-2 mb-3">
        <Skeleton width="4rem" height="1.5rem" className="rounded-full" />
        <Skeleton width="4rem" height="1.5rem" className="rounded-full" />
      </div>

      <div className="flex items-center justify-between">
        <Skeleton variant="circular" width="2rem" height="2rem" />
        <Skeleton width="5rem" />
      </div>
    </div>
  );
};

export default TaskCardSkeleton;
