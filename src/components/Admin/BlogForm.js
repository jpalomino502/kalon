import React, { useState, useEffect } from 'react';
import { db, storage } from '../../config/firebaseConfig';
import { collection, addDoc, doc, updateDoc, getDoc } from 'firebase/firestore';
import { ref, uploadBytes, getDownloadURL } from 'firebase/storage';
import { useNavigate, useParams } from 'react-router-dom';

const BlogForm = () => {
  const [post, setPost] = useState({ title: '', summary: '', content: '', imageURL: '' });
  const [file, setFile] = useState(null);
  const navigate = useNavigate();
  const { postId } = useParams();

  useEffect(() => {
    const fetchPost = async () => {
      if (postId) {
        const postDoc = doc(db, 'blogPosts', postId);
        const postSnap = await getDoc(postDoc);
        if (postSnap.exists()) {
          setPost(postSnap.data());
        }
      }
    };

    fetchPost();
  }, [postId]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setPost({ ...post, [name]: value });
  };

  const handleFileChange = (e) => {
    setFile(e.target.files[0]);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    let imageURL = post.imageURL;

    if (file) {
      const storageRef = ref(storage, `blogPosts/${file.name}`);
      const uploadTask = uploadBytes(storageRef, file);

      // Esperar a que la tarea de carga se complete
      await uploadTask;

      // Obtener la URL de descarga después de que la tarea de carga se complete
      imageURL = await getDownloadURL(storageRef);
    }

    const postData = { ...post, imageURL };

    try {
      if (postId) {
        const postDoc = doc(db, 'blogPosts', postId);
        await updateDoc(postDoc, postData);
      } else {
        await addDoc(collection(db, 'blogPosts'), postData);
      }
      navigate('/admin/blogs');
    } catch (error) {
      console.error("Error adding document: ", error);
    }
  };

  return (
    <div className="max-w-2xl mx-auto p-6 bg-white shadow-md rounded-lg">
      <h1 className="text-2xl font-semibold mb-4">{postId ? 'Edit Blog Post' : 'Create New Blog Post'}</h1>
      <form onSubmit={handleSubmit} className="space-y-6">
        <div>
          <label className="block text-sm font-medium text-gray-700">Title</label>
          <input
            type="text"
            name="title"
            value={post.title}
            onChange={handleChange}
            className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2"
            required
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700">Summary</label>
          <textarea
            name="summary"
            value={post.summary}
            onChange={handleChange}
            className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2"
            required
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700">Content</label>
          <textarea
            name="content"
            value={post.content}
            onChange={handleChange}
            className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2"
            required
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700">Image</label>
          <input type="file" onChange={handleFileChange} />
        </div>
        <button
          type="submit"
          className="w-full px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
        >
          Save
        </button>
      </form>
    </div>
  );
};

export default BlogForm;
