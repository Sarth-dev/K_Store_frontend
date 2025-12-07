export default function ProductSkeleton() {
  return (
    <div className="animate-pulse bg-white rounded-xl shadow-md overflow-hidden">
      <div className="bg-gray-200 h-48 w-full"></div>

      <div className="p-4 space-y-3">
        <div className="h-4 bg-gray-300 rounded w-3/4"></div>
        <div className="h-4 bg-gray-200 rounded w-1/2"></div>
        <div className="h-5 bg-gray-300 rounded w-1/4"></div>
        <div className="h-8 bg-blue-200 rounded w-full mt-3"></div>
      </div>
    </div>
  );
}
