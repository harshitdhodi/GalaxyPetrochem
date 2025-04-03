export default function Copyright() {
    return (
      <div className="w-full relative bg-black/95 p-2">
        <div className="max-w-[75rem] mx-auto text-left text-gray-500 text-sm">
          <p>&copy; {new Date().getFullYear()} Vihani Enterprise. All rights reserved.</p>
        </div>
      </div>
    );
  }