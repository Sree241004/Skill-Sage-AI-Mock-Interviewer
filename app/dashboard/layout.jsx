import React from "react";
import { Header } from "./_components/Header";
import Sidebar from "./_components/Sidebar";

function DashboardLayout({ children }) {
  return (
    <div className="flex bg-gray-50/50 min-h-screen">
      <Sidebar />
      <div className="flex-1 flex flex-col md:ml-64">
        <Header />
        <main className="flex-1 p-5 md:p-8 lg:p-10 overflow-y-auto">
          {children}
        </main>
      </div>
    </div>
  );
}

export default DashboardLayout;
