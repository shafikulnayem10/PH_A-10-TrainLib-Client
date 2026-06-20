'use client';

import { useEffect, useState } from "react";
import { usePathname } from "next/navigation";
import { 
    LayoutSideContentLeft, Bell, Briefcase, Gear, House, 
    Star, Calendar, GraduationCap, Comments, FileText, Person
} from "@gravity-ui/icons";
import { Button, Drawer } from "@heroui/react";
import { Users, UserCog, ShieldAlert } from "lucide-react";
import Link from 'next/link';
import { authClient } from "@/lib/auth-client";

const userNavLinks = [
    { icon: House,       href: "/dashboard/user",              label: "Overview" },
    { icon: Calendar,    href: "/dashboard/user/booked-classes",   label: "Booked Classes" },
    { icon: Star,        href: "/dashboard/user/favorites",        label: "Favorites" },
    { icon: FileText,    href: "/dashboard/user/apply-trainer",    label: "Apply as Trainer" },
    { icon: Person,      href: "/dashboard/user/profile",          label: "Manage Profile" },
    { icon: Gear,        href: "/dashboard/user/settings",         label: "Settings" },
];

const trainerNavLinks = [
    { icon: House,       href: "/dashboard/trainer",                label: "Overview" },
    { icon: FileText,    href: "/dashboard/trainer/add-class",      label: "Add New Class" }, 
    { icon: Briefcase,   href: "/dashboard/trainer/my-classes",     label: "My Classes" },
    { icon: Bell,        href: "/dashboard/trainer/add-forum-post", label: "Add Forum Post" },
    { icon: Comments,    href: "/dashboard/trainer/my-forum-posts", label: "My Forum Posts" },
    { icon: Gear,        href: "/dashboard/trainer/settings",       label: "Settings" },
];

const adminNavLinks = [
    { icon: House,         href: "/dashboard/admin",                      label: "Overview" },
    { icon: Users,         href: "/dashboard/admin/manage-users",         label: "Manage Users" },
    { icon: GraduationCap, href: "/dashboard/admin/trainer-applications", label: "Trainer Applications" },
    { icon: UserCog,       href: "/dashboard/admin/manage-trainers",      label: "Manage Trainers" },
    { icon: Briefcase,     href: "/dashboard/admin/manage-classes",       label: "Manage Classes" },
    { icon: Star,          href: "/dashboard/admin/transactions",         label: "Transactions" }, 
    { icon: Bell,          href: "/dashboard/admin/add-forum-post",       label: "Add Forum Post" },
    { icon: ShieldAlert,   href: "/dashboard/admin/manage-forum",         label: "Manage Forum" },
    { icon: Gear,          href: "/dashboard/admin/settings",             label: "Settings" },
];

export function DashboardSidebar() {
    const pathname = usePathname();
    const [user, setUser] = useState(null);
    const [loading, setLoading] = useState(true);
    const [role, setRole] = useState('user');

    useEffect(() => {
        const fetchUser = async () => {
            try {
                setLoading(true);
                const { data } = await authClient.getSession();
                const userData = data?.user || null;
                setUser(userData);
                setRole(userData?.role || 'user');
            } catch (error) {
                console.error("Error fetching user session:", error);
                setUser(null);
                setRole('user');
            } finally {
                setLoading(false);
            }
        };
        fetchUser();
    }, [pathname]);

    const navLinksMap = {
        user: userNavLinks,
        trainer: trainerNavLinks,
        admin: adminNavLinks,
    };

    const currentRole = role;
    const navItems = navLinksMap[currentRole] || userNavLinks;

    // Check if a link is active
    const isLinkActive = (href) => {
        // Exact match for the home/overview page
        if (href === pathname) {
            return true;
        }
        
       
        if (href !== `/dashboard/${currentRole}` && pathname.startsWith(href)) {
            return true;
        }
        
        
        if (href === `/dashboard/${currentRole}` && pathname === href) {
            return true;
        }
        
        return false;
    };

    const navContent = (
        <div className="flex flex-col h-full justify-between">
            <div className="space-y-3">
                {/* Header with gradient */}
                <div className="px-3 py-2 hidden lg:block">
                    <div className="flex items-center gap-2">
                        <div className="w-1 h-6 bg-gradient-to-b from-blue-500 to-blue-600 rounded-full"></div>
                        <h2 className="text-[10px] font-black tracking-widest text-blue-600 uppercase">
                            {currentRole.charAt(0).toUpperCase() + currentRole.slice(1)} Menu
                        </h2>
                    </div>
                </div>

                <nav className="flex flex-col gap-1">
                    {navItems.map((item) => {
                        const isActive = isLinkActive(item.href);
                        return (
                            <Link
                                key={item.label}
                                className={`flex items-center gap-2.5 rounded-lg px-3 py-2 text-xs font-semibold transition-all duration-200 group relative ${
                                    isActive 
                                        ? 'bg-gradient-to-r from-blue-50 to-blue-100/50 text-blue-700 shadow-sm shadow-blue-100/50' 
                                        : 'text-slate-600 hover:bg-blue-50/70 hover:text-blue-600'
                                }`}
                                href={item.href}
                            >
                                {/* Active indicator bar */}
                                {isActive && (
                                    <span className="absolute left-0 top-1/2 -translate-y-1/2 w-1 h-6 bg-gradient-to-b from-blue-500 to-blue-600 rounded-full"></span>
                                )}
                                
                                <item.icon className={`size-4 transition-colors flex-shrink-0 ${
                                    isActive ? 'text-blue-600' : 'text-slate-400 group-hover:text-blue-500'
                                }`} />
                                
                                <span className={isActive ? 'text-blue-700' : ''}>
                                    {item.label}
                                </span>
                                
                                {/* Active dot indicator */}
                                {isActive && (
                                    <span className="ml-auto w-1.5 h-1.5 rounded-full bg-blue-500 animate-pulse"></span>
                                )}
                            </Link>
                        );
                    })}
                </nav>
            </div>
            
            {/* Footer */}
            <div className="pt-3 border-t border-slate-100/80">
                <div className="flex items-center gap-2 px-3 py-1.5 bg-gradient-to-r from-blue-50/50 to-transparent rounded-lg">
                    <div className="w-1.5 h-1.5 rounded-full bg-blue-400 animate-pulse"></div>
                    <span className="text-[9px] font-semibold text-slate-400 tracking-wider">
                        TrainLib Workspace
                    </span>
                </div>
            </div>
        </div>
    );

    if (loading) {
        return (
            <aside className="hidden w-52 shrink-0 border-r border-slate-100 bg-white p-3 lg:block">
                <div className="flex items-center justify-center h-full">
                    <div className="w-5 h-5 border-2 border-blue-500 border-t-transparent rounded-full animate-spin"></div>
                </div>
            </aside>
        );
    }

    return (
        <>
          
            <aside className="hidden w-52 shrink-0 border-r border-slate-100 bg-white p-3 lg:block shadow-[1px_0_15px_rgba(59,130,246,0.05)]">
                {navContent}
            </aside>

            {/* Mobile Drawer Navigation */}
            <div className="p-3 lg:hidden">
                <Drawer>
                    <Button 
                        className="bg-blue-50 border border-blue-100 hover:bg-blue-100 text-blue-600 font-bold rounded-xl shadow-sm transition-all flex items-center gap-2 h-9 text-xs px-3" 
                        variant="flat"
                    >
                        <LayoutSideContentLeft className="size-3.5" />
                        Dashboard Menu
                    </Button>
                    <Drawer.Backdrop>
                        <Drawer.Content placement="left" className="max-w-[260px]">
                            <Drawer.Dialog className="bg-white p-4 rounded-r-2xl">
                                <Drawer.CloseTrigger className="text-slate-400 hover:text-blue-600 transition-colors" />
                                <Drawer.Header className="px-0 pb-3 border-b border-slate-50 mb-3">
                                    <Drawer.Heading className="text-lg font-black text-blue-950 tracking-tight">
                                        TrainLib
                                    </Drawer.Heading>
                                </Drawer.Header>
                                <Drawer.Body className="px-0 py-1">
                                    {navContent}
                                </Drawer.Body>
                            </Drawer.Dialog>
                        </Drawer.Content>
                    </Drawer.Backdrop>
                </Drawer>
            </div>
        </>
    );
}