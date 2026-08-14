import React from 'react';
import { Product } from '../types/product';

interface ProductCardProps {
  product: Product;
  onAddToCart: (product: Product) => void;
}

export const ProductCard: React.FC<ProductCardProps> = ({ product, onAddToCart }) => {
  return (
    <div style={{
      border: '1px solid #ddd',
      borderRadius: '8px',
      overflow: 'hidden',
      padding: '1rem',
      textAlign: 'center',
      backgroundColor: '#fff',
      boxShadow: '0 2px 5px rgba(0,0,0,0.1)',
    }}>
      <img 
        src={product.image} 
        alt={product.name} 
        style={{ width: '100%', height: '200px', objectFit: 'cover', borderRadius: '4px' }} 
      />
      <h3 style={{ margin: '0.5rem 0 0.2rem' }}>{product.name}</h3>
      <p style={{ color: '#888', margin: '0 0 0.5rem' }}>{product.category}</p>
      <p style={{ fontWeight: 'bold', color: '#2c3e50', fontSize: '1.1rem' }}>
        Rp {product.price.toLocaleString('id-ID')}
      </p>
      <button 
        onClick={() => onAddToCart(product)}
        style={{
          padding: '0.5rem 1rem',
          backgroundColor: '#007bff',
          color: '#fff',
          border: 'none',
          borderRadius: '4px',
          cursor: 'pointer',
          width: '100%',
        }}
      >
        + Keranjang
      </button>
    </div>
  );
};