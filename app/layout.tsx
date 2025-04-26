'use client';
import './globals.css';
import { Inter } from 'next/font/google';
import Navigation from './components/dashboard-content/report-content/Navigation';
import type React from 'react';
import TopNav from './components/navbar-content/TopNav';
import { useAuth } from './utils/auth';
import { usePathname } from 'next/navigation';
import { useState, useEffect } from 'react';
import { Toaster } from 'react-hot-toast';

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
				<Toaster
					position="top-center"
					containerStyle={{
						position: 'fixed',
						left: 'calc(50% + 120px)', // 120px = half of sidebar width
						transform: 'translateX(-50%)',
						top: '1rem',
						zIndex: 9999,
					}}
					toastOptions={{
						className: 'text-xl min-w-[300px]',
						duration: 5000,
					}}
				/>
				<TopNav />
				<div className="flex">
					{isDashboard && (
						<Navigation
							isSideNavOpen={isSideNavOpen}
							setIsSideNavOpen={setIsSideNavOpen}
						/>
					)}
					<main
						className={`flex-1 p-8 bg-gray-50 dark:bg-gray-800 transition-all duration-300 ${
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
