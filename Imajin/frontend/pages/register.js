import { useState } from 'react';
import api from '../utils/api';

export default function Register(){
  const [email,setEmail]=useState('');
  const [pass,setPass]=useState('');
  const [name,setName]=useState('');
  const [msg,setMsg]=useState('');
  async function onSubmit(e){
    e.preventDefault();
    const r = await api.post('/api/auth/register',{ email, password: pass, name });
    if (r && r.token) {
      localStorage.setItem('token', r.token);
      setMsg('Registered and logged in');
    } else setMsg('Failed');
  }
  return (
    <div style={{ padding: 20 }}>
      <h2>Register</h2>
      <form onSubmit={onSubmit}>
        <input placeholder="name" value={name} onChange={e=>setName(e.target.value)} />
        <input placeholder="email" value={email} onChange={e=>setEmail(e.target.value)} />
        <input placeholder="password" type="password" value={pass} onChange={e=>setPass(e.target.value)} />
        <button type="submit">Register</button>
      </form>
      <div>{msg}</div>
    </div>
  );
}
