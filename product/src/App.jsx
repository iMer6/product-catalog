import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, Link } from 'react-router-dom';

import Home from "./components/Home.jsx";
import CartModal from "./components/CartModal.jsx";
import AuthModal from "./components/AuthModal.jsx";
import ProductCatalog from "./components/ProductCatalog.jsx";

import "./App.css";

const App = () => {
  if (!sessionStorage.getItem('userName')) sessionStorage.setItem('userName', 'Гість');
  const [name, setName] = useState(sessionStorage.getItem('userName'));

  const [cart, setCart] = useState([]);
  const [isCartOpen, setIsCartOpen] = useState(false);
  const [isRegisterOpen, setIsRegisterOpen] = useState(false);

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

  const clearCart = () => { setCart([]); };

  const totalItemsCount = cart.reduce((sum, el) => sum + el.quantity, 0);

  return (
    <Router>
      <nav className='nav-container'>
        <Link className='nav-link' to="/">Головна</Link>
        <Link className='nav-link' to="/products">Каталог товарів</Link>
        <button onClick={() => setIsCartOpen(true)} className='cart-btn'>
          <i className="bi bi-basket3"></i> ({totalItemsCount})
        </button>
        <button onClick={() => setIsRegisterOpen(true)} className="nav-link auth-modal">
          {`${name} `}
          <i className="bi bi-person-circle"></i>
        </button>
      </nav>

      <CartModal
        isOpen={isCartOpen}
        onClose={() => setIsCartOpen(false)}
        cartItems={cart}
        removeFromCart={removeFromCart}
        clearCart={clearCart}
      />

      <AuthModal
        isOpen={isRegisterOpen}
        onClose={() => setIsRegisterOpen(false)}
        setName={setName}
      />

      <Routes>
        <Route path="/" element={<Home/>}/>
        <Route path="/products" element={<ProductCatalog addToCart={addToCart}/>}/>
      </Routes>
    </Router>
  );
};

export default App;