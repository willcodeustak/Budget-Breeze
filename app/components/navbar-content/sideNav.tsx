'use client';

import Link from 'next/link';
import { Home, PieChart, LogOut, Menu } from 'lucide-react';
import { useAuth } from '../../utils/auth';
import Image from 'next/image';
import triple from '../../images/triple.png'; 

import { useState } from 'react';

export default function SideNav({
	isSideNavOpen,
	setIsSideNavOpen,
}: {
	isSideNavOpen: boolean;
	setIsSideNavOpen: (isOpen: boolean) => void;
}) {
	const { user } = useAuth();

	if (!user) {
		return null;
	}

	return (
		<>
			<button
				onClick={() => setIsSideNavOpen(!isSideNavOpen)}
				className="fixed top-4 left-4 z-50 p-2 bg-gray-800 text-white rounded-lg sm:hidden"
			>
				<Menu size={24} />
			</button>
			<nav
				className={`w-60 bg-gray-800 text-white h-screen shadow-lg fixed top-0 left-0 z-40 transform transition-transform duration-300 ease-in-out ${
					isSideNavOpen ? 'translate-x-0' : '-translate-x-full'
				} sm:translate-x-0`}
			>
				<div className="p-4 border-b border-gray-700">
					<Link href="/dashboard">
						<div className="flex items-center">
							<Image
								src={triple}
								alt="Budget Breeze Logo"
								width={30}
								height={30}
							/>
							<h1 className="text-2xl font-extrabold text-white ml-2 whitespace-nowrap">
								Budget Breeze
							</h1>
						</div>
					</Link>
				</div>
				<ul className="space-y-6 p-4">
					<li>
						<Link
							href="/dashboard"
							className="flex items-center space-x-5 text-gray-300 hover:text-blue-400 p-3 rounded-lg transition-all duration-200 ease-in-out hover:bg-gray-700"
						>
							<Home size={25} />
							<span className="text-1xl font-semibold">Dashboard</span>
						</Link>
					</li>
					<li>
						<Link
							href="/dashboard/reports"
							className="flex items-center space-x-5 text-gray-300 hover:text-blue-400 p-3 rounded-lg transition-all duration-200 ease-in-out hover:bg-gray-700"
						>
							<PieChart size={25} />
							<span className="text-1xl font-semibold">Reports</span>
						</Link>
					</li>
				</ul>
			</nav>
		</>
	);
}
