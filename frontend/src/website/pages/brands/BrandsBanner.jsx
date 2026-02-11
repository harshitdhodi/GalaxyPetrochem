import { Link } from "react-router-dom"
import banner from "../../../assets/petrochemical.webp"

const BrandsBanner = ({ banners, location }) => {
  const formatSlugToTitle = (slug) => {
    if (!slug) return ""
    return slug
      .split("-")
      .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
      .join(" ")
  }

  const getBrandNameFromUrl = () => {
    const match = location.pathname.match(/\/brands\/([^/]+)/)
    if (match) {
      return decodeURIComponent(match[1])
    }
    return null
  }

  return (
    <div className="relative">
      {banners && banners.length > 0 ? (
        <img
          src={`/api/image/download/${banners[0].image}`}
          alt={banners[0].title}
          className="w-full h-48 sm:h-64 md:h-72 lg:h-80 object-cover"
        />
      ) : (
        <img
          src={banner || "/placeholder.svg"}
          alt="Default Banner"
          className="w-full h-48 sm:h-64 md:h-72 lg:h-80 object-cover"
        />
      )}

      <div className="absolute inset-0 bg-black bg-opacity-40"></div>

      <div className="absolute inset-0 flex flex-col justify-center items-center text-center px-4">
        {location.pathname === "/brands" ? (
          <h1 className="text-2xl  md:text-3xl font-bold text-white mb-4">Our Brands</h1>
        ) : location.pathname.startsWith("/brands/") ? (
          <h1 className="text-2xl  md:text-4xl font-bold text-white mb-4">
            {formatSlugToTitle(location.pathname.split("/")[2])}
          </h1>
        ) : null}

        <nav className=" px-4 py-2 rounded-md text-white text-sm sm:text-base font-semibold flex items-center flex-wrap justify-center">
          <Link to="/" className="hover:text-gray-300 transition-colors">
            <span className="text-md sm:text-md ">Home</span>
          </Link>
          <span className="mx-2">/</span>

          {location.pathname.startsWith("/brands") && (
            <>
              <Link to="/brands" className="hover:text-gray-300 transition-colors">
                <span className="text-md sm:text-md ">Brands</span>
              </Link>
              {getBrandNameFromUrl() && (
                <>
                  <span className="mx-2">/</span>
                  <span className="text-md sm:text-md ">{getBrandNameFromUrl()}</span>
                </>
              )}
            </>
          )}
        </nav>
      </div>
    </div>
  )
}

export default BrandsBanner
