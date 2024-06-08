import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { db } from '../../config/firebaseConfig';
import { doc, getDoc } from 'firebase/firestore';

const BlogPost = () => {
  const { postId } = useParams();
  const [post, setPost] = useState(null);

  useEffect(() => {
    const fetchPost = async () => {
      const postDoc = doc(db, 'blogPosts', postId);
      const postSnap = await getDoc(postDoc);
      if (postSnap.exists()) {
        setPost(postSnap.data());
      } else {
        console.log('No such document!');
      }
    };

    fetchPost();
  }, [postId]);

  if (!post) return <div className="p-4">Loading...</div>;

  return (
    <div className="p-4">
      <h1 className="text-3xl font-bold mb-4">{post.title}</h1>
      <img src={post.imageUrl} alt={post.title} className="object-cover h-full w-full mb-4" />
      <p>{post.content}</p>
    </div>
  );
};

export default BlogPost;
