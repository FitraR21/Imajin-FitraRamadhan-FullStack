import { useEffect, useState } from 'react';
import api from '../utils/api';

export default function Orders(){
  const [orders,setOrders]=useState([]);
  useEffect(()=>{ fetchOrders(); }, []);
  async function fetchOrders(){
    const t = localStorage.getItem('token');
    const res = await api.get('/api/orders', {}, t);
    setOrders(res || []);
  }
  return (
    <div style={{ padding: 20 }}>
      <h2>Orders</h2>
      {orders.map(o => (
        <div key={o.id} style={{ border: '1px solid #ccc', margin: 8, padding: 8 }}>
          <div>Order: {o.id} - {o.createdAt}</div>
          <div>Total: {o.total}</div>
          <ul>{o.lines.map(l=> <li key={l.productId}>{l.title} x {l.qty} @ {l.price}</li>)}</ul>
        </div>
      ))}
    </div>
  );
}
