const API_BASE = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:4000';

async function request(path, method='GET', body=null, token=null){
  const opts = { method, headers: {} };
  if (body) { opts.body = JSON.stringify(body); opts.headers['Content-Type'] = 'application/json'; }
  if (token) opts.headers['Authorization'] = 'Bearer ' + token;
  const res = await fetch(API_BASE + path, opts);
  if (res.status === 204) return null;
  try {
    return await res.json();
  } catch (e) { return null; }
}

export default {
  get: (path, params={}, token=null) => {
    const qs = Object.entries(params).filter(([k,v])=>v!==''&&v!=null).map(([k,v])=>`${encodeURIComponent(k)}=${encodeURIComponent(v)}`).join('&');
    const p = qs ? path + '?' + qs : path;
    return request(p, 'GET', null, token);
  },
  post: (path, body, token=null) => request(path, 'POST', body, token)
};
