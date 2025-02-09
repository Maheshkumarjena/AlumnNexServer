import Post from '../../models/Post.js';
import Comment from '../../models/Comment.js';
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
// Get all posts for a user
export const getPosts = [authenticate, async (req, res) => {
  console.log(req.body);
  const { _id: userId } = req.body;

  try {
    const posts = await Post.find({ userId })
      .sort({ createdAt: -1 })
      .populate({
        path: 'userId',
        select: '-password', // Exclude the password field
      })
      .populate({
        path: 'comments',
        populate: {
          path: 'userId', // Populate the user who commented
          select: 'username profilePicture ', // Fetch name & profile picture
        },
      });


    // Transform the response to change the key name from userId to user
    const transformedPosts = posts.map(post => {
      const { userId, comments, ...rest } = post._doc;
      return {
        ...rest,
        user: userId,
comments: comments.map(comment => ({
  ...comment._doc,
  commentedUser: comment.userId, // Rename userId to user
})),
      };
    });

    res.status(200).send({
      success: true,
      message: "Posts retrieved successfully",
      data: transformedPosts,
    });
    console.log('Posts retrieved and sent to client');
  } catch (error) {
    console.error("Error retrieving posts:", error);
    res.status(400).send({
      success: false,
      message: "Failed to retrieve posts",
      error: error.message,
    });
  }
}];


export const deletePost = [authenticate, async (req, res) => {}];

export const likePost = [authenticate, async (req, res) => {
  console.log("like post triggered");
  console.log("request . body at like post", req.body);

  const { postId, userId } = req.body;

  try {
    const post = await Post.findById(postId);
    if (!post) {
      return res.status(404).json({
        success: false,
        message: "Post not found",
      });
    }

    console.log("userId at like post============>", userId);

    // Check if userId is already in the likes array
    if (post.likes.includes(userId)) {
      console.log("You have already liked this post");
      return res.status(400).json({
        success: false,
        message: "You have already liked this post",
      });
    }

    // If not liked already, push userId to likes array
    post.likes.push(userId);
    await post.save(); // Ensure async save completes

    return res.status(200).json({
      success: true,
      message: "Post liked successfully",
      likes: post.likes.length,
    });
  } catch (error) {
    console.error("Error retrieving post:", error);
    return res.status(500).json({
      success: false,
      message: "Internal Server Error",
      error: error.message,
    });
  }
}];

export const commentPost = [authenticate, async (req, res) => {
  console.log("comment post triggered");
  console.log("request.body at comment post", req.body);

  const { userId, content, parentCommentId } = req.body;
  const postId = req.params.id;

  console.log("userId at comment post", userId);
  console.log("comment at comment post", content);
  console.log("postId at comment post", postId);
  console.log("parentCommentId at comment post", parentCommentId);

  try {
    const post = await Post.findById(postId);
    if (!post) {
      return res.status(404).json({ success: false, message: "Post not found" });
    }

    const newComment = new Comment({
      userId,
      postId,
      content,
      parentCommentId: parentCommentId || null,
    });

    await newComment.save();

    if (parentCommentId) {
      const parentComment = await Comment.findById(parentCommentId);
      if (parentComment) {
        parentComment.replies.push(newComment._id);
        await parentComment.save();
      }
    } else {
      post.comments.push(newComment._id);
      await post.save();
    }

    const updatedPost = await Post.findById(postId)
      .populate({
        path: "comments",
        populate: [
          {
            path: "userId",
            select: "username profilePicture",
          },
          {
            path: "replies",
            populate: {
              path: "userId",
              select: "username profilePicture",
            },
          },
        ],
      });

    console.log("comment added successfully");
    return res.status(200).json({
      success: true,
      message: "Comment added successfully",
      comments: updatedPost.comments,
    });
  } catch (error) {
    console.error("Error in commentPost:", error);
    return res.status(500).json({
      success: false,
      message: "Internal Server Error",
      error: error.message,
    });
  }
}];
