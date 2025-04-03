// LoadingSkeleton.jsx
import { Card } from "@/components/ui/card";

export default function LoadingSkeleton({ type, count = 1 }) {
  switch (type) {
    case 'products':
      return (
        <div className="grid grid-cols-1 sm:grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 justify-center sm:justify-start">
          {Array(count).fill().map((_, index) => (
            <ProductSkeleton key={index} />
          ))}
        </div>
      );
    case 'event':
      return <EventSkeleton />;
    case 'catalogues':
      return <CatalogueSkeleton />;
    default:
      return null;
  }
}

// Individual skeleton components
const ProductSkeleton = () => (
  <div className="overflow-hidden w-full lg:w-[250px] lg:h-[220px] md:w-full md:h-auto border animate-pulse">
    <div className="h-full flex flex-col items-center justify-between">
      <div className="relative w-full h-[50%] flex items-center justify-center bg-gray-200"></div>
      <div className="bg-gray-300 w-full p-2 h-10"></div>
    </div>
  </div>
);

const EventSkeleton = () => (
  <Card className="space-y-4 border p-4">
    <div className="border-x border-t p-4">
      <div className="h-4 bg-gray-200 rounded w-3/4 mb-2 animate-pulse"></div>
      <div className="h-4 bg-gray-200 rounded w-1/2 mb-2 animate-pulse"></div>
      <div className="h-4 bg-gray-200 rounded w-5/6 animate-pulse"></div>
    </div>
  </Card>
);

const CatalogueSkeleton = () => (
  <div className="space-y-4 animate-pulse">
    <div className="h-6 bg-gray-200 rounded w-1/2 mb-4"></div>
    <div className="h-24 bg-gray-200 rounded w-[100px] mb-4"></div>
    <div className="h-10 bg-gray-200 rounded w-3/4"></div>
  </div>
);