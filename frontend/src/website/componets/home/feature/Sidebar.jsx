// EventsSection.jsx
import { Card } from "@/components/ui/card";
import LoadingSkeleton from "./Skeleton";

export default function EventsSection({ event, isLoading }) {
  if (isLoading) {
    return <LoadingSkeleton type="event" />;
  }

  if (!event) {
    return <div className="text-gray-500">No upcoming events</div>;
  }

  return (
    <Card className="space-y-4 border p-4">
      <div className="border-x border-t p-4">
        <div dangerouslySetInnerHTML={{ __html: event.events }} />
      </div>
    </Card>
  );
}


