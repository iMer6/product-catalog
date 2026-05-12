import React, { useEffect } from 'react';

import modalStyles from "../styles/modal.module.css";
import cartStyles from "../styles/cart.module.css";

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
    <div className={modalStyles.overlay}>
      <div className={modalStyles.modal}>
        <div className={modalStyles.header}>
          <h2>Ваш кошик</h2>
          <button onClick={onClose} className={modalStyles['close-btn']}>&times;</button>
        </div>
        
        <div className={modalStyles.content}>
          {cartItems.length === 0 ? (
            <p style={{ textAlign: 'center' }}>Кошик порожній</p>
          ) : (
            <>
              <div className={cartStyles['cart-row']} style={{ fontWeight: 'bold', borderBottom: '2px solid #eee'}}>
                <span className={cartStyles['item-name']}>Назва товару</span>
                <span style={{ textAlign: 'center' }}>Кількість</span>
                <span className={cartStyles['item-price']} style={{ textAlign: 'right' }}>Ціна</span>
                <span></span> {}
              </div>

              {cartItems.map((item) => (
                <div key={item.id} className={cartStyles['cart-row']}>
                  <span className={cartStyles['item-name']}>{item.name}</span>
                  <span style={{ textAlign: 'center', fontWeight: 'bold' }}>{item.quantity}</span>
                  <span className={cartStyles['item-price']}>{item.price * item.quantity} грн</span>
                  <div className={cartStyles['action-area']}>
                    <button onClick={() => removeFromCart(item.id)} className={cartStyles['remove-btn']}>Видалити</button>
                  </div>
                </div>
              ))}
            </>
          )}
        </div>

        {cartItems.length > 0 && (
          <div className={modalStyles.footer}>
            <h3>Разом: {totalSum} грн</h3>
            <button className={modalStyles.btn} onClick={() => handleCheckout()}>Оформити замовлення</button>
          </div>
        )}
      </div>
    </div>
  );
};

export default CartModal;