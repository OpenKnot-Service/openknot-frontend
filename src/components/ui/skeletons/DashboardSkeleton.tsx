import Card from '../Card';
import Skeleton from '../Skeleton';

const DashboardSkeleton = () => {
  return (
    <div className="max-w-7xl mx-auto p-4 md:p-6 space-y-6">
      {/* Header */}
      <div>
        <Skeleton width="15rem" height="2rem" className="mb-2" />
        <Skeleton width="25rem" height="1.25rem" />
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {[1, 2, 3].map((i) => (
          <Card key={i} className="p-6">
            <div className="flex items-center gap-4">
              <Skeleton variant="circular" width="3rem" height="3rem" />
              <div className="flex-1">
                <Skeleton width="3rem" height="1.5rem" className="mb-2" />
                <Skeleton width="8rem" />
              </div>
            </div>
          </Card>
        ))}
      </div>

      {/* Main Content Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Project Overview */}
        <div className="lg:col-span-2">
          <Card className="p-6">
            <Skeleton width="10rem" height="1.5rem" className="mb-4" />
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {[1, 2, 3, 4].map((i) => (
                <div key={i} className="p-4 bg-gray-50 dark:bg-gray-800 rounded-lg">
                  <Skeleton width="60%" height="1.25rem" className="mb-2" />
                  <Skeleton count={2} className="mb-3" />
                  <Skeleton height="0.5rem" />
                </div>
              ))}
            </div>
          </Card>
        </div>

        {/* Recent Activity */}
        <div>
          <Card className="p-6">
            <Skeleton width="8rem" height="1.5rem" className="mb-4" />
            <div className="space-y-3">
              {[1, 2, 3, 4, 5].map((i) => (
                <div key={i} className="flex items-start gap-3">
                  <Skeleton variant="circular" width="2rem" height="2rem" />
                  <div className="flex-1">
                    <Skeleton width="100%" className="mb-1" />
                    <Skeleton width="60%" />
                  </div>
                </div>
              ))}
            </div>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default DashboardSkeleton;
