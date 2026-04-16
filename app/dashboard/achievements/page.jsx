"use client";
import React from 'react';

export default function AchievementsPage() {
  return (
    <div className="p-10">
      <h1 className="text-2xl font-bold mb-5">Practice Areas & Achievements</h1>
      <div className="bg-white p-10 rounded-xl border border-gray-200 text-center text-gray-500">
         <p>You haven&apos;t unlocked any badges or achievements yet.</p>
         <p className="text-sm mt-2">Complete more mock interviews to earn them!</p>
      </div>
    </div>
  );
}
