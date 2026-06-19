import { getUserSession } from "@/lib/core/session";
import { 
    LayoutSideContentLeft, Bell, Briefcase, Gear, House, 
    Star, Calendar, GraduationCap, Comments, FileText, Person
} from "@gravity-ui/icons";
import { Button, Drawer } from "@heroui/react";
import { Users, UserCog, ShieldAlert } from "lucide-react";
import Link from 'next/link';

export async function DashboardSidebar() {

    const user = await getUserSession();

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
        { icon: Briefcase,   href: "/dashboard/trainer/my-classes", label: "My Classes" },
        { icon: Bell,        href: "/dashboard/trainer/add-forum-post", label: "Add Forum Post" },
        { icon: Comments,    href: "/dashboard/trainer/my-forum-posts",    label: "My Forum Posts" },
        { icon: Gear,        href: "/dashboard/trainer/settings",       label: "Settings" },
    ];

    const adminNavLinks = [
        { icon: House,         href: "/dashboard/admin",                        label: "Overview" },
        { icon: Users,         href: "/dashboard/admin/users",                  label: "Manage Users" },
        { icon: GraduationCap, href: "/dashboard/admin/trainer-applications",   label: "Trainer Applications" },
        { icon: UserCog,       href: "/dashboard/admin/trainers",               label: "Manage Trainers" },
        { icon: Briefcase,     href: "/dashboard/admin/classes",                label: "Manage Classes" },
        { icon: Star,          href: "/dashboard/admin/transactions",           label: "Transactions" }, 
        { icon: Bell,          href: "/dashboard/admin/add-forum-post",         label: "Add Forum Post" },
        { icon: ShieldAlert,   href: "/dashboard/admin/manage-forum",           label: "Manage Forum" },
        { icon: Gear,          href: "/dashboard/admin/settings",               label: "Settings" },
    ];

    const navLinksMap = {
        user: userNavLinks,
        trainer: trainerNavLinks,
        admin: adminNavLinks,
    };

    const currentRole = user?.role || "user";
    const navItems = navLinksMap[currentRole] || userNavLinks;

    const navContent = (
        <div className="flex flex-col h-full justify-between">
            <div className="space-y-4">
                {/* Clean Sidebar Branding Title */}
                <div className="px-3.5 py-2 hidden lg:block">
                    <h2 className="text-xs font-bold tracking-widest text-blue-600 uppercase/80">
                        {currentRole} Menu
                    </h2>
                </div>

                {/* Navigation Links with Blue Vibe */}
                <nav className="flex flex-col gap-1.5">
                    {navItems.map((item) => (
                        <Link
                            key={item.label}
                            className="flex items-center gap-3 rounded-xl px-3.5 py-3 text-sm font-semibold text-slate-600 transition-all duration-200 hover:bg-blue-50 hover:text-blue-600 active:scale-[0.98] group"
                            href={item.href}
                        >
                            <item.icon className="size-5 text-slate-400 transition-colors group-hover:text-blue-500" />
                            {item.label}
                        </Link>
                    ))}
                </nav>
            </div>
            
            {/* Footer Notice inside sidebar */}
            <div className="pt-4 border-t border-slate-100 text-[11px] text-slate-400 font-medium text-center">
                TrainLib Workspace v2.0
            </div>
        </div>
    );

    return (
        <>
            {/* Desktop Aside Panel */}
            <aside className="hidden w-64 shrink-0 border-r border-slate-100 bg-white p-4 lg:block shadow-[1px_0_10px_rgba(241,245,249,0.7)]">
                {navContent}
            </aside>

            {/* Mobile Drawer Navigation */}
            <div className="p-4 lg:hidden">
                <Drawer>
                    <Button 
                        className="bg-blue-50 border border-blue-100 hover:bg-blue-100 text-blue-600 font-bold rounded-xl shadow-sm transition-all flex items-center gap-2" 
                        variant="flat"
                    >
                        <LayoutSideContentLeft className="size-4" />
                        Dashboard Menu
                    </Button>
                    <Drawer.Backdrop>
                        <Drawer.Content placement="left" className="max-w-[280px]">
                            <Drawer.Dialog className="bg-white p-5 rounded-r-3xl">
                                <Drawer.CloseTrigger className="text-slate-400 hover:text-blue-600 transition-colors" />
                                <Drawer.Header className="px-0 pb-4 border-b border-slate-50 mb-4">
                                    <Drawer.Heading className="text-xl font-black text-blue-950 tracking-tight">
                                        TrainLib Navigation
                                    </Drawer.Heading>
                                </Drawer.Header>
                                <Drawer.Body className="px-0 py-2">
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