// FormField.jsx
import React from 'react';

const FormField = ({ label, type, options, value, onChange, placeholder }) => {
  const inputClasses = "w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent transition duration-200 text-gray-800";
  const labelClasses = "block text-sm font-medium text-gray-700 mb-2";

  return (
    <div className="space-y-1">
      <label className={labelClasses}>{label}</label>
      {type === 'select' ? (
        <div className="relative">
          <select
            required
            className={`${inputClasses} appearance-none pr-8`} 
            value={value} 
            onChange={onChange}
          >
            {options.map((option, index) => {
              const isPlaceholder = index === 0;
              return (
                <option
                  key={index}
                  value={isPlaceholder ? '' : option}
                  disabled={isPlaceholder} // placeholder cannot be selected
                >
                  {option.toUpperCase()}
                </option>
              );
            })}
          </select>
          <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-2 text-gray-700">
            <svg className="fill-current h-4 w-4" viewBox="0 0 20 20">
              <path d="M9.293 12.95l.707.707L15.657 8l-1.414-1.414L10 10.828 5.757 6.586 4.343 8z"/>
            </svg>
          </div>
        </div>
      ) : (
        <input 
          type={type} 
          className={inputClasses} 
          placeholder={placeholder} 
          value={value} 
          onChange={onChange} 
        />
      )}
    </div>
  );
};

export default FormField;