import React, { useState, useEffect } from 'react';

import orderStyles from "../styles/userOrders.module.css";

const UserOrders = () => {
  const [orders, setOrders] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');

  useEffect(() => {
    const email = sessionStorage.getItem('userEmail');
    if (!email) return;

    fetch('/api/user/orders/', {
        method: 'GET',
        headers: {
            'Content-Type': 'application/json',
            'userEmail': sessionStorage.getItem('userEmail')
        }
    })
    .then((res) => res.json())
    .then((data) => { if (data.success) setOrders(data.orders); })
    .catch((err) => console.error("Error:", err));
  }, [sessionStorage.getItem('useremail')]);

  const filteredOrders = (orders || []).filter(order =>
    order?.id?.toString().includes(searchTerm.trim()) ||
    order?.items?.some(item => item.name.toLowerCase().includes(searchTerm.toLowerCase()))
  );

  return (
    <div className={orderStyles.container}>
  <input
    type="text"
    placeholder="Пошук товару..."
    className={orderStyles['search-input']}
    value={searchTerm}
    onChange={(e) => setSearchTerm(e.target.value)}
  />

  <div className={orderStyles.list}>
    {filteredOrders.length > 0 ? (
      filteredOrders.map(order => (
        <div key={order.id} className={orderStyles.orderCard}>
          <div className={orderStyles.header}>
            <span className={`${orderStyles.status} ${orderStyles[order.status.toLowerCase()]}`}>
              {order.status}
            </span>
          </div>
          
          <div className={orderStyles.details}>
            <p className={orderStyles.date}>
              <i className="bi bi-calendar3"></i> {new Date(order.date).toLocaleString('uk-UA')}
            </p>
            <div className={orderStyles.items}>
              {order.items.map((item, index) => (
                <span key={index} className={orderStyles.itemName}>
                  {item.name} 
                  <span className={orderStyles.itemQuantity}>{item.quantity > 1 ? ` (x${item.quantity})` : ""}</span>
                  {index < order.items.length - 1 ? ', ' : ''}
                </span>
              ))}
            </div>
          </div>

          <div className={orderStyles.footer}>
            <div className={orderStyles.summaryInfo}>
              <p className={orderStyles.totalPrice}>
                Разом: <strong>{order.totalSum} грн</strong>
              </p>
            </div>
            <button className={orderStyles.btnDetails}>
              Детальніше <i className="bi bi-chevron-right"></i>
            </button>
          </div>
        </div>
      ))
    ) : (
      <p className={orderStyles.noResults}>Замовлень не знайдено.</p>
    )}
  </div>
</div>
  );
};

export default UserOrders;