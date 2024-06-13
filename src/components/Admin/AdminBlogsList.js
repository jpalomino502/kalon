import React, { useEffect, useState } from 'react';
import { db, storage } from '../../config/firebaseConfig';
import { collection, getDocs, addDoc, updateDoc, doc, deleteDoc, getDoc } from 'firebase/firestore';
import { ref, uploadBytes, getDownloadURL } from 'firebase/storage';
import { Link, useNavigate, useParams } from 'react-router-dom';
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

const AdminBlogsList = () => {
  const [blogs, setBlogs] = useState([]);
  const [formState, setFormState] = useState({ title: '', summary: '', content: '', imageURL: '', category: '' });
  const [file, setFile] = useState(null);
  const navigate = useNavigate();
  const { postId } = useParams();

  useEffect(() => {
    const fetchBlogs = async () => {
      const blogsCollection = collection(db, 'blogPosts');
      const blogsSnapshot = await getDocs(blogsCollection);
      const blogsList = blogsSnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
      setBlogs(blogsList);
    };

    fetchBlogs();

    if (postId) {
      fetchBlog(postId);
    }
  }, [postId]);

  const fetchBlog = async (id) => {
    const postDoc = doc(db, 'blogPosts', id);
    const postSnap = await getDoc(postDoc);
    if (postSnap.exists()) {
      setFormState(postSnap.data());
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormState({ ...formState, [name]: value });
  };

  const handleFileChange = (e) => {
    setFile(e.target.files[0]);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    let imageURL = formState.imageURL;

    if (file) {
      const storageRef = ref(storage, `blogPosts/${file.name}`);
      await uploadBytes(storageRef, file);
      imageURL = await getDownloadURL(storageRef);
    }

    const postData = { ...formState, imageURL };

    try {
      if (postId) {
        const postDoc = doc(db, 'blogPosts', postId);
        await updateDoc(postDoc, postData);
        toast.success('Blog actualizado correctamente', { position: 'bottom-right' });
      } else {
        await addDoc(collection(db, 'blogPosts'), postData);
        toast.success('Blog creado correctamente', { position: 'bottom-right' });
      }
      setTimeout(() => {
        navigate('/admin/blogs');
      }, 5000); // Redireccionar después de 5 segundos
    } catch (error) {
      console.error("Error adding/updating document: ", error);
      toast.error('Hubo un error al procesar la acción', { position: 'bottom-right' });
    }
  };

  const handleDelete = async (id) => {
    try {
      const postDoc = doc(db, 'blogPosts', id);
      await deleteDoc(postDoc);
      setBlogs(blogs.filter(blog => blog.id !== id));
      toast.success('Blog eliminado correctamente', { position: 'bottom-right' });
    } catch (error) {
      console.error("Error deleting document: ", error);
      toast.error('Hubo un error al eliminar el blog', { position: 'bottom-right' });
    }
  };

  return (
    <div>
      <ToastContainer />
      <h1 className="text-3xl font-bold mb-6">Listado de Blogs</h1>
      <form onSubmit={handleSubmit} className="mb-6">
        <div className="mb-4">
          <label className="block text-gray-700 mb-2">Título</label>
          <input
            type="text"
            name="title"
            className="w-full p-2 border border-gray-300 rounded"
            placeholder="Ingrese el título del post"
            value={formState.title}
            onChange={handleChange}
            required
          />
        </div>
        <div className="mb-4">
          <label className="block text-gray-700 mb-2">Resumen</label>
          <textarea
            name="summary"
            className="w-full p-2 border border-gray-300 rounded"
            placeholder="Ingrese el resumen del post"
            value={formState.summary}
            onChange={handleChange}
            required
          ></textarea>
        </div>
        <div className="mb-4">
          <label className="block text-gray-700 mb-2">Contenido</label>
          <textarea
            name="content"
            className="w-full p-2 border border-gray-300 rounded"
            placeholder="Ingrese el contenido del post"
            value={formState.content}
            onChange={handleChange}
            required
          ></textarea>
        </div>
        <div className="mb-4">
          <label className="block text-gray-700 mb-2">Imagen</label>
          <input
            type="file"
            className="w-full p-2 border border-gray-300 rounded"
            onChange={handleFileChange}
          />
        </div>
        <div className="mb-4">
          <label className="block text-gray-700 mb-2">Categoría</label>
          <select
            name="category"
            className="w-full p-2 border border-gray-300 rounded"
            value={formState.category}
            onChange={handleChange}
            required
          >
            <option value="">Seleccione una categoría</option>
            <option value="Technology">Tecnología</option>
            <option value="Business">Negocios</option>
            <option value="Lifestyle">Estilo de vida</option>
          </select>
        </div>
        <button type="submit" className="bg-red-600 text-white px-4 py-2 rounded">
          {postId ? 'Actualizar' : 'Crear'}
        </button>
      </form>
      <ul>
        {blogs.map(blog => (
          <li key={blog.id} className="mb-4">
            <Link to={`/admin/blog/edit/${blog.id}`} className="text-red-600 hover:underline">
              {blog.title}
            </Link>
            <button onClick={() => handleDelete(blog.id)} className="ml-4 text-red-600 hover:underline">
              Borrar
            </button>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default AdminBlogsList;
