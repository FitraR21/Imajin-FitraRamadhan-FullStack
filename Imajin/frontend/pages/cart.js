import { useEffect, useState } from 'react';
import api from '../utils/api';

export default function Cart(){
  const [cart,setCart] = useState([]);
  const [msg,setMsg] = useState('');

  useEffect(()=>{ fetchCart(); }, []);

  async function fetchCart(){
    const t = localStorage.getItem('token');
    const res = await api.get('/api/cart', {}, t);
    setCart(res || []);
  }

  async function checkout(){
    const t = localStorage.getItem('token');
    // send partial lines - here full cart
    const items = cart.map(c => ({ productId: c.productId, qty: c.qty }));
    const order = await api.post('/api/cart/checkout', { items }, t);
    if (order && order.id) setMsg('Order created: ' + order.id);
    await fetchCart();
  }

  return (
    <div style={{ padding: 20 }}>
      <h2>Your Cart</h2>
      <ul>
        {cart.map(c=> <li key={c.productId}>{c.productId} x {c.qty}</li>)}
      </ul>
      <button onClick={checkout}>Checkout (dummy)</button>
      <div>{msg}</div>
    </div>
  );
}
