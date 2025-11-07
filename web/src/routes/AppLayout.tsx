import { Link, Outlet, useLocation, useNavigate } from 'react-router-dom';
import { useAuth } from '../state/AuthContext';
import { useState } from 'react';
import { useTheme } from '../state/Theme';

export function AppLayout() {
	const { user, logout } = useAuth();
	const navigate = useNavigate();
	const location = useLocation();
	const [open, setOpen] = useState(false);
	const { theme, toggle } = useTheme();


	const onLogout = () => {
		logout();
		navigate('/login');
	};
	return (
		<div className={(theme === 'dark' ? 'dark ' : '') + 'min-h-screen bg-gray-50 text-gray-900 dark:bg-gray-900 dark:text-gray-100'}>
			<header className="sticky top-0 z-20 border-b bg-white dark:bg-gray-800 border-gray-200 dark:border-gray-700 shadow-sm">
				<div className="mx-auto max-w-5xl px-4 py-3 flex items-center justify-between">
					<Link to="/" className="font-semibold text-lg flex items-center gap-2">
						<span className="h-8 w-8 rounded-md bg-gradient-to-br from-blue-500 to-indigo-600 flex items-center justify-center text-white font-bold">S</span>
						<span>Scalable Web App</span>
					</Link>
					<nav className="flex items-center gap-2 sm:gap-4">
						<button 
							onClick={toggle} 
							className="px-3 py-1.5 rounded-md bg-gray-100 hover:bg-gray-200 text-sm dark:bg-gray-700 dark:text-gray-100 dark:hover:bg-gray-600 transition-colors" 
							aria-label="Toggle theme"
						>
							{theme === 'dark' ? '☀️ Light' : '🌙 Dark'}
						</button>
						{user ? (
							<div className="relative">
								<button
									onClick={() => setOpen(v => !v)}
									className="flex items-center gap-2 px-2 py-1.5 rounded-md hover:bg-gray-100 dark:hover:bg-gray-700 focus:outline-none"
								>
									<div className="h-8 w-8 rounded-full bg-blue-600 text-white flex items-center justify-center text-sm font-semibold select-none">{user.name?.[0]?.toUpperCase()}</div>
									<span className="text-sm text-gray-700 dark:text-gray-200 hidden sm:inline">Hi, {user.name}</span>
								</button>
								{open && (
									<div
										className="absolute right-0 mt-2 w-72 rounded-xl border bg-white dark:bg-gray-800 dark:border-gray-700 shadow-lg overflow-hidden"
										onMouseLeave={() => setOpen(false)}
									>
										<div className="relative">
											{/* Profile Header/Banner */}
											<div className="h-20 bg-gradient-to-r from-blue-500 to-blue-600"></div>
											{/* Profile Picture */}
											<div className="absolute left-4 -bottom-6">
												<div className="relative group">
													<div className="h-16 w-16 rounded-full ring-4 ring-white dark:ring-gray-800 bg-blue-600 text-white flex items-center justify-center text-xl font-semibold">{user.name?.[0]?.toUpperCase()}</div>

												</div>
											</div>
										</div>
										
										{/* Profile Info */}
										<div className="px-4 pt-8 pb-4">
											<div className="space-y-1 mb-4">
												<div className="text-base font-semibold text-gray-900 dark:text-gray-100">{user.name}</div>
												<div className="text-sm text-gray-600 dark:text-gray-400 truncate">{user.email}</div>
											</div>
											
											{/* Actions */}
											<div className="space-y-2">
												<button
													onClick={onLogout}
													className="w-full px-4 py-2 text-sm rounded-lg bg-gray-100 text-gray-900 hover:bg-gray-200 dark:bg-gray-700 dark:text-gray-100 dark:hover:bg-gray-600 transition-colors"
												>
													Logout
												</button>
											</div>
										</div>
									</div>
								)}
							</div>
						) : (
							<>
								<Link to="/login" className={location.pathname === '/login' ? 'text-blue-600' : ''}>Login</Link>
								<Link to="/register" className={location.pathname === '/register' ? 'text-blue-600' : ''}>Register</Link>
							</>
						)}
					</nav>
				</div>
			</header>
			<main className="mx-auto max-w-5xl px-4 py-8">
				<div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm p-6">
					<Outlet />
				</div>
			</main>
		</div>
	);
}

