import React, { useState, useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../../contexts/AuthContext";
import { db, storage } from "../../config/firebaseConfig";
import { doc, getDoc, updateDoc } from "firebase/firestore";
import { ref, uploadBytes, getDownloadURL } from "firebase/storage";
import AvatarEditor from "react-avatar-editor";
import { FaSave, FaTimes, FaUpload } from "react-icons/fa"; // Importamos los iconos necesarios

const EditProfile = () => {
  const { currentUser } = useAuth();
  const [nombre, setNombre] = useState("");
  const [bio, setBio] = useState("");
  const [foto, setFoto] = useState(null);
  const [fotoURL, setFotoURL] = useState("");
  const [error, setError] = useState("");
  const [scale, setScale] = useState(1);
  const navigate = useNavigate();
  const editorRef = useRef(null);

  useEffect(() => {
    if (!currentUser) {
      navigate("/login");
      return;
    }

    const fetchUserData = async () => {
      const userDoc = await getDoc(doc(db, "profiles", currentUser.uid));
      if (userDoc.exists()) {
        const userData = userDoc.data();
        setNombre(userData.name);
        setBio(userData.bio || "");
        setFotoURL(userData.photoURL || "");
      }
    };

    fetchUserData();
  }, [currentUser, navigate]);

  const handlePhotoChange = (e) => {
    if (e.target.files[0]) {
      setFoto(e.target.files[0]);
    }
  };

  const handleScaleChange = (e) => {
    const scaleValue = parseFloat(e.target.value);
    setScale(scaleValue);
  };

  const handleSave = async (e) => {
    e.preventDefault();
    setError("");

    try {
      let nuevaFotoURL = fotoURL;
      if (foto && editorRef.current) {
        const canvas = editorRef.current.getImageScaledToCanvas();
        const resizedCanvas = document.createElement("canvas");
        resizedCanvas.width = 96;
        resizedCanvas.height = 96;
        const ctx = resizedCanvas.getContext("2d");
        ctx.drawImage(canvas, 0, 0, 96, 96);

        const blob = await new Promise((resolve) =>
          resizedCanvas.toBlob(resolve, "image/jpeg")
        );
        const fotoRef = ref(storage, `profiles/${currentUser.uid}/photo.jpg`);
        await uploadBytes(fotoRef, blob);
        nuevaFotoURL = await getDownloadURL(fotoRef);
      }

      await updateDoc(doc(db, "profiles", currentUser.uid), {
        name: nombre,
        bio,
        photoURL: nuevaFotoURL,
      });

      navigate("/profile");
    } catch (error) {
      setError("Error al actualizar el perfil");
    }
  };

  const handleCancel = () => {
    navigate("/profile");
  };

  return (
    <div className="container mx-auto my-8 p-4 flex justify-center">
      <form onSubmit={handleSave} className="bg-white p-6 rounded-lg shadow-lg w-full max-w-lg">
        <h2 className="text-xl font-bold mb-4 text-center">Editar Perfil</h2>
        {error && <p className="text-red-500 mb-4">{error}</p>}
        <div className="flex items-center justify-center mb-4 flex-col">
          <div className="w-24 h-24 rounded-full overflow-hidden bg-gray-200 flex items-center justify-center mb-2">
            {fotoURL ? (
              <img src={fotoURL} alt="Foto de perfil" className="w-full h-full object-cover" />
            ) : (
              <span className="text-gray-500 text-4xl">👤</span>
            )}
          </div>
          <label className="flex items-center justify-center cursor-pointer text-white bg-blue-500 hover:bg-blue-600 px-4 py-2 rounded-md">
            <input
              type="file"
              accept="image/*"
              onChange={handlePhotoChange}
              className="hidden"
            />
            <FaUpload className="mr-2" /> Cambiar Foto
          </label>
        </div>
        <div className="mb-4">
          <label htmlFor="nombre" className="block text-sm font-bold mb-2">
            Nombre:
          </label>
          <input
            type="text"
            id="nombre"
            value={nombre}
            onChange={(e) => setNombre(e.target.value)}
            className="w-full p-2 border border-gray-300 rounded-md"
          />
        </div>
        <div className="mb-4">
          <label htmlFor="bio" className="block text-sm font-bold mb-2">
            Bio:
          </label>
          <textarea
            id="bio"
            value={bio}
            onChange={(e) => setBio(e.target.value)}
            className="w-full p-2 border border-gray-300 rounded-md"
            rows="4"
          ></textarea>
        </div>
        {foto && (
          <div className="mb-4">
            <AvatarEditor
              ref={editorRef}
              image={foto}
              width={150}
              height={150}
              border={0}
              borderRadius={75}
              scale={scale}
              className="mx-auto"
            />
            <input
              type="range"
              min="1"
              max="3"
              step="0.01"
              value={scale}
              onChange={handleScaleChange}
              className="mt-4 w-full"
            />
          </div>
        )}
        <div className="flex justify-between mt-4">
          <button
            type="button"
            onClick={handleCancel}
            className="px-4 py-2 bg-gray-300 text-black rounded-md hover:bg-gray-400 flex items-center"
          >
            <FaTimes className="mr-2" /> Cancelar
          </button>
          <button
            type="submit"
            className="px-4 py-2 bg-black text-white rounded-md hover:bg-gray-800 flex items-center"
          >
            <FaSave className="mr-2" /> Guardar Cambios
          </button>
        </div>
      </form>

      <style jsx>{`
        @media (max-width: 768px) {
          .container {
            padding: 1rem;
          }
          form {
            padding: 2rem;
          }
          h2 {
            font-size: 1.25rem;
          }
        }
      `}</style>
    </div>
  );
};

export default EditProfile;
