import React from 'react';
import { Link } from "react-router-dom";
const services = [
  { name: 'Buy Airtime', icon: '📞', color: 'bg-pink-100', iconColor: 'text-pink-600', nav: "/airtime"},
  { name: 'Buy Data', icon: '📶', color: 'bg-blue-100', iconColor: 'text-blue-600', nav: "/data" },
  { name: 'Cable TV', icon: '🖥️', color: 'bg-green-100', iconColor: 'text-green-600', nav:"/cable"},
  { name: 'Electricity', icon: '⚡', color: 'bg-yellow-100', iconColor: 'text-yellow-600', nav:"#"},
  { name: 'Exam Pin', icon: '🎓', color: 'bg-red-100', iconColor: 'text-red-600', nav:"#"},
  { name: 'Data Pin', icon: '📱', color: 'bg-indigo-100', iconColor: 'text-indigo-600', nav:"#"},
  { name: 'Agent', icon: '👨‍💼', color: 'bg-purple-100', iconColor: 'text-purple-600', nav:"#"},
  { name: 'Vendor', icon: '🛍️', color: 'bg-lime-100', iconColor: 'text-lime-600', nav:"#"},
  { name: 'History', icon: '📜', color: 'bg-gray-100', iconColor: 'text-gray-600', nav:"/history"},
];

const ServiceGrid = () => {
  return (
    <div className="grid grid-cols-3 gap-4">
      {services.map((service, index) => (
        <Link
          to={service.nav}
          key={index} 
          className="active:scale-95 hover:scale-95 p-3 text-center rounded-xl shadow-lg hover:shadow-xl transition duration-300 transform hover:scale-105 cursor-pointer bg-white"
        >
          <div className={`${service.color} ${service.iconColor} p-3 mx-auto w-12 h-12 rounded-full flex items-center justify-center mb-1 transition duration-300 group-hover:bg-opacity-80`}>
            <span className="text-xl">{service.icon}</span> 
          </div>
          <p className="text-xs font-medium text-gray-700 mt-2">{service.name}</p>
        </Link>
      ))}
    </div>
  );
};

export default ServiceGrid;