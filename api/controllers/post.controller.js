import Post from '../../models/Post.js';
import { authenticate } from './auth.controller.js';

export const post =[authenticate, async (req, res) => {
    console.log('request . body at post route', req.body.media[0]);
    const content = req.body.content;
    const media = req.body.media[0];
    const id=req.body._id;
    console.log("id",id);
    try {
      const post = new Post({
        userId: id,
        content:content,
        media:media,
      });
  
      await post.save();
  
      // Optionally, you can also push the post to the user's posts array if you have such a field
      // const user = await User.findById(req.user._id);
      // user.posts.push(post._id);
      // await user.save();
  
      res.status(201).send(post);
    } catch (error) {
      res.status(400).send(error);
    }
  }];