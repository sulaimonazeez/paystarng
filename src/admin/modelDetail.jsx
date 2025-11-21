import React, { useEffect, useState } from "react";
import NavBar from "./navbar.jsx";
import { useParams } from "react-router-dom";
import UserTable from "./userTable.jsx";
import axiosInstance from "../api/utilities.jsx";

const ModelDetail = () => {
  const { model } = useParams();
  const [users, setUsers] = useState([]);
  const [selectedUser, setSelectedUser] = useState(null);
  const [formData, setFormData] = useState({});

  const handleEdit = (user) => {
    setSelectedUser(user);
    setFormData(user);
  };

  const handleUpdate = async () => {
    try {
      await axiosInstance.put(`/model/${model}/${selectedUser._id}`, formData);
      alert("Updated successfully!");
      setSelectedUser(null);
    } catch (err) {
      console.error(err);
    }
  };

  useEffect(() => {
    const fetchDetail = async () => {
      try {
        const response = await axiosInstance.get(`/model/${model}`);
        setUsers(response.data);
      } catch (err) {
        console.log(err);
      }
    };
    if (model) fetchDetail();
  }, [model]);

  const handleDelete = async (id) => {
    if (confirm("Are you sure you want to delete this?")) {
      try {
        await axiosInstance.delete(`/model/${model}/${id}`);
        setUsers((prev) => prev.filter((item) => item._id !== id));
      } catch (err) {
        console.log(err);
      }
    }
  };

  return (
    <div className="min-h-screen bg-black text-gray-200">
      <NavBar />

      <div className="px-4 md:px-10 py-6 animate-fadeIn">
        <h1 className="text-3xl font-bold text-indigo-400 mb-5 tracking-wide drop-shadow">
          {model} Management
        </h1>

        <div className="bg-black/40 p-4 rounded-xl border border-white/10 shadow-xl backdrop-blur-md">
          <UserTable data={users} handleEdit={handleEdit} onDelete={handleDelete} />
        </div>
      </div>

      {/* MODAL */}
      {selectedUser && (
        <div className="
          fixed inset-0 bg-black/70 backdrop-blur-sm flex items-center justify-center
          animate-fadeIn
        ">
          <div className="
            bg-gradient-to-br from-black/70 to-black/30 
            border border-white/10 
            shadow-[0_0_35px_rgba(255,255,255,0.15)]
            rounded-xl p-6 w-[90%] md:w-[450px]
            animate-scaleIn
          ">
            <h2 className="text-xl font-bold text-indigo-300 mb-4">
              Edit {model}
            </h2>

            <div className="space-y-3 max-h-[55vh] overflow-y-auto pr-1">
              {Object.keys(formData).map((field) => {
                if (["_id", "createdAt", "updatedAt", "__v", "password", "UpdatedAt", "CreatedAt", "timestamps"].includes(field))
                  return null;

                return (
                  <div key={field} className="flex flex-col">
                    <label className="text-sm text-gray-300 mb-1 capitalize">
                      {field}
                    </label>
                    <input
                      type="text"
                      value={formData[field] || ""}
                      onChange={(e) =>
                        setFormData({ ...formData, [field]: e.target.value })
                      }
                      className="
                        bg-black/40 border border-white/10 rounded-md p-2 text-gray-200 
                        focus:outline-none focus:ring-2 focus:ring-indigo-500 
                        transition
                      "
                    />
                  </div>
                );
              })}
            </div>

            <div className="flex justify-end gap-3 mt-5">
              <button
                onClick={() => setSelectedUser(null)}
                className="
                  px-4 py-2 rounded-md bg-gray-600/40 text-gray-200 
                  hover:bg-gray-500/60 transition shadow
                "
              >
                Cancel
              </button>

              <button
                onClick={handleUpdate}
                className="
                  px-4 py-2 rounded-md bg-indigo-600 text-white 
                  hover:bg-indigo-500 
                  shadow hover:shadow-[0_0_15px_rgba(99,102,241,0.6)]
                  transition
                "
              >
                Save
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ModelDetail;