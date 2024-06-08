import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { auth, db, storage } from '../config/firebaseConfig';
import { doc, getDoc, setDoc } from 'firebase/firestore';
import { ref, uploadBytes, getDownloadURL } from 'firebase/storage';
import Avatar from 'react-avatar-edit';
import { FaImage, FaSave, FaEdit, FaTimes } from 'react-icons/fa';

const Profile = () => {
  const navigate = useNavigate();
  const [user, setUser] = useState(null);
  const [isAdmin, setIsAdmin] = useState(false);
  const [loading, setLoading] = useState(true);
  const [profileData, setProfileData] = useState({
    description: '',
    twitter: '',
    linkedin: '',
    photoURL: '',
    backgroundURL: '',
  });
  const [editing, setEditing] = useState(false);
  const [newPhoto, setNewPhoto] = useState(null);
  const [newBackground, setNewBackground] = useState(null);
  const [photoLoading, setPhotoLoading] = useState(false);
  const [backgroundLoading, setBackgroundLoading] = useState(false);

  useEffect(() => {
    const unsubscribe = auth.onAuthStateChanged(async (currentUser) => {
      if (!currentUser) {
        navigate('/login');
      } else {
        setUser(currentUser);
        const roleDoc = await getDoc(doc(db, 'roles', currentUser.uid));
        if (roleDoc.exists()) {
          setIsAdmin(roleDoc.data().role === 'admin');
        }

        const profileDoc = await getDoc(doc(db, 'profiles', currentUser.uid));
        if (profileDoc.exists()) {
          setProfileData(profileDoc.data());
        }
      }
      setLoading(false);
    });

    return () => unsubscribe();
  }, [navigate]);

  const handleSignOut = () => {
    auth.signOut()
      .then(() => {
        navigate('/login');
      })
      .catch((error) => {
        console.error('Error al cerrar sesión:', error);
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

  const handleBackgroundCrop = (preview) => {
    setNewBackground(preview);
  };

  const handleSave = async () => {
    if (user) {
      if (newPhoto) {
        setPhotoLoading(true);
        const photoRef = ref(storage, `profile_photos/${user.uid}`);
        const response = await fetch(newPhoto);
        const blob = await response.blob();
        await uploadBytes(photoRef, blob);
        const photoURL = await getDownloadURL(photoRef);
        setProfileData((prevData) => ({
          ...prevData,
          photoURL,
        }));
        setPhotoLoading(false);

        // Actualizamos la URL de la foto de perfil en Firestore
        await setDoc(doc(db, 'profiles', user.uid), {
          ...profileData,
          photoURL, // Actualizamos la URL de la foto de perfil
        });
      }
      if (newBackground) {
        setBackgroundLoading(true);
        const backgroundRef = ref(storage, `profile_backgrounds/${user.uid}`);
        const response = await fetch(newBackground);
        const blob = await response.blob();
        await uploadBytes(backgroundRef, blob);
        const backgroundURL = await getDownloadURL(backgroundRef);
        setProfileData((prevData) => ({
          ...prevData,
          backgroundURL,
        }));
        setBackgroundLoading(false);

        // Actualizamos la URL del fondo de perfil en Firestore
        await setDoc(doc(db, 'profiles', user.uid), {
          ...profileData,
          backgroundURL, // Actualizamos la URL del fondo de perfil
        });
      }
      setEditing(false);
    }
  };

  if (loading) {
    return <div className="flex justify-center items-center h-screen">Cargando...</div>;
  }

  return (
    <div className="flex justify-center items-center min-h-screen bg-gray-100">
      <div className="bg-white rounded-lg shadow-md p-8 max-w-3xl w-full">
        <div className="bg-black h-40 rounded-t-lg flex justify-center items-center relative">
          {profileData.backgroundURL && (
            <img src={profileData.backgroundURL} alt="Fondo de perfil" className="absolute inset-0 w-full h-full object-cover rounded-t-lg" />
          )}
          {profileData.photoURL ? (
            <img src={profileData.photoURL} alt="Foto de perfil" className="h-28 w-28 rounded-full border-4 border-white absolute -bottom-14" />
          ) : (
            <div className="h-28 w-28 rounded-full border-4 border-white absolute -bottom-14 bg-gray-200 flex justify-center items-center">
              <span className="text-gray-500">No Photo</span>
            </div>
          )}
        </div>
        <div className="text-center mt-20">
          {user && (
            <>
              <h2 className="text-2xl font-bold text-black">{user.displayName || 'Usuario'}</h2>
              <p className="text-sm text-gray-600">@{user.displayName ? user.displayName.toLowerCase().replace(/ /g, '') : 'usuario'}</p>
              <p className="text-sm mt-2">{user.email}</p>
              {editing ? (
                <div>
                  <textarea
                    name="description"
                    value={profileData.description}
                    onChange={handleInputChange}
                    className="border border-gray-300 p-2 w-full rounded mt-2"
                    placeholder="Descripción"
                  />
                  <input
                    type="text"
                    name="twitter"
                    value={profileData.twitter}
                    onChange={handleInputChange}
                    className="border border-gray-300 p-2 w-full rounded mt-2"
                    placeholder="Twitter"
                  />
                  <input
                    type="text"
                    name="linkedin"
                    value={profileData.linkedin}
                    onChange={handleInputChange}
                    className="border border-gray-300 p-2 w-full rounded mt-2"
                    placeholder="LinkedIn"
                  />
                  <div className="flex justify-center mt-4">
                    <Avatar
                      width={390}
                      height={295}
                      onCrop={handleCrop}
                      onClose={() => setNewPhoto(null)}
                      src={profileData.photoURL}
                      label={<><FaImage className="mr-2" />Foto de Perfil</>}
                    />
                  </div>
                  <div className="flex justify-center mt-4">
                    <Avatar
                      width={390}
                      height={295}
                      onCrop={handleBackgroundCrop}
                      onClose={() => setNewBackground(null)}
                      src={profileData.backgroundURL}
                      label={<><FaImage className="mr-2" />Fondo de Perfil</>}
                    />
                  </div>
                  {photoLoading && <p className="text-blue-500 mt-2">Subiendo foto...</p>}
                  {backgroundLoading && <p className="text-blue-500 mt-2">Subiendo fondo...</p>}
                  <div className="flex justify-center space-x-4 mt-4">
                    <button
                      className="bg-black text-white py-2 px-4 rounded-md hover:bg-gray-800 flex items-center"
                      onClick={handleSave}
                    >
                      <FaSave className="mr-2" />Guardar
                    </button>
                    <button
                      className="bg-white text-black py-2 px-4 rounded-md border border-black hover:bg-gray-200 flex items-center"
                      onClick={() => setEditing(false)}
                    >
                      <FaTimes className="mr-2" />Cancelar
                    </button>
                  </div>
                </div>
              ) : (
                <>
                  <p className="text-sm mt-2">{profileData.description}</p>
                  {profileData.twitter && (
                    <p className="text-sm text-blue-500">
                      <a href={`https://twitter.com/${profileData.twitter}`} target="_blank" rel="noopener noreferrer">
                        Twitter: @{profileData.twitter}
                      </a>
                    </p>
                  )}
                  {profileData.linkedin && (
                    <p className="text-sm text-blue-500">
                      <a href={`https://linkedin.com/in/${profileData.linkedin}`} target="_blank" rel="noopener noreferrer">
                        LinkedIn: {profileData.linkedin}
                      </a>
                    </p>
                  )}
                  <div className="flex justify-center space-x-4 mt-4">
                    <button
                      className="bg-black text-white py-2 px-4 rounded-md hover:bg-gray-800 flex items-center"
                      onClick={() => setEditing(true)}
                    >
                      <FaEdit className="mr-2" />Editar Perfil
                    </button>
                  </div>
                </>
              )}
            </>
          )}
          {isAdmin && (
            <div className="flex justify-center mt-4">
              <button
                className="bg-white text-black py-2 px-4 rounded-md border border-black hover:bg-gray-200 flex items-center"
                onClick={() => navigate('/admin')}
              >
                <FaEdit className="mr-2" />Ir al Panel de Administración
              </button>
            </div>
          )}
          <div className="flex justify-center mt-4">
            <button
              className="bg-red-500 text-white py-2 px-4 rounded-md hover:bg-red-600 flex items-center"
              onClick={handleSignOut}
            >
              <FaTimes className="mr-2" />Cerrar Sesión
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Profile;

