// frontend/src/components/PostList.js
import React, { useEffect, useState } from 'react';
import { getPosts } from '../services/postService';
import Post from './Post';

const PostList = () => {
  const [posts, setPosts] = useState([]);

  useEffect(() => {
    const fetchPosts = async () => {
      try {
        const { data } = await getPosts();
        setPosts(data.posts);
      } catch (error) {
        console.error('Failed to fetch posts', error);
      }
    };

    fetchPosts();
  }, []);

  return (
    <div className="post-list">
      {/*posts.length>0 && posts.map(post => (
        <Post key={post.id} post={post} />
      ))*/}
    </div>
  );
};

export default PostList;
