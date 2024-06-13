import React, { useEffect, useState } from 'react';
import { db, storage } from '../../config/firebaseConfig';
import { collection, getDocs, addDoc, updateDoc, doc, deleteDoc, getDoc } from 'firebase/firestore';
import { ref, uploadBytes, getDownloadURL } from 'firebase/storage';
import { Link, useNavigate, useParams } from 'react-router-dom';
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

const AdminCoursesList = () => {
  const [courses, setCourses] = useState([]);
  const [formState, setFormState] = useState({ title: '', description: '', videoURL: '', category: '' });
  const [file, setFile] = useState(null);
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

  const handleSubmit = async (e) => {
    e.preventDefault();
    let videoURL = formState.videoURL;

    if (file) {
      const storageRef = ref(storage, `courses/${file.name}`);
      await uploadBytes(storageRef, file);
      videoURL = await getDownloadURL(storageRef);
    }

    const courseData = { ...formState, videoURL };

    try {
      if (courseId) {
        const courseDoc = doc(db, 'courses', courseId);
        await updateDoc(courseDoc, courseData);
        toast.success('Curso actualizado correctamente', { position: 'bottom-right' });
      } else {
        await addDoc(collection(db, 'courses'), courseData);
        toast.success('Curso creado correctamente', { position: 'bottom-right' });
      }
      setTimeout(() => {
        navigate('/admin/courses');
      }, 5000); // Redireccionar después de 5 segundos
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
    <div>
      <ToastContainer />
      <h1 className="text-3xl font-bold mb-6">Listado de Cursos</h1>
      <form onSubmit={handleSubmit} className="mb-6">
        <div className="mb-4">
          <label className="block text-gray-700 mb-2">Título</label>
          <input
            type="text"
            name="title"
            className="w-full p-2 border border-gray-300 rounded"
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
            className="w-full p-2 border border-gray-300 rounded"
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
          {courseId ? 'Actualizar' : 'Crear'}
        </button>
      </form>
      <ul>
        {courses.map(course => (
          <li key={course.id} className="mb-4">
            <Link to={`/admin/course/edit/${course.id}`} className="text-red-600 hover:underline">
              {course.title}
            </Link>
            <button onClick={() => handleDelete(course.id)} className="ml-4 text-red-600 hover:underline">
              Borrar
            </button>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default AdminCoursesList;
