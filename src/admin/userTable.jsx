import React from "react";

const UserTable = ({ data, onDelete, handleEdit }) => {
  if (!data || data.length === 0) {
    return (
      <p className="text-center text-gray-400 py-10 text-lg">
        No data found
      </p>
    );
  }

  const excludeFields = ["_id", "__v", "password", "user"];
  const tableHeaders = Object.keys(data[0]).filter(
    (key) => !excludeFields.includes(key)
  );

  return (
    <div className="overflow-x-auto rounded-lg border border-white/10 shadow-xl bg-black/50 backdrop-blur-md">
      <table className="min-w-full border-collapse text-sm text-gray-300">
        {/* HEADER */}
        <thead className="bg-black/60 border-b border-white/10">
          <tr>
            <th className="py-3 px-4">
              <input type="checkbox" className="form-checkbox" />
            </th>

            {tableHeaders.map((header) => (
              <th
                key={header}
                className="py-3 px-4 text-indigo-300 font-semibold text-left capitalize"
              >
                {header}
              </th>
            ))}

            <th className="py-3 px-4 text-blue-300 font-semibold">Update</th>
            <th className="py-3 px-4 text-red-300 font-semibold">Delete</th>
          </tr>
        </thead>

        {/* BODY */}
        <tbody>
          {data.map((item, index) => (
            <tr
              key={item._id || index}
              className="
                border-b border-white/5 
                hover:bg-white/5 
                transition 
                duration-200
              "
            >
              <td className="py-3 px-4">
                <input type="checkbox" className="form-checkbox" />
              </td>

              {tableHeaders.map((header) => (
                <td key={header} className="py-3 px-4">
                  {typeof item[header] === "object"
                    ? JSON.stringify(item[header])
                    : item[header]}
                </td>
              ))}

              {/* EDIT BUTTON */}
              <td className="py-3 px-4">
                <button
                  onClick={() => handleEdit(item)}
                  className="
                    px-3 py-1 
                    bg-blue-600/80 hover:bg-blue-500 
                    text-white 
                    rounded-md 
                    transition 
                    duration-200 
                    shadow 
                    hover:shadow-[0_0_10px_rgba(37,99,235,0.6)]
                  "
                >
                  Edit
                </button>
              </td>

              {/* DELETE BUTTON */}
              <td className="py-3 px-4">
                <button
                  onClick={() => onDelete(item._id)}
                  className="
                    px-3 py-1 
                    bg-red-600/80 hover:bg-red-500 
                    text-white 
                    rounded-md 
                    transition 
                    duration-200 
                    shadow 
                    hover:shadow-[0_0_10px_rgba(239,68,68,0.6)]
                  "
                >
                  Delete
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default UserTable;