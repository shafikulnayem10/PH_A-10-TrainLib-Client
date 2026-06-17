"use client";

import Link from "next/link";
import Image from "next/image";
import { FaFacebook, FaGithub, FaLinkedinIn } from "react-icons/fa";
import { RiTwitterXFill } from "react-icons/ri";
import { Mail, Phone, MapPin } from "lucide-react";

import logoImg from "../../../public/images/trainliblogo.jpg";

export default function Footer() {
  const currentYear = new Date().getFullYear();

  const quickLinks = [
    { label: "Home", href: "/" },
    { label: "All Classes", href: "/classes" },
    { label: "Community Forum", href: "/forum" },
   
  ];

  const socialLinks = [
    { icon: <FaFacebook size={18} />, href: "https://facebook.com", label: "Facebook" },
    { icon: <RiTwitterXFill size={18} />, href: "https://x.com", label: "X (Twitter)" },
    { icon: <FaLinkedinIn size={18} />, href: "https://linkedin.com", label: "LinkedIn" },
    { icon: <FaGithub size={18} />, href: "https://github.com", label: "GitHub" },
  ];

  return (
    <footer className="w-full bg-white dark:bg-slate-950 border-t border-slate-100 dark:border-slate-900 text-slate-600 dark:text-slate-400 mt-auto transition-colors duration-300">
      <div className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8">
        
        {/* Main Footer Content Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 pb-8 border-b border-slate-100 dark:border-slate-900">
          
          {/* Column 1: Brand & Description */}
          <div className="flex flex-col gap-4">
            <Link href="/" className="flex items-center gap-3 group">
              <div className="relative flex h-10 w-10 items-center justify-center rounded-xl border border-slate-200/60 bg-white shadow-sm overflow-hidden">
                <Image
                  src={logoImg}
                  alt="TrainLib Logo"
                  fill
                  sizes="40px"
                  className="object-cover"
                />
              </div>
              <h1 className="text-xl font-black text-slate-950 dark:text-white tracking-tight">
                Train<span className="text-blue-600">Lib</span>
              </h1>
            </Link>
            <p className="text-sm font-medium leading-relaxed max-w-xs text-slate-500 dark:text-slate-400">
              Your ultimate platform to manage fitness classes, discover expert trainers, and engage with a vibrant health community.
            </p>
          </div>

          {/* Column 2: Quick Links */}
          <div className="flex flex-col gap-4 md:items-center">
            <div className="w-fit">
              <h3 className="text-sm font-extrabold text-slate-900 dark:text-white uppercase tracking-wider mb-2">
                Quick Links
              </h3>
              <ul className="flex flex-col gap-2.5">
                {quickLinks.map((link) => (
                  <li key={link.label}>
                    <Link
                      href={link.href}
                      className="text-sm font-semibold hover:text-blue-600 dark:hover:text-blue-400 transition-colors"
                    >
                      {link.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          </div>

          {/* Column 3: Contact Information */}
          <div className="flex flex-col gap-4">
            <h3 className="text-sm font-extrabold text-slate-900 dark:text-white uppercase tracking-wider">
              Contact Information
            </h3>
            <ul className="flex flex-col gap-3">
              <li className="flex items-center gap-3 text-sm font-medium">
                <MapPin size={16} className="text-blue-600 shrink-0" />
                <span>123 Fitness Plaza, Dhaka, Bangladesh</span>
              </li>
              <li className="flex items-center gap-3 text-sm font-medium">
                <Phone size={16} className="text-blue-600 shrink-0" />
                <a href="tel:+880123456789" className="hover:underline">
                  +880 1234-567890
                </a>
              </li>
              <li className="flex items-center gap-3 text-sm font-medium">
                <Mail size={16} className="text-blue-600 shrink-0" />
                <a href="mailto:support@trainlib.com" className="hover:underline">
                  support@trainlib.com
                </a>
              </li>
            </ul>
          </div>

        </div>

        {/* Bottom Footer Section: Social Icons & Copyright */}
        <div className="flex flex-col sm:flex-row items-center justify-between gap-4 pt-8">
          
          {/* Copyright Text */}
          <p className="text-xs font-bold text-slate-400 dark:text-slate-500 order-2 sm:order-1">
            &copy; {currentYear} TrainLib. All rights reserved.
          </p>

          {/* Social Media Links with Modern X Logo */}
          <div className="flex items-center gap-3 order-1 sm:order-2">
            {socialLinks.map((social) => (
              <a
                key={social.label}
                href={social.href}
                target="_blank"
                rel="noopener noreferrer"
                aria-label={social.label}
                className="flex h-9 w-9 items-center justify-center rounded-xl bg-slate-50 dark:bg-slate-900 border border-slate-100 dark:border-slate-800 text-slate-500 dark:text-slate-400 hover:bg-blue-600 hover:text-white dark:hover:bg-blue-600 dark:hover:text-white hover:border-blue-600 shadow-sm transition-all duration-200 hover:-translate-y-0.5"
              >
                {social.icon}
              </a>
            ))}
          </div>

        </div>

      </div>
    </footer>
  );
}