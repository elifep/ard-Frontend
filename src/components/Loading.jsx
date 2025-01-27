// src/components/Loading.js
import React from "react";

const Loading = () => {
  return (
    <div className="flex flex-col items-center justify-center h-screen w-full bg-gray-100 text-gray-700">
      <div className="animate-spin rounded-full h-16 w-16 border-t-4 border-b-4 border-bordo"></div>
      <h1 className="mt-4 text-xl font-semibold">Yükleniyor...</h1>
      <p className="mt-2">Lütfen bekleyin.</p>
    </div>
  );
};

export default Loading;