import Card from '../Card';
import Skeleton from '../Skeleton';

const ProjectCardSkeleton = () => {
  return (
    <Card className="p-6">
      <div className="flex items-start justify-between mb-4">
        <Skeleton width="60%" height="1.5rem" />
        <Skeleton variant="circular" width="2rem" height="2rem" />
      </div>

      <Skeleton count={2} className="mb-4" />

      <div className="flex items-center gap-2 mb-4">
        <Skeleton variant="circular" width="1.5rem" height="1.5rem" />
        <Skeleton variant="circular" width="1.5rem" height="1.5rem" />
        <Skeleton variant="circular" width="1.5rem" height="1.5rem" />
      </div>

      <div className="space-y-2">
        <div className="flex items-center justify-between">
          <Skeleton width="30%" />
          <Skeleton width="20%" />
        </div>
        <Skeleton height="0.5rem" />
      </div>
    </Card>
  );
};

export default ProjectCardSkeleton;
