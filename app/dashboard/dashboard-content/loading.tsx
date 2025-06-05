'use client';

export default function Loading() {
	return (
		<div className="flex items-center justify-center min-h-screen bg-white dark:bg-gray-800">
			<div className="text-center">
				<div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600"></div>
				<p className="mt-4 text-gray-700 dark:text-gray-300">Loading...</p>
			</div>
		</div>
	);
}
