import PropTypes from 'prop-types'; // Import PropTypes

export function Banner({ imageUrl, title }) {
  return (
    <div className="relative w-full h-[30vh] lg:h-[250px]">
      {/* Banner Image */}
      <img 
        src={imageUrl}
        alt="Banner"
        className="w-full h-full object-fill"
      />
       
      {/* Overlay */}
      <div className="absolute inset-0 bg-black bg-opacity-45"></div>

      {/* Title */}
      <div className="absolute inset-0 flex items-center justify-center">
        <h1 className="text-white text-2xl lg:text-3xl font-bold text-center">
          {title}
        </h1>
      </div>
    </div>
  );
}

// Add PropTypes validation for Banner
Banner.propTypes = {
  imageUrl: PropTypes.string.isRequired, // Validate imageUrl as a required string
  title: PropTypes.string, // Validate title as an optional string
};