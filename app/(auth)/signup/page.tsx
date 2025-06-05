'use client';

import type React from 'react';
import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { signUp } from '../../utils/auth';
import { Toaster, toast } from 'react-hot-toast';
import breeze from '../../images/breeze.jpg';
import triple from '../../images/triple.png';

import Image from 'next/image';

function LeftPanel() {
	return (
		<div className="hidden lg:flex flex-1 flex-col justify-center items-start bg-white dark:bg-gray-800 to-indigo-600 text-black pl-12 pr-8 lg:pl-16 lg:pr-12">
			<div className="text-left flex items-center space-x-3">
				<Image
					src={triple}
					alt="Triple Image"
					width={60}
					height={60}
					className="object-contain"
				/>
				<h2 className="text-4xl lg:text-5xl dark:text-white font-extrabold">
					BudgetBreeze
				</h2>
			</div>

			<p className="text-lg dark:text-white lg:text-xl italic mt-4 max-w-[90%]">
				Personal budgeting is a key step toward financial freedom. Start with
				BudgetBreeze today.
			</p>

			<div className="mt-8 lg:mt-12 w-full max-w-[90%]">
				<Image
					src={breeze}
					alt="Business illustration"
					width={600}
					height={300}
					className="rounded-xl shadow-lg w-full h-auto"
					priority
				/>
			</div>
		</div>
	);
}
export default function SignUp() {
	const [email, setEmail] = useState('');
	const [password, setPassword] = useState('');
	const [displayName, setDisplayName] = useState('');

	const [error, setError] = useState<string | null>(null);
	const router = useRouter();

	const handleSubmit = async (e: React.FormEvent) => {
		e.preventDefault();
		setError(null);
		const { error } = await signUp(email, password, displayName);
		if (error) {
			toast.error(error.message);
		} else {
			toast.success('Verification has been sent to your email! 🎉', {
				className: 'text-xl p-4 min-w-[300px]',
			});
			setTimeout(() => router.push('/signin'), 2000);
		}
	};

	const handleBack = () => {
		router.back();
	};

	return (
		<div className="min-h-screen flex flex-col md:flex-row">
			<Toaster />
			<LeftPanel />

			{/* Right Panel - Form */}
			<div className="w-full lg:w-1/2 flex items-center justify-center bg-white dark:bg-gray-800 p-6 md:p-12 relative">
				<div className="absolute left-0 top-1/2 transform -translate-y-1/2 h-2/3 w-px bg-gray-200 hidden lg:block"></div>
				<div className="max-w-md w-full space-y-6 md:space-y-8">
					<div className="lg:hidden flex justify-center mb-6">
						<div className="flex items-center space-x-3">
							<Image
								src={triple}
								alt="Triple Image"
								width={40}
								height={40}
								className="object-contain"
							/>
							<h2 className="text-3xl font-extrabold dark:text-white">
								BudgetBreeze
							</h2>
						</div>
					</div>

					<h2 className="text-2xl md:text-3xl font-extrabold text-gray-900 dark:text-white text-center">
						Create a new account
					</h2>

					<form
						className="mt-4 md:mt-8 space-y-4 md:space-y-6"
						onSubmit={handleSubmit}
					>
						<div className="rounded-md shadow-sm space-y-3 md:space-y-4">
							<div>
								<label htmlFor="user-name" className="sr-only">
									User Name
								</label>
								<input
									type="text"
									placeholder="Display Name"
									value={displayName}
									onChange={(e) => setDisplayName(e.target.value)}
									required
									className="appearance-none rounded-md relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 text-base md:text-lg dark:bg-gray-700 dark:text-white dark:border-gray-600"
								/>
							</div>
							<div>
								<label htmlFor="emailAddress" className="sr-only">
									Email address
								</label>
								<input
									id="emailAddress"
									name="email"
									type="email"
									autoComplete="email"
									required
									className="appearance-none rounded-md relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 text-base md:text-lg dark:bg-gray-700 dark:text-white dark:border-gray-600"
									placeholder="Email address"
									value={email}
									onChange={(e) => setEmail(e.target.value)}
								/>
							</div>
							<div>
								<label htmlFor="password" className="sr-only">
									Password
								</label>
								<input
									id="password"
									name="password"
									type="password"
									autoComplete="newPassword"
									required
									className="appearance-none rounded-md relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 text-base md:text-lg dark:bg-gray-700 dark:text-white dark:border-gray-600"
									placeholder="Password"
									value={password}
									onChange={(e) => setPassword(e.target.value)}
								/>
							</div>
						</div>

						{error && <div className="text-red-500 text-sm">{error}</div>}

						<button
							type="submit"
							className="w-full flex justify-center py-2 px-4 border border-transparent text-sm md:text-base font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
						>
							Sign up
						</button>
					</form>

					<div className="text-sm text-center">
						<button
							onClick={handleBack}
							className="font-medium text-indigo-600 hover:text-indigo-500 dark:text-indigo-400 dark:hover:text-indigo-300"
						>
							Already have an account? Sign in
						</button>
					</div>
				</div>
			</div>
		</div>
	);
}
