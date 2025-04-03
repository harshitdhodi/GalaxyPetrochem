import { useLocation, Link } from "react-router-dom";

export default function SearchResultsTable() {
  const location = useLocation();
  const { results, searchTerm } = location.state || { results: [], searchTerm: "Unknown" };

  return (
    <div className="flex justify-center w-full">
      <div className="w-full max-w-7xl p-6">
        <h1 className="text-2xl font-semibold mb-4">
          Search Results for "{searchTerm}"
        </h1>

        <table className="w-full border-collapse border border-gray-300">
          <thead className="bg-main text-white">
            <tr>
              <th className="border border-gray-300 p-2">Product Name</th>
              <th className="border border-gray-300 p-2">Category</th>
              <th className="border border-gray-300 p-2">Price</th>
            </tr>
          </thead>
          <tbody>
            {results.length > 0 ? (
              results.map((chemical, index) => (
                <tr key={index} className="bg-blue-50">
                  <td className="border border-gray-300 p-2">
                    <Link
                      to={`/${chemical.category.slug}/${chemical.slug}`}
                      className="text-main hover:underline cursor-pointer"
                    >
                      {chemical.name}
                    </Link>
                  </td>
                  <td className="border border-gray-300 p-2">
                    <Link
                      to={`/${chemical.category.slug}`}
                      className="text-main hover:underline cursor-pointer"
                    >
                      {chemical.category.category || 'N/A'}
                    </Link>
                  </td>
                  <td className="border border-gray-300 p-2">{chemical.price || 'N/A'} /piece</td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan="3" className="border border-gray-300 p-2 text-center">
                  No results found
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
