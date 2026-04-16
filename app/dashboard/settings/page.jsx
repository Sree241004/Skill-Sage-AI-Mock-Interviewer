"use client";
import React from 'react';

export default function SettingsPage() {
  return (
    <div className="p-10">
      <h1 className="text-2xl font-bold mb-5">Settings</h1>
      <div className="bg-white p-10 rounded-xl border border-gray-200">
         <p className="text-gray-500 mb-4">Account and application settings will be available here.</p>
         <div className="flex items-center gap-4 border-b pb-4 mb-4">
             <div className="w-10 h-10 bg-indigo-100 rounded-full flex items-center justify-center">⚙️</div>
             <div>
                <h3 className="font-semibold text-gray-800">Preferences</h3>
                <p className="text-sm text-gray-500">Manage your notification and display settings.</p>
             </div>
         </div>
         <div className="flex items-center gap-4">
             <div className="w-10 h-10 bg-red-100 rounded-full flex items-center justify-center">🔒</div>
             <div>
                <h3 className="font-semibold text-gray-800">Privacy & Security</h3>
                <p className="text-sm text-gray-500">Control your data and account security.</p>
             </div>
         </div>
      </div>
    </div>
  );
}
