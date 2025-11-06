import api from '../utils/api';

export default function ProductCard({ product }){
  async function addToCart(){
    const token = localStorage.getItem('token');
    await api.post('/api/cart/add', { productId: product.id, qty: 1 }, token);
    alert('Added');
  }
  return (
    <div style={{ border: '1px solid #ddd', padding: 10 }}>
      <h3>{product.title}</h3>
      <div>{product.description}</div>
      <div>{product.category} - ${product.price}</div>
      <button onClick={addToCart}>Add to cart</button>
    </div>
  );
}
