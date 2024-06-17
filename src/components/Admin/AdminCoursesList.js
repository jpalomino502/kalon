import React, { useEffect, useState } from 'react';
import { db, storage } from '../../config/firebaseConfig';
import { collection, getDocs, addDoc, updateDoc, doc, deleteDoc, getDoc } from 'firebase/firestore';
import { ref, uploadBytes, getDownloadURL } from 'firebase/storage';
import { Link, useNavigate, useParams } from 'react-router-dom';
import { toast, ToastContainer } from 'react-toastify';
import imageCompression from 'browser-image-compression';
import 'react-toastify/dist/ReactToastify.css';

const AdminCoursesList = () => {
  const [courses, setCourses] = useState([]);
  const [formState, setFormState] = useState({ title: '', description: '', videoURL: '', category: '', image: '', price: '', duration: '' });
  const [file, setFile] = useState(null);
  const [imageFile, setImageFile] = useState(null);
  const navigate = useNavigate();
  const { courseId } = useParams();

  useEffect(() => {
    const fetchCourses = async () => {
      const coursesCollection = collection(db, 'courses');
      const coursesSnapshot = await getDocs(coursesCollection);
      const coursesList = coursesSnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
      setCourses(coursesList);
    };

    fetchCourses();

    if (courseId) {
      fetchCourse(courseId);
    }
  }, [courseId]);

  const fetchCourse = async (id) => {
    const courseDoc = doc(db, 'courses', id);
    const courseSnap = await getDoc(courseDoc);
    if (courseSnap.exists()) {
      setFormState(courseSnap.data());
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormState({ ...formState, [name]: value });
  };

  const handleFileChange = (e) => {
    setFile(e.target.files[0]);
  };

  const handleImageChange = (e) => {
    setImageFile(e.target.files[0]);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    let videoURL = formState.videoURL;
    let imageURL = formState.image;

    if (file) {
      const storageRef = ref(storage, `courses/${file.name}`);
      await uploadBytes(storageRef, file);
      videoURL = await getDownloadURL(storageRef);
    }

    if (imageFile) {
      // Compresión de la imagen antes de subirla
      const compressedFile = await imageCompression(imageFile, {
        maxSizeMB: 0.1, // Máximo tamaño en MB (100KB)
        maxWidthOrHeight: 800, // Ajustar tamaño si es necesario
        useWebWorker: true,
      });
      const imageRef = ref(storage, `courses/images/${imageFile.name}`);
      await uploadBytes(imageRef, compressedFile);
      imageURL = await getDownloadURL(imageRef);
    }

    const courseData = { ...formState, videoURL, image: imageURL };

    try {
      if (courseId) {
        const courseDoc = doc(db, 'courses', courseId);
        await updateDoc(courseDoc, courseData);
        toast.success('Curso actualizado correctamente', { position: 'bottom-right' });
      } else {
        const docRef = await addDoc(collection(db, 'courses'), courseData);
        toast.success('Curso creado correctamente', { position: 'bottom-right' });
        navigate(`/courses/${docRef.id}`);
      }
    } catch (error) {
      console.error("Error adding/updating document: ", error);
      toast.error('Hubo un error al procesar la acción', { position: 'bottom-right' });
    }
  };

  const handleDelete = async (id) => {
    try {
      const courseDoc = doc(db, 'courses', id);
      await deleteDoc(courseDoc);
      setCourses(courses.filter(course => course.id !== id));
      toast.success('Curso eliminado correctamente', { position: 'bottom-right' });
    } catch (error) {
      console.error("Error deleting document: ", error);
      toast.error('Hubo un error al eliminar el curso', { position: 'bottom-right' });
    }
  };

  return (
    <div className="container mx-auto p-4">
      <ToastContainer />
      <h1 className="text-4xl font-bold text-center mb-6">Listado de Cursos</h1>
      <form onSubmit={handleSubmit} className="bg-white p-6 rounded-lg shadow-md mb-6">
        <div className="mb-4">
          <label className="block text-gray-700 mb-2">Título</label>
          <input
            type="text"
            name="title"
            className="w-full p-3 border border-gray-300 rounded-lg"
            placeholder="Ingrese el título del curso"
            value={formState.title}
            onChange={handleChange}
            required
          />
        </div>
        <div className="mb-4">
          <label className="block text-gray-700 mb-2">Descripción</label>
          <textarea
            name="description"
            className="w-full p-3 border border-gray-300 rounded-lg"
            placeholder="Ingrese la descripción del curso"
            value={formState.description}
            onChange={handleChange}
            required
          ></textarea>
        </div>
        <div className="mb-4">
          <label className="block text-gray-700 mb-2">Video</label>
          <input
            type="file"
            className="w-full p-3 border border-gray-300 rounded-lg"
            onChange={handleFileChange}
          />
        </div>
        <div className="mb-4">
          <label className="block text-gray-700 mb-2">Imagen de Fondo</label>
          <input
            type="file"
            className="w-full p-3 border border-gray-300 rounded-lg"
            onChange={handleImageChange}
          />
        </div>
        <div className="mb-4">
          <label className="block text-gray-700 mb-2">Categoría</label>
          <select
            name="category"
            className="w-full p-3 border border-gray-300 rounded-lg"
            value={formState.category}
            onChange={handleChange}
            required
          >
            <option value="">Seleccione una categoría</option>
            <option value="Teoría Musical">Teoría Musical</option>
            <option value="Instrumentos">Instrumentos</option>
            <option value="Producción Musical">Producción Musical</option>
          </select>
        </div>
        <div className="mb-4">
          <label className="block text-gray-700 mb-2">Precio</label>
          <input
            type="number"
            name="price"
            className="w-full p-3 border border-gray-300 rounded-lg"
            placeholder="Ingrese el precio del curso"
            value={formState.price}
            onChange={handleChange}
            required
          />
        </div>
        <div className="mb-4">
          <label className="block text-gray-700 mb-2">Duración (horas)</label>
          <input
            type="number"
            name="duration"
            className="w-full p-3 border border-gray-300 rounded-lg"
            placeholder="Ingrese la duración del curso en horas"
            value={formState.duration}
            onChange={handleChange}
            required
          />
        </div>
        <button type="submit" className="w-full bg-red-600 text-white py-3 rounded-lg hover:bg-red-700 transition duration-300">
          {courseId ? 'Actualizar' : 'Crear'}
        </button>
      </form>
      <ul>
        {courses.map(course => (
          <li key={course.id} className="mb-4 p-4 bg-gray-100 rounded-lg shadow-md flex justify-between items-center">
            <Link to={`/admin/course/edit/${course.id}`} className="text-blue-600 hover:underline text-xl">
              {course.title}
            </Link>
            <button onClick={() => handleDelete(course.id)} className="text-red-600 hover:underline text-lg">
              Borrar
            </button>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default AdminCoursesList;
