"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { Button } from "@heroui/react";
import { authClient } from "@/lib/auth-client";
import Image from "next/image";

import logoImg from "../../../public/images/trainliblogo.jpg"; 

export default function Navbar() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [session, setSession] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const getSession = async () => {
      try {
        const { data } = await authClient.getSession();
        setSession(data);
      } catch (error) {
        console.error("Error fetching session:", error);
      } finally {
        setLoading(false);
      }
    };
    getSession();
  }, []);

  const user = session?.user;

  const handleSignOut = async () => {
    await authClient.signOut();
    setSession(null);
    setIsMenuOpen(false);
  };

  const navLinks = [
    {
      label: "Home",
      href: "/",
    },
    {
      label: "All Classes",
      href: "/classes",
    },
    {
      label: "Community Forum",
      href: "/forum",
    },
  ];

  const dashboardLinks = {
    user: "/dashboard/user",
    trainer: "/dashboard/trainer",
    admin: "/dashboard/admin",
  };

  if (user?.email) {
    navLinks.push({
      label: "Dashboard",
      href: dashboardLinks[user?.role || "user"],
    });
  }

  if (loading) {
    return (
      <nav className="sticky top-0 z-50 border-b border-slate-100 bg-white/90 backdrop-blur-md">
        <div className="mx-auto flex h-20 max-w-7xl items-center justify-between px-4 sm:px-6 lg:px-8">
          <Link href="/" className="flex items-center gap-3 group">
            <div className="relative flex h-11 w-11 items-center justify-center rounded-xl border border-slate-200/60 bg-white shadow-sm transition-transform duration-200 group-hover:scale-105 overflow-hidden">
              <Image
                src={logoImg}
                alt="TrainLib Logo"
                fill
                sizes="44px"
                className="object-cover"
                priority
              />
            </div>
            <div className="leading-none sm:block">
              <h1 className="text-xl font-black text-slate-950 tracking-tight transition-colors duration-200 group-hover:text-blue-600">
                Train<span className="text-blue-600">Lib</span>
              </h1>
            </div>
          </Link>
        </div>
      </nav>
    );
  }

  return (
    <nav className="sticky top-0 z-50 border-b border-slate-100 bg-white/90 backdrop-blur-md">
      <div className="mx-auto flex h-20 max-w-7xl items-center justify-between px-4 sm:px-6 lg:px-8">
        
        {/* LOGO & BRAND */}
        <Link href="/" className="flex items-center gap-3 group">
          <div className="relative flex h-11 w-11 items-center justify-center rounded-xl border border-slate-200/60 bg-white shadow-sm transition-transform duration-200 group-hover:scale-105 overflow-hidden">
            <Image
              src={logoImg}
              alt="TrainLib Logo"
              fill
              sizes="44px"
              className="object-cover"
              priority
            />
          </div>
          <div className="leading-none sm:block">
            <h1 className="text-xl font-black text-slate-950 tracking-tight transition-colors duration-200 group-hover:text-blue-600">
              Train<span className="text-blue-600">Lib</span>
            </h1>
          </div>
        </Link>

        {/* RIGHT SIDE: DESKTOP NAVIGATION & AUTH */}
        <div className="flex items-center gap-4">
          <div className="hidden items-center gap-6 md:flex">
            {/* Nav Links */}
            <ul className="flex items-center gap-1 rounded-full border border-slate-100 bg-slate-100 px-3 py-1.5">
              {navLinks.map((link) => (
                <li key={link.href}>
                  <Link
                    href={link.href}
                    className="rounded-full px-4 py-2 text-sm font-semibold text-slate-900 transition hover:bg-blue-50 hover:text-blue-600"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>

            {/* Vertical Divider */}
            <div className="h-6 w-px bg-slate-200" />

            {/* Auth Section */}
            <div className="flex items-center gap-4">
              {user ? (
                <div className="flex items-center gap-3">
                  <Image
                    src={user?.image || "https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?q=80&w=100"}
                    alt="User avatar"
                    width={36}
                    height={36}
                    className="h-9 w-9 rounded-full object-cover ring-2 ring-blue-600/20"
                  />
                  <span className="text-sm font-bold text-slate-700">
                    Hi, {user.name}!
                  </span>
                  <Button 
                    onClick={handleSignOut} 
                    variant="light"
                    className="font-bold text-red-500 hover:bg-red-50"
                  >
                    Sign Out
                  </Button>
                </div>
              ) : (
                <>
                  <Link
                    href="/login"
                    className="text-sm font-bold text-blue-600 transition hover:text-blue-700"
                  >
                    Login
                  </Link>
                  
                  {/* Desktop Register Button */}
                  <Link href="/register">
                    <Button
                      radius="xl"
                      className="h-11 bg-blue-600 px-6 text-sm font-bold text-white hover:bg-blue-700 shadow-md shadow-blue-600/10"
                    >
                      Register
                    </Button>
                  </Link>
                </>
              )}
            </div>
          </div>

          {/* MOBILE MENU BUTTON */}
          <button
            onClick={() => setIsMenuOpen(!isMenuOpen)}
            className="flex items-center justify-center rounded-lg p-2 text-slate-700 transition hover:bg-slate-100 md:hidden"
            aria-label="Toggle Menu"
          >
            {isMenuOpen ? (
              <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
              </svg>
            ) : (
              <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M4 6h16M4 12h16M4 18h16" />
              </svg>
            )}
          </button>
        </div>
      </div>

      {/* MOBILE MENU */}
      {isMenuOpen && (
        <div className="border-t border-slate-100 bg-white md:hidden animate-in slide-in-from-top-2 duration-150">
          <div className="space-y-3 px-4 py-6">
            {/* Nav Links */}
            <ul className="space-y-1">
              {navLinks.map((link) => (
                <li key={link.href}>
                  <Link
                    href={link.href}
                    className="block rounded-xl px-4 py-3 text-base font-semibold text-slate-600 transition hover:bg-blue-50 hover:text-blue-600"
                    onClick={() => setIsMenuOpen(false)}
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>

            {/* Divider & Auth Section */}
            <div className="border-t border-slate-100 pt-4">
              <div className="flex flex-col gap-3">
                {user ? (
                  <>
                    <div className="flex items-center gap-3 px-4 py-2.5 bg-slate-50 rounded-xl">
                      <Image
                        src={user?.image || "https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?q=80&w=100"}
                        alt="User avatar"
                        width={36}
                        height={36}
                        className="h-9 w-9 rounded-full object-cover"
                      />
                      <div className="truncate">
                        <p className="text-sm font-bold text-slate-800 truncate">{user.name}</p>
                        <p className="text-xs text-slate-500 truncate">{user.email}</p>
                      </div>
                    </div>
                    <Button
                      onClick={handleSignOut}
                      className="w-full font-bold bg-red-50 text-red-500 hover:bg-red-100 py-5"
                      radius="xl"
                    >
                      Sign Out
                    </Button>
                  </>
                ) : (
                  <>
                    <Link
                      href="/login"
                      className="rounded-xl px-4 py-3 text-center text-base font-bold text-blue-600 transition hover:bg-blue-50"
                      onClick={() => setIsMenuOpen(false)}
                    >
                      Login
                    </Link>

                    {/* Mobile Responsive Register Button */}
                    <Link href="/register" onClick={() => setIsMenuOpen(false)}>
                      <Button
                        className="w-full bg-blue-600 font-bold text-white shadow-md shadow-blue-600/10 py-5"
                        radius="xl"
                      >
                        Register
                      </Button>
                    </Link>
                  </>
                )}
              </div>
            </div>
          </div>
        </div>
      )}
    </nav>
  );
}