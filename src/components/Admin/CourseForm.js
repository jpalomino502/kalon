import React, { useState, useEffect } from 'react';
import { db, storage } from '../../config/firebaseConfig';
import { collection, addDoc, doc, updateDoc, getDoc } from 'firebase/firestore';
import { ref, uploadBytes, getDownloadURL } from 'firebase/storage';
import { useNavigate, useParams } from 'react-router-dom';

const CourseForm = () => {
  const [course, setCourse] = useState({ title: '', description: '', videoURL: '' });
  const [file, setFile] = useState(null);
  const navigate = useNavigate();
  const { courseId } = useParams();

  useEffect(() => {
    const fetchCourse = async () => {
      if (courseId) {
        const courseDoc = doc(db, 'courses', courseId);
        const courseSnap = await getDoc(courseDoc);
        if (courseSnap.exists()) {
          setCourse(courseSnap.data());
        }
      }
    };

    fetchCourse();
  }, [courseId]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setCourse({ ...course, [name]: value });
  };

  const handleFileChange = (e) => {
    setFile(e.target.files[0]);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    let videoURL = course.videoURL;

    if (file) {
      const storageRef = ref(storage, `courses/${file.name}`);
      await uploadBytes(storageRef, file);
      videoURL = await getDownloadURL(storageRef);
    }

    const courseData = { ...course, videoURL };

    try {
      if (courseId) {
        const courseDoc = doc(db, 'courses', courseId);
        await updateDoc(courseDoc, courseData);
      } else {
        await addDoc(collection(db, 'courses'), courseData);
      }
      navigate('/admin/courses');
    } catch (error) {
      console.error("Error adding document: ", error);
    }
  };

  return (
    <div className="container mx-auto p-4 bg-white rounded-lg shadow-md">
      <h2 className="text-2xl font-bold text-black mb-4">Crear / Editar Curso</h2>
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="block text-sm font-medium text-black">Título</label>
          <input
            type="text"
            name="title"
            value={course.title}
            onChange={handleChange}
            className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2"
            required
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-black">Descripción</label>
          <textarea
            name="description"
            value={course.description}
            onChange={handleChange}
            className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2"
            required
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-black">Video</label>
          <input type="file" onChange={handleFileChange} className="mt-1 block w-full" />
        </div>
        <button
          type="submit"
          className="px-4 py-2 bg-black text-white rounded-md hover:bg-gray-800"
        >
          Guardar
        </button>
      </form>
    </div>
  );
};

export default CourseForm;
