// components/dashboard-content/report-content/Navigation.tsx
import { Dispatch, SetStateAction } from 'react';

interface NavigationProps {
	isSideNavOpen: boolean;
	setIsSideNavOpen: Dispatch<SetStateAction<boolean>>;
}

export default function Navigation({
	isSideNavOpen,
	setIsSideNavOpen,
}: NavigationProps) {
	// ... rest of your component code
}
