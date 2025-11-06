import { useEffect, useState } from 'react';
import ProductCard from '../components/ProductCard';
import api from '../utils/api';

export default function Home() {
  const [q, setQ] = useState('');
  const [items, setItems] = useState([]);
  const [category, setCategory] = useState('');
  const [sort, setSort] = useState('');

  useEffect(() => { fetchList(); }, []);

  async function fetchList() {
    const params = { q, category, sort };
    const res = await api.get('/api/products', params);
    setItems(res || []);
  }

  async function onSearch(e){
    e.preventDefault();
    await fetchList();
  }

  return (
    <div>
      <form onSubmit={onSearch} style={{ display: 'flex', gap: 12, marginBottom: 24, alignItems: 'center' }}>
        <input placeholder="Search products..." value={q} onChange={e=>setQ(e.target.value)} style={{ flex: 1, padding: 8, borderRadius: 6, border: '1px solid #ddd' }} />
        <select value={category} onChange={e=>setCategory(e.target.value)} style={{ padding: 8, borderRadius: 6, border: '1px solid #ddd' }}>
          <option value="">All Categories</option>
          <option value="shoes">Shoes</option>
          <option value="hats">Hats</option>
        </select>
        <select value={sort} onChange={e=>setSort(e.target.value)} style={{ padding: 8, borderRadius: 6, border: '1px solid #ddd' }}>
          <option value="">Relevance</option>
          <option value="newest">Newest</option>
          <option value="oldest">Oldest</option>
        </select>
        <button type="submit" style={{ padding: '8px 16px', borderRadius: 6, background: '#2d3748', color: '#fff', border: 'none', fontWeight: 600 }}>Search</button>
      </form>
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(260px, 1fr))', gap: 24 }}>
        {items.map(p=> <ProductCard key={p.id} product={p} />)}
      </div>
      {items.length === 0 && <div style={{ textAlign: 'center', color: '#888', marginTop: 32 }}>No products found.</div>}
    </div>
  );
}
