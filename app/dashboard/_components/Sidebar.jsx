"use client";
import { LayoutDashboard, Play, History, BarChart, Trophy, User, Settings, HelpCircle } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";
import React from "react";
import { Button } from "@/components/ui/button";

const Sidebar = () => {
  const path = usePathname();

  const menuList = [
    {
      name: "Dashboard",
      icon: LayoutDashboard,
      path: "/dashboard",
    },
    {
      name: "Start Interview",
      icon: Play,
      path: "/dashboard/interview/setup",
    },
    {
      name: "Interview History",
      icon: History,
      path: "/dashboard/history",
    },
    {
      name: "Analytics",
      icon: BarChart,
      path: "/dashboard/analytics",
    },
    {
      name: "Achievements",
      icon: Trophy,
      path: "/dashboard/achievements",
    },
    {
      name: "Profile",
      icon: User,
      path: "/dashboard/profile",
    },
    {
      name: "Settings",
      icon: Settings,
      path: "/dashboard/settings",
    },
    {
      name: "Help & Support",
      icon: HelpCircle,
      path: "/dashboard/support",
    },
  ];

  return (
    <div className="w-64 border-r h-screen bg-white fixed hidden md:flex flex-col">
      <div className="p-5 flex items-center gap-2 border-b">
        <Image src="/logo.svg" alt="logo" width={30} height={30} />
        <span className="font-bold text-lg hidden lg:block">Mock Interview</span>
      </div>
      <div className="flex-1 overflow-y-auto px-4 py-4 space-y-2">
        <p className="text-sm font-semibold text-gray-500 mb-2 px-3">Navigation</p>
        <ul className="flex flex-col gap-1">
          {menuList.map((item, index) => (
            <li key={index}>
              <Link href={item.path}>
                <div
                  className={`flex items-center gap-3 p-3 rounded-lg cursor-pointer transition-all hover:bg-gray-100 hover:text-primary ${
                    path === item.path ? "bg-indigo-50 text-primary font-medium" : "text-gray-600"
                  }`}
                >
                  <item.icon className="w-5 h-5" />
                  <span>{item.name}</span>
                </div>
              </Link>
            </li>
          ))}
        </ul>
      </div>

      <div className="p-4 border-t">
        <div className="bg-indigo-50 rounded-lg p-4 text-center space-y-3">
          <div className="mx-auto bg-white w-10 h-10 flex items-center justify-center rounded-full shadow-sm text-primary">
            <Trophy className="w-5 h-5" />
          </div>
          <div>
            <p className="font-semibold text-sm">Upgrade to Pro</p>
            <p className="text-xs text-gray-500">Get unlimited interviews</p>
          </div>
          <Button className="w-full bg-blue-600 hover:bg-blue-700 text-white rounded-md text-sm">Upgrade Now</Button>
        </div>
      </div>
    </div>
  );
};

export default Sidebar;
