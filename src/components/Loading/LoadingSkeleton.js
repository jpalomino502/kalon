// src/components/LoadingSkeleton.js
import React from "react";
import "./LoadingSkeleton.css"; // Asegúrate de crear este archivo CSS

const LoadingSkeleton = () => {
  return (
    <div className="skeleton-wrapper">
      <div className="skeleton-header"></div>
      <div className="skeleton-content">
        <div className="skeleton-item"></div>
        <div className="skeleton-item"></div>
        <div className="skeleton-item"></div>
      </div>
    </div>
  );
};

export default LoadingSkeleton;
