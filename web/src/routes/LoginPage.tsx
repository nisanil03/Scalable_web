import { useState } from 'react';
import { z } from 'zod';
import { useAuth } from '../state/AuthContext';
import { useNavigate, Link, Navigate } from 'react-router-dom';
import axios from 'axios';

const schema = z.object({ email: z.string().email(), password: z.string().min(1) });

export function LoginPage() {
	const { login, token } = useAuth();
	const navigate = useNavigate();
	const [form, setForm] = useState({ email: '', password: '' });
	const [error, setError] = useState<string | null>(null);
	const [loading, setLoading] = useState(false);

	if (token) return <Navigate to="/" replace />;

	async function onSubmit(e: React.FormEvent) {
		e.preventDefault();
		const parse = schema.safeParse(form);
		if (!parse.success) {
			setError('Please enter a valid email and password.');
			return;
		}
		setLoading(true);
		setError(null);
		try {
			const res = await axios.post('/api/auth/login', parse.data);
			login(res.data.token, res.data.user);
			navigate('/');
		} catch (err: any) {
			setError(err?.response?.data?.error || 'Login failed');
		} finally {
			setLoading(false);
		}
	}

	return (
		<div className="max-w-md mx-auto">
			<h1 className="text-2xl font-semibold mb-4">Login</h1>
			<form onSubmit={onSubmit} className="space-y-3">
				<input className="w-full border rounded px-3 py-2 text-gray-900" placeholder="Email" value={form.email} onChange={e => setForm({ ...form, email: e.target.value })} />
				<input className="w-full border rounded px-3 py-2 text-gray-900" type="password" placeholder="Password" value={form.password} onChange={e => setForm({ ...form, password: e.target.value })} />
				{error && <div className="text-red-600 text-sm">{error}</div>}
				<button disabled={loading} className="w-full bg-blue-600 text-white rounded px-3 py-2 disabled:opacity-50">{loading ? 'Signing in...' : 'Login'}</button>
			</form>
			<p className="text-sm mt-3">No account? <Link to="/register" className="text-blue-600">Register</Link></p>
		</div>
	);
}

