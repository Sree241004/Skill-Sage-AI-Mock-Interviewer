"use client";
import React from 'react';
import { Button } from "@/components/ui/button";

export default function SupportPage() {
  return (
    <div className="p-10">
      <h1 className="text-2xl font-bold mb-5">Help & Support</h1>
      <div className="bg-white p-10 rounded-xl border border-gray-200">
         <h2 className="text-lg font-bold text-gray-800 mb-2">Need Assistance?</h2>
         <p className="text-gray-500 mb-6">If you encounter any issues or have questions regarding your mock interviews, our support team is ready to help.</p>
         
         <div className="space-y-4">
             <Button className="w-full sm:w-auto bg-blue-600 hover:bg-blue-700 text-white">Contact Support via Email</Button>
             <p className="text-sm text-gray-400 mt-4">Average response time: 24-48 hours.</p>
         </div>
      </div>
    </div>
  );
}
