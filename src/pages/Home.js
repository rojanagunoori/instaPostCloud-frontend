// frontend/src/pages/Home.js
import React from 'react';
import PostList from '../components/PostList';

const Home = () => {
  return (
    <div className="home">
      <h2>Home</h2>
      <PostList />
    </div>
  );
};

export default Home;
