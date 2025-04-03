import { memo } from 'react';

const NavigationSkeleton = () => {
  const skeletonItems = Array(6).fill(0);
  
  return (
    <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 divide-x-2 divide-y-2 md:divide-y-0 divide-gray-700/10">
      {skeletonItems.map((_, index) => (
        <div 
          key={index}
          className={`flex md:flex-col gap-4 items-center justify-center lg:px-4 py-3 lg:py-6 animate-pulse ${index % 2 === 1 ? 'border-t-2 md:border-t-0' : ''}`}
        >
          <div className="bg-gray-300 rounded-full w-10 h-10 mx-auto"></div>
          <div className="bg-gray-300 h-4 w-16 mx-auto mt-2 rounded"></div>
        </div>
      ))}
    </div>
  );
};

export default memo(NavigationSkeleton);