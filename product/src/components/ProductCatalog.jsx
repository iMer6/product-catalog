import React, { useState, useEffect } from 'react';

import pcStyles from "../styles/productCatalog.module.css";

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
    <div className={pcStyles.container}>
      <input
        type="text"
        placeholder="Пошук товарів..."
        className={pcStyles['search-input']}
        value={searchTerm}
        onChange={(e) => setSearchTerm(e.target.value)}
      />

      <div className={pcStyles.grid}>
        {filteredProducts.map(product => (
          <div key={product.id} className={pcStyles.card}>
            <div className={pcStyles['icon-wrapper']}>
              <i className={`bi ${product.icon}`}></i>
            </div>
            <h3 className={pcStyles['product-name']}>{product.name}</h3>
            <p className={pcStyles.category}>{product.category}</p>
            <p className={pcStyles.price}>{product.price} грн</p>
            <button className={pcStyles.btn} onClick={() => addToCart(product)}>
              До кошика <i className="bi bi-basket3"></i>
            </button>
          </div>
        ))}
      </div>
    </div>
  );
};

export default ProductCatalog;