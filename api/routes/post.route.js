import express from 'express';
import { getPostById, likePost, post, sharePost } from '../controllers/post.controller.js';
import { getPosts } from '../controllers/post.controller.js';
import { commentPost } from '../controllers/post.controller.js';
const router = express.Router();


router.post('/upload', post);
router.post('/getPosts',getPosts)
router.post('/likePost',likePost)
router.post('/commentPost/:id',commentPost)
router.post('/:postId/share',sharePost)
router.post('/:postId',getPostById)

export default router;