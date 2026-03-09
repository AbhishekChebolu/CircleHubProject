export const PostSkeleton = () => (
  <div className="bg-white dark:bg-gray-800 rounded-lg p-6 shadow-sm border border-gray-200 dark:border-gray-700 animate-pulse">
    {/* Header */}
    <div className="flex items-center gap-3 mb-4">
      <div className="w-12 h-12 bg-gray-300 dark:bg-gray-700 rounded-full"></div>
      <div className="flex-1">
        <div className="h-4 bg-gray-300 dark:bg-gray-700 rounded w-32 mb-2"></div>
        <div className="h-3 bg-gray-300 dark:bg-gray-700 rounded w-24"></div>
      </div>
    </div>

    {/* Content */}
    <div className="space-y-2 mb-4">
      <div className="h-4 bg-gray-300 dark:bg-gray-700 rounded w-full"></div>
      <div className="h-4 bg-gray-300 dark:bg-gray-700 rounded w-5/6"></div>
      <div className="h-4 bg-gray-300 dark:bg-gray-700 rounded w-4/6"></div>
    </div>

    {/* Image placeholder */}
    <div className="h-64 bg-gray-300 dark:bg-gray-700 rounded-lg mb-4"></div>

    {/* Actions */}
    <div className="flex items-center gap-6">
      <div className="h-4 bg-gray-300 dark:bg-gray-700 rounded w-16"></div>
      <div className="h-4 bg-gray-300 dark:bg-gray-700 rounded w-16"></div>
      <div className="h-4 bg-gray-300 dark:bg-gray-700 rounded w-16"></div>
    </div>
  </div>
);

export const CommentSkeleton = () => (
  <div className="flex gap-3 p-4 animate-pulse">
    <div className="w-10 h-10 bg-gray-300 dark:bg-gray-700 rounded-full"></div>
    <div className="flex-1">
      <div className="h-3 bg-gray-300 dark:bg-gray-700 rounded w-24 mb-2"></div>
      <div className="h-4 bg-gray-300 dark:bg-gray-700 rounded w-full mb-1"></div>
      <div className="h-4 bg-gray-300 dark:bg-gray-700 rounded w-3/4"></div>
    </div>
  </div>
);

export const CircleSkeleton = () => (
  <div className="bg-white dark:bg-gray-800 rounded-lg p-6 shadow-sm border border-gray-200 dark:border-gray-700 animate-pulse">
    <div className="h-6 bg-gray-300 dark:bg-gray-700 rounded w-40 mb-3"></div>
    <div className="space-y-2 mb-4">
      <div className="h-4 bg-gray-300 dark:bg-gray-700 rounded w-full"></div>
      <div className="h-4 bg-gray-300 dark:bg-gray-700 rounded w-4/5"></div>
    </div>
    <div className="flex items-center gap-4">
      <div className="h-4 bg-gray-300 dark:bg-gray-700 rounded w-24"></div>
      <div className="h-8 bg-gray-300 dark:bg-gray-700 rounded w-20"></div>
    </div>
  </div>
);

export const UserSkeleton = () => (
  <div className="flex items-center gap-3 p-4 animate-pulse">
    <div className="w-12 h-12 bg-gray-300 dark:bg-gray-700 rounded-full"></div>
    <div className="flex-1">
      <div className="h-4 bg-gray-300 dark:bg-gray-700 rounded w-32 mb-2"></div>
      <div className="h-3 bg-gray-300 dark:bg-gray-700 rounded w-24"></div>
    </div>
    <div className="h-8 bg-gray-300 dark:bg-gray-700 rounded w-20"></div>
  </div>
);

export const ProfileSkeleton = () => (
  <div className="animate-pulse">
    {/* Cover Image */}
    <div className="h-48 bg-gray-300 dark:bg-gray-700 rounded-t-lg"></div>
    
    {/* Profile Info */}
    <div className="px-6 pb-6">
      <div className="flex items-end gap-4 -mt-16 mb-4">
        <div className="w-32 h-32 bg-gray-300 dark:bg-gray-700 rounded-full border-4 border-white dark:border-gray-900"></div>
        <div className="flex-1 mt-16">
          <div className="h-6 bg-gray-300 dark:bg-gray-700 rounded w-48 mb-2"></div>
          <div className="h-4 bg-gray-300 dark:bg-gray-700 rounded w-32"></div>
        </div>
        <div className="h-10 bg-gray-300 dark:bg-gray-700 rounded w-24 mb-2"></div>
      </div>
      
      {/* Bio */}
      <div className="space-y-2 mb-4">
        <div className="h-4 bg-gray-300 dark:bg-gray-700 rounded w-full"></div>
        <div className="h-4 bg-gray-300 dark:bg-gray-700 rounded w-3/4"></div>
      </div>
      
      {/* Stats */}
      <div className="flex gap-6">
        <div className="h-4 bg-gray-300 dark:bg-gray-700 rounded w-24"></div>
        <div className="h-4 bg-gray-300 dark:bg-gray-700 rounded w-24"></div>
        <div className="h-4 bg-gray-300 dark:bg-gray-700 rounded w-24"></div>
      </div>
    </div>
  </div>
);

const SkeletonLoader = ({ type = 'post', count = 1 }) => {
  const skeletons = {
    post: PostSkeleton,
    comment: CommentSkeleton,
    circle: CircleSkeleton,
    user: UserSkeleton,
    profile: ProfileSkeleton,
  };

  const Skeleton = skeletons[type] || PostSkeleton;

  return (
    <>
      {Array.from({ length: count }).map((_, index) => (
        <Skeleton key={index} />
      ))}
    </>
  );
};

export default SkeletonLoader;
