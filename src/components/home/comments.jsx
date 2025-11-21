import React from "react";
import CommentCard from "../ui/comment-card.jsx";
import { Shield, Smartphone, FolderOpen } from 'lucide-react';

const Comment = ({theme}) => {
  return (
  <div className={theme==="light" ? "mt-10 bg-white px-5 md:px-24 mx-auto p-24" : "mt-10 bg-neutral-900 px-5 md:px-24 mx-auto p-24"}>
    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
      
      {/* First Card */}
      <div className={theme==="light" ? "mt-10 p-4 rounded bg-slate-100" : "mt-10 p-4 rounded bg-black"}>
        <CommentCard
          theme={theme}
          header="Friendly Interface" 
          icon={Smartphone} 
          content="Enjoy an awesome experience with beautiful interface while using our platform."
        />
      </div>

      {/* Second Card */}
      <div className={theme==="light" ? "mt-10 p-4 rounded bg-slate-100" : "mt-10 p-4 rounded bg-black"}>
        <CommentCard 
         theme={theme}
          header="E - Wallet System" 
          icon={FolderOpen} 
          content="Each user on our platform has a dedicated wallet which can be used to make all transaction."
        />
      </div>

      {/* Last Card (Centered) */}
      <div className="mt-5 md:mt-4 md:col-span-2 flex justify-center">
        <div className={theme==="light" ? "w-full md:w-1/2 p-6 rounded bg-slate-100" : "w-full md:w-1/2 p-6 rounded bg-black"}>
          <CommentCard 
            theme={theme}
            header="Secure Transactions" 
            icon={Shield} 
            content="Everything you do is secure, we keep your digital wallet safe at all time."
          />
        </div>
      </div>
      </div>
    </div>
  );
};

export default Comment;