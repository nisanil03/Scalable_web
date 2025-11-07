import { createContext, useContext, useMemo, useState, useLayoutEffect } from 'react';

type Theme = 'light' | 'dark';

const ThemeContext = createContext<{ theme: Theme; toggle: () => void } | undefined>(undefined);

export function ThemeProvider({ children }: { children: React.ReactNode }) {
	const [theme, setTheme] = useState<Theme>(() => {
		const saved = localStorage.getItem('theme') as Theme | null;
		if (saved) return saved;
		const prefersDark = window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches;
		return prefersDark ? 'dark' : 'light';
	});
	// Apply immediately to avoid flicker and ensure class is present
	useLayoutEffect(() => {
		const root = document.documentElement;
		if (theme === 'dark') root.classList.add('dark'); else root.classList.remove('dark');
		localStorage.setItem('theme', theme);
	}, [theme]);
	const value = useMemo(() => ({ theme, toggle: () => setTheme(t => (t === 'dark' ? 'light' : 'dark')) }), [theme]);
	return <ThemeContext.Provider value={value}>{children}</ThemeContext.Provider>;
}

export function useTheme() {
	const ctx = useContext(ThemeContext);
	if (!ctx) throw new Error('useTheme must be used within ThemeProvider');
	return ctx;
}

