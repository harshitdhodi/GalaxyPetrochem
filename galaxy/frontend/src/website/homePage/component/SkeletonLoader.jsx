const SkeletonLoader = () => (
    <div className="w-full h-[40vh] sm:h-[50vh] md:h-[60vh] lg:h-[70vh] bg-gray-200 animate-pulse rounded overflow-hidden">
      <div className="absolute w-full top-1/2 transform -translate-y-1/2 px-4 sm:px-[15%]">
        <div className="w-32 h-10 bg-gray-300 animate-pulse rounded" />
      </div>
    </div>
  );
  
  export default SkeletonLoader;