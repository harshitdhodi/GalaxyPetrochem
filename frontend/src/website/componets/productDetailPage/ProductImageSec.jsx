export default function ImageSection({ images, selectedImage, setSelectedImage }) {
  console.log(images); // To verify the structure of the images array

  return (
    <div className="sm:w-[80%] md:w-[100%] mb-5 lg:mb-0">
      {/* Main Image Section */}
      <div className="border items-center flex justify-center p-5 overflow-hidden mb-4 lg:h-[400px] md:h-[300px] h-[200px]">
        <img
          src={images[selectedImage]?.url ? `/api/image/download/${images[selectedImage].url}` : "https://via.placeholder.com/300x300?text=No+Image+Available"}
          alt={images[selectedImage]?.alt || "Chemical bottles with blue liquid"}
          className="w-full h-full object-contain"
        />
      </div>

      {/* Thumbnail Section */}
      <div className="flex gap-4">
        {images.map((img, index) => (
          <button
            key={index}
            onClick={() => setSelectedImage(index)}
            className={`border px-3 overflow-hidden w-26 h-24 ${
              selectedImage === index ? "border-primary" : ""
            }`}
          >
            <img
              src={img.url ? `/api/image/download/${img.url}` : "https://via.placeholder.com/150x150?text=No+Thumbnail"}
              alt={img.alt || `Thumbnail ${index + 1}`}
              className="w-full h-full object-cover"
            />
          </button>
        ))}
      </div>
    </div>
  );
}