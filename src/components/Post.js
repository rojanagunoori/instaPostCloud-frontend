import React, { useState, useEffect } from 'react';
import { CSSTransition, TransitionGroup } from 'react-transition-group';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faThumbsUp, faThumbsDown, faTrash, faEdit, faSave, faTimes } from '@fortawesome/free-solid-svg-icons';
import { db } from './firebaseConfig'; // Import the Firestore instance
import { collection, addDoc, onSnapshot, doc, deleteDoc, updateDoc,getDocs } from 'firebase/firestore';
import './styles.css'; // Make sure to import your CSS file with styles

const Post = () => {
  const [fileInput, setFileInput] = useState(null);
  const [descriptionInput, setDescriptionInput] = useState('');
  const [enteredPosts, setEnteredPosts] = useState([]);
  const [commentInput, setCommentInput] = useState('');
  const [editingPostId, setEditingPostId] = useState(null);
  const [editDescription, setEditDescription] = useState('');

  useEffect(() => {
    const unsubscribe = onSnapshot(collection(db, 'posts'), snapshot => {
      const posts = snapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      }));
      setEnteredPosts(posts);
    });

    return () => unsubscribe();
  }, []);

  const handleFileChange = (event) => {
    const file = event.target.files[0];
    if (file.size > 5 * 1024 * 1024 * 1024) {
      alert('File size exceeds 5GB limit.');
      // Optionally handle this case (e.g., reset file input)
    } else {
      setFileInput(file);
      // Optionally handle this case (e.g., show preview)
    }
  };

  const handleDescriptionChange = (event) => {
    setDescriptionInput(event.target.value);
  };

  const handleEditDescriptionChange = (event) => {
    setEditDescription(event.target.value);
  };

  const handleSubmit = async () => {
    const newPost = {
      imageUrl: URL.createObjectURL(fileInput),
      description: descriptionInput,
      likes: 0,
      dislikes: 0,
      comments: []
    };

    try {
      await addDoc(collection(db, 'posts'), newPost);
      setFileInput(null);
      setDescriptionInput('');
    } catch (error) {
      console.error('Error adding document: ', error);
    }
  };

  const handleCommentChange = (event) => {
    setCommentInput(event.target.value);
  };

  const handleCommentSubmit = async (postId) => {
    const newComment = {
      text: commentInput,
      likes: 0,
      dislikes: 0
    };
  
    try {
      const postRef = doc(db, 'posts', postId);
      const commentRef = await addDoc(collection(postRef, 'comments'), newComment);
      
      // Update local state
      const updatedPosts = enteredPosts.map(post => {
        if (post.id === postId) {
          return {
            ...post,
            comments: [...post.comments, { id: commentRef.id, ...newComment }]
          };
        }
        return post;
      });
      
      setEnteredPosts(updatedPosts);
      setCommentInput('');
    } catch (error) {
      console.error('Error adding comment: ', error);
    }
  };
  
  
  
  const handleLike = async (postIndex, commentIndex) => {
    const updatedPosts = [...enteredPosts];
    
    if (commentIndex !== undefined) {
      updatedPosts[postIndex].comments[commentIndex].likes++;
      const { id: postId, comments } = updatedPosts[postIndex];
      try {
        const commentId = comments[commentIndex].id;
        const commentRef = doc(db, 'posts', postId, 'comments', commentId);
        await updateDoc(commentRef, { likes: comments[commentIndex].likes });
      } catch (error) {
        console.error('Error updating comment likes: ', error);
      }
    } else {
      updatedPosts[postIndex].likes = (updatedPosts[postIndex].likes || 0) + 1;
      const { id: postId, likes } = updatedPosts[postIndex];
      try {
        const postRef = doc(db, 'posts', postId);
        await updateDoc(postRef, { likes });
      } catch (error) {
        console.error('Error updating post likes: ', error);
      }
    }
    
    setEnteredPosts(updatedPosts);
  };
  
  const handleDislike = async (postIndex, commentIndex) => {
    const updatedPosts = [...enteredPosts];
    
    if (commentIndex !== undefined) {
      updatedPosts[postIndex].comments[commentIndex].dislikes++;
      const { id: postId, comments } = updatedPosts[postIndex];
      try {
        const commentId = comments[commentIndex].id;
        const commentRef = doc(db, 'posts', postId, 'comments', commentId);
        await updateDoc(commentRef, { dislikes: comments[commentIndex].dislikes });
      } catch (error) {
        console.error('Error updating comment dislikes: ', error);
      }
    } else {
      updatedPosts[postIndex].dislikes = (updatedPosts[postIndex].dislikes || 0) + 1;
      const { id: postId, dislikes } = updatedPosts[postIndex];
      try {
        const postRef = doc(db, 'posts', postId);
        await updateDoc(postRef, { dislikes });
      } catch (error) {
        console.error('Error updating post dislikes: ', error);
      }
    }
    
    setEnteredPosts(updatedPosts);
  };

  const handlePostDelete = async (postId) => {
    try {
      await deleteDoc(doc(db, 'posts', postId));
      const updatedPosts = enteredPosts.filter(post => post.id !== postId);
      setEnteredPosts(updatedPosts);
    } catch (error) {
      console.error('Error deleting document: ', error);
    }
  };

  const handleCommentDelete = async (postId, commentId) => {
    try {
      await deleteDoc(doc(db, 'posts', postId, 'comments', commentId));
      const updatedPosts = [...enteredPosts];
      const postIndex = updatedPosts.findIndex(post => post.id === postId);
      if (postIndex !== -1) {
        updatedPosts[postIndex].comments = updatedPosts[postIndex].comments.filter(comment => comment.id !== commentId);
        setEnteredPosts(updatedPosts);
      }
    } catch (error) {
      console.error('Error deleting document: ', error);
    }
  };
  

  const handleEditComment = async (postId, commentId, newText) => {
    try {
      const commentRef = doc(db, 'posts', postId, 'comments', commentId);
      await updateDoc(commentRef, { text: newText });
      const updatedPosts = [...enteredPosts];
      const postIndex = updatedPosts.findIndex(post => post.id === postId);
      if (postIndex !== -1) {
        const commentIndex = updatedPosts[postIndex].comments.findIndex(comment => comment.id === commentId);
        if (commentIndex !== -1) {
          updatedPosts[postIndex].comments[commentIndex].text = newText;
          setEnteredPosts(updatedPosts);
        }
      }
    } catch (error) {
      console.error('Error updating document: ', error);
    }
  };

  const handleEditPost = async (postId, newDescription, newImageUrl) => {
    const updatedPost = {
      description: newDescription,
      imageUrl: newImageUrl
    };

    try {
      await updateDoc(doc(db, 'posts', postId), updatedPost);
      const updatedPosts = [...enteredPosts];
      const postIndex = updatedPosts.findIndex(post => post.id === postId);
      if (postIndex !== -1) {
        updatedPosts[postIndex].description = newDescription;
        updatedPosts[postIndex].imageUrl = newImageUrl;
        setEnteredPosts(updatedPosts);
        setEditingPostId(null);
      }
    } catch (error) {
      console.error('Error updating document: ', error);
    }
  };

  const toggleEditPost = (postId, currentDescription) => {
    setEditingPostId(postId);
    setEditDescription(currentDescription);
  };


  useEffect(() => {
    const unsubscribe = onSnapshot(collection(db, 'posts'), snapshot => {
      const posts = snapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      }));
      setEnteredPosts(posts);
      
      // Fetch comments for each post
      posts.forEach(async post => {
        const commentsSnapshot = await getDocs(collection(db, 'posts', post.id, 'comments'));
        const comments = commentsSnapshot.docs.map(doc => ({
          id: doc.id,
          ...doc.data()
        }));
        
        // Update local state with comments
        setEnteredPosts(prevPosts => prevPosts.map(prevPost => {
          if (prevPost.id === post.id) {
            return { ...prevPost, comments };
          }
          return prevPost;
        }));
      });
    });
  
    return () => unsubscribe();
  }, []);
  

  return (
    <div className="post-list">
      <div className="input-area">
        <input type="file" onChange={handleFileChange} />
        <textarea
          placeholder="Enter description..."
          value={descriptionInput}
          onChange={handleDescriptionChange}
        />
        <button onClick={handleSubmit}>Submit</button>
      </div>

      <TransitionGroup className="posts-container">
        {enteredPosts.map((post, postIndex) => (
          <CSSTransition key={post.id} classNames="post" timeout={500}>
            <div className="post">
              {editingPostId === post.id ? (
                <div className="edit-post">
                  <input type="file" onChange={handleFileChange} />
                  <textarea
                    value={editDescription}
                    onChange={handleEditDescriptionChange}
                  />
                  <div>
                    <button onClick={() => handleEditPost(post.id, editDescription, URL.createObjectURL(fileInput))}>
                      <FontAwesomeIcon icon={faSave} /> Save
                    </button>
                    <button onClick={() => setEditingPostId(null)}>
                      <FontAwesomeIcon icon={faTimes} /> Cancel
                    </button>
                  </div>
                </div>
              ) : (
                <div className="post-content">
                  <img src={post.imageUrl} alt="Post" />
                  <p>{post.description}</p>
                  <div className="post-actions">
                    <button onClick={() => handleLike(postIndex)}>
                      <FontAwesomeIcon icon={faThumbsUp} /> {post.likes}
                    </button>
                    <button onClick={() => handleDislike(postIndex)}>
                      <FontAwesomeIcon icon={faThumbsDown} /> {post.dislikes}
                    </button>
                    <button onClick={() => handlePostDelete(post.id)}>
                      <FontAwesomeIcon icon={faTrash} /> Delete
                    </button>
                    <button onClick={() => toggleEditPost(post.id, post.description)}>
                      <FontAwesomeIcon icon={faEdit} /> Edit
                    </button>
                  </div>
                  <div className="comments-section">
                    <div className="add-comment">
                      <textarea
                        placeholder="Add a comment..."
                        value={commentInput}
                        onChange={handleCommentChange}
                      />
                      <button onClick={() => handleCommentSubmit(post.id)}>Submit</button>
                    </div>
                    {post.comments && post.comments.map((comment, commentIndex) => (
                      <div key={comment.id} className="comment">
                        <p>{comment.text}</p>
                        <div className="comment-actions">
                          <button onClick={() => handleLike(postIndex, commentIndex)}>
                            <FontAwesomeIcon icon={faThumbsUp} /> {comment.likes}
                          </button>
                          <button onClick={() => handleDislike(postIndex, commentIndex)}>
                            <FontAwesomeIcon icon={faThumbsDown} /> {comment.dislikes}
                          </button>
                          <button onClick={() => handleCommentDelete(post.id, comment.id)}>
                            <FontAwesomeIcon icon={faTrash} /> Delete
                          </button>
                          <button onClick={() => handleEditComment(post.id, comment.id, prompt('Edit comment', comment.text))}>
                            <FontAwesomeIcon icon={faEdit} /> Edit
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </CSSTransition>
        ))}
      </TransitionGroup>
    </div>
  );
};

export default Post;
