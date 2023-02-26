"use client";
import Link from "next/link";
import { Settings, User, Grid, Calendar } from "react-feather";
import { usePathname } from "next/navigation"; // this import is why "use client" is needed
// hooks only work on client components
import clsx from "clsx";

const icons = { Settings, User, Grid, Calendar }

// link prop is being passed from server component to this client component
// which has a network barrier.
// a function can't be serialzed across that boundary, and other types of objects can't be serialized, like Icon
// so we pass a string that tells which icon to use

const SidebarLink = ( { link } : {
    link: any
}) => {
    const pathname = usePathname()
    let isActive = false

    // this doesn't need to be state, can be handled when component rerenders
    if (pathname === link.link) {
        isActive = true
    }

    const Icon = icons[link.icon];
    return (
        <Link href={link.link} className="w-full flex justify-center items-center">
            <Icon 
                size={40} 
                className={clsx(
                    "stroke-gray-400 hover:stroke-violet-600 transition duration-200 ease-in-out", 
                    isActive && "stroke-violet-600"
                )} 
            />
        </Link>
    )
}

export default SidebarLink;