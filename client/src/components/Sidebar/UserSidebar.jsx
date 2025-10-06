import React from "react";
import { NavLink } from "react-router-dom";
import { motion } from "framer-motion";

const links = [
	{ to: "/dashboard/user", label: "Dashboard", icon: (
		<svg className="w-6 h-6" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M3 12l2-2m0 0l7-7 7 7M13 5v6h6m-6 0v6m0 0H7m6 0h6" /></svg>
	) },
	{ to: "/dashboard/user/my-bookings", label: "My Bookings", icon: (
		<svg className="w-6 h-6" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" /></svg>
	) },
	{ to: "/dashboard/user/profile", label: "Profile", icon: (
		<svg className="w-6 h-6" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M5.121 17.804A13.937 13.937 0 0112 15c2.485 0 4.797.657 6.879 1.804M15 10a3 3 0 11-6 0 3 3 0 016 0z" /></svg>
	) },
];

const sidebarVariants = {
	hidden: { x: -80, opacity: 0 },
	visible: { x: 0, opacity: 1, transition: { type: "spring", stiffness: 80 } },
};

const UserSidebar = () => {
	return (
		<motion.aside
			initial="hidden"
			animate="visible"
			variants={sidebarVariants}
			className="fixed top-16 left-0 h-full w-56 bg-gradient-to-br from-blue-600 to-blue-400 shadow-xl z-30 flex flex-col py-8 px-4"
		>
			<div className="mb-10 text-white text-2xl font-bold tracking-wide text-center">
				<span className="inline-block align-middle mr-2">
					<svg className="w-8 h-8 inline-block" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M12 4v16m8-8H4" /></svg>
				</span>
				User Panel
			</div>
			<nav className="flex flex-col gap-2">
				{links.map((link) => (
					<NavLink
						key={link.to}
						to={link.to}
						className={({ isActive }) =>
							`flex items-center gap-3 px-4 py-3 rounded-lg font-medium transition-colors duration-200 hover:bg-blue-700/80 hover:text-white ${
								isActive ? "bg-blue-800 text-white shadow-lg" : "text-blue-100"
							}`
						}
						end
					>
						{link.icon}
						<span>{link.label}</span>
					</NavLink>
				))}
			</nav>
		</motion.aside>
	);
};

export default UserSidebar;
