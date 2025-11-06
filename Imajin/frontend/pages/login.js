import { useState } from 'react';
import api from '../utils/api';

export default function Login(){
  const [email,setEmail]=useState('');
  const [pass,setPass]=useState('');
  const [msg,setMsg]=useState('');
  async function onSubmit(e){
    e.preventDefault();
    const r = await api.post('/api/auth/login',{ email, password: pass });
    if (r && r.token) {
      localStorage.setItem('token', r.token);
      setMsg('Logged in');
    } else setMsg('Failed');
  }
  return (
    <div style={{ padding: 20 }}>
      <h2>Login</h2>
      <form onSubmit={onSubmit}>
        <input placeholder="email" value={email} onChange={e=>setEmail(e.target.value)} />
        <input placeholder="password" type="password" value={pass} onChange={e=>setPass(e.target.value)} />
        <button type="submit">Login</button>
      </form>
      <div>{msg}</div>
    </div>
  );
}
