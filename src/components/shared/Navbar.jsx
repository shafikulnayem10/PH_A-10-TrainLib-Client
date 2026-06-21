"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { Button } from "@heroui/react";
import { authClient } from "@/lib/auth-client";
import Image from "next/image";
import { useRouter, usePathname } from "next/navigation";

import logoImg from "../../../public/images/trainliblogo.jpg"; 

export default function Navbar() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [session, setSession] = useState(null);
  const [loading, setLoading] = useState(true);
  const router = useRouter();
  const pathname = usePathname();

  const getSession = async () => {
    try {
      setLoading(true);
      const { data } = await authClient.getSession();
      setSession(data);
    } catch (error) {
      console.error("Error fetching session:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    getSession();
  }, [pathname]);

  const user = session?.user;

  const handleSignOut = async () => {
    await authClient.signOut();
    setSession(null);
    setIsMenuOpen(false);
    router.push('/');
    router.refresh();
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

  const isActiveLink = (href) => {
    if (href === "/") {
      return pathname === href;
    }
    return pathname === href || pathname.startsWith(href);
  };

  if (loading) {
    return (
      <nav className="sticky top-0 z-50 border-b border-blue-100 bg-white/90 backdrop-blur-md">
        <div className="mx-auto flex h-20 max-w-7xl items-center justify-between px-4 sm:px-6 lg:px-8">
          <Link href="/" className="flex items-center gap-3 group">
            <div className="relative flex h-11 w-11 items-center justify-center rounded-xl border border-blue-200/60 bg-white shadow-sm transition-transform duration-200 group-hover:scale-105 overflow-hidden">
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
              <h1 className="text-xl font-black text-blue-950 tracking-tight transition-colors duration-200 group-hover:text-blue-600">
                Train<span className="text-blue-600">Lib</span>
              </h1>
            </div>
          </Link>
        </div>
      </nav>
    );
  }

  return (
    <nav className="sticky top-0 z-50 border-b border-blue-100 bg-white/90 backdrop-blur-md shadow-sm shadow-blue-100/20">
      <div className="mx-auto flex h-20 max-w-7xl items-center justify-between px-4 sm:px-6 lg:px-8">
        
        {/* Logo */}
        <Link href="/" className="flex items-center gap-3 group">
          <div className="relative flex h-11 w-11 items-center justify-center rounded-xl border border-blue-200/60 bg-white shadow-sm shadow-blue-100/50 transition-transform duration-200 group-hover:scale-105 overflow-hidden">
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
            <h1 className="text-xl font-black text-blue-950 tracking-tight transition-colors duration-200 group-hover:text-blue-600">
              Train<span className="text-blue-600">Lib</span>
            </h1>
          </div>
        </Link>

        <div className="flex items-center gap-4">
          <div className="hidden items-center gap-6 md:flex">
            {/* Nav Links */}
            <ul className="flex items-center gap-1 rounded-full border border-blue-100 bg-blue-50/50 px-3 py-1.5">
              {navLinks.map((link) => {
                const isActive = isActiveLink(link.href);
                return (
                  <li key={link.href}>
                    <Link
                      href={link.href}
                      className={`rounded-full px-4 py-2 text-sm font-semibold transition-all duration-200 ${
                        isActive
                          ? "bg-blue-600 text-white shadow-md shadow-blue-200/50"
                          : "text-blue-700 hover:bg-blue-100 hover:text-blue-600"
                      }`}
                    >
                      {link.label}
                    </Link>
                  </li>
                );
              })}
            </ul>

            <div className="h-6 w-px bg-blue-200" />

            {/* Auth Section */}
            <div className="flex items-center gap-4">
              {user ? (
                <div className="flex items-center gap-3">
                  <Image
                    src={user?.image || "https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?q=80&w=100"}
                    alt="User avatar"
                    width={36}
                    height={36}
                    className="h-9 w-9 rounded-full object-cover ring-2 ring-blue-400/30"
                  />
                  <span className="text-sm font-bold text-blue-700">
                    Hi, {user.name}!
                  </span>
                  <Button 
                    onClick={handleSignOut} 
                    variant="light"
                    className="font-bold text-rose-500 hover:bg-rose-50"
                  >
                    Sign Out
                  </Button>
                </div>
              ) : (
                <>
                  <Link
                    href="/login"
                    className="text-sm font-bold text-blue-600 transition hover:text-blue-700 hover:underline"
                  >
                    Login
                  </Link>
                  
                  <Link href="/register">
                    <Button
                      radius="xl"
                      className="h-11 bg-gradient-to-r from-blue-600 to-indigo-600 px-6 text-sm font-bold text-white hover:from-blue-700 hover:to-indigo-700 shadow-lg shadow-blue-200/50"
                    >
                      Register
                    </Button>
                  </Link>
                </>
              )}
            </div>
          </div>

          {/* Mobile Menu Button */}
          <button
            onClick={() => setIsMenuOpen(!isMenuOpen)}
            className="flex items-center justify-center rounded-lg p-2 text-blue-600 transition hover:bg-blue-50 md:hidden"
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

      {/* Mobile Menu */}
      {isMenuOpen && (
        <div className="border-t border-blue-100 bg-white md:hidden animate-in slide-in-from-top-2 duration-150 shadow-lg shadow-blue-100/20">
          <div className="space-y-3 px-4 py-6">
            <ul className="space-y-1">
              {navLinks.map((link) => {
                const isActive = isActiveLink(link.href);
                return (
                  <li key={link.href}>
                    <Link
                      href={link.href}
                      className={`block rounded-xl px-4 py-3 text-base font-semibold transition-all duration-200 ${
                        isActive
                          ? "bg-blue-600 text-white shadow-md shadow-blue-200/50"
                          : "text-blue-600 hover:bg-blue-50 hover:text-blue-700"
                      }`}
                      onClick={() => setIsMenuOpen(false)}
                    >
                      {link.label}
                    </Link>
                  </li>
                );
              })}
            </ul>

            <div className="border-t border-blue-100 pt-4">
              <div className="flex flex-col gap-3">
                {user ? (
                  <>
                    <div className="flex items-center gap-3 px-4 py-2.5 bg-blue-50/50 rounded-xl border border-blue-100">
                      <Image
                        src={user?.image || "https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?q=80&w=100"}
                        alt="User avatar"
                        width={36}
                        height={36}
                        className="h-9 w-9 rounded-full object-cover"
                      />
                      <div className="truncate">
                        <p className="text-sm font-bold text-blue-800 truncate">{user.name}</p>
                        <p className="text-xs text-blue-500 truncate">{user.email}</p>
                      </div>
                    </div>
                    <Button
                      onClick={handleSignOut}
                      className="w-full font-bold bg-rose-50 text-rose-500 hover:bg-rose-100 py-5 rounded-xl border border-rose-200"
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

                    <Link href="/register" onClick={() => setIsMenuOpen(false)}>
                      <Button
                        className="w-full bg-gradient-to-r from-blue-600 to-indigo-600 font-bold text-white shadow-lg shadow-blue-200/50 py-5 rounded-xl"
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