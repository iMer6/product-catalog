import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, Link } from 'react-router-dom';
import "./App.css"
import "./cartStyles.css"
import "./index.css"

const Home = () => (
  <div style={{ textAlign: 'center', marginTop: '50px', color: 'color(display-p3 0.945 0.934 0.549)'}}>
    <h1>Перейдіть до каталогу, щоб побачити товари.</h1>
  </div>
);

const App = () => {
  const [cart, setCart] = useState([]);
  const [isCartOpen, setIsCartOpen] = useState(false);

  const addToCart = (product) => {
    setCart(prevCart => {
      const existingItem = prevCart.find(el => el.id === product.id);
      if (existingItem) {
        return prevCart.map(el =>
          el.id === product.id ? { ...el, quantity: el.quantity + 1 } : el
        );
      }
      return [...prevCart, { ...product, quantity: 1 }];
    });
  };

  const removeFromCart = (productId) => {
    setCart(prevCart => {
      const item = prevCart.find(i => i.id === productId);
      if (item && item.quantity > 1) {
        return prevCart.map(el => el.id === productId ? { ...el, quantity: el.quantity - 1 } : el);
      }
      return prevCart.filter(i => i.id !== productId);
    });
  };

  const totalItemsCount = cart.reduce((sum, el) => sum + el.quantity, 0);

  return (
    <Router>
      <nav className='nav-container'>
        <Link className='nav-link' to="/">Головна</Link>
        <Link className='nav-link' to="/products">Каталог товарів</Link>
        <button onClick={() => setIsCartOpen(true)} className='cart-btn'>
          <i className="bi bi-basket3"></i>&nbsp;({totalItemsCount})
        </button>
      </nav>

      <CartModal 
        isOpen={isCartOpen} 
        onClose={() => setIsCartOpen(false)} 
        cartItems={cart}
        removeFromCart={removeFromCart}
      />

      <Routes>
        <Route path="/" element={<Home />}/>
        <Route path="/products" element={<ProductCatalog addToCart={addToCart} />}/>
      </Routes>
    </Router>
  );
};

const CartModal = ({ isOpen, onClose, cartItems, removeFromCart }) => {
  if (!isOpen) return null;

  const totalSum = cartItems.reduce((sum, item) => sum + (item.price * item.quantity), 0);

  return (
    <div className='overlay'>
      <div className='modal'>
        <div className='header'>
          <h2>Ваш кошик</h2>
          <button onClick={onClose} className='close-btn'>&times;</button>
        </div>
        
        <div className='content'>
          {cartItems.length === 0 ? (
            <p style={{ textAlign: 'center' }}>Кошик порожній</p>
          ) : (
            <>
              {}
              <div className='cart-row' style={{ fontWeight: 'bold', borderBottom: '2px solid #eee'}}>
                <span className='item-name'>Назва товару</span>
                <span style={{ textAlign: 'center' }}>Кількість</span>
                <span className='item-price' style={{ textAlign: 'right' }}>Ціна</span>
                <span></span> {}
              </div>

              {}
              {cartItems.map((item) => (
                <div key={item.id} className='cart-row'>
                  <span className='item-name'>{item.name}</span>
                  <span style={{ textAlign: 'center', fontWeight: 'bold' }}>{item.quantity}</span>
                  <span className='item-price'>{item.price * item.quantity} грн</span>
                  <div className='action-area'>
                    <button onClick={() => removeFromCart(item.id)} className='remove-btn'>Видалити</button>
                  </div>
                </div>
              ))}
            </>
          )}
        </div>

        {cartItems.length > 0 && (
          <div className='footer'>
            <h3>Разом: {totalSum} грн</h3>
            <button className='btn'>Оформити замовлення</button>
          </div>
        )}
      </div>
    </div>
  );
};

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
    product.name.toLowerCase().includes(searchTerm.toLowerCase())
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
              До кошика&nbsp;<i className="bi bi-basket3"></i>
            </button>
          </div>
        ))}
      </div>
    </div>
  );
};

export default App;