import React from "react";


const CommentCard = ({icon:Icon, header, content, theme}) =>{
  return (
      <div className="flex">
        <div className="mr-3">
        <Icon color="green" size={36} />
      </div>
      <div>
        <h6 className={theme==="light" ? "text-2xl text-blue-950 font-bold" : "text-2xl text-white font-bold"}>{ header }</h6>
        <p className="text-gray-500 font-sans">{content}</p>
      </div>
    </div>
  )
}

export default CommentCard;