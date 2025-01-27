import React from "react";

const FormInput = ({
  label,
  name,
  value,
  onChange,
  maxLength, // maxLength prop'u
  onInput, // onInput prop'u
  type = "text",
  placeholder = "",
  required = false,
  error = "", // Hata mesajını prop olarak al
}) => {
  return (
    <div className="mb-4">
      <label className="block text-sm font-bold mb-2" htmlFor={name}>
        {label}
      </label>
      {type === "textarea" ? (
        <textarea
          id={name}
          name={name}
          value={value}
          onChange={onChange}
          placeholder={placeholder}
          className={`shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline ${
            error ? "border-red-500" : ""
          }`}
          required={required}
        />
      ) : (
        <input
          type={type}
          id={name}
          name={name}
          value={value}
          onChange={onChange}
          placeholder={placeholder}
          className={`shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline ${
            error ? "border-red-500" : ""
          }`}
          required={required}
          maxLength={maxLength} // maxLength özelliği
          onInput={onInput} // onInput özelliği
        />
      )}
      {/* Hata mesajını göster */}
      {error && <p className="text-red-500 text-xs mt-1">{error}</p>}
    </div>
  );
};

export default FormInput;