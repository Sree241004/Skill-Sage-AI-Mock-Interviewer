"use client";
import React from 'react';
import { UserProfile } from '@clerk/nextjs';

export default function ProfilePage() {
  return (
    <div className="p-10 flex justify-center">
      <UserProfile routing="hash" />
    </div>
  );
}
