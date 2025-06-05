'use client';
import './globals.css';
import { Inter } from 'next/font/google';
import Navigation from './components/dashboard-content/report-content/Navigation';
import type React from 'react';
import TopNav from './components/navbar-content/TopNav';
import { useAuth } from './utils/auth';
import { usePathname } from 'next/navigation';
import { useState, useEffect } from 'react';

const inter = Inter({ subsets: ['latin'] });

export default function RootLayout({
	children,
}: {
	children: React.ReactNode;
}) {
	const pathname = usePathname();
	const { user } = useAuth();
	const isDashboard = pathname?.startsWith('/dashboard');
	const [isSideNavOpen, setIsSideNavOpen] = useState(false);

	useEffect(() => {
		const handleResize = () => {
			// larger screens always show the side menu
			if (window.innerWidth >= 640) {
				setIsSideNavOpen(true);
			} else {
				// hide side menu on small
				setIsSideNavOpen(false);
			}
		};

		// check for size
		handleResize();

		// resize listener
		window.addEventListener('resize', handleResize);

		// refresh/clean allows reset
		return () => window.removeEventListener('resize', handleResize);
	}, []);

	return (
		<html lang="en">
			<body className={inter.className}>
				<TopNav />
				<div className="flex">
					{isDashboard && (
						<Navigation
							isSideNavOpen={isSideNavOpen}
							setIsSideNavOpen={setIsSideNavOpen}
						/>
					)}
					<main
						className={`flex-1 p-8 bg-white dark:bg-gray-800 transition-all duration-300 ${
							isDashboard && isSideNavOpen ? 'pl-72' : 'pl-0'
						}`}
					>
						{children}
					</main>
				</div>
			</body>
		</html>
	);
}
