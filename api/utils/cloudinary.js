import { v2 as cloudinary } from 'cloudinary';
import fs from 'fs'; 

    // Configuration

    console.log("cloudinary config:",process.env.CLOUDINARY_API_KEY,process.env.CLOUDINARY_API_SECRET)

cloudinary.config({ 
    cloud_name: 'diiopqo1y', 
    api_key: '556316231398198', 
    api_secret: "tFVVkEkNjKlic2gKQCRU6PsMROk" // Click 'View API Keys' above to copy your API secret
});

export const uploadToCloudinary = async (localFilePath) => {
    try {
        if (!localFilePath) {
            throw new Error('File path is required');
        }

        // Upload a file to Cloudinary
        const response = await cloudinary.uploader.upload(localFilePath, {
            resource_type: 'auto',
            public_id: 'sample_image',
        });

        console.log("Uploaded URL:", response.url);
        return response.url; // Return the uploaded URL

    } catch (error) {
        // Remove the locally saved temporary file as the operation failed
        if (fs.existsSync(localFilePath)) {
            fs.unlinkSync(localFilePath);
        }
        console.log("Cloudinary upload failed:", error);
        throw error; // Re-throw the error for handling in the calling function
    }
};

export default uploadToCloudinary