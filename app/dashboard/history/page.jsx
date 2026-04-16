"use client";
import React from 'react';
import InterviewList from '../_components/InterviewList';

export default function HistoryPage() {
  return (
    <div className="p-10">
      <h1 className="text-2xl font-bold mb-5">Interview History</h1>
      <InterviewList />
    </div>
  );
}
