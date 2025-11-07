import { useState } from 'react';
import { z } from 'zod';
import axios from 'axios';
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
			await axios.post('/api/auth/register', parse.data);
			setOk('Account created. You can now log in.');
			setTimeout(() => navigate('/login'), 800);
		} catch (err: any) {
			setError(err?.response?.data?.error || 'Registration failed');
		} finally { setLoading(false); }
	}

	return (
		<div className="max-w-md mx-auto">
			<h1 className="text-2xl font-semibold mb-4">Register</h1>
			<form onSubmit={onSubmit} className="space-y-3">
				<input className="w-full border rounded px-3 py-2" placeholder="Name" value={form.name} onChange={e => setForm({ ...form, name: e.target.value })} />
				<input className="w-full border rounded px-3 py-2" placeholder="Email" value={form.email} onChange={e => setForm({ ...form, email: e.target.value })} />
				<input className="w-full border rounded px-3 py-2" type="password" placeholder="Password" value={form.password} onChange={e => setForm({ ...form, password: e.target.value })} />
				{error && <div className="text-red-600 text-sm">{error}</div>}
				{ok && <div className="text-green-700 text-sm">{ok}</div>}
				<button disabled={loading} className="w-full bg-blue-600 text-white rounded px-3 py-2 disabled:opacity-50">{loading ? 'Creating...' : 'Create account'}</button>
			</form>
			<p className="text-sm mt-3">Already have an account? <Link to="/login" className="text-blue-600">Login</Link></p>
		</div>
	);
}

