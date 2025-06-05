import './globals.css';
import { Inter } from 'next/font/google';
import type { Metadata } from 'next';
import type { ReactNode } from 'react';
import ClientLayout from './clientLayout';

const inter = Inter({ subsets: ['latin'] });

export const metadata: Metadata = {
	title: 'Welcome to Budget Breeze',
	description: 'Your personal budget management tool',
	icons: {
		icon: '/triple.png',
		apple: '/triple.png',
	},
};

export default function RootLayout({ children }: { children: ReactNode }) {
	return (
		<html lang="en">
			<body className={inter.className}>
				<ClientLayout>{children}</ClientLayout>
			</body>
		</html>
	);
}
