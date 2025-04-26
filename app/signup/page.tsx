'use client';

import type React from 'react';
import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { signUp } from '../utils/auth';
import { Toaster, toast } from 'react-hot-toast';
import breeze from '../images/breeze.jpg';
import triple from '../images/triple.png';

import Image from 'next/image';

function LeftPanel() {
	return (
		<div className="flex-1 flex flex-col justify-center items-end bg-gradient-to-br to-indigo-600 text-black py-12 pr-16">
			<div className="text-left w-full max-w-[85%]">
				<div className="flex items-center space-x-3">
					<Image
						src={triple}
						alt="Triple Image"
						width={60}
						height={60}
						className="object-contain"
					/>

					<h2 className="text-5xl font-extrabold dark:text-white">
						BudgetBreeze
					</h2>
				</div>

				<p className="text-xl italic dark:text-white mt-4 ml-4 ">
					Personal budgeting is a key step toward financial freedom. Start with
					BudgetBreeze today.
				</p>

				<div className="mt-12 ml-4 mr-8">
					<Image
						src={breeze}
						alt="Business illustration"
						width={800}
						height={500}
						className="rounded-xl shadow-lg"
					/>
				</div>
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
		<div className="min-h-screen flex">
			<LeftPanel />

			<div className="w-[40%] flex items-center justify-center bg-white-50 p-12 relative ">
				<div className="absolute left-0  h-1/2 w-px bg-gray-300"></div>
				<div className="max-w-md w-full space-y-8">
					<h2 className="text-3xl font-extrabold text-gray-900 text-center dark:text-white">
						Create a new account
					</h2>

					<form className="mt-8 space-y-6" onSubmit={handleSubmit}>
						<div className="rounded-md shadow-sm space-y-4">
							{' '}
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
									className="appearance-none rounded-md relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-lg dark:bg-gray-700 dark:text-white dark:border-gray-600"
								/>
							</div>
							<div>
								<label htmlFor="email-address" className="sr-only">
									Email address
								</label>
								<input
									id="email-address"
									name="email"
									type="email"
									autoComplete="email"
									required
									className="appearance-none rounded-md relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-lg dark:bg-gray-700 dark:text-white dark:border-gray-600"
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
									autoComplete="new-password"
									required
									className="appearance-none rounded-md relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-lg dark:bg-gray-700 dark:text-white dark:border-gray-600"
									placeholder="Password"
									value={password}
									onChange={(e) => setPassword(e.target.value)}
								/>
							</div>
						</div>

						{error && <div className="text-red-500 text-sm">{error}</div>}

						<button
							type="submit"
							className="w-full flex justify-center py-2 px-4 border border-transparent text-sm font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
						>
							Sign up
						</button>
					</form>

					<div className="text-sm text-center">
						<button
							onClick={handleBack}
							className="font-medium text-indigo-600 hover:text-indigo-500"
						>
							Already have an account? Sign in
						</button>
					</div>
				</div>
			</div>
		</div>
	);
}
