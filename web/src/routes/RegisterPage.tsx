import { useState } from 'react';
import { z } from 'zod';
import apiClient from '../api';
import { Link, useNavigate, Navigate } from 'react-router-dom';
import { useAuth } from '../state/AuthContext';

const schema = z.object({
	name: z.string().min(2),
	email: z.string().email(),
	password: z.string().min(6),
});

export function RegisterPage() {
	const { token } = useAuth();
	const [form, setForm] = useState({ name: '', email: '', password: '' });
	const [error, setError] = useState<string | null>(null);
	const [ok, setOk] = useState<string | null>(null);
	const [loading, setLoading] = useState(false);
	const navigate = useNavigate();

	if (token) return <Navigate to="/" replace />;

	async function onSubmit(e: React.FormEvent) {
		e.preventDefault();
		const parse = schema.safeParse(form);
		if (!parse.success) return setError('Please fill all fields correctly.');
		setLoading(true); setError(null); setOk(null);
		try {
			await apiClient.post('/api/auth/register', parse.data);
			setOk('Account created. You can now log in.');
			setTimeout(() => navigate('/login'), 800);
		} catch (err: any) {
			setError(err?.response?.data?.error || 'Registration failed');
		} finally { setLoading(false); }
	}

	return (
		<div className="min-h-[calc(100vh-200px)] flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8 relative overflow-hidden">
			{/* Background with gradient overlay */}
			<div className="absolute inset-0 bg-gradient-to-br from-blue-400 via-indigo-500 to-purple-600 dark:from-gray-900 dark:via-blue-900 dark:to-indigo-900">
				{/* Animated background pattern */}
				<div className="absolute inset-0 opacity-20">
					<div className="absolute top-0 left-0 w-full h-full bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNjAiIGhlaWdodD0iNjAiIHZpZXdCb3g9IjAgMCA2MCA2MCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48ZyBmaWxsPSJub25lIiBmaWxsLXJ1bGU9ImV2ZW5vZGQiPjxwYXRoIGQ9Ik0zNiAzNGMwIDIuMjA5LTEuNzkxIDQtNCA0cy00LTEuNzkxLTQtNCAxLjc5MS00IDQtNCA0IDEuNzkxIDQgNHptMCAyNGMwIDIuMjA5LTEuNzkxIDQtNCA0cy00LTEuNzkxLTQtNCAxLjc5MS00IDQtNCA0IDEuNzkxIDQgNHptMjQgMGMwIDIuMjA5LTEuNzkxIDQtNCA0cy00LTEuNzkxLTQtNCAxLjc5MS00IDQtNCA0IDEuNzkxIDQgNHoiIGZpbGw9IiNmZmYiIG9wYWNpdHk9Ii4wNSIvPjwvZz48L3N2Zz4=')]"></div>
				</div>
				{/* Floating orbs for depth */}
				<div className="absolute top-20 left-10 w-72 h-72 bg-blue-300 dark:bg-blue-800 rounded-full mix-blend-multiply dark:mix-blend-soft-light filter blur-xl opacity-30 animate-blob"></div>
				<div className="absolute top-40 right-10 w-72 h-72 bg-purple-300 dark:bg-purple-800 rounded-full mix-blend-multiply dark:mix-blend-soft-light filter blur-xl opacity-30 animate-blob animation-delay-2000"></div>
				<div className="absolute -bottom-8 left-1/2 w-72 h-72 bg-indigo-300 dark:bg-indigo-800 rounded-full mix-blend-multiply dark:mix-blend-soft-light filter blur-xl opacity-30 animate-blob animation-delay-4000"></div>
			</div>

			<div className="max-w-md w-full space-y-8 relative z-10">
				{/* Header */}
				<div className="text-center">
					<div className="mx-auto h-16 w-16 rounded-full bg-gradient-to-br from-blue-500 to-indigo-600 flex items-center justify-center mb-4 shadow-2xl backdrop-blur-sm border-2 border-white/20">
						<svg className="h-8 w-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
							<path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M18 9v3m0 0v3m0-3h3m-3 0h-3m-2-5a4 4 0 11-8 0 4 4 0 018 0zM3 20a6 6 0 0112 0v1H3v-1z" />
						</svg>
					</div>
					<h2 className="text-4xl font-extrabold text-white mb-2 drop-shadow-lg">
						Create your account
					</h2>
					<p className="text-white/90 drop-shadow-md">
						Join us and start your journey today
					</p>
				</div>

				{/* Form Card with Glassmorphism */}
				<div className="backdrop-blur-xl bg-white/10 dark:bg-gray-900/20 rounded-2xl shadow-2xl p-8 border border-white/20 dark:border-white/10 ring-1 ring-white/10">
					<form onSubmit={onSubmit} className="space-y-6">
						{/* Name Field */}
						<div>
							<label htmlFor="name" className="block text-sm font-medium text-white/90 mb-2 drop-shadow-sm">
								Full name
							</label>
							<div className="relative">
								<div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
									<svg className="h-5 w-5 text-white/60" fill="none" stroke="currentColor" viewBox="0 0 24 24">
										<path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
									</svg>
								</div>
								<input
									id="name"
									type="text"
									autoComplete="name"
									required
									className="block w-full pl-10 pr-3 py-3 border border-white/20 rounded-lg backdrop-blur-sm bg-white/20 dark:bg-white/10 text-white placeholder-white/60 focus:outline-none focus:ring-2 focus:ring-white/50 focus:border-white/40 transition-all"
									placeholder="John Doe"
									value={form.name}
									onChange={e => setForm({ ...form, name: e.target.value })}
								/>
							</div>
						</div>

						{/* Email Field */}
						<div>
							<label htmlFor="email" className="block text-sm font-medium text-white/90 mb-2 drop-shadow-sm">
								Email address
							</label>
							<div className="relative">
								<div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
									<svg className="h-5 w-5 text-white/60" fill="none" stroke="currentColor" viewBox="0 0 24 24">
										<path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
									</svg>
								</div>
								<input
									id="email"
									type="email"
									autoComplete="email"
									required
									className="block w-full pl-10 pr-3 py-3 border border-white/20 rounded-lg backdrop-blur-sm bg-white/20 dark:bg-white/10 text-white placeholder-white/60 focus:outline-none focus:ring-2 focus:ring-white/50 focus:border-white/40 transition-all"
									placeholder="you@example.com"
									value={form.email}
									onChange={e => setForm({ ...form, email: e.target.value })}
								/>
							</div>
						</div>

						{/* Password Field */}
						<div>
							<label htmlFor="password" className="block text-sm font-medium text-white/90 mb-2 drop-shadow-sm">
								Password
							</label>
							<div className="relative">
								<div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
									<svg className="h-5 w-5 text-white/60" fill="none" stroke="currentColor" viewBox="0 0 24 24">
										<path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
									</svg>
								</div>
								<input
									id="password"
									type="password"
									autoComplete="new-password"
									required
									className="block w-full pl-10 pr-3 py-3 border border-white/20 rounded-lg backdrop-blur-sm bg-white/20 dark:bg-white/10 text-white placeholder-white/60 focus:outline-none focus:ring-2 focus:ring-white/50 focus:border-white/40 transition-all"
									placeholder="At least 6 characters"
									value={form.password}
									onChange={e => setForm({ ...form, password: e.target.value })}
								/>
							</div>
							<p className="mt-2 text-xs text-white/70 drop-shadow-sm">
								Must be at least 6 characters long
							</p>
						</div>

						{/* Error Message */}
						{error && (
							<div className="backdrop-blur-sm bg-red-500/20 border border-red-300/30 rounded-lg p-4">
								<div className="flex">
									<svg className="h-5 w-5 text-red-200 mr-2 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
										<path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
									</svg>
									<p className="text-sm text-red-100 drop-shadow-sm">{error}</p>
								</div>
							</div>
						)}

						{/* Success Message */}
						{ok && (
							<div className="backdrop-blur-sm bg-green-500/20 border border-green-300/30 rounded-lg p-4">
								<div className="flex">
									<svg className="h-5 w-5 text-green-200 mr-2 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
										<path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
									</svg>
									<p className="text-sm text-green-100 drop-shadow-sm">{ok}</p>
								</div>
							</div>
						)}

						{/* Submit Button */}
						<button
							type="submit"
							disabled={loading}
							className="w-full flex justify-center items-center py-3 px-4 border border-transparent rounded-lg shadow-sm text-base font-medium text-white bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50 disabled:cursor-not-allowed transition-all transform hover:scale-[1.02] active:scale-[0.98]"
						>
							{loading ? (
								<>
									<svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" fill="none" viewBox="0 0 24 24">
										<circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
										<path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
									</svg>
									Creating account...
								</>
							) : (
								'Create account'
							)}
						</button>
					</form>

					{/* Login Link */}
					<div className="mt-6 text-center">
						<p className="text-sm text-white/80 drop-shadow-sm">
							Already have an account?{' '}
							<Link to="/login" className="font-medium text-white hover:text-white/90 underline underline-offset-2 transition-colors">
								Sign in here
							</Link>
						</p>
					</div>
				</div>
			</div>
		</div>
	);
}

