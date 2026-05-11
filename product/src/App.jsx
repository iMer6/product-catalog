import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, Link } from 'react-router-dom';

import "./App.css";
import "./cartStyles.css";
import "./index.css";
import "./authFormStyles.css";

const Home = () => (
  <div style={{ textAlign: 'center', marginTop: '50px', color: 'color(display-p3 0.945 0.934 0.549)'}}>
    <h1>Перейдіть до каталогу, щоб побачити товари.</h1>
  </div>
);

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
        <Route path="/" element={<Home />}/>
        <Route path="/products" element={<ProductCatalog addToCart={addToCart} />}/>
      </Routes>
    </Router>
  );
};

const CartModal = ({ isOpen, onClose, cartItems, removeFromCart, clearCart }) => {
  useEffect(() => {
    const keyDown = (event) => { if (event.key === 'Escape') { onClose(); } };
    if (isOpen) { window.addEventListener('keydown', keyDown); } // add listener when modal form is open
    return () => { window.removeEventListener('keydown', keyDown); }; // remove listener when modal form is close 
  }, [isOpen, onClose]);

  const totalSum = cartItems.reduce((sum, item) => sum + (item.price * item.quantity), 0);
  const handleCheckout = async () => {
    const userEmail = sessionStorage.getItem('userEmail') || 'example@email.com';

    const orderData = {
      email: userEmail,
      items: cartItems.map(item => ({
        name: item.name,
        quantity: item.quantity,
        price: item.price,
        totalItemPrice: item.price * item.quantity
      })),
      totalSum: totalSum,
      date: new Date().toLocaleString()
    };

    try {
      const response = await fetch('http://localhost:3000/checkout', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(orderData),
      });

      if (response.ok) {
        alert("Замовлення успішно оформлено!");
        clearCart();
        onClose();
      } else {
        alert("Помилка при оформленні замовлення");
      }
    } catch (err) {
      console.error("Помилка:", err);
    }
  };

  if (!isOpen) return null;

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
              <div className='cart-row' style={{ fontWeight: 'bold', borderBottom: '2px solid #eee'}}>
                <span className='item-name'>Назва товару</span>
                <span style={{ textAlign: 'center' }}>Кількість</span>
                <span className='item-price' style={{ textAlign: 'right' }}>Ціна</span>
                <span></span> {}
              </div>

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
            <button className='btn' onClick={() => handleCheckout()}>Оформити замовлення</button>
          </div>
        )}
      </div>
    </div>
  );
};

const AuthModal = ({ isOpen, onClose, setName }) => {
  // state for switching Sign-up/Log-in form
  // true – Log in
  // false – Sign up
  const [isLogin, setIsLogin] = useState(false); 
  const [formData, setFormData] = useState({ username: '', email: '', password: '', confirmPassword: '' });

  useEffect(() => {
    const handleKeyDown = (event) => { if (event.key === 'Escape') { onClose(); } };
    if (isOpen) { window.addEventListener('keydown', handleKeyDown); } // add listener when modal form is open
    return () => { window.removeEventListener('keydown', handleKeyDown); }; // remove listener when modal form is close 
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  const handleChange = (e) => { setFormData({ ...formData, [e.target.name]: e.target.value }); };

  const handleSubmit = async (e) => {
    e.preventDefault(); // prevents a "Submit" button from refreshing the page

    if (!isLogin && formData.password !== formData.confirmPassword) {
      alert("Паролі не збігаються");
      return;
    }

    try {
      const link = isLogin
        ? 'http://localhost:3000/log-in'
        : 'http://localhost:3000/sign-up';
      
      const response = await fetch(link, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData, ['name', 'email', 'password']),
        credentials: 'include',
      })

      if (response.ok) {
        const data = await response.json();

        if (data.user) {
          sessionStorage.setItem('userName', data.user.name);
          sessionStorage.setItem('userEmail', data.user.email);
        }

        !isLogin
          ? alert("Successfully sign up")
          : alert("Successfully log in");

        // change username without reload entire page
        setName(sessionStorage.getItem('userName'));
      } else if (response.status === 409) { 
        alert("Цей імейл вже зайнятий!");
      } else {
        const errorData = await response.json();
        throw new Error(errorData.message || "Щось пішло не так");
      }
    } catch (err) {
      console.error("Помилка:", err);
    }

    setFormData({ username: '', email: '', password: '', confirmPassword: '' }); // clears the data
    onClose();
  };

  return (
    <div className='overlay'>
      <div className='modal' style={{ maxWidth: '450px' }}>
        <div className='header'>
          <h2>{isLogin ? "Вхід" : "Реєстрація"}</h2>
          <button onClick={onClose} className='close-btn'>&times;</button>
        </div>

        <form onSubmit={handleSubmit} className='content'>
          {!isLogin && (
            <div className='form-group'>
            <label>Ім'я користувача</label>
            <input type="text" name="username" value={formData.username} onChange={handleChange} required className='form-input'/>
          </div>
          )}

          <div className='form-group'>
            <label>Електронна пошта</label>
            <input type="email" name="email" value={formData.email} onChange={handleChange} required className='form-input'/>
          </div>

          <div className='form-group'>
            <label>Пароль</label>
            <input type="password" name="password" value={formData.password} onChange={handleChange} required className='form-input'/>
          </div>

          {!isLogin && (
            <div className='form-group'>
            <label>Підтвердіть пароль</label>
            <input type="password" name="confirmPassword" value={formData.confirmPassword} onChange={handleChange} required className='form-input'/>
          </div>
          )}

          <div className='footer' style={{ textAlign: 'center' }}>
            <button type="submit" className='btn' style={{ width: '100%' }}>
              {isLogin ? "Увійти" : "Створити акаунт"}
            </button>
            <p style={{ marginTop: '10px', fontSize: '14px' }}>
              {isLogin ? "Ще не маєте акаунт?" : "Вже майте акаунт?"}
              <span className='sU-lI' onClick={() => setIsLogin(!isLogin)}> {/* swtich state */}
                {isLogin ? "Зареєструватися" : "Увійти"}
              </span>
            </p>
          </div>
        </form>
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

export default App;