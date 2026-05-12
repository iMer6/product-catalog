import React, { useState, useEffect } from 'react';

import "../styles/productCatalog.css";

const ProductCatalog = ({ addToCart }) => {
  const [products, setProducts] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');

  useEffect(() => {
    fetch('/api/products/')
      .then((res) => res.json())
      .then((data) => { setProducts(data.products); })
      .catch((err) => { console.error("Помилка завантаження:", err); });
  }, []);

  const filteredProducts = products.filter(product =>
    product.name.toLowerCase().includes(searchTerm.trim().toLowerCase())
  );

  return (
    <div className='container'>
      <input
        type="text"
        placeholder="Пошук товарів..."
        className='search-input'
        value={searchTerm}
        onChange={(e) => setSearchTerm(e.target.value)}
      />

      <div className='grid'>
        {filteredProducts.map(product => (
          <div key={product.id} className='card'>
            <div className='icon-wrapper'>
              <i className={`bi ${product.icon}`}></i>
            </div>
            <h3 className='product-name'>{product.name}</h3>
            <p className='category'>{product.category}</p>
            <p className='price'>{product.price} грн</p>
            <button className='btn' onClick={() => addToCart(product)}>
              До кошика <i className="bi bi-basket3"></i>
            </button>
          </div>
        ))}
      </div>
    </div>
  );
};

export default ProductCatalog;