import PropTypes from 'prop-types'; // Import PropTypes

export function Banner({ imageUrl }) {
  return (
    <div className="relative w-full h-[30vh] lg:h-[250px]">
      {/* Banner Image */}
      <img 
        src={imageUrl}
        alt="Banner"
        className="w-full h-full object-fill"
      />
       
      {/* Overlay */}
      {/* <div className="absolute inset-0 bg-black bg-opacity-30"></div> */}
    </div>
  );
}

// Add PropTypes validation for Banner
Banner.propTypes = {
  imageUrl: PropTypes.string.isRequired, // Validate imageUrl as a required string
};