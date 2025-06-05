import { useEffect, useState } from 'react';

// Global state to share between instances
let globalColorMode =
	typeof window !== 'undefined'
		? localStorage.getItem('color-theme') || 'light'
		: 'light';

const useColorMode = () => {
	const [colorMode, setColorMode] = useState(globalColorMode);

	useEffect(() => {
		const className = 'dark';
		const htmlElement = window.document.documentElement;

		// Update global state
		globalColorMode = colorMode;
		localStorage.setItem('color-theme', colorMode);

		if (colorMode === 'dark') {
			htmlElement.classList.add(className);
		} else {
			htmlElement.classList.remove(className);
		}

		// Listen for changes from other components
		const handleStorageChange = (e: StorageEvent) => {
			if (e.key === 'color-theme' && e.newValue !== null) {
				setColorMode(e.newValue);
			}
		};

		window.addEventListener('storage', handleStorageChange);
		return () => window.removeEventListener('storage', handleStorageChange);
	}, [colorMode]);

	return [colorMode, setColorMode] as const;
};

export default useColorMode;
