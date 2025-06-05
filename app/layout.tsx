'use client';
import './globals.css';
import { Inter } from 'next/font/google';
import Navigation from './components/navbar-content/sideNav';
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
			// Show sidebar on large screens (1024px+)
			if (window.innerWidth >= 1024) {
				setIsSideNavOpen(true);
			}
			// Hide sidebar on smaller screens
			else {
				setIsSideNavOpen(false);
			}
		};

		handleResize();
		window.addEventListener('resize', handleResize);
		return () => window.removeEventListener('resize', handleResize);
	}, []);

	return (
		<html lang="en">
			<body className={inter.className}>
				<TopNav isDashboard={isDashboard} />
				<div className="flex">
					{isDashboard && (
						<div className="hidden lg:block">
							<Navigation
								isSideNavOpen={isSideNavOpen}
								setIsSideNavOpen={setIsSideNavOpen}
							/>
						</div>
					)}
					<main
						className={`flex-1 p-4 sm:p-6 lg:p-8 bg-white dark:bg-gray-800 transition-all duration-300 ${
							isDashboard && isSideNavOpen ? 'lg:pl-72' : 'pl-0'
						}`}
					>
						<div className="w-full max-w-[300px] xs:max-w-[375px] sm:max-w-[540px] lg:max-w-none mx-auto">
							{children}
						</div>
					</main>
				</div>
			</body>
		</html>
	);
}
