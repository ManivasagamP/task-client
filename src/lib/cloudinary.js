// Browser-compatible Cloudinary configuration
const CLOUDINARY_CONFIG = {
    cloud_name: import.meta.env.VITE_CLOUDINARY_CLOUD_NAME,
    api_key: import.meta.env.VITE_CLOUDINARY_API_KEY,
    upload_preset: import.meta.env.VITE_CLOUDINARY_UPLOAD_PRESET,
    api_secret: import.meta.env.VITE_CLOUDINARY_API_SECRET
};

// Direct upload function using Cloudinary's upload API
export const uploadToCloudinary = async (file) => {
    const formData = new FormData();
    formData.append('file', file);
    formData.append('upload_preset', CLOUDINARY_CONFIG.upload_preset);
    formData.append('cloud_name', CLOUDINARY_CONFIG.cloud_name);

    try {
        const response = await fetch(
            `https://api.cloudinary.com/v1_1/${CLOUDINARY_CONFIG.cloud_name}/image/upload`,
            {
                method: 'POST',
                body: formData,
            }
        );

        if (!response.ok) {
            throw new Error(`Upload failed: ${response.statusText}`);
        }

        const data = await response.json();
        return data.secure_url;
    } catch (error) {
        console.error('Error uploading to Cloudinary:', error);
        throw error;
    }
};

export default CLOUDINARY_CONFIG;