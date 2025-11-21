import React from 'react';

const ActionCard = ({ label, subtext, icon, onClick }) => {
  return (
    <div 
      className="flex items-center justify-between p-4 bg-gray-50 rounded-lg shadow-sm cursor-pointer 
                 hover:shadow-md hover:bg-gray-100 transition duration-300 transform hover:scale-[1.01]"
      onClick={onClick}
    >
      <div className="flex items-center">
        {/* You'd use an SVG here for a truly high-res icon */}
        <span className="text-xl mr-3">{icon}</span> 
        <div>
          <p className="font-medium text-gray-800">{label}</p>
          {subtext && <p className="text-sm text-gray-500">{subtext}</p>}
        </div>
      </div>
      {/* Example for a right-aligned icon, like the signal strength */}
      {label === "View Network Status" && (
        <svg className="w-6 h-6 text-orange-500" fill="currentColor" viewBox="0 0 20 20"><path d="M2 10a8 8 0 018-8v8h8a8 8 0 01-8 8v-8H2z"></path></svg> // Placeholder for signal icon
      )}
      {label === "Select From Contacts" && (
        <svg className="w-6 h-6 text-gray-500" fill="currentColor" viewBox="0 0 20 20"><path d="M13 7a4 4 0 11-8 0 4 4 0 018 0zm-4 7a4 4 0 00-4 4v1h8v-1a4 4 0 00-4-4z"></path></svg> // Placeholder for contacts icon
      )}
    </div>
  );
};

export default ActionCard;