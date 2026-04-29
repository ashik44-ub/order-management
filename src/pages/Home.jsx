import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { Package, Search, LogIn, LayoutDashboard } from 'lucide-react';
import { Link } from 'react-router-dom';

const API_BASE_URL = 'https://order-management-backend-eight.vercel.app/api';

const Home = () => {
  const [parts, setParts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  useEffect(() => {
    const token = localStorage.getItem('token');
    if (token) setIsLoggedIn(true);
    fetchParts();
  }, []);

  const fetchParts = async () => {
    try {
      const res = await axios.get(`${API_BASE_URL}/parts`);
      setParts(res.data);
      setLoading(false);
    } catch (err) {
      console.error(err);
      setLoading(false);
    }
  };

  const filteredParts = parts.filter(part => 
    part.customerName.toLowerCase().includes(searchTerm.toLowerCase()) ||
    part.opNo.toLowerCase().includes(searchTerm.toLowerCase()) ||
    part.partsName.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="container">
      <header style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '40px' }}>
        <div>
          <h1 style={{ fontSize: '2.5rem', background: 'linear-gradient(to right, #6366f1, #a855f7)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>
            OP Parts Delivery
          </h1>
          <p style={{ color: 'var(--text-muted)' }}>Real-time parts delivery tracking system</p>
        </div>
        {isLoggedIn ? (
          <Link to="/dashboard" className="btn btn-primary" style={{ background: 'var(--success)', display: 'flex', alignItems: 'center', gap: '8px' }}>
            <LayoutDashboard size={18} /> Dashboard
          </Link>
        ) : (
          <Link to="/login" className="btn btn-primary">
            <LogIn size={18} /> Admin Login
          </Link>
        )}
      </header>

      <div className="glass-card" style={{ padding: '20px', marginBottom: '20px' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
          <Search size={20} color="var(--text-muted)" />
          <input 
            type="text" 
            placeholder="Search by OP No, Customer, or Part Name..." 
            style={{ border: 'none', background: 'transparent', padding: '10px' }}
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
      </div>

      <div className="glass-card table-container">
        <table>
          <thead>
            <tr>
              <th>Op No</th>
              <th>Customer</th>
              <th>Parts Name</th>
              <th>Ordered</th>
              <th>Delivered</th>
              <th>Pending</th>
              <th>Total Amount</th>
              <th>Paid</th>
              <th>Due</th>
              <th>Del. Date</th>
              <th>Status</th>
              <th>Remarks</th>
            </tr>
          </thead>
          <tbody>
            {loading ? (
              <tr><td colSpan="12" style={{ textAlign: 'center' }}>Loading...</td></tr>
            ) : filteredParts.length === 0 ? (
              <tr><td colSpan="12" style={{ textAlign: 'center' }}>No records found.</td></tr>
            ) : (
              filteredParts.map(part => (
                <tr key={part._id}>
                  <td><span style={{ color: 'var(--primary)', fontWeight: '600' }}>{part.opNo}</span></td>
                  <td>{part.customerName}</td>
                  <td>{part.partsName}</td>
                  <td>{part.totalQtyOrdered}</td>
                  <td>{part.qtyDelivered}</td>
                  <td><span style={{ color: part.pendingQty > 0 ? 'var(--warning)' : 'var(--success)' }}>{part.pendingQty}</span></td>
                  <td>৳{part.totalAmount}</td>
                  <td>৳{part.advancedPaid}</td>
                  <td><span style={{ color: part.dueAmount > 0 ? 'var(--error)' : 'var(--success)' }}>৳{part.dueAmount}</span></td>
                  <td><span style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>{part.deliveryDate || 'N/A'}</span></td>
                  <td>
                    <span style={{ 
                      padding: '4px 8px', 
                      borderRadius: '4px', 
                      fontSize: '0.75rem',
                      background: part.partsStatus === 'Delivered' ? 'rgba(16, 185, 129, 0.1)' : 'rgba(245, 158, 11, 0.1)',
                      color: part.partsStatus === 'Delivered' ? 'var(--success)' : 'var(--warning)',
                      border: `1px solid ${part.partsStatus === 'Delivered' ? 'var(--success)' : 'var(--warning)'}`
                    }}>
                      {part.partsStatus}
                    </span>
                  </td>
                  <td style={{ color: 'var(--text-muted)', fontSize: '0.8rem' }}>{part.remarks}</td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default Home;
