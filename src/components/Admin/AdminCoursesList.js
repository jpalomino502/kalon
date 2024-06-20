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
import imageCompression from "browser-image-compression";
import "react-toastify/dist/ReactToastify.css";
import ReactQuill from "react-quill";
import "react-quill/dist/quill.snow.css";

const AdminCourseForm = ({
  course,
  handleSave,
  handleChange,
  handleFileChange,
  handleImageChange,
  handleEditorChange,
  file, // Add file as a prop
  imageFile, // Add imageFile as a prop
}) => {
  const handleFileUpload = async () => {
    let videoURL = course.videoURL;

    if (file) {
      const storageRef = ref(storage, `courses/videos/${file.name}`);
      await uploadBytes(storageRef, file);
      videoURL = await getDownloadURL(storageRef);
    }

    return videoURL;
  };

  const handleImageUpload = async () => {
    let imageURL = course.image;

    if (imageFile) {
      const compressedFile = await imageCompression(imageFile, {
        maxSizeMB: 0.1, // Maximum size in MB (100KB)
        maxWidthOrHeight: 800, // Adjust size if necessary
        useWebWorker: true,
      });
      const imageRef = ref(storage, `courses/images/${imageFile.name}`);
      await uploadBytes(imageRef, compressedFile);
      imageURL = await getDownloadURL(imageRef);
    }

    return imageURL;
  };

  return (
    <div className="p-6 bg-white rounded-lg shadow-md">
      <h2 className="text-2xl font-bold mb-4">Crear/Editar Curso</h2>
      <form
        onSubmit={(e) => {
          e.preventDefault();
          handleSave(handleFileUpload, handleImageUpload);
        }}
      >
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
          <div className="col-span-1">
            <label className="block text-gray-700 mb-2">Título</label>
            <input
              type="text"
              name="title"
              className="w-full p-3 border border-gray-300 rounded-lg"
              placeholder="Ingrese el título del curso"
              value={course.title}
              onChange={handleChange}
              required
            />
          </div>
          <div className="col-span-1">
            <label className="block text-gray-700 mb-2">Categoría</label>
            <select
              name="category"
              className="w-full p-3 border border-gray-300 rounded-lg"
              value={course.category}
              onChange={handleChange}
              required
            >
              <option value="">Seleccione una categoría</option>
              <option value="Teoría Musical">Teoría Musical</option>
              <option value="Instrumentos">Instrumentos</option>
              <option value="Producción Musical">Producción Musical</option>
            </select>
          </div>
          <div className="col-span-1">
            <label className="block text-gray-700 mb-2">Precio</label>
            <input
              type="number"
              name="price"
              className="w-full p-3 border border-gray-300 rounded-lg"
              placeholder="Ingrese el precio del curso"
              value={course.price}
              onChange={handleChange}
              required
            />
          </div>
          <div className="col-span-1">
            <label className="block text-gray-700 mb-2">Duración (horas)</label>
            <input
              type="number"
              name="duration"
              className="w-full p-3 border border-gray-300 rounded-lg"
              placeholder="Ingrese la duración del curso en horas"
              value={course.duration}
              onChange={handleChange}
              required
            />
          </div>
        </div>
        <div className="mb-6">
          <label className="block text-gray-700 mb-2">Descripción</label>
          <ReactQuill
            value={course.description}
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
          {course.id ? "Actualizar" : "Crear"}
        </button>
      </form>
    </div>
  );
};

const AdminCoursesList = () => {
  const [courses, setCourses] = useState([]);
  const [formState, setFormState] = useState({
    title: "",
    description: "",
    videoURL: "",
    category: "",
    image: "",
    price: "",
    duration: "",
  });
  const [file, setFile] = useState(null);
  const [imageFile, setImageFile] = useState(null);
  const [showVideo, setShowVideo] = useState(false);
  const navigate = useNavigate();
  const { courseId } = useParams();

  useEffect(() => {
    const fetchCourses = async () => {
      const coursesCollection = collection(db, "courses");
      const coursesSnapshot = await getDocs(coursesCollection);
      const coursesList = coursesSnapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      }));
      setCourses(coursesList);
    };

    fetchCourses();

    if (courseId) {
      fetchCourse(courseId);
    }
  }, [courseId]);

  const fetchCourse = async (id) => {
    const courseDoc = doc(db, "courses", id);
    const courseSnap = await getDoc(courseDoc);
    if (courseSnap.exists()) {
      setFormState(courseSnap.data());
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

    // Function to strip HTML tags from description
    const stripHtmlTags = (html) => {
      const doc = new DOMParser().parseFromString(html, "text/html");
      return doc.body.textContent || "";
    };

    const courseData = {
      ...formState,
      videoURL,
      image: imageURL,
      description: stripHtmlTags(formState.description), // Strips HTML tags from description
    };

    try {
      if (courseId) {
        const courseDoc = doc(db, "courses", courseId);
        await updateDoc(courseDoc, courseData);
        toast.success("Curso actualizado correctamente", {
          position: "bottom-right",
        });
      } else {
        const docRef = await addDoc(collection(db, "courses"), courseData);
        toast.success("Curso creado correctamente", {
          position: "bottom-right",
        });
        navigate(`/courses/${docRef.id}`);
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
      const courseDoc = doc(db, "courses", id);
      await deleteDoc(courseDoc);
      setCourses((prevCourses) => prevCourses.filter((course) => course.id !== id));
      toast.success("Curso eliminado correctamente", {
        position: "bottom-right",
      });
    } catch (error) {
      console.error("Error deleting document: ", error);
      toast.error("Hubo un error al eliminar el curso", {
        position: "bottom-right",
      });
    }
  };

  return (
    <div className="container mx-auto mt-6">
      <ToastContainer />
      <h1 className="text-3xl font-bold text-center mb-6">Listado de Cursos</h1>
      <div className="flex">
        <div className="w-1/2">
          <AdminCourseForm
            course={formState}
            handleSave={handleSave}
            handleChange={handleChange}
            handleFileChange={handleFileChange}
            handleImageChange={handleImageChange}
            handleEditorChange={handleEditorChange}
            file={file} // Pass file state as prop
            imageFile={imageFile} // Pass imageFile state as prop
          />
        </div>
        <div className="w-1/2 pl-4">
          <h2 className="text-2xl font-bold mb-4">Vista previa del Curso</h2>
          <div className="flex">
            <div className="w-1/2">
              <div className="relative h-64 w-full bg-gray-200">
                {formState.image && (
                  <img
                    src={formState.image}
                    alt="Course"
                    className="w-full h-full object-cover"
                  />
                )}
                {showVideo && (
                  <video
                    controls
                    className="w-full h-full object-cover absolute top-0 left-0"
                  >
                    <source src={formState.videoURL} type="video/mp4" />
                    Your browser does not support the video tag.
                  </video>
                )}
              </div>
              {formState.videoURL && !showVideo && (
                <button
                  onClick={() => setShowVideo(true)}
                  className="bg-blue-600 text-white py-2 px-4 rounded-lg hover:bg-blue-700 transition duration-300 mt-2"
                >
                  Ver Video
                </button>
              )}
              {showVideo && (
                <button
                  onClick={() => setShowVideo(false)}
                  className="bg-blue-600 text-white py-2 px-4 rounded-lg hover:bg-blue-700 transition duration-300 mt-2"
                >
                  Ocultar Video
                </button>
              )}
            </div>
            <div className="w-1/2 pl-4">
              <h2 className="text-2xl font-bold">{formState.title}</h2>
              <div
                dangerouslySetInnerHTML={{ __html: formState.description }}
                className="text-gray-700"
              ></div>
              <p className="text-gray-700 mt-2">
                <strong>Precio:</strong> ${formState.price}
              </p>
              <p className="text-gray-700 mt-2">
                <strong>Duración:</strong> {formState.duration} horas
              </p>
              <p className="text-gray-700 mt-2">
                <strong>Categoría:</strong> {formState.category}
              </p>
            </div>
          </div>
        </div>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-6">
        {courses.map((course) => (
          <div key={course.id} className="bg-white rounded-lg shadow-md p-6">
            <div
              className="h-40 bg-cover bg-center mb-4"
              style={{ backgroundImage: `url(${course.image})` }}
            ></div>
            <h2 className="text-2xl font-bold">{course.title}</h2>
            <p className="text-gray-700">{course.description}</p>
            <p className="text-gray-700 mt-2">
              <strong>Precio:</strong> ${course.price}
            </p>
            <p className="text-gray-700 mt-2">
              <strong>Duración:</strong> {course.duration} horas
            </p>
            <p className="text-gray-700 mt-2">
              <strong>Categoría:</strong> {course.category}
            </p>
            <div className="flex justify-between mt-4">
              <Link
                to={`/admin/edit-course/${course.id}`}
                className="bg-blue-600 text-white py-2 px-4 rounded-lg hover:bg-blue-700 transition duration-300"
              >
                Editar
              </Link>
              <button
                onClick={() => handleDelete(course.id)}
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

export default AdminCoursesList;
