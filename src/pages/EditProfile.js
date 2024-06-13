// EditProfile.js
import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../contexts/AuthContext";
import { db, storage } from "../config/firebaseConfig";
import { doc, getDoc, updateDoc } from "firebase/firestore";
import { ref, uploadBytes, getDownloadURL } from "firebase/storage";
import { FaSave } from "react-icons/fa";

const EditProfile = () => {
  const { currentUser } = useAuth();
  const [name, setName] = useState("");
  const [bio, setBio] = useState("");
  const [photo, setPhoto] = useState(null);
  const [photoURL, setPhotoURL] = useState("");
  const [error, setError] = useState("");
  const navigate = useNavigate();

  useEffect(() => {
    if (!currentUser) {
      navigate("/login");
      return;
    }

    const fetchUserData = async () => {
      const userDoc = await getDoc(doc(db, "profiles", currentUser.uid));
      if (userDoc.exists()) {
        const userData = userDoc.data();
        setName(userData.name);
        setBio(userData.bio || "");
        setPhotoURL(userData.photoURL || "");
      }
    };

    fetchUserData();
  }, [currentUser, navigate]);

  const handlePhotoChange = (e) => {
    if (e.target.files[0]) {
      setPhoto(e.target.files[0]);
    }
  };

  const handleSave = async (e) => {
    e.preventDefault();
    setError("");
    try {
      let newPhotoURL = photoURL;
      if (photo) {
        const photoRef = ref(storage, `profiles/${currentUser.uid}/photo.jpg`);
        await uploadBytes(photoRef, photo);
        newPhotoURL = await getDownloadURL(photoRef);
      }
      await updateDoc(doc(db, "profiles", currentUser.uid), {
        name,
        bio,
        photoURL: newPhotoURL,
      });
      navigate("/profile");
    } catch (error) {
      setError("Failed to update profile");
    }
  };

  return (
    <div className="container mx-auto my-8 p-4">
      <form onSubmit={handleSave} className="bg-white p-6 rounded-lg shadow-lg">
        <h2 className="text-xl font-bold mb-4">Edit Profile</h2>
        {error && <p className="text-red-500 mb-4">{error}</p>}
        <div className="mb-4">
          <label htmlFor="name" className="block text-sm font-bold mb-2">
            Name:
          </label>
          <input
            type="text"
            id="name"
            value={name}
            onChange={(e) => setName(e.target.value)}
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
        <div className="mb-4">
          <label htmlFor="photo" className="block text-sm font-bold mb-2">
            Profile Photo:
          </label>
          <input
            type="file"
            id="photo"
            accept="image/*"
            onChange={handlePhotoChange}
            className="w-full p-2 border border-gray-300 rounded-md"
          />
        </div>
        {photoURL && (
          <div className="mb-4">
            <img src={photoURL} alt="Profile" className="w-24 h-24 rounded-full mx-auto" />
          </div>
        )}
        <button
          type="submit"
          className="mt-4 px-4 py-2 bg-[#D91604] text-white rounded-md hover:bg-red-700 flex items-center"
        >
          <FaSave className="mr-2" /> Save
        </button>
      </form>
    </div>
  );
};

export default EditProfile;
