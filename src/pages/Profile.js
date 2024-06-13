import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../contexts/AuthContext";
import { db } from "../config/firebaseConfig";
import { doc, getDoc } from "firebase/firestore";
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
        const userDoc = await getDoc(doc(db, "profiles", currentUser.uid));
        if (userDoc.exists()) {
          setUserData(userDoc.data());
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

  if (!userData) {
    return <LoadingSkeleton />;
  }

  return (
    <div className="container mx-auto my-8 p-4">
      <div className="flex flex-col lg:flex-row items-center lg:items-start">
        <div className="lg:w-1/3 w-full lg:pr-8">
          <div className="bg-white p-6 rounded-lg shadow-lg">
            <div className="text-center">
              <div className="w-24 h-24 mx-auto rounded-full bg-gray-200 flex items-center justify-center">
                {userData.photoURL && (
                  <img
                    src={userData.photoURL}
                    alt="Profile"
                    className="w-full h-full rounded-full"
                  />
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
                    <FaStar className="text-gray-300" />
                    <span className="ml-2 text-sm">4.2</span>
                  </div>
                </div>
                <div className="text-right">
                  <span>75%</span>
                </div>
              </div>
              <div className="flex items-center justify-between">
                <div>
                  <h4 className="font-bold">Mastering JavaScript</h4>
                  <div className="flex items-center">
                    <FaStar className="text-yellow-500" />
                    <FaStar className="text-yellow-500" />
                    <FaStar className="text-yellow-500" />
                    <FaStar className="text-yellow-500" />
                    <FaStar className="text-yellow-500" />
                    <span className="ml-2 text-sm">4.7</span>
                  </div>
                </div>
                <div className="text-right">
                  <span>90%</span>
                </div>
              </div>
            </div>
          </div>
          <div className="bg-white p-6 rounded-lg shadow-lg">
            <h3 className="text-xl font-bold mb-4">Recommended Courses</h3>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {/* Example recommended courses */}
              <div className="bg-gray-100 p-4 rounded-lg">
                <h4 className="font-bold">Intro to Python Programming</h4>
                <div className="flex items-center mb-2">
                  <FaStar className="text-yellow-500" />
                  <FaStar className="text-yellow-500" />
                  <FaStar className="text-yellow-500" />
                  <FaStar className="text-yellow-500" />
                  <FaStar className="text-gray-300" />
                  <span className="ml-2 text-sm">4.2</span>
                </div>
                <button className="w-full px-4 py-2 font-bold text-white bg-[#D91604] rounded-md hover:bg-red-700">
                  Enroll
                </button>
              </div>
              <div className="bg-gray-100 p-4 rounded-lg">
                <h4 className="font-bold">Mastering CSS Layouts</h4>
                <div className="flex items-center mb-2">
                  <FaStar className="text-yellow-500" />
                  <FaStar className="text-yellow-500" />
                  <FaStar className="text-yellow-500" />
                  <FaStar className="text-yellow-500" />
                  <FaStar className="text-yellow-500" />
                  <span className="ml-2 text-sm">4.8</span>
                </div>
                <button className="w-full px-4 py-2 font-bold text-white bg-[#D91604] rounded-md hover:bg-red-700">
                  Enroll
                </button>
              </div>
              <div className="bg-gray-100 p-4 rounded-lg">
                <h4 className="font-bold">Advanced React Patterns</h4>
                <div className="flex items-center mb-2">
                  <FaStar className="text-yellow-500" />
                  <FaStar className="text-yellow-500" />
                  <FaStar className="text-yellow-500" />
                  <FaStar className="text-yellow-500" />
                  <FaStar className="text-yellow-500" />
                  <span className="ml-2 text-sm">5.0</span>
                </div>
                <button className="w-full px-4 py-2 font-bold text-white bg-[#D91604] rounded-md hover:bg-red-700">
                  Enroll
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
