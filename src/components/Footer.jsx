import React from "react";

export default function Footer(){
  return (
    <footer className="py-10 border-t border-white/6 mt-20">
      <div className="container mx-auto px-6 lg:px-20 text-center text-gray-400">
        <div className="mb-4">© {new Date().getFullYear()} Paystar Galaxy</div>
        <div className="space-x-4">
          <a className="hover:text-white">Privacy</a>
          <a className="hover:text-white">Terms</a>
          <a className="hover:text-white">Support</a>
        </div>
      </div>
    </footer>
  )
}