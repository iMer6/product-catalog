import React, { useState, useEffect } from 'react';

import { BrowserRouter as Router, Routes, Route, Link } from 'react-router-dom';

const Home = () => (
  <div style={{ textAlign: 'center', marginTop: '50px', color: 'color(display-p3 0.945 0.934 0.549)'}}>
    <h1>Перейдіть до каталогу, щоб побачити товари.</h1>
  </div>
);

const App = () => {
  return (
    <Router>
      <nav style={routerStyles.nav}>
        <Link style={routerStyles.navLink} to="/">Головна</Link>
        <Link style={routerStyles.navLink} to="/products">Каталог товарів</Link>
      </nav>

      <Routes>
        <Route path="/" element={<Home />}/>
        <Route path="/products" element={<ProductCatalog />}/>
      </Routes>
    </Router>
  );
};

const routerStyles = {
  nav: {
    padding: '20px',
    display: 'flex',
    justifyContent: 'center',
    gap: '20px'
  },

  navLink: {
    color: 'color(display-p3 0.919 0.979 0.865)',
    textDecoration: 'none',
    fontSize: '24px',
    fontWeight: 'bold'
  },
};

const ProductCatalog = () => {
  const [products, setProducts] = useState([]); // спочатаку порожній масив []
  const [searchTerm, setSearchTerm] = useState(''); // спочатку порожній рядок ('')

  useEffect(() => {
    fetch('/api/products/')
      .then((res) => res.json())
      .then((data) => { setProducts(data.products); })
      .catch((err) => console.error("Помилка завантаження:", err));
  }, []);

  const filteredProducts = products.filter(product =>
    product.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div style={styles.container}>
      <input
        type="text"
        placeholder="Пошук товарів..."
        style={styles.searchInput}
        value={searchTerm}
        onChange={(e) => setSearchTerm(e.target.value)}
      />

      <div style={styles.grid}>
        {filteredProducts.length > 0 ? (
          filteredProducts.map(product => (
            <div key={product.id} style={styles.card}>
              <div style={styles.iconWrapper}>
                <i className={`bi ${product.icon}`} style={styles.icon}></i>
              </div>
              
              <h3 style={styles.productName}>{product.name}</h3>
              <p style={styles.category}>{product.category}</p>
              <p style={styles.price}>{product.price} грн</p>
              <button style={styles.button}>До кошика</button>
            </div>
          ))
        ) : (
          <p style={{ textAlign: 'center', gridColumn: '1 / -1' }}>Товарів не знайдено</p>
        )}
      </div>
    </div>
  );
};

const styles = {
  container: {
    padding: '20px',
    maxWidth: '1200px',
    margin: '0 auto',
  },

  searchInput: {
    width: '100%',
    padding: '12px',
    marginBottom: '30px',
    borderRadius: '8px',
    border: '1px solid #ddd',
    fontSize: '16px',
    boxSizing: 'border-box'
  },

  grid: {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fill, minmax(220px, 1fr))',
    gap: '20px'
  },

  card: {
    border: '1px solid #eee',
    borderRadius: '12px',
    padding: '20px',
    textAlign: 'center',
    backgroundColor: 'color(display-p3 0.97 0.965 0.785)',
    boxShadow: '0 4px 6px rgba(0,0,0,0.05)',
    transition: 'transform 0.2s'
  },

  iconWrapper: {
    fontSize: '32px',
    color: 'color(display-p3 0.026 0.327 0.921)',
    marginBottom: '15px'
  },

  icon: {
    display: 'inline-block'
  },

  productName: {
    margin: '10px 0 5px',
    fontSize: '18px',
    color: 'color(display-p3 0.061 0.008 0.071)'
  },

  category: {
    color: 'color(display-p3 0.061 0.008 0.071)',
    fontSize: '14px',
    marginBottom: '15px'
  },

  price: {
    fontWeight: 'bold',
    fontSize: '22px',
    color: '#27ae60',
    marginBottom: '15px' },

  button: {
    backgroundColor: '#3498db',
    color: 'white',
    border: 'none',
    padding: '10px 15px',
    borderRadius: '6px',
    cursor: 'pointer',
    width: '100%',
    fontSize: '16px',
    fontWeight: '600'
  }
};

export default App;