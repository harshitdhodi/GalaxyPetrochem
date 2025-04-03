import { useEffect, useState } from "react";
import axios from "axios";

export default function PromoSidebar() {
    const [images, setImages] = useState([]);
    const [currentImageIndex, setCurrentImageIndex] = useState(0);
    const BASE_URL = "/api/logo/download/"; // Change this to your actual image server path

    useEffect(() => {
        // Fetch images from API
        const fetchImages = async () => {
            try {
                const response = await axios.get("/api/slideShow/getAll");
              console.log(response.data)
                if (response.data) {
                    setImages(response.data.map(item => ({
                        url: `${BASE_URL}${item.image}`, // Construct full image URL
                        altText: item.altText || "Slideshow Image",
                        title: item.title || item.altText || "Slideshow Image" // Add this line
                    })));
                }
            } catch (error) {
                console.error("Error fetching slideshow images:", error);
            }
        };

        fetchImages();
    }, []);

    useEffect(() => {
        if (images.length > 0) {
            const interval = setInterval(() => {
                setCurrentImageIndex((prevIndex) => (prevIndex + 1) % images.length);
            }, 3000);

            return () => clearInterval(interval);
        }
    }, [currentImageIndex, images.length]);

    return (
        <div className="md:w-62 w-[100wh] relative h-[30vh] md:h-[68vh] overflow-hidden">
            {images.length > 0 ? (
                images.map((image, index) => (
                    <img
                        key={index}
                        src={image.url}
                        alt={image.altText}
                        title={image.title} // This will now correctly show the title from your data
                        className={`w-full h-full absolute object-cover transition-opacity duration-1000 ease-in-out ${index === currentImageIndex ? "opacity-100" : "opacity-0"
                            }`}
                    />
                ))
            ) : (
                <p className="text-center text-gray-500">Loading images...</p>
            )}
        </div>
    );
}
