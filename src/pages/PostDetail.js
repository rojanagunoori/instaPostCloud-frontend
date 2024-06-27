// frontend/src/pages/PostDetail.js
import React from 'react';
import { useParams } from 'react-router-dom';

const PostDetail = () => {
  const { postId } = useParams();

  // Fetch post details based on postId from API or local state

  return (
    <div className="post-detail">
      <h2>Post Detail</h2>
      <p>Post ID: {postId}</p>
      {/* Display more details of the post */}
    </div>
  );
};

export default PostDetail;
