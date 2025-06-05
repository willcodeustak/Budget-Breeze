'use client';

import { useState, useEffect } from 'react';
import { usePathname } from 'next/navigation';
import Navigation from './components/navigation/sideNav';
import TopNav from './components/navigation/TopNav';
import { useAuth } from './utils/auth';
import type { ReactNode } from 'react';

export default function Template({ children }: { children: ReactNode }) {
	const pathname = usePathname();
	const { user } = useAuth();
	const isDashboard =
		pathname?.startsWith('/dashboard') || pathname?.startsWith('/reports');
	const [isSideNavOpen, setIsSideNavOpen] = useState(false);

	useEffect(() => {
		const handleResize = () => {
			if (window.innerWidth >= 1024) {
				setIsSideNavOpen(true);
			} else {
				setIsSideNavOpen(false);
			}
		};

		handleResize();
		window.addEventListener('resize', handleResize);
		return () => window.removeEventListener('resize', handleResize);
	}, []);

	return (
		<>
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
		</>
	);
}
