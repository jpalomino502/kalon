import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { db } from '../../config/firebaseConfig';
import { doc, getDoc, collection, addDoc, getDocs } from 'firebase/firestore';
import LoadingSkeleton from '../Loading/LoadingSkeleton';
import { FaStar } from 'react-icons/fa';

const CourseDetail = ({ onAddToCart }) => {
  const { courseId } = useParams();
  const [course, setCourse] = useState(null);
  const [loading, setLoading] = useState(true);
  const [videoError, setVideoError] = useState(false);
  const [showVideo, setShowVideo] = useState(false);
  const [comments, setComments] = useState([]);
  const [newComment, setNewComment] = useState('');
  const [rating, setRating] = useState(0);
  const [averageRating, setAverageRating] = useState(0);
  const [activeTab, setActiveTab] = useState('valoraciones');
  useEffect(() => {
    const fetchCourse = async () => {
      try {
        const courseDoc = doc(db, 'courses', courseId);
        const courseSnap = await getDoc(courseDoc);
        if (courseSnap.exists()) {
          setCourse(courseSnap.data());
        } else {
          console.log('No such document!');
        }
      } catch (error) {
        console.error('Error fetching course:', error);
      } finally {
        setLoading(false);
      }
    };

    const fetchComments = async () => {
      try {
        const commentsCollection = collection(db, 'courses', courseId, 'commentsAndRatings');
        const commentsSnap = await getDocs(commentsCollection);
        const commentsList = commentsSnap.docs.map(doc => doc.data());
        setComments(commentsList);

        const totalRating = commentsList.reduce((acc, comment) => acc + comment.rating, 0);
        const average = commentsList.length ? totalRating / commentsList.length : 0;
        setAverageRating(average);
      } catch (error) {
        console.error('Error fetching comments:', error);
      }
    };

    fetchCourse();
    fetchComments();
  }, [courseId]);

  const handleVideoError = () => {
    setVideoError(true);
  };

  const handleAddComment = async () => {
    if (newComment.trim() !== '' && rating > 0) {
      try {
        const commentData = {
          text: newComment,
          rating: rating,
          createdAt: new Date(),
        };
        const commentsCollection = collection(db, 'courses', courseId, 'commentsAndRatings');
        await addDoc(commentsCollection, commentData);
        setComments([...comments, commentData]);
        setNewComment('');
        setRating(0);
      } catch (error) {
        console.error('Error adding comment:', error);
      }
    }
  };

  if (loading) {
    return <LoadingSkeleton />;
  }

  if (!course) {
    return <div>El curso no existe o ha sido eliminado.</div>;
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="bg-white rounded-lg shadow-md p-6 flex">
        <div className="w-1/2 relative">
          <div
            className="relative h-64 bg-cover bg-center mb-4"
            style={{ backgroundImage: `url(${course.image})` }}
            onClick={() => setShowVideo(!showVideo)}
          >
            {!showVideo && (
              <div className="absolute inset-0 bg-black bg-opacity-50 flex items-center justify-center cursor-pointer">
                <svg
                  className="w-16 h-16 text-white"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M14.752 11.168l-5.197-2.88A1 1 0 008 9.103v5.794a1 1 0 001.555.832l5.197-2.88a1 1 0 000-1.664z"
                  />
                </svg>
              </div>
            )}
            {showVideo && course.videoURL && (
              <video
                controls
                className="absolute inset-0 w-full h-full"
                onCanPlay={() => setVideoError(false)}
                onError={handleVideoError}
              >
                <source src={course.videoURL} type="video/mp4" />
                Tu navegador no soporta el elemento de video.
              </video>
            )}
          </div>
          {videoError && (
            <div className="text-red-500 mt-2">
              Error cargando el video. Por favor, intenta nuevamente más tarde.
            </div>
          )}
          <div className="mt-4">
            <button className="bg-red-600 text-white py-2 px-4 mr-2" onClick={() => onAddToCart(course)}>
              Comprar
            </button>
          </div>
        </div>
        <div className="w-1/2 pl-8">
          <h1 className="text-3xl font-bold mb-4">{course.title}</h1>
          <p className="text-gray-700 mb-4">{course.description}</p>
          <p className="text-gray-800 font-semibold mb-2">
            Precio: COP$ {course.price},00
          </p>
          <p className="text-gray-600 mb-4">Duración: {course.duration} horas</p>
          {course.topics && course.topics.length > 0 && (
            <div className="mt-4">
              <h2 className="text-2xl font-bold">Temas Cubiertos</h2>
              <ul className="list-disc list-inside">
                {course.topics.map((topic, index) => (
                  <li key={index}>{topic}</li>
                ))}
              </ul>
            </div>
          )}
          {course.instructor && (
            <div className="mt-4">
              <h2 className="text-2xl font-bold">Sobre el Instructor</h2>
              <p>{course.instructor}</p>
            </div>
          )}
        </div>
      </div>
      <div className="mt-8">
            <div className="flex justify-around border-b">
              <button
                className={`py-2 px-4 ${activeTab === 'valoraciones' ? 'border-b-2 border-red-600' : ''}`}
                onClick={() => setActiveTab('valoraciones')}
              >
                Valoraciones
              </button>
              <button
                className={`py-2 px-4 ${activeTab === 'preguntas' ? 'border-b-2 border-red-600' : ''}`}
                onClick={() => setActiveTab('preguntas')}
              >
                Preguntas
              </button>
            </div>

            {activeTab === 'valoraciones' && (
              <div>
                <h2 className="text-2xl font-bold mt-4">Valoraciones y Comentarios</h2>
                <p className="text-gray-800 mb-4">Promedio de valoraciones: {averageRating.toFixed(1)} / 5</p>
                {comments.map((comment, index) => (
                  <div key={index} className="border-t pt-4 mt-4">
                    <p className="text-gray-700">{comment.text}</p>
                    <div className="flex">
                      {[...Array(5)].map((_, starIndex) => (
                        <FaStar
                          key={starIndex}
                          size={20}
                          color={starIndex < comment.rating ? "#ffc107" : "#e4e5e9"}
                        />
                      ))}
                    </div>
                  </div>
                ))}
                <div className="mt-4">
                  <textarea
                    className="w-full p-2 border border-gray-300 rounded-md"
                    placeholder="Escribe un comentario..."
                    value={newComment}
                    onChange={(e) => setNewComment(e.target.value)}
                  />
                  <div className="flex items-center mt-2">
                    <span className="mr-2">Valoración:</span>
                    {[...Array(5)].map((_, starIndex) => (
                      <FaStar
                        key={starIndex}
                        size={20}
                        color={starIndex < rating ? "#ffc107" : "#e4e5e9"}
                        onClick={() => setRating(starIndex + 1)}
                        className="cursor-pointer"
                      />
                    ))}
                  </div>
                  <button className="bg-blue-600 text-white py-2 px-4 mt-4" onClick={handleAddComment}>
                    Agregar Comentario
                  </button>
                </div>
              </div>
            )}

            {activeTab === 'preguntas' && (
              <div>
                <h2 className="text-2xl font-bold mt-4">Preguntas</h2>
                <p className="text-gray-700 mb-4">Aquí puedes ver y hacer preguntas sobre el curso.</p>
                {/* Aquí puedes añadir la lógica para mostrar y agregar preguntas */}
              </div>
            )}
          </div>
    </div>
  );
};

export default CourseDetail;
