'use client';

import Link from 'next/link';
import { Home, PieChart } from 'lucide-react';
import DarkModeSwitcher from './DarkModeSwitcher';
import DropdownMessage from './DropdownMessage';
import { useAuth } from '../../utils/auth';
import { supabase } from '@/lib/supabase';
import { useState, useRef, useEffect } from 'react';
import { toast } from 'react-hot-toast';
import { LogOut } from 'lucide-react';
import triple from '../../images/triple.png'; // Import the logo
import Image from 'next/image';

export default function TopNav() {
	const { user, signOutAndRedirect } = useAuth();
	const [isDropdownOpen, setIsDropdownOpen] = useState(false);
	const [newPassword, setNewPassword] = useState('');
	const [isChangingPassword, setIsChangingPassword] = useState(false);
	const dropdownRef = useRef<HTMLDivElement>(null);

	useEffect(() => {
		const handleClickOutside = (event: MouseEvent) => {
			if (
				dropdownRef.current &&
				!dropdownRef.current.contains(event.target as Node)
			) {
				setIsDropdownOpen(false);
			}
		};

		document.addEventListener('mousedown', handleClickOutside);
		return () => {
			document.removeEventListener('mousedown', handleClickOutside);
		};
	}, []);

	useEffect(() => {
		if (!user) {
			setIsDropdownOpen(false);
		}
	}, [user]);

	if (!user) {
		return null;
	}

	const handlePasswordChange = async () => {
		if (!newPassword) {
			toast.error('Please enter a new password');
			return;
		}

		try {
			const { error } = await supabase.auth.updateUser({
				password: newPassword,
			});

			if (error) throw error;

			toast.success('Password changed successfully!');
			setIsChangingPassword(false);
			setNewPassword('');
		} catch (error) {
			toast.error('Error changing password');
			console.error(error);
		}
	};

	const handleLogout = async () => {
		setIsDropdownOpen(false);
		await signOutAndRedirect();
	};

	return (
		<nav className="w-full bg-gray-800 text-white shadow-lg top-0 z-50 sticky">
			<div className="flex items-center justify-between px-4 py-2.5 md:px-6  gap-4">
				{/* Logo and Dashboard/Reports Links (Visible on All Screens) */}
				<div className="flex items-center gap-4">
					<Link href="/dashboard" className="flex items-center gap-2">
						<Image
							src={triple}
							alt="Budget Breeze Logo"
							width={30}
							height={30}
						/>
						<h1 className="text-xl px-4  font-extrabold text-white whitespace-nowrap">
							Budget Breeze
						</h1>
					</Link>
				</div>

				{/* Dashboard and Reports Links (Visible on Small Screens) */}

				{/* User Options */}
				<div className="flex items-center gap-4">
					<DarkModeSwitcher />
					<DropdownMessage />
					<div className="relative" ref={dropdownRef}>
						<button
							onClick={() => setIsDropdownOpen(!isDropdownOpen)}
							className="flex items-center gap-2 hover:bg-gray-700 px-3 py-3 rounded-lg transition-colors"
						>
							<span className="font-extrabold text-white">
								{user.user_metadata?.display_name || user.email?.split('@')[0]}
							</span>
							<svg
								className="w-4 h-4"
								fill="none"
								stroke="currentColor"
								viewBox="0 0 24 24"
							>
								<path
									strokeLinecap="round"
									strokeLinejoin="round"
									strokeWidth={2}
									d="M19 9l-7 7-7-7"
								/>
							</svg>
						</button>

						{isDropdownOpen && (
							<div className="absolute right-0 mt-2 w-48 bg-white rounded-md shadow-lg py-2 dark:bg-gray-700">
								{isChangingPassword ? (
									<div className="px-4 py-2">
										<input
											type="password"
											value={newPassword}
											onChange={(e) => setNewPassword(e.target.value)}
											placeholder="New Password"
											className="w-full px-2 py-1 border rounded dark:bg-gray-600 text-black dark:text-white"
										/>
										<div className="flex gap-2 mt-2">
											<button
												onClick={handlePasswordChange}
												className="text-sm bg-blue-500 text-white px-2 py-1 rounded"
											>
												Save
											</button>
											<button
												onClick={() => setIsChangingPassword(false)}
												className="text-sm bg-gray-500 text-white px-2 py-1 rounded"
											>
												Cancel
											</button>
										</div>
									</div>
								) : (
									<>
										<button
											onClick={() => setIsChangingPassword(true)}
											className="flex items-center text-gray-800 dark:text-gray-300 p-2 rounded-lg transition-all duration-200 ease-in-out w-full hover:bg-gray-700 hover:text-red-400 dark:hover:bg-gray-600 dark:hover:text-red-400"
										>
											<span className="text-1xl font-semibold">
												Change Password
											</span>
										</button>
										<button
											onClick={handleLogout}
											className="flex items-center text-gray-800 dark:text-gray-300 p-2 rounded-lg transition-all duration-200 ease-in-out w-full hover:bg-gray-700 hover:text-red-400 dark:hover:bg-gray-600 dark:hover:text-red-400"
										>
											<LogOut size={25} />
											<span className="text-1xl font-semibold">Logout</span>
										</button>
									</>
								)}
							</div>
						)}
					</div>
				</div>
			</div>
		</nav>
	);
}
