import React, { useEffect, useState } from 'react';
import './Admin.css';
import { useProducts } from '../../context/ProductsContext';
import { assets } from '../../assets/assets';
import { apiFetch, BILLS_BASE, AUTH_BASE } from '../../api/apiClient';
import { useAuth } from '../../context/AuthContext';
import { useNavigate } from 'react-router-dom';

const resolveAsset = (imageField) => {
	if (!imageField) return undefined;
	if (typeof imageField === 'string') {
	  const key = imageField.startsWith('assets.') ? imageField.split('.')[1] : imageField;
	  return assets[key] || assets[imageField];
	}
	return imageField;
};

const AdminHeader = () => {
	const { logout, user } = useAuth() || {};
	const navigate = useNavigate();
	const handleLogout = () => { if (logout) { logout(); } navigate('/'); };
	return (
		<header className="admin-header">
			<div className="admin-header__logo">emmable</div>
			<div className="admin-header__welcome">Welcome {user?.name || 'Admin'}</div>
			<button className="admin-logout-btn" onClick={handleLogout}>Logout</button>
		</header>
	);
};

const ProductsSection = () => {
	const { products, addProduct, deleteProduct } = useProducts();
	const [formOpen, setFormOpen] = useState(false);
	const [formData, setFormData] = useState({
		name: '',
		price: '',
		originalPrice: '',
		category: '',
		brand: '',
		sizes: '',
		isNew: false,
		inStock: true,
		rating: '',
		image: ''
	});

	const handleImageChange = (e) => {
		const file = e.target.files && e.target.files[0];
		if (!file) return;
		const reader = new FileReader();
		reader.onload = () => {
			setFormData(prev => ({ ...prev, image: reader.result }));
		};
		reader.readAsDataURL(file);
	};

	const handleSubmit = (e) => {
		e.preventDefault();
		const sizesArray = formData.sizes
			.split(',')
			.map(s => s.trim())
			.filter(Boolean);
		addProduct({
			name: formData.name,
			price: formData.price,
			originalPrice: formData.originalPrice,
			category: formData.category,
			brand: formData.brand,
			sizes: sizesArray,
			isNew: formData.isNew,
			inStock: formData.inStock,
			rating: formData.rating,
			image: 'assets.explore1'
		});
		setFormOpen(false);
		setFormData({ name: '', price: '', originalPrice: '', category: '', brand: '', sizes: '', isNew: false, inStock: true, rating: '', image: '' });
	};

	return (
		<section className="admin-section">
			<div className="section-header">
				<h2 className="section-title">Products</h2>
				<button className="btn-primary small" onClick={() => setFormOpen(true)}>Add Product</button>
			</div>
			{formOpen && (
				<form className="admin-form" onSubmit={handleSubmit}>
					<div className="form-grid">
						<label>
							<span>Name</span>
							<input value={formData.name} onChange={e => setFormData(p => ({ ...p, name: e.target.value }))} required />
						</label>
						<label>
							<span>Price</span>
							<input type="number" step="0.01" value={formData.price} onChange={e => setFormData(p => ({ ...p, price: e.target.value }))} required />
						</label>
						<label>
							<span>Original Price</span>
							<input type="number" step="0.01" value={formData.originalPrice} onChange={e => setFormData(p => ({ ...p, originalPrice: e.target.value }))} />
						</label>
						<label>
							<span>Category</span>
							<input value={formData.category} onChange={e => setFormData(p => ({ ...p, category: e.target.value }))} />
						</label>
						<label>
							<span>Brand</span>
							<input value={formData.brand} onChange={e => setFormData(p => ({ ...p, brand: e.target.value }))} />
						</label>
						<label>
							<span>Sizes (comma separated)</span>
							<input value={formData.sizes} onChange={e => setFormData(p => ({ ...p, sizes: e.target.value }))} />
						</label>
						<label className="checkbox-inline">
							<input type="checkbox" checked={formData.isNew} onChange={e => setFormData(p => ({ ...p, isNew: e.target.checked }))} />
							<span>Is New</span>
						</label>
						<label className="checkbox-inline">
							<input type="checkbox" checked={formData.inStock} onChange={e => setFormData(p => ({ ...p, inStock: e.target.checked }))} />
							<span>In Stock</span>
						</label>
						<label>
							<span>Rating</span>
							<input type="number" step="0.1" min="0" max="5" value={formData.rating} onChange={e => setFormData(p => ({ ...p, rating: e.target.value }))} />
						</label>
						<label>
							<span>Image</span>
							<input type="file" accept="image/*" onChange={handleImageChange} />
						</label>
					</div>
					<div className="form-actions">
						<button type="button" className="btn-secondary small" onClick={() => setFormOpen(false)}>Cancel</button>
						<button type="submit" className="btn-primary small">Save</button>
					</div>
				</form>
			)}

			<div className="section-card">
				<table className="admin-table">
					<thead>
						<tr>
							<th>ID</th>
							<th>Image</th>
							<th>Name</th>
							<th>Price</th>
							<th>Category</th>
							<th>Brand</th>
							<th>Actions</th>
						</tr>
					</thead>
					<tbody>
						{products.length === 0 && (
							<tr>
								<td colSpan="7">No products</td>
							</tr>
						)}
						{products.map(p => (
							<tr key={p.id}>
								<td>{p.id}</td>
								<td>{p.image ? <img src={resolveAsset(p.image)} alt={p.name} style={{ width: 40, height: 40, objectFit: 'cover', borderRadius: 4 }} /> : '-'}</td>
								<td>{p.name}</td>
								<td>${Number(p.price).toFixed(2)}</td>
								<td>{p.category}</td>
								<td>{p.brand}</td>
								<td>
									<button className="btn-danger small" onClick={() => deleteProduct(p.id)}>Delete</button>
								</td>
							</tr>
						))}
					</tbody>
				</table>
			</div>
		</section>
	);
};

const OrdersSection = () => {
	const [orders, setOrders] = useState([]);
	const [loading, setLoading] = useState(true);
	const { user } = useAuth();

	useEffect(() => {
		const loadOrders = async () => {
			try {
				// Try direct TrackOrder service call
				try {
					const response = await fetch('http://localhost:9105/orders');
					if (response.ok) {
						const data = await response.json();
						if (Array.isArray(data)) {
							setOrders(data);
							return;
						}
					}
				} catch (e) {
					console.log('TrackOrder service not available, using localStorage');
				}
				
				// Fallback to localStorage orders
				try {
					const stored = localStorage.getItem('admin_orders');
					if (stored) {
						const adminOrders = JSON.parse(stored);
						// Convert admin orders format to database format
						const converted = [];
						adminOrders.forEach(order => {
							order.items.forEach(item => {
								converted.push({
									orderId: order.orderId,
									email: order.email,
									productName: item.name,
									price: item.price,
									qty: item.quantity,
									status: order.status || 'SHIPPED'
								});
							});
						});
						setOrders(converted);
					} else {
						setOrders([]);
					}
				} catch (e) {
					console.error('Failed to load orders from localStorage:', e);
					setOrders([]);
				}
			} catch (e) {
				console.error('Failed to load orders:', e);
				setOrders([]);
			} finally {
				setLoading(false);
			}
		};
		loadOrders();
		// Auto-refresh every 30 seconds to show new orders
		const interval = setInterval(loadOrders, 30000);
		return () => clearInterval(interval);
	}, [user]);

	return (
		<section className="admin-section">
			<h2 className="section-title">Orders</h2>
			<div className="section-card">
				{loading ? <div style={{ padding: '1rem' }}>Loading...</div> : (
					<table className="admin-table">
						<thead>
							<tr>
								<th>Order #</th>
								<th>Email</th>
								<th>Product</th>
								<th>Price</th>
								<th>Qty</th>
								<th>Status</th>
							</tr>
						</thead>
						<tbody>
							{orders.length === 0 && (
								<tr>
									<td colSpan="6">No orders yet</td>
								</tr>
							)}
							{orders.map((o, idx) => (
								<tr key={`${o.orderId}-${idx}`}>
									<td>{o.orderId}</td>
									<td>{o.email}</td>
									<td>{o.productName}</td>
									<td>${Number(o.price).toFixed(2)}</td>
									<td>{o.qty}</td>
									<td>{o.status || 'Shipped'}</td>
								</tr>
							))}
						</tbody>
					</table>
				)}
			</div>
		</section>
	);
};

const UsersSection = () => {
	const [users, setUsers] = useState([]);
	const [loading, setLoading] = useState(true);
	const [error, setError] = useState(null);

	useEffect(() => {
		let cancelled = false;
		const randomDate = () => {
			const now = new Date();
			const pastDays = Math.floor(Math.random() * 180) + 1;
			const d = new Date(now.getTime() - pastDays * 24 * 60 * 60 * 1000);
			return d.toISOString().split('T')[0];
		};
		const load = async () => {
			setLoading(true); setError(null);
			try {
				const token = localStorage.getItem('auth_token');
				const cached = localStorage.getItem('admin_users_cache');
				if (cached) { try { const parsed = JSON.parse(cached); if (!cancelled) setUsers(parsed);} catch {/* ignore */} }
				let data;
				try {
					data = await apiFetch('/emails', { base: AUTH_BASE, auth: true });
				} catch (e) {
					if (e.status === 403 && token === 'admin_token') {
						// Local mock admin token fallback (endpoint might be public internally)
						data = await apiFetch('/emails', { base: AUTH_BASE, auth: false });
					} else { throw e; }
				}
				if (!Array.isArray(data)) throw new Error('Unexpected response format');
				const mapped = data.map((email, idx) => ({
					id: idx + 1,
					name: typeof email === 'string' ? email.split('@')[0] : 'user',
					email,
					role: 'User',
					registeredOn: randomDate(),
					status: 'Active'
				}));
				if (!cancelled) { setUsers(mapped); localStorage.setItem('admin_users_cache', JSON.stringify(mapped)); }
			} catch (e) {
				if (!cancelled) {
					let msg = e.message || 'Failed to load users';
					if (e.status === 403) msg = 'Forbidden: your account lacks permission to list user emails.';
					if (e.status === 401) msg = 'Unauthorized: please login again.';
					setError(msg);
				}
			} finally { if (!cancelled) setLoading(false); }
		};
		load();
		// Auto-refresh every 30 seconds to show new signups
		const interval = setInterval(load, 30000);
		return () => { cancelled = true; clearInterval(interval); };
	}, []);

	return (
		<section className="admin-section">
			<h2 className="section-title">Users</h2>
			<div className="section-card">
				{loading ? <div style={{ padding: '1rem' }}>Loading...</div> : error ? <div style={{ padding: '1rem', color: 'var(--danger,#c00)' }}>{error}</div> : (
					<table className="admin-table">
						<thead>
							<tr>
								<th>ID</th>
								<th>Name</th>
								<th>Email</th>
								<th>Role</th>
								<th>Registered On</th>
								<th>Status</th>
							</tr>
						</thead>
						<tbody>
							{users.length === 0 && (<tr><td colSpan="6">No users found</td></tr>)}
							{users.map(u => (
								<tr key={u.id}>
									<td>{u.id}</td>
									<td>{u.name}</td>
									<td>{u.email}</td>
									<td>{u.role}</td>
									<td>{u.registeredOn}</td>
									<td><span className={`status-badge ${u.status === 'Active' ? 'active' : 'inactive'}`}>{u.status}</span></td>
								</tr>
							))}
						</tbody>
					</table>
				)}
			</div>
		</section>
	);
};

const Admin = () => {
	const [activeTab, setActiveTab] = useState('products');

	return (
		<div className="admin-page">
			<AdminHeader />
			<div className="admin-layout">
				<aside className="admin-sidebar">
					<nav className="admin-nav">
						<button
							className={`admin-nav__item ${activeTab === 'products' ? 'is-active' : ''}`}
							onClick={() => setActiveTab('products')}
						>
							Products
						</button>
						<button
							className={`admin-nav__item ${activeTab === 'orders' ? 'is-active' : ''}`}
							onClick={() => setActiveTab('orders')}
						>
							Orders
						</button>
						<button
							className={`admin-nav__item ${activeTab === 'users' ? 'is-active' : ''}`}
							onClick={() => setActiveTab('users')}
						>
							Users
						</button>
					</nav>
				</aside>
				<main className="admin-content">
					{activeTab === 'products' ? <ProductsSection /> : activeTab === 'orders' ? <OrdersSection /> : <UsersSection />}
				</main>
			</div>
		</div>
	);
};

export default Admin;
