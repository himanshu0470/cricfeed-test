'use client';

import Link from 'next/link';
import Image from 'next/image';
import logo from '@/assets/cricfeed-logo.png';
import { useApp } from '@/app/providers';
import { useRouter } from "next/navigation";
import { USER_DATA_KEY } from '@/constants/loginConst';
import { CircleUserRound } from 'lucide-react';
import { Menu, MenuButton, MenuItem, MenuItems } from '@headlessui/react'
import { useState } from 'react';
import { Menu as Hamburger, User, LogOut } from 'lucide-react';

export const Header = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const { initialData } = useApp(); // Use `initialData` directly from `AppContext`
  const menuItems = initialData?.menuItems || [];
  const headerBlock = menuItems.find((block: any) => block.blockName === "Top Menu");
  const defaultPage = initialData?.pages.find((page: any) => page.isDefault === true);
  const defaultUrl = defaultPage ? `/${defaultPage.alias}` : '/';
  const router = useRouter();
  const userString = localStorage.getItem(USER_DATA_KEY) || ""; // Retrieve the data as a string
  const user = userString ? JSON.parse(userString) : null;
  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
  };
  return (
    <header className="bg-gradient-to-l bg-[#001DB2] h-[68px] w-full z-50 shadow-md rounded-b-xl">
      <div className="container-fluid mx-auto px-4">
          <div className="flex items-center justify-between h-15">
            <div className="flex items-center space-x-8">
              <Link href={defaultUrl} className="flex items-center" rel="canonical">
                <Image
                  src={logo}
                  alt="Sportish"
                  className="home-logo"
                />
              </Link>

              {/* Navigation for medium and larger screens */}
              <nav className="hidden md:flex space-x-6">
                {headerBlock?.menuItem
                  .sort(
                    (a: { displayOrder: number }, b: { displayOrder: number }) =>
                      a.displayOrder - b.displayOrder
                  )
                  .map((item: any) => (
                    <Link
                      key={item.menuItemId}
                      href={`/${item.pageDetails.alias}`}
                      className="text-white text-sm font-semibold tracking-wide p-2 hover:bg-[#1e3799] rounded-sm"
                      rel="canonical"
                    >
                      {item.menuItem.toUpperCase()}
                    </Link>
                  ))}
              </nav>
            </div>

            {/* User section for larger screens */}
            {user && (user?.fullName || user?.emailId || user?.userName) ? (
              <Menu>
                <MenuButton className="md:flex space-x-2 items-center hidden md:block text-white transition-opacity text-base font-semibold cursor-pointer sm-text-small">
                  <span className='mx-2'><CircleUserRound /></span> {user?.fullName ? user.fullName : user?.userName ? user?.userName : user?.emailId}
                </MenuButton>
                <MenuItems anchor="bottom" className="bg-white text-slate-600 z-50 space-y-1 py-2 rounded shadow-lg w-48">
                  <MenuItem>
                    <a className="flex items-center px-4 py-2 hover:bg-blue-100" href="/profile">
                      <User className="w-5 h-5 mr-2" />
                      <span>Profile</span>
                    </a>
                  </MenuItem>
                  <MenuItem>
                    <a className="flex items-center px-4 py-2 hover:bg-blue-100" 
                      onClick={() => {
                            localStorage.removeItem(USER_DATA_KEY);
                            localStorage.removeItem("accessToken");
                            router.push(`/`);
                            window.location.reload();
                      }}>
                      <LogOut className="w-5 h-5 mr-2" />
                      <span>Logout</span>
                    </a>
                  </MenuItem>
                </MenuItems>
              </Menu>
            ) : (
              <button
                className="hover:opacity-80 transition-opacity text-base font-semibold hidden md:block"
                onClick={() => router.push(`/login`)}
              >
                LOGIN
              </button>
            )}

            {/* Hamburger Menu for small screens at the last position */}
            <div className="md:hidden flex items-center ml-auto">
              <button
                onClick={toggleMenu}
                className="text-white p-2 focus:outline-none"
              >
                {/* Hamburger Icon */}
                <Hamburger />
              </button>
            </div>

            {/* Dropdown menu for small screens */}
            {isMenuOpen && (
              <div className="md:hidden absolute top-16 left-4 right-4 bg-slate-200 text-slate-800 p-4 z-20">
                {headerBlock?.menuItem
                  .sort(
                    (a: { displayOrder: number }, b: { displayOrder: number }) =>
                      a.displayOrder - b.displayOrder
                  )
                  .map((item: any) => (
                    <Link
                      key={item.menuItemId}
                      href={`/${item.pageDetails.alias}`}
                      className="block py-2 text-sm font-semibold"
                      rel="canonical"
                      onClick={() => toggleMenu()}
                    >
                      {item.menuItem.toUpperCase()}
                    </Link>
                  ))}
                {user && user.userName ? (
                  <Menu>
                    <MenuButton className="flex space-x-2 items-center transition-opacity text-base font-semibold cursor-pointer sm-text-small">
                      <span className='mr-2'><CircleUserRound /></span>{user.userName.toUpperCase()}
                    </MenuButton>
                    <MenuItems anchor="bottom" className="bg-white text-slate-600 z-50 space-y-1 py-2 rounded shadow-lg w-48">
                      <MenuItem>
                        <a className="flex items-center px-4 py-2 hover:bg-blue-100" href="/profile">
                          <User className="w-5 h-5 mr-2" />
                          <span>Profile</span>
                        </a>
                      </MenuItem>
                      <MenuItem>
                        <a className="flex items-center px-4 py-2 hover:bg-blue-100" 
                          onClick={() => {
                                localStorage.removeItem(USER_DATA_KEY);
                                localStorage.removeItem("accessToken");
                                router.push(`/`);
                                window.location.reload();
                          }}>
                          <LogOut className="w-5 h-5 mr-2" />
                          <span>Logout</span>
                        </a>
                      </MenuItem>
                    </MenuItems>
                  </Menu>
                ) : (
                  <button
                    className="hover:opacity-80 transition-opacity text-base font-semibold"
                    onClick={() => {
                      toggleMenu()
                      router.push(`/login`)
                    }}
                  >
                    LOGIN
                  </button>
                )}
              </div>
            )}
          </div>
      </div>
    </header>
  );
};
