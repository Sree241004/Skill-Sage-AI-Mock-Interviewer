"use client";
import React from "react";
import Link from "next/link";

function AddNewInterview({ children }) {
  return (
    <Link href="/dashboard/interview/setup" className="block w-full h-full">
      {children ? children : (
        <div className="p-10 border rounded-lg bg-secondary hover:scale-105 hover:shadow-md cursor-pointer transition-all">
          <h1 className="font-bold text-lg text-center">+ Add New</h1>
        </div>
      )}
    </Link>
  );
}

export default AddNewInterview;
