import { getUserSession } from "@/lib/core/session";
import { 
    LayoutSideContentLeft, Bell, Briefcase, Gear, House, 
    Star, Calendar, GraduationCap, Comments, FileText, Person
} from "@gravity-ui/icons";
import { Button, Drawer } from "@heroui/react";
import { Users, UserCog, ShieldAlert } from "lucide-react";
import Link from "next/link";

export async function DashboardSidebar() {

    const user = await getUserSession();

    
    const userNavLinks = [
        { icon: House,       href: "/dashboard/user",               label: "Overview" },
        { icon: Calendar,    href: "/dashboard/user/booked-classes",   label: "Booked Classes" },
        { icon: Star,        href: "/dashboard/user/favorites",        label: "Favorites" },
        { icon: FileText,    href: "/dashboard/user/apply-trainer",    label: "Apply as Trainer" },
        { icon: Person,      href: "/dashboard/user/profile",          label: "Manage Profile" },
        { icon: Gear,        href: "/dashboard/user/settings",         label: "Settings" },
    ];

   
    const trainerNavLinks = [
        { icon: House,       href: "/dashboard/trainer",                label: "Overview" },
        { icon: FileText,    href: "/dashboard/trainer/add-class",      label: "Add New Class" }, 
        { icon: Briefcase,   href: "/dashboard/trainer/manage-classes", label: "My Classes" },
        { icon: Bell,        href: "/dashboard/trainer/add-forum-post", label: "Add Forum Post" },
        { icon: Comments,    href: "/dashboard/trainer/forum-posts",    label: "My Forum Posts" },
        { icon: Gear,        href: "/dashboard/trainer/settings",       label: "Settings" },
    ];

   
    const adminNavLinks = [
        { icon: House,         href: "/dashboard/admin",                        label: "Overview" },
        { icon: Users,         href: "/dashboard/admin/users",                  label: "Manage Users" },
        { icon: GraduationCap, href: "/dashboard/admin/trainer-applications",   label: "Trainer Applications" },
        { icon: UserCog,       href: "/dashboard/admin/trainers",               label: "Manage Trainers" },
        { icon: Briefcase,     href: "/dashboard/admin/classes",                label: "Manage Classes" },
        { icon: Star,          href: "/dashboard/admin/transactions",           label: "Transactions" }, // CreditCard এর বদলে Star বা Lucide আইকন
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
        <nav className="flex flex-col gap-1">
            {navItems.map((item) => (
                <Link
                    key={item.label}
                    className="flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm text-foreground transition-colors hover:bg-default"
                    href={item.href}
                >
                    <item.icon className="size-5 text-muted" />
                    {item.label}
                </Link>
            ))}
        </nav>
    );

    return (
        <>
            <aside className="hidden w-64 shrink-0 border-r border-default p-4 lg:block">
                {navContent}
            </aside>
            <Drawer>
                <Button className="lg:hidden" variant="secondary">
                    <LayoutSideContentLeft />
                    Sidebar
                </Button>
                <Drawer.Backdrop>
                    <Drawer.Content placement="left">
                        <Drawer.Dialog>
                            <Drawer.CloseTrigger />
                            <Drawer.Header>
                                <Drawer.Heading>Navigation</Drawer.Heading>
                            </Drawer.Header>
                            <Drawer.Body>
                                {navContent}
                            </Drawer.Body>
                        </Drawer.Dialog>
                    </Drawer.Content>
                </Drawer.Backdrop>
            </Drawer>
        </>
    );
}