import React from 'react';
import { useCart } from '../context/CartContext';
import { useNavigate } from 'react-router-dom';
import { type Service } from '../types';

const CartPage: React.FC = () => {
    const { cartItems, total, addItemToCart, removeItemFromCart, clearCart } = useCart();
    const navigate = useNavigate();

    // Simple shared button styles
    const actionButtonStyle: React.CSSProperties = {
        padding: '5px 8px',
        marginLeft: '5px',
        borderRadius: '4px',
        cursor: 'pointer',
        border: '1px solid',
        backgroundColor: 'transparent'
    };

    // ⭐️ Fixed Grid Layout: Increased width for the quantity/price columns
    // 1fr (Name) | 120px (Quantity Controls) | 120px (Price per unit) | 150px (Subtotal)
    const gridLayout: React.CSSProperties = {
        display: 'grid',
        gridTemplateColumns: '1fr 120px 120px 150px',
        alignItems: 'center',
        padding: '10px 0',
        borderBottom: '1px solid #eee'
    };


    return (
        <div style={{ maxWidth: '800px', margin: '20px auto', padding: '20px', border: '1px solid #ddd', borderRadius: '8px' }}>

            {/* ⭐️ Header and Clear Button Container (using Flexbox) */}
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '10px' }}>
                <h2>🛒 Ваша корзина</h2>

                {cartItems.length > 0 && (
                    <button
                        onClick={clearCart}
                        style={{
                            padding: '8px 15px',
                            backgroundColor: '#dc3545',
                            color: 'white',
                            border: 'none',
                            borderRadius: '4px',
                            cursor: 'pointer'
                        }}
                    >
                        Очистить корзину
                    </button>
                )}
            </div>
            {/* End of Header Container */}


            <hr style={{ margin: '20px 0' }} />

            {cartItems.length === 0 ? (
                <div>
                    <p>Корзина пуста.</p>
                    <button onClick={() => navigate('/services')} style={{ padding: '10px', backgroundColor: '#007bff', color: 'white', border: 'none', borderRadius: '4px', cursor: 'pointer' }}>
                        Перейти к услугам
                    </button>
                </div>
            ) : (
                <>
                    {/* Table Header (Optional: for clarity) */}
                    <div style={{ ...gridLayout, fontWeight: 'bold', borderBottom: '2px solid #333' }}>
                        <span>Название</span>
                        <span style={{ textAlign: 'center' }}>Кол-во</span>
                        <span style={{ textAlign: 'right', paddingRight: '15px' }}>Цена за ед.</span>
                        <span style={{ textAlign: 'right' }}>Сумма</span>
                    </div>

                    {/* Cart Items List */}
                    <ul style={{ listStyle: 'none', padding: 0 }}>
                        {cartItems.map(item => (
                            <li
                                key={item.id}
                                style={gridLayout}
                            >
                                <span><b>{item.name}</b></span>

                                {/* Quantity Controls */}
                                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                                    <button
                                        onClick={() => removeItemFromCart(item.id)}
                                        style={{ ...actionButtonStyle, borderColor: '#dc3545', color: '#dc3545' }}
                                    >
                                        ➖
                                    </button>
                                    <span style={{ margin: '0 8px' }}>{item.quantity}</span>
                                    <button
                                        onClick={() => addItemToCart(item as Service)}
                                        style={{ ...actionButtonStyle, borderColor: '#28a745', color: '#28a745' }}
                                    >
                                        ➕
                                    </button>
                                </div>

                                {/* Price per unit (Moved right within its column) */}
                                <span style={{ textAlign: 'right', paddingRight: '15px' }}>{item.price.toFixed(2)} руб.</span>

                                {/* Subtotal */}
                                <span style={{ textAlign: 'right', fontWeight: 'bold' }}>
                                    {(item.price * item.quantity).toFixed(2)} руб.
                                </span>
                            </li>
                        ))}
                    </ul>

                    <h3 style={{ marginTop: '30px', textAlign: 'right' }}>
                        ИТОГО: <span style={{ color: '#28a745' }}>{total.toFixed(2)} руб.</span>
                    </h3>

                    {/* ⭐️ Checkout Button Fix (using a wrapper div) */}
                    <div style={{ overflow: 'hidden', paddingTop: '10px' }}>
                        <button style={{ float: 'right', padding: '10px 20px', backgroundColor: '#007bff', color: 'white', border: 'none', borderRadius: '4px', cursor: 'pointer' }}>
                            Оформить заказ
                        </button>
                    </div>
                </>
            )}
        </div>
    );
};

export default CartPage;
