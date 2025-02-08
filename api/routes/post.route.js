import express from 'express';
import { likePost, post } from '../controllers/post.controller.js';
import { getPosts } from '../controllers/post.controller.js';

const router = express.Router();


router.post('/upload', post);
router.post('/getPosts',getPosts)
router.post('/likePost',likePost)

export default router;