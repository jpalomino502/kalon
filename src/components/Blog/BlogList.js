import React, { useEffect, useState } from 'react';
import { db } from '../../config/firebaseConfig';
import { collection, getDocs } from 'firebase/firestore';
import { Link } from 'react-router-dom';

const BlogList = () => {
  const [posts, setPosts] = useState([]);

  useEffect(() => {
    const fetchPosts = async () => {
      const postsCollection = collection(db, 'blogPosts');
      const postSnapshot = await getDocs(postsCollection);
      const postList = postSnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
      setPosts(postList);
    };

    fetchPosts();
  }, []);

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 p-4">
      {posts.map(post => (
        <div key={post.id} className="bg-white rounded-lg shadow-md overflow-hidden">
          <div className="bg-gray-200 h-48 flex items-center justify-center">
            <img src={post.imageUrl || 'default-image.png'} alt={post.title} className="object-cover h-full w-full" />
          </div>
          <div className="p-4">
            <h2 className="text-xl font-bold mb-2">{post.title}</h2>
            <p className="text-gray-700 mb-4">{post.summary}</p>
            <Link to={`/blog/${post.id}`} className="text-indigo-500 hover:text-indigo-600">
              Leer más
            </Link>
          </div>
        </div>
      ))}
    </div>
  );
};

export default BlogList;
