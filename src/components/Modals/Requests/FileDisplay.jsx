import React from "react";
import { FaFileImage, FaFilePdf, FaFileAlt } from "react-icons/fa";

const FileDisplay = ({ submissions, onRemove }) => {
  // Dosya ikonunu belirleme fonksiyonu
  const getFileIcon = (fileName) => {
    const fileExtension = fileName.split(".").pop().toLowerCase();
    switch (fileExtension) {
      case "png":
      case "jpg":
      case "jpeg":
        return <FaFileImage className="text-blue-500 text-xl" />;
      case "pdf":
        return <FaFilePdf className="text-red-500 text-xl" />;
      default:
        return <FaFileAlt className="text-gray-500 text-xl" />;
    }
  };

  // Link metnini kısaltma fonksiyonu
  const truncateFileName = (fileName, maxLength = 20) => {
    if (fileName.length > maxLength) {
      return `${fileName.substring(0, maxLength)}...`;
    }
    return fileName;
  };

  return (
    <div className="bg-gray-100 rounded-lg p-4">
      <ul className="space-y-2">
        {submissions.map((file, index) => (
          <li
            key={index}
            className="flex items-center gap-4 border border-gray-200 rounded-lg p-2"
          >
            {getFileIcon(file.document.name || file.document)}
            <a
              href={file.document instanceof File ? URL.createObjectURL(file.document) : file.document}
              target="_blank"
              rel="noopener noreferrer"
              className="text-blue-500 underline truncate"
            >
              {truncateFileName(file.document.name || file.document)}
            </a>
            {file.documentDescription && (
              <span className="text-gray-700 text-sm italic">{file.documentDescription}</span>
            )}
            <button
              onClick={() => onRemove(index)}
              className="bg-red-500 text-white px-2 py-1 rounded hover:bg-red-600"
            >
              Kaldır
            </button>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default FileDisplay;