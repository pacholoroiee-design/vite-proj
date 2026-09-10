import React, { useState, useEffect } from 'react';
import './App.css';

function UserCard({ user }) {
  return (
    <div className="product-card">
      <div className="product-info">
        <h3>{user.name}</h3>
        <p className="price">{user.email}</p>
        <p>{user.username}</p>
        <p>{user.phone}</p>
        <p>{user.website}</p>
      </div>
    </div>
  );
}

function App() {
  // Existing product state
  const [activeTab, setActiveTab] = useState('all');

  // New Task 1: User state
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Existing products
  const products = [
    {
      id: 1,
      name: 'Chronograph Royal',
      category: 'timepieces',
      price: '$12,500',
      image:
        'https://images.unsplash.com/photo-1522335789203-aabd1fc54bc9?q=80&w=800&auto=format&fit=crop'
    },
    {
      id: 2,
      name: 'Noir Essence',
      category: 'fragrance',
      price: '$380',
      image:
        'https://images.unsplash.com/photo-1541643600914-78b084683601?q=80&w=800&auto=format&fit=crop'
    },
    {
      id: 3,
      name: 'Aurelia Handbag',
      category: 'accessories',
      price: '$4,200',
      image:
        'https://images.unsplash.com/photo-1584917865442-de89df76afd3?q=80&w=800&auto=format&fit=crop'
    }
  ];

  // Task 2: Fetch user data
  useEffect(() => {
    const fetchUsers = async () => {
      try {
        setLoading(true);
        setError(null);

        const response = await fetch(
          'https://jsonplaceholder.typicode.com/users'
        );

        if (!response.ok) {
          throw new Error('Failed to fetch users');
        }

        const data = await response.json();

        setUsers(data);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchUsers();
  }, []);

  // Existing product filtering
  const filteredProducts =
    activeTab === 'all'
      ? products
      : products.filter((p) => p.category === activeTab);

  return (
    <div className="luxury-app">

      {/* Top Announcement Bar */}
      <div className="announcement-bar">
        <span>Complimentary Worldwide Express Delivery</span>
      </div>

      {/* Navigation */}
      <header className="navbar">
        <div className="nav-left">
          <a href="#collection">Collection</a>
          <a href="#users">Users</a>
        </div>

        <div className="brand-logo">L'ÉTOILE</div>

        <div className="nav-right">
          <a href="#search">Search</a>
          <a href="#bag">Bag (0)</a>
        </div>
      </header>

      {/* Hero Section */}
      <section className="hero">
        <div className="hero-content">
          <p className="subtitle">Autumn / Winter Edition</p>

          <h1>Uncompromising Elegance</h1>

          <p className="description">
            Discover modern luxury crafted with precision, passion, and
            timeless sophistication.
          </p>

          <button className="primary-btn">
            Explore The Collection
          </button>
        </div>
      </section>

      {/* Collection Showcase */}
      <section className="showcase" id="collection">
        <div className="section-header">
          <h2>Curated Selection</h2>

          <div className="filter-tabs">
            <button
              className={activeTab === 'all' ? 'active' : ''}
              onClick={() => setActiveTab('all')}
            >
              All
            </button>

            <button
              className={activeTab === 'timepieces' ? 'active' : ''}
              onClick={() => setActiveTab('timepieces')}
            >
              Timepieces
            </button>

            <button
              className={activeTab === 'fragrance' ? 'active' : ''}
              onClick={() => setActiveTab('fragrance')}
            >
              Fragrance
            </button>

            <button
              className={activeTab === 'accessories' ? 'active' : ''}
              onClick={() => setActiveTab('accessories')}
            >
              Accessories
            </button>
          </div>
        </div>

        <div className="product-grid">
          {filteredProducts.map((item) => (
            <div key={item.id} className="product-card">
              <div className="img-wrapper">
                <img src={item.image} alt={item.name} />
              </div>

              <div className="product-info">
                <h3>{item.name}</h3>
                <p className="price">{item.price}</p>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* New Task 3: Users Section */}
      <section className="showcase" id="users">
        <div className="section-header">
          <h2>Our Users</h2>
        </div>

        {/* Loading */}
        {loading && (
          <p>Loading users...</p>
        )}

        {/* Error */}
        {error && (
          <p>
            Error: {error}
          </p>
        )}

        {/* Users */}
        {!loading && !error && (
          <div className="product-grid">
            {users.map((user) => (
              <UserCard
                key={user.id}
                user={user}
              />
            ))}
          </div>
        )}
      </section>

      {/* Footer */}
      <footer className="footer">
        <div className="footer-content">
          <p className="brand-logo-small">L'ÉTOILE</p>

          <p>
            © 2026 L'ÉTOILE Maison. All rights reserved.
          </p>
        </div>
      </footer>

    </div>
  );
}

export default App;