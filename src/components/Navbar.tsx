import React from 'react';

interface NavbarProps {
  cartCount: number;
}

export const Navbar: React.FC<NavbarProps> = ({ cartCount }) => {
  return (
    <nav style={{
      display: 'flex',
      justifyContent: 'space-between',
      alignItems: 'center',
      padding: '1rem 2rem',
      backgroundColor: '#1a1a1a',
      color: '#ee0d0d',
    }}>
      <h2 style={{ margin: 0 }}>TokoPakaianku</h2>
      <div style={{ fontSize: '1.1rem', fontWeight: 'bold' }}>
        🛒 Keranjang: <span style={{ color: '#131513' }}>{cartCount}</span>
      </div>
    </nav>
  );
};