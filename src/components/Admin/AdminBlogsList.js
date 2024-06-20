import React, { useEffect, useState } from "react";
import { db, storage } from "../../config/firebaseConfig";
import {
  collection,
  getDocs,
  addDoc,
  updateDoc,
  doc,
  deleteDoc,
  getDoc,
} from "firebase/firestore";
import { ref, uploadBytes, getDownloadURL } from "firebase/storage";
import { Link, useNavigate, useParams } from "react-router-dom";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import ReactQuill from "react-quill";
import "react-quill/dist/quill.snow.css";
import imageCompression from "browser-image-compression";

const AdminBlogForm = ({
  blog,
  handleSave,
  handleChange,
  handleFileChange,
  handleImageChange,
  handleEditorChange,
  file,
  imageFile,
}) => {
  const handleFileUpload = async () => {
    let videoURL = blog.videoURL || "";

    if (file) {
      const storageRef = ref(storage, `blogs/videos/${file.name}`);
      await uploadBytes(storageRef, file);
      videoURL = await getDownloadURL(storageRef);
    }

    return videoURL;
  };

  const handleImageUpload = async () => {
    let imageURL = blog.image || "";

    if (imageFile) {
      const compressedFile = await imageCompression(imageFile, {
        maxSizeMB: 0.1,
        maxWidthOrHeight: 800,
        useWebWorker: true,
      });
      const imageRef = ref(storage, `blogs/images/${imageFile.name}`);
      await uploadBytes(imageRef, compressedFile);
      imageURL = await getDownloadURL(imageRef);
    }

    return imageURL;
  };

  return (
    <div className="p-6 bg-white rounded-lg shadow-md">
      <h2 className="text-2xl font-bold mb-4">Crear/Editar Blog</h2>
      <form
        onSubmit={(e) => {
          e.preventDefault();
          handleSave(handleFileUpload, handleImageUpload);
        }}
      >
        <div className="mb-6">
          <label className="block text-gray-700 mb-2">Título</label>
          <input
            type="text"
            name="title"
            className="w-full p-3 border border-gray-300 rounded-lg"
            placeholder="Ingrese el título del blog"
            value={blog.title || ""}
            onChange={handleChange}
            required
          />
        </div>
        <div className="mb-6">
          <label className="block text-gray-700 mb-2">Descripción</label>
          <ReactQuill
            value={blog.description || ""}
            onChange={handleEditorChange}
            theme="snow"
            className="w-full p-3 border border-gray-300 rounded-lg"
          />
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
          <div className="col-span-1">
            <label className="block text-gray-700 mb-2">Video</label>
            <input
              type="file"
              className="w-full p-3 border border-gray-300 rounded-lg"
              onChange={handleFileChange}
            />
          </div>
          <div className="col-span-1">
            <label className="block text-gray-700 mb-2">Imagen de Fondo</label>
            <input
              type="file"
              className="w-full p-3 border border-gray-300 rounded-lg"
              onChange={handleImageChange}
            />
          </div>
        </div>
        <button
          type="submit"
          className="w-full bg-red-600 text-white py-3 rounded-lg hover:bg-red-700 transition duration-300"
        >
          {blog.id ? "Actualizar" : "Crear"}
        </button>
      </form>
    </div>
  );
};

const AdminBlogsList = () => {
  const [blogs, setBlogs] = useState([]);
  const [formState, setFormState] = useState({
    title: "",
    description: "",
    videoURL: "",
    image: "",
  });
  const [file, setFile] = useState(null);
  const [imageFile, setImageFile] = useState(null);
  const [showVideo, setShowVideo] = useState(false);
  const navigate = useNavigate();
  const { blogId } = useParams();

  useEffect(() => {
    const fetchBlogs = async () => {
      const blogsCollection = collection(db, "blogs");
      const blogsSnapshot = await getDocs(blogsCollection);
      const blogsList = blogsSnapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      }));
      setBlogs(blogsList);
    };

    fetchBlogs();

    if (blogId) {
      fetchBlog(blogId);
    }
  }, [blogId]);

  const fetchBlog = async (id) => {
    const blogDoc = doc(db, "blogs", id);
    const blogSnap = await getDoc(blogDoc);
    if (blogSnap.exists()) {
      setFormState(blogSnap.data());
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormState((prevState) => ({
      ...prevState,
      [name]: value,
    }));
  };

  const handleEditorChange = (value) => {
    setFormState((prevState) => ({
      ...prevState,
      description: value,
    }));
  };

  const handleFileChange = (e) => {
    setFile(e.target.files[0]);
  };

  const handleImageChange = (e) => {
    setImageFile(e.target.files[0]);
  };

  const handleSave = async (handleFileUpload, handleImageUpload) => {
    const videoURL = await handleFileUpload();
    const imageURL = await handleImageUpload();

    const stripHtmlTags = (html) => {
      const doc = new DOMParser().parseFromString(html, "text/html");
      return doc.body.textContent || "";
    };

    const blogData = {
      ...formState,
      videoURL,
      image: imageURL,
      description: stripHtmlTags(formState.description),
    };

    try {
      if (blogId) {
        const blogDoc = doc(db, "blogs", blogId);
        await updateDoc(blogDoc, blogData);
        toast.success("Blog actualizado correctamente", {
          position: "bottom-right",
        });
      } else {
        const docRef = await addDoc(collection(db, "blogs"), blogData);
        toast.success("Blog creado correctamente", {
          position: "bottom-right",
        });
        navigate(`/blogs/${docRef.id}`);
      }
    } catch (error) {
      console.error("Error adding/updating document: ", error);
      toast.error("Hubo un error al procesar la acción", {
        position: "bottom-right",
      });
    }
  };

  const handleDelete = async (id) => {
    try {
      const blogDoc = doc(db, "blogs", id);
      await deleteDoc(blogDoc);
      setBlogs((prevBlogs) => prevBlogs.filter((blog) => blog.id !== id));
      toast.success("Blog eliminado correctamente", {
        position: "bottom-right",
      });
    } catch (error) {
      console.error("Error deleting document: ", error);
      toast.error("Hubo un error al eliminar el blog", {
        position: "bottom-right",
      });
    }
  };

  return (
    <div className="container mx-auto mt-6">
      <ToastContainer />
      <h1 className="text-3xl font-bold text-center mb-6">Listado de Blogs</h1>
      <div className="flex">
        <div className="w-1/2">
          <AdminBlogForm
            blog={formState}
            handleSave={handleSave}
            handleChange={handleChange}
            handleFileChange={handleFileChange}
            handleImageChange={handleImageChange}
            handleEditorChange={handleEditorChange}
            file={file}
            imageFile={imageFile}
          />
        </div>
        <div className="w-1/2 pl-4">
          <h2 className="text-2xl font-bold mb-4">Vista previa del Blog</h2>
          <div className="flex">
            <div className="w-1/2">
              <div className="relative h-64 w-full bg-gray-200">
                {formState.image && (
                  <img
                    src={formState.image}
                    alt="Blog"
                    className="w-full h-full object-cover"
                  />
                )}
                {formState.videoURL && (
                  <video
                    controls
                    className="w-full h-full object-cover absolute top-0 left-0"
                  >
                    <source src={formState.videoURL} type="video/mp4" />
                    Tu navegador no soporta la etiqueta de video.
                  </video>
                )}
              </div>
              {formState.videoURL && (
                <button
                  onClick={() => setShowVideo(!showVideo)}
                  className="bg-blue-600 text-white py-2 px-4 rounded-lg hover:bg-blue-700 transition duration-300 mt-2"
                >
                  {showVideo ? "Ocultar Video" : "Ver Video"}
                </button>
              )}
            </div>
            <div className="w-1/2 pl-4">
              <h2 className="text-2xl font-bold">{formState.title}</h2>
              <div
                dangerouslySetInnerHTML={{ __html: formState.description }}
                className="text-gray-700"
              ></div>
            </div>
          </div>
        </div>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-6">
        {blogs.map((blog) => (
          <div key={blog.id} className="bg-white rounded-lg shadow-md p-6">
            <div
              className="h-40 bg-cover bg-center mb-4"
              style={{ backgroundImage: `url(${blog.image})` }}
            ></div>
            <h2 className="text-2xl font-bold">{blog.title}</h2>
            <p className="text-gray-700">{blog.description}</p>
            <div className="flex justify-between mt-4">
              <Link
                to={`/admin/edit-blog/${blog.id}`}
                className="bg-blue-600 text-white py-2 px-4 rounded-lg hover:bg-blue-700 transition duration-300"
              >
                Editar
              </Link>
              <button
                onClick={() => handleDelete(blog.id)}
                className="bg-red-600 text-white py-2 px-4 rounded-lg hover:bg-red-700 transition duration-300"
              >
                Eliminar
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default AdminBlogsList;
