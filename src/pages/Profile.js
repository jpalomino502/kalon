// Profile.js
import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../contexts/AuthContext";
import { auth, db, storage } from "../config/firebaseConfig";
import { doc, getDoc, setDoc } from "firebase/firestore";
import { ref, uploadBytes, getDownloadURL } from "firebase/storage";
import { FaImage, FaSave, FaEdit, FaTimes, FaUserCog } from "react-icons/fa";
import Avatar from "react-avatar-edit";

const Profile = () => {
  const navigate = useNavigate();
  const { currentUser, userRole } = useAuth();
  const [loading, setLoading] = useState(true);
  const [profileData, setProfileData] = useState({
    name: "",
    description: "",
    photoURL: "",
    email: "",
    createdAt: "",
  });
  const [editing, setEditing] = useState(false);
  const [newPhoto, setNewPhoto] = useState(null);
  const [photoLoading, setPhotoLoading] = useState(false);

  useEffect(() => {
    const loadProfileData = async () => {
      if (!currentUser) {
        navigate("/login");
      } else {
        const profileDoc = await getDoc(doc(db, "profiles", currentUser.uid));
        if (profileDoc.exists()) {
          setProfileData(profileDoc.data());
        } else {
          setProfileData((prevData) => ({
            ...prevData,
            email: currentUser.email,
            createdAt: currentUser.metadata.creationTime,
          }));
        }
      }
      setLoading(false);
    };

    loadProfileData();
  }, [currentUser, navigate]);

  const handleSignOut = () => {
    auth
      .signOut()
      .then(() => {
        navigate("/login");
      })
      .catch((error) => {
        console.error("Error al cerrar sesión:", error);
      });
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setProfileData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
  };

  const handleCrop = (preview) => {
    setNewPhoto(preview);
  };

  const handleSave = async () => {
    if (currentUser) {
      if (newPhoto) {
        setPhotoLoading(true);
        const photoRef = ref(storage, `profile_photos/${currentUser.uid}`);
        const response = await fetch(newPhoto);
        const blob = await response.blob();
        await uploadBytes(photoRef, blob);
        const photoURL = await getDownloadURL(photoRef);
        setProfileData((prevData) => ({
          ...prevData,
          photoURL,
        }));
        setPhotoLoading(false);
      }

      await setDoc(doc(db, "profiles", currentUser.uid), profileData);
      setEditing(false);
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-screen">
        Cargando...
      </div>
    );
  }

  return (
    <div className="flex justify-center items-center bg-white p-4">
      <div className="bg-white rounded-lg shadow-lg p-8 max-w-2xl w-full text-black">
        <div className="relative flex justify-center items-center h-48 bg-black rounded-t-lg">
          <button
            className="absolute top-2 right-2 text-black"
            onClick={() => {
              if (editing) {
                handleSave();
              } else {
                setEditing(!editing);
              }
            }}
          >
            {editing ? (
              <FaSave className="text-2xl" />
            ) : (
              <FaEdit className="text-2xl" />
            )}
          </button>
          {profileData.photoURL ? (
            <img
              src={profileData.photoURL}
              alt="Foto de perfil"
              className="h-28 w-28 rounded-full border-4 border-white absolute -bottom-14"
            />
          ) : (
            <div className="h-28 w-28 rounded-full border-4 border-white absolute -bottom-14 bg-gray-200 flex justify-center items-center">
              <span className="text-gray-500">No Photo</span>
            </div>
          )}
        </div>
        <div className="text-center mt-20">
          {currentUser && (
            <>
              {editing ? (
                <>
                  <input
                    type="text"
                    name="name"
                    value={profileData.name}
                    onChange={handleInputChange}
                    className="border border-gray-300 p-2 w-full rounded mt-2 bg-white text-black"
                    placeholder="Nombre"
                  />
                  <textarea
                    name="description"
                    value={profileData.description}
                    onChange={handleInputChange}
                    className="border border-gray-300 p-2 w-full rounded mt-2 bg-white text-black"
                    placeholder="Descripción"
                  />
                  <div className="flex justify-center mt-4">
                    <Avatar
                      width={300}
                      height={200}
                      onCrop={handleCrop}
                      onClose={() => setNewPhoto(null)}
                      src={profileData.photoURL}
                      label={
                        <>
                          <FaImage className="mr-2" />
                          Foto de Perfil
                        </>
                      }
                    />
                  </div>
                  {photoLoading && (
                    <p className="text-blue-500 mt-2">Subiendo foto...</p>
                  )}
                </>
              ) : (
                <>
                  <h2 className="text-2xl font-semibold text-black">
                    {profileData.name || "Usuario"}
                  </h2>
                  <p className="text-sm mt-2 text-gray-600">
                    {profileData.email}
                  </p>
                  <p className="text-sm mt-2 text-gray-600">
                    Creado:{" "}
                    {new Date(profileData.createdAt).toLocaleDateString()}
                  </p>
                  <p className="text-sm mt-2 text-gray-600">
                    {profileData.description}
                  </p>
                </>
              )}
            </>
          )}
          <div className="flex justify-center mt-4">
            {userRole === "admin" && (
              <button
                className="bg-gray-800 text-white py-2 px-4 rounded-md hover:bg-gray-900 flex items-center"
                onClick={() => navigate("/admin")}
              >
                <FaUserCog className="mr-2" />
                Admin
              </button>
            )}
            <button
              className="bg-red-500 text-white py-2 px-4 rounded-md hover:bg-red-600 flex items-center ml-4"
              onClick={handleSignOut}
            >
              <FaTimes className="mr-2" />
              Salir
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Profile;