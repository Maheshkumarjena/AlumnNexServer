import Post from '../../models/Post.js';
import { authenticate } from '../../middleware/auth.middleware.js';
import { upload } from '../../middleware/multer.middleware.js';
import uploadToCloudinary from '../utils/cloudinary.js';
import fs from 'fs';
import path from 'path';
import mongoose from 'mongoose'; // Import mongoose for ObjectId

// Ensure the uploads directory exists

const uploadFiles = async (files) => {
  try {
    const uploadPromises = files.map(file => {
      if (!fs.existsSync(file.path)) {
        throw new Error(`File not found: ${file.path}`);
      }
      return uploadToCloudinary(file.path);
    });
    return await Promise.all(uploadPromises);
  } catch (error) {
    console.error("Error uploading files to Cloudinary:", error);
    throw new Error("Failed to upload files to Cloudinary");
  }
};

const cleanupFiles = (files) => {
  files.forEach(file => {
    if (fs.existsSync(file.path)) {
      fs.unlinkSync(file.path); // Delete the file
    }
  });
};


// Create a new post
export const post = [
  authenticate,
  upload.array('files', 10),
  async (req, res) => {
    console.log('Request body at post route:', req.body);
    console.log('Uploaded files:', req.files);

    const content = req.body.content;
    const id=req.body.id;

    // Validate request body
    if (!content || !id) {
      return res.status(400).send({
        success: false,
        message: "Content and user ID are required",
      });
    }

    try {
      // Validate that the `id` is a valid 24-character hex string
      if (!mongoose.Types.ObjectId.isValid(id)) { // <-- Added validation for ObjectId
        return res.status(400).send({
          success: false,
          message: "Invalid user ID format",
        });
      }

      // Upload files to Cloudinary (if any)
      let mediaUrls = [];
      const files = req.files;

      if (files && files.length > 0) {
        console.log('Files to upload:', files);
        mediaUrls = await uploadFiles(files);
        console.log('Media URLs from Cloudinary:', mediaUrls);
        cleanupFiles(files); // Clean up temporary files
      }

      // Log the data being saved
      console.log('Data to save:', {
        userId: id,
        content,
        media: mediaUrls,
      });

      // Create a new post
      const post = new Post({
        userId: new mongoose.Types.ObjectId(id), // Convert string to ObjectId
        content,
        media: mediaUrls,
      });

      await post.save();

      res.status(201).send({
        success: true,
        message: "Post created successfully",
        data: post,
      });
      console.log('Post created successfully'); // <-- Fixed typo in log message
    } catch (error) {
      console.error("Error creating post:", error);
      res.status(400).send({
        success: false,
        message: "Failed to create post",
        error: error.message, // Include the specific error message
      });
    }
  }
];

// Get all posts for a user

export const getPosts = [authenticate, async (req, res) => {
  console.log(req.body)
  const { _id: userId } = req.body;

  try {
    const posts = await Post.find({ userId }).sort({ createdAt: -1 });

    res.status(200).send({
      success: true,
      message: "Posts retrieved successfully",
      data: posts,
    });
    console.log('post retrived and sent to client')
  } catch (error) {
    console.error("Error retrieving posts:", error);
    res.status(400).send({
      success: false,
      message: "Failed to retrieve posts",
      error: error.message,
    });
  }
}];
