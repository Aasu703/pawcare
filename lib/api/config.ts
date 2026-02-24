// API configuration 

const RAW_API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL || "http://localhost:5050";

// Normalize the API base URL by removing any trailing slashes
const NORMALIZED_API_BASE_URL = RAW_API_BASE_URL.replace(/\/+$/, "");

export const API_CONFIG = {
    baseURL: `${NORMALIZED_API_BASE_URL}`, // Ensure the base URL ends with /api
    BASE_URL: NORMALIZED_API_BASE_URL, // Keep the normalized base URL for other uses

    // Always return a string for Next/IMage `src`. Use a local fallback image when missing.
    getImageUrl : (imagePath: string | undefined | null): string => {
        const baseUrl = NORMALIZED_API_BASE_URL; // Use the normalized base URL
        if (!imagePath) {
            return `${baseUrl}/images/default-pet.png`; // Fallback image for missing paths
        }
        return `${baseUrl}${imagePath}`; // Construct the full URL for valid image paths
    }
};

export default API_CONFIG; 