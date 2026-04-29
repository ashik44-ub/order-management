import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Plus, Edit, Trash2, LogOut, Save, X } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || '/api';

const Dashboard = () => {
  const [parts, setParts] = useState([]);
  const [formData, setFormData] = useState({
    opNo: '', customerName: '', partsName: '', totalQtyOrdered: 0,
    qtyDelivered: 0, totalAmount: 0, advancedPaid: 0,
    chequeNo: '', chequeDate: '', deliveryDate: '', partsStatus: 'Pending', remarks: ''
  });
  const [editingId, setEditingId] = useState(null);
  const navigate = useNavigate();

  const token = localStorage.getItem('token');

  useEffect(() => {
    fetchParts();
  }, []);

  const fetchParts = async () => {
    try {
      const res = await axios.get(`${API_BASE_URL}/parts`);
      if (Array.isArray(res.data)) {
        setParts(res.data);
      } else {
        console.error('API did not return an array:', res.data);
        setParts([]);
      }
    } catch (err) {
      console.error('Fetch error:', err);
      setParts([]);
    }
  };

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    navigate('/login');
  };

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    // Calculations
    const pendingQty = formData.totalQtyOrdered - formData.qtyDelivered;
    const dueAmount = formData.totalAmount - formData.advancedPaid;
    
    const data = { ...formData, pendingQty, dueAmount };

    try {
      if (editingId) {
        await axios.put(`${API_BASE_URL}/parts/${editingId}`, data, {
          headers: { 'x-auth-token': token }
        });
      } else {
        await axios.post(`${API_BASE_URL}/parts`, data, {
          headers: { 'x-auth-token': token }
        });
      }
      setFormData({
        opNo: '', customerName: '', partsName: '', totalQtyOrdered: 0,
        qtyDelivered: 0, totalAmount: 0, advancedPaid: 0,
        chequeNo: '', chequeDate: '', deliveryDate: '', partsStatus: 'Pending', remarks: ''
      });
      setEditingId(null);
      fetchParts();
    } catch (err) {
      console.error(err);
    }
  };

  const handleEdit = (part) => {
    setEditingId(part._id);
    setFormData({
      opNo: part.opNo,
      customerName: part.customerName,
      partsName: part.partsName,
      totalQtyOrdered: part.totalQtyOrdered,
      qtyDelivered: part.qtyDelivered,
      totalAmount: part.totalAmount,
      advancedPaid: part.advancedPaid,
      chequeNo: part.chequeNo || '',
      chequeDate: part.chequeDate || '',
      deliveryDate: part.deliveryDate || '',
      partsStatus: part.partsStatus,
      remarks: part.remarks || ''
    });
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleDelete = async (id) => {
    if (window.confirm('Are you sure you want to delete this record?')) {
      try {
        await axios.delete(`${API_BASE_URL}/parts/${id}`, {
          headers: { 'x-auth-token': token }
        });
        fetchParts();
      } catch (err) {
        console.error(err);
      }
    }
  };

  return (
    <div className="container">
      <header style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '30px' }}>
        <h1>Admin Dashboard</h1>
        <button onClick={handleLogout} className="btn" style={{ background: 'rgba(239, 68, 68, 0.1)', color: 'var(--error)' }}>
          <LogOut size={18} /> Logout
        </button>
      </header>

      <div className="glass-card" style={{ padding: '30px', marginBottom: '40px' }}>
        <h3 style={{ marginBottom: '20px', display: 'flex', alignItems: 'center', gap: '10px' }}>
          {editingId ? <Edit size={20} /> : <Plus size={20} />}
          {editingId ? 'Edit Part Delivery' : 'Add New Part Delivery'}
        </h3>
        <form onSubmit={handleSubmit} className="grid grid-cols-3">
          <div className="form-group">
            <label>Op No</label>
            <input type="text" name="opNo" value={formData.opNo} onChange={handleChange} required />
          </div>
          <div className="form-group">
            <label>Customer Name</label>
            <input type="text" name="customerName" value={formData.customerName} onChange={handleChange} required />
          </div>
          <div className="form-group">
            <label>Parts Name</label>
            <input type="text" name="partsName" value={formData.partsName} onChange={handleChange} required />
          </div>
          <div className="form-group">
            <label>Total Qty Ordered</label>
            <input type="number" name="totalQtyOrdered" value={formData.totalQtyOrdered} onChange={handleChange} required />
          </div>
          <div className="form-group">
            <label>Qty Delivered</label>
            <input type="number" name="qtyDelivered" value={formData.qtyDelivered} onChange={handleChange} required />
          </div>
          <div className="form-group">
            <label>Total Amount</label>
            <input type="number" name="totalAmount" value={formData.totalAmount} onChange={handleChange} required />
          </div>
          <div className="form-group">
            <label>Advanced Paid</label>
            <input type="number" name="advancedPaid" value={formData.advancedPaid} onChange={handleChange} required />
          </div>
          <div className="form-group">
            <label>Cheque No</label>
            <input type="text" name="chequeNo" value={formData.chequeNo} onChange={handleChange} />
          </div>
          <div className="form-group">
            <label>Cheque Date</label>
            <input type="date" name="chequeDate" value={formData.chequeDate} onChange={handleChange} />
          </div>
          <div className="form-group">
            <label>Delivery Date</label>
            <input type="date" name="deliveryDate" value={formData.deliveryDate} onChange={handleChange} />
          </div>
          <div className="form-group">
            <label>Parts Status</label>
            <select name="partsStatus" value={formData.partsStatus} onChange={handleChange}>
              <option value="Pending">Pending</option>
              <option value="Partially Delivered">Partially Delivered</option>
              <option value="Delivered">Delivered</option>
              <option value="Cancelled">Cancelled</option>
            </select>
          </div>
          <div className="form-group">
            <label>Remarks</label>
            <textarea name="remarks" value={formData.remarks} onChange={handleChange} rows="1"></textarea>
          </div>
          <div style={{ gridColumn: 'span 3', display: 'flex', gap: '10px', justifyContent: 'flex-end' }}>
            {editingId && (
              <button type="button" onClick={() => { setEditingId(null); setFormData({
                opNo: '', customerName: '', partsName: '', totalQtyOrdered: 0,
                qtyDelivered: 0, totalAmount: 0, advancedPaid: 0,
                chequeNo: '', chequeDate: '', deliveryDate: '', partsStatus: 'Pending', remarks: ''
              }); }} className="btn" style={{ background: 'var(--glass)' }}>
                <X size={18} /> Cancel
              </button>
            )}
            <button type="submit" className="btn btn-primary">
              <Save size={18} /> {editingId ? 'Update Record' : 'Save Record'}
            </button>
          </div>
        </form>
      </div>

      <div className="glass-card table-container">
        <table>
          <thead>
            <tr>
              <th>Op No</th>
              <th>Customer</th>
              <th>Parts</th>
              <th>Status</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {parts.map(part => (
              <tr key={part._id}>
                <td>{part.opNo}</td>
                <td>{part.customerName}</td>
                <td>{part.partsName}</td>
                <td>{part.partsStatus}</td>
                <td>
                  <div style={{ display: 'flex', gap: '10px' }}>
                    <button onClick={() => handleEdit(part)} style={{ background: 'none', border: 'none', cursor: 'pointer', color: 'var(--primary)' }}>
                      <Edit size={18} />
                    </button>
                    <button onClick={() => handleDelete(part._id)} style={{ background: 'none', border: 'none', cursor: 'pointer', color: 'var(--error)' }}>
                      <Trash2 size={18} />
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default Dashboard;
