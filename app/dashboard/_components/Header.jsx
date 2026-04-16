"use client"
import { UserButton } from '@clerk/nextjs'
import Image from 'next/image'
import React from 'react'
import { Moon, Bell } from 'lucide-react'

export const Header = () => {
  return (
    <div className='flex p-4 items-center justify-between md:justify-end bg-white border-b h-16'>
        {/* Mobile Logo */}
        <div className="flex items-center gap-2 md:hidden">
           <Image src={'/logo.svg'} alt='logo' width={30} height={30} />
           <span className="font-bold">AI Mock Interview</span>
        </div>

        <div className="flex items-center gap-6">
            <Moon className="w-5 h-5 text-gray-500 cursor-pointer hover:text-primary transition-all" />
            <div className="relative">
                <Bell className="w-5 h-5 text-gray-500 cursor-pointer hover:text-primary transition-all" />
                <span className="absolute -top-1 -right-1 w-2 h-2 bg-red-500 rounded-full"></span>
            </div>
            <UserButton/>
        </div>
    </div>
  )
}
