import React from "react";
import { useLocation } from "react-router";
import { Link } from "react-router-dom";
import { AnimatePresence, motion } from "framer-motion";
import styles from "./BottomNavBar.module.css";

function BottomNavBar() {
	const tabs = [
		{
			icon: (
				<svg
					fill="none"
					strokeLinecap="round"
					strokeLinejoin="round"
					strokeWidth="2"
					viewBox="0 0 24 24"
					stroke="currentColor"
				>
					<path d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
				</svg>
			),
			url: "/dashboard"
		},
		{
			icon: (
				<svg
					xmlns="http://www.w3.org/2000/svg"
					fill="none"
					viewBox="0 0 24 24"
					stroke="currentColor"
				>
					<path
						strokeLinecap="round"
						strokeLinejoin="round"
						strokeWidth={2}
						d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z"
					/>
				</svg>
			),
			url: "/community"
		},
		{
			icon: (
				<motion.svg
					fill="none"
					strokeLinecap="round"
					strokeLinejoin="round"
					strokeWidth="2"
					viewBox="0 0 24 24"
					stroke="currentColor"
				>
					<path d="M5.121 17.804A13.937 13.937 0 0112 16c2.5 0 4.847.655 6.879 1.804M15 10a3 3 0 11-6 0 3 3 0 016 0zm6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
				</motion.svg>
			),
			url: "/profile"
		}
	];

	return (
		<div className="shadow-lg fixed bottom-0 bg-white z-10 mx-auto flex-shrink-0 w-full h-20 flex items-center justify-evenly">
			{tabs.map(t => (
				<Tab key={t.url} {...t} />
			))}
		</div>
	);
}

function Tab(props: { url: string; icon: JSX.Element }) {
	const location = useLocation();
	const isCurrent = location.pathname === props.url;
	return (
		<Link
			to={props.url}
			className={`w-full ${styles.icon} ${
				isCurrent ? " text-brand-primary" : " text-gray-500"
			}`}
		>
			<div className="h-8 w-8 mx-auto">
				{props.icon}
				<AnimatePresence>
					{isCurrent && (
						<motion.div
							initial={{
								height: 0,
								width: 0
							}}
							animate={{
								height: 10,
								width: 10
							}}
							exit={{
								height: 0,
								width: 0
							}}
							className="mx-auto mt-1 rounded-full bg-brand-primary"
						/>
					)}
				</AnimatePresence>
			</div>
		</Link>
	);
}

export default BottomNavBar;
