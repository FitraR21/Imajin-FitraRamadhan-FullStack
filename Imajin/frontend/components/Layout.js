import Link from 'next/link';

export default function Layout({ children }) {
  return (
    <div style={{ fontFamily: 'Inter, Arial, sans-serif', background: '#f7f8fa', minHeight: '100vh' }}>
      <header style={{ background: '#fff', borderBottom: '1px solid #eee', padding: '16px 32px', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
        <div style={{ fontWeight: 700, fontSize: 24, color: '#2d3748' }}>
          <Link href="/" style={{ textDecoration: 'none', color: '#2d3748' }}>Imajin Marketplace</Link>
        </div>
        <nav style={{ display: 'flex', gap: 24 }}>
          <Link href="/cart">Cart</Link>
          <Link href="/orders">Orders</Link>
          <Link href="/login">Login</Link>
          <Link href="/register">Register</Link>
        </nav>
      </header>
      <main style={{ maxWidth: 1200, margin: '32px auto', padding: 24, background: '#fff', borderRadius: 12, boxShadow: '0 2px 8px #e2e8f0' }}>
        {children}
      </main>
      <footer style={{ textAlign: 'center', color: '#888', padding: 16 }}>
        Inspired by <a href="https://www.figma.com/community/website-templates/marketplace" target="_blank" rel="noopener noreferrer">Figma Marketplace Template</a>
      </footer>
    </div>
  );
}
