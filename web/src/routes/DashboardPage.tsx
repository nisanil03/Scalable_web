import { useEffect, useMemo, useState } from 'react';
import apiClient from '../api';
import { useAuth } from '../state/AuthContext';
import { Navigate } from 'react-router-dom';

type Task = { _id: string; title: string; description?: string; status: string; createdAt: string };

export function DashboardPage() {
	const { user, token } = useAuth();
	const [profile, setProfile] = useState<any>(null);
	const [tasks, setTasks] = useState<Task[]>([]);
	const [total, setTotal] = useState(0);
	const [q, setQ] = useState('');
	const [status, setStatus] = useState('');
	const [sort, setSort] = useState<'createdAt'|'title'|'status'>('createdAt');
	const [order, setOrder] = useState<'asc'|'desc'>('desc');
	const [page, setPage] = useState(1);
	const [limit, setLimit] = useState(5);
	const [creating, setCreating] = useState({ title: '', description: '' });

	const authHeaders = useMemo(() => ({ Authorization: token ? `Bearer ${token}` : '' }), [token]);

	useEffect(() => {
		if (!token) return;
		apiClient.get('/api/profile', { headers: authHeaders })
			.then(r => setProfile(r.data))
			.catch(err => console.error('Failed to load profile:', err?.response?.data?.error || err.message));
		load();
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, [token]);

	// Reload when pagination/sort settings change
	useEffect(() => {
		if (!token) return;
		load();
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, [page, limit, sort, order]);

	async function load() {
		const params: any = { page, limit, sort, order };
		if (q) params.q = q;
		if (status) params.status = status;
		const r = await apiClient.get('/api/tasks', { headers: authHeaders, params });
		setTasks(r.data.data);
		setTotal(r.data.total || 0);
	}

	async function addTask(e: React.FormEvent) {
		e.preventDefault();
		if (!creating.title) return;
		await apiClient.post('/api/tasks', creating, { headers: authHeaders });
		setCreating({ title: '', description: '' });
		await load();
	}

	async function updateTask(id: string, updates: Partial<Task>) {
		await apiClient.put(`/api/tasks/${id}`, updates, { headers: authHeaders });
		await load();
	}

	async function deleteTask(id: string) {
		await apiClient.delete(`/api/tasks/${id}`, { headers: authHeaders });
		await load();
	}

	if (!user || !token) return <Navigate to="/login" replace />;

	return (
		<div className="space-y-6">
			<header className="pb-4 border-b dark:border-gray-700">
				<div className="flex items-center justify-between">
					<div>
						<h1 className="text-2xl font-semibold dark:text-gray-100">Dashboard</h1>
						<p className="text-sm text-gray-600 dark:text-gray-400">Welcome back, {profile?.name || user.name}</p>
					</div>
					<div className="text-sm text-gray-500 dark:text-gray-400">Tasks: <span className="font-medium text-gray-700 dark:text-gray-300">{total}</span></div>
				</div>
			</header>

			{/* Quick Create Task */}
			<div className="grid grid-cols-1 gap-4">
				<form onSubmit={addTask} className="rounded-xl border bg-white dark:bg-gray-800 dark:border-gray-700 p-5 shadow-sm space-y-3">
					<h2 className="font-semibold text-black dark:text-gray-100">Quick add task</h2>
					<input
						className="w-full border rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500 text-gray-900 dark:text-gray-100 dark:bg-gray-700 dark:border-gray-600"
						placeholder="New task title"
						value={creating.title}
						onChange={e => setCreating(s => ({ ...s, title: e.target.value }))}
					/>
					<input
						className="w-full border rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500 text-gray-900 dark:text-gray-100 dark:bg-gray-700 dark:border-gray-600"
						placeholder="Description (optional)"
						value={creating.description}
						onChange={e => setCreating(s => ({ ...s, description: e.target.value }))}
					/>
					<button className="w-full sm:w-auto px-4 py-2 rounded-md bg-blue-600 text-white hover:bg-blue-700 active:scale-95 transition">
						Add Task
					</button>
				</form>
			</div>

			{/* Filter + Sort + Pagination */}
			<div className="flex flex-col md:flex-row gap-2 items-stretch md:items-center">
				<input className="border rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500 text-gray-900 dark:text-gray-100 dark:bg-gray-700 dark:border-gray-600" placeholder="Search" value={q} onChange={e => setQ(e.target.value)} />
				<select className="border rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500 text-gray-900 dark:text-gray-100 dark:bg-gray-700 dark:border-gray-600" value={status} onChange={e => setStatus(e.target.value)}>
					<option value="">All</option>
					<option value="todo">Todo</option>
					<option value="in_progress">In Progress</option>
					<option value="done">Done</option>
				</select>
				<select className="border rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500 text-gray-900 dark:text-gray-100 dark:bg-gray-700 dark:border-gray-600" value={sort} onChange={e => setSort(e.target.value as any)}>
					<option value="createdAt">Newest</option>
					<option value="title">Title</option>
					<option value="status">Status</option>
				</select>
				<select className="border rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500 text-gray-900 dark:text-gray-100 dark:bg-gray-700 dark:border-gray-600" value={order} onChange={e => setOrder(e.target.value as any)}>
					<option value="desc">Desc</option>
					<option value="asc">Asc</option>
				</select>
				<select className="border rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500 text-gray-900 dark:text-gray-100 dark:bg-gray-700 dark:border-gray-600" value={limit} onChange={e => setLimit(Number(e.target.value))}>
					<option value={5}>5</option>
					<option value={10}>10</option>
					<option value={20}>20</option>
				</select>
				<button className="px-3 py-2 rounded-md bg-gray-900 dark:bg-gray-700 text-white hover:bg-black dark:hover:bg-gray-600 active:scale-95 transition" onClick={() => { setPage(1); load(); }}>Apply</button>
			</div>

			<div className="flex items-center gap-2">
				{(() => { const maxPage = Math.max(1, Math.ceil(total / limit)); return (
					<>
						<button className="px-3 py-1.5 border rounded disabled:opacity-50 dark:border-gray-600 dark:bg-gray-700 dark:text-gray-100" onClick={() => setPage(p => Math.max(1, p - 1))} disabled={page === 1}>Prev</button>
						<span className="text-sm dark:text-gray-300">Page {page} / {maxPage}</span>
						<button className="px-3 py-1.5 border rounded disabled:opacity-50 dark:border-gray-600 dark:bg-gray-700 dark:text-gray-100" onClick={() => setPage(p => Math.min(maxPage, p + 1))} disabled={page >= maxPage}>Next</button>
					</>
				); })()}
			</div>

			{/* Auto-load on page/limit/sort/order changes */}

			{/* Tasks List */}
			<ul className="divide-y rounded-xl border bg-white dark:bg-gray-800 dark:border-gray-700 overflow-hidden shadow-sm">
				{tasks.map(t => (
					<li key={t._id} className="p-3 sm:p-4 flex flex-col sm:flex-row sm:items-center gap-3 justify-between hover:bg-gray-50 dark:hover:bg-gray-700 transition">
						<div>
							<div className="font-medium text-gray-900 dark:text-gray-100">{t.title}</div>
							{t.description && <div className="text-sm text-gray-600 dark:text-gray-400">{t.description}</div>}
						</div>
						<div className="flex items-center gap-2">
							<input type="checkbox" className="h-4 w-4" checked={t.status === 'done'} onChange={e => updateTask(t._id, { status: e.target.checked ? 'done' : 'todo' } as any)} />
							<select className="border rounded px-2 py-1 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 text-gray-900 dark:text-gray-100 dark:bg-gray-700 dark:border-gray-600" value={t.status} onChange={e => updateTask(t._id, { status: e.target.value as any})}>
								<option value="todo">Todo</option>
								<option value="in_progress">In Progress</option>
								<option value="done">Done</option>
							</select>
							<button className="text-red-600 dark:text-red-400 text-sm hover:text-red-700 dark:hover:text-red-300 active:scale-95 transition" onClick={() => deleteTask(t._id)}>Delete</button>
						</div>
					</li>
				))}
				{tasks.length === 0 && <li className="p-6 text-sm text-gray-600 dark:text-gray-400">No tasks yet</li>}
			</ul>
		</div>
	);
}

