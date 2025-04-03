// CataloguesSection.jsx
import { Button } from "@/components/ui/button";
import { ArrowRight } from "lucide-react";
import LoadingSkeleton from "./Skeleton";
import CatalogueItem from "./CatalogItem";

export default function CataloguesSection({ catalogues, isLoading }) {
  if (isLoading) {
    return <LoadingSkeleton type="catalogues" />;
  }

  if (!catalogues || catalogues.length === 0) {
    return <div className="text-gray-500">No catalogues available</div>;
  }

  return (
    <div className="space-y-4">
      {catalogues.map((catalogue, index) => (
        <CatalogueItem key={index} catalogue={catalogue} />
      ))}
    </div>
  );
}