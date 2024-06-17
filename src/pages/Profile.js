import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../contexts/AuthContext";
import { db } from "../config/firebaseConfig";
import { doc, getDoc, setDoc } from "firebase/firestore";
import { FaUserEdit, FaUserShield } from "react-icons/fa";
import LoadingSkeleton from "../components/Loading/LoadingSkeleton";
import { Lumiflex } from "uvcanvas"; // Import Lumiflex component here

const Profile = () => {
  const [userData, setUserData] = useState(null);
  const { currentUser, logout } = useAuth();
  const navigate = useNavigate();
  const [isAdmin, setIsAdmin] = useState(false);

  useEffect(() => {
    const fetchUserData = async () => {
      if (!currentUser) {
        navigate("/login");
        return;
      }

      try {
        const userDocRef = doc(db, "profiles", currentUser.uid);
        let userDoc = await getDoc(userDocRef);

        if (!userDoc.exists()) {
          const defaultUserData = {
            name: currentUser.displayName || "Nuevo Usuario",
            email: currentUser.email,
            bio: "",
            photoURL: currentUser.photoURL || "",
          };
          await setDoc(userDocRef, defaultUserData);
          userDoc = await getDoc(userDocRef);
        }

        if (userDoc.exists()) {
          setUserData(userDoc.data());
        } else {
          console.error("No user data found for uid:", currentUser.uid);
          setUserData(null);
        }

        const roleDoc = await getDoc(doc(db, "roles", currentUser.uid));
        if (roleDoc.exists() && roleDoc.data().role === "admin") {
          setIsAdmin(true);
        } else {
          setIsAdmin(false);
        }
      } catch (error) {
        console.error("Error fetching user data:", error);
      }
    };

    fetchUserData();
  }, [currentUser, navigate]);

  const handleLogout = async () => {
    try {
      await logout();
      navigate("/login");
    } catch (error) {
      console.error("Failed to log out", error);
    }
  };

  if (!currentUser || userData === null) {
    return <LoadingSkeleton />;
  }

  const username = userData.email ? userData.email.split('@')[0] : "Usuario";

  return (
    <div className="container mx-auto my-8 p-4">
      <Lumiflex /> {/* Lumiflex component as the background */}
      <div className="flex flex-col items-center">
        <div className="w-full bg-white text-black p-6 rounded-lg shadow-lg relative">
          <div className="flex items-center">
            <div className="w-24 h-24 rounded-full bg-gray-200 flex items-center justify-center overflow-hidden">
              {userData.photoURL ? (
                <img
                  src={userData.photoURL}
                  alt="Profile"
                  className="w-full h-full"
                />
              ) : (
                <span className="text-gray-500">No Image</span>
              )}
            </div>
            <div className="ml-4">
              <h2 className="text-xl font-bold">{userData.name}</h2>
              <p className="text-gray-400">@{username}</p>
              <p className="text-gray-400">{userData.bio || "Ciudad"}</p>
            </div>
            <button
              className="absolute top-6 right-6 bg-black p-2 rounded-full hover:bg-gray-600"
              onClick={() => navigate("/edit-profile")}
            >
              <FaUserEdit className="text-white" />
            </button>
          </div>
        </div>

        <div className="w-full mt-4 bg-white rounded-lg shadow-lg p-6">
          <div className="flex space-x-4 border-b border-gray-200 mb-4">
            <button className="py-2 px-4 text-red-600 border-b-2 border-red-600">
              Cursos
            </button>
            <button className="py-2 px-4 text-gray-600">Lista de deseados</button>
          </div>
          {/* Removed textarea */}
        </div>

        {isAdmin && (
          <button
            className="mt-4 px-4 py-2 bg-red-600 text-white rounded-md hover:bg-red-700"
            onClick={() => navigate("/admin")}
          >
            <FaUserShield className="inline mr-2" /> Admin Panel
          </button>
        )}
        <button
          className="mt-4 px-4 py-2 bg-red-600 text-white rounded-md hover:bg-red-700"
          onClick={handleLogout}
        >
          Cerrar sesión
        </button>
      </div>
    </div>
  );
};

export default Profile;
