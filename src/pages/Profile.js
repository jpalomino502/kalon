import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../contexts/AuthContext";
import { db } from "../config/firebaseConfig";
import { doc, getDoc, setDoc } from "firebase/firestore";
import { FaStar, FaUserEdit, FaUserShield } from "react-icons/fa";
import LoadingSkeleton from "../components/Loading/LoadingSkeleton";

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

        // Si no existe el documento del usuario, crear uno nuevo
        if (!userDoc.exists()) {
          const defaultUserData = {
            name: currentUser.displayName || "Nuevo Usuario",
            email: currentUser.email,
            bio: "",
            photoURL: currentUser.photoURL || "",
          };
          await setDoc(userDocRef, defaultUserData);

          // Volver a obtener el documento después de la creación
          userDoc = await getDoc(userDocRef);
        }

        // Verificar si el documento se creó correctamente
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

  return (
    <div className="container mx-auto my-8 p-4">
      <div className="flex flex-col lg:flex-row items-center lg:items-start">
        <div className="lg:w-1/3 w-full lg:pr-8">
          <div className="bg-white p-6 rounded-lg shadow-lg">
            <div className="text-center">
              <div className="w-24 h-24 mx-auto rounded-full bg-gray-200 flex items-center justify-center">
                {userData.photoURL ? (
                  <img
                    src={userData.photoURL}
                    alt="Profile"
                    className="w-full h-full rounded-full"
                  />
                ) : (
                  <span className="text-gray-500">No Image</span>
                )}
              </div>
              <h2 className="text-xl font-bold mt-4">{userData.name}</h2>
              <p className="text-gray-600 mt-4 text-sm">{userData.email}</p>
              <p className="text-gray-600 mt-2 text-sm">{userData.bio}</p>
              <button
                className="mt-4 px-4 py-2 bg-[#D91604] text-white rounded-md hover:bg-red-700"
                onClick={() => navigate("/edit-profile")}
              >
                <FaUserEdit className="inline mr-2" /> Editar Perfil
              </button>
              {isAdmin && (
                <button
                  className="mt-4 px-4 py-2 bg-gray-300 text-gray-700 rounded-md hover:bg-gray-400 ml-4"
                  onClick={() => navigate("/admin")}
                >
                  <FaUserShield className="inline mr-2" /> Admin Panel
                </button>
              )}
              <button
                className="mt-4 px-4 py-2 bg-gray-300 text-gray-700 rounded-md hover:bg-gray-400 ml-4"
                onClick={handleLogout}
              >
                Cerrar sesión
              </button>
            </div>
          </div>
        </div>
        <div className="lg:w-2/3 w-full mt-8 lg:mt-0">
          <div className="bg-white p-6 rounded-lg shadow-lg mb-6">
            <h3 className="text-xl font-bold mb-4">Courses Purchased</h3>
            <div className="space-y-4">
              {/* Example courses purchased */}
              <div className="flex items-center justify-between">
                <div>
                  <h4 className="font-bold">Introduction to React.js</h4>
                  <div className="flex items-center">
                    <FaStar className="text-yellow-500" />
                    <FaStar className="text-yellow-500" />
                    <FaStar className="text-yellow-500" />
                    <FaStar className="text-yellow-500" />
                    <FaStar className="text-yellow-500" />
                  </div>
                </div>
                <button className="bg-[#D91604] text-white px-4 py-2 rounded-md hover:bg-red-700">
                  View Course
                </button>
              </div>
              <div className="flex items-center justify-between">
                <div>
                  <h4 className="font-bold">Advanced JavaScript</h4>
                  <div className="flex items-center">
                    <FaStar className="text-yellow-500" />
                    <FaStar className="text-yellow-500" />
                    <FaStar className="text-yellow-500" />
                    <FaStar className="text-yellow-500" />
                    <FaStar className="text-yellow-500" />
                  </div>
                </div>
                <button className="bg-[#D91604] text-white px-4 py-2 rounded-md hover:bg-red-700">
                  View Course
                </button>
              </div>
            </div>
          </div>
          <div className="bg-white p-6 rounded-lg shadow-lg">
            <h3 className="text-xl font-bold mb-4">Blogs</h3>
            <div className="space-y-4">
              {/* Example blogs */}
              <div className="flex items-center justify-between">
                <div>
                  <h4 className="font-bold">Understanding Redux</h4>
                  <p className="text-gray-600">March 25, 2023</p>
                </div>
                <button className="bg-[#D91604] text-white px-4 py-2 rounded-md hover:bg-red-700">
                  Read Blog
                </button>
              </div>
              <div className="flex items-center justify-between">
                <div>
                  <h4 className="font-bold">React Hooks Explained</h4>
                  <p className="text-gray-600">April 10, 2023</p>
                </div>
                <button className="bg-[#D91604] text-white px-4 py-2 rounded-md hover:bg-red-700">
                  Read Blog
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Profile;
