import React, { useState } from 'react';
import { FaCalendarAlt, FaSearch, FaFilter, FaDownload } from 'react-icons/fa';
import './Transactionhistory.css';

const Transactionhistory = () => {
  const transactions = [
    {
      id: 1,
      date: '2025-04-27 10:30 AM',
      serviceId: 'SVC123',
      referenceNo: 'REF001',
      remark: 'Payment Received',
      amount: 500,
      openingBalance: 1000,
      closingBalance: 1500,
      status: 'Completed',
    },
    {
      id: 2,
      date: '2025-04-26 4:15 PM',
      serviceId: 'SVC124',
      referenceNo: 'REF002',
      remark: 'Payment Sent',
      amount: -200,
      openingBalance: 1500,
      closingBalance: 1300,
      status: 'Completed',
    },
    {
      id: 3,
      date: '2025-04-25 1:00 PM',
      serviceId: 'SVC125',
      referenceNo: 'REF003',
      remark: 'Refund Issued',
      amount: -100,
      openingBalance: 1300,
      closingBalance: 1200,
      status: 'Pending',
    },
    {
      id: 4,
      date: '2025-04-24 11:45 AM',
      serviceId: 'SVC126',
      referenceNo: 'REF004',
      remark: 'Service Charge',
      amount: -50,
      openingBalance: 1200,
      closingBalance: 1150,
      status: 'Completed',
    },
    {
      id: 5,
      date: '2025-04-23 3:20 PM',
      serviceId: 'SVC127',
      referenceNo: 'REF005',
      remark: 'Bonus Credit',
      amount: 300,
      openingBalance: 1150,
      closingBalance: 1450,
      status: 'Completed',
    },
  ];

  const [searchQuery, setSearchQuery] = useState('');
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');
  const [showDatePicker, setShowDatePicker] = useState(false);
  const [activeFilter, setActiveFilter] = useState('all');

  const filteredTransactions = transactions.filter((tx) => {
    const matchSearch = tx.serviceId.toLowerCase().includes(searchQuery.toLowerCase()) ||
                        tx.referenceNo.toLowerCase().includes(searchQuery.toLowerCase()) ||
                        tx.remark.toLowerCase().includes(searchQuery.toLowerCase());

    const txDate = new Date(tx.date);
    const matchDate = (!startDate || txDate >= new Date(startDate)) &&
                      (!endDate || txDate <= new Date(endDate));

    const matchFilter = activeFilter === 'all' || 
                        (activeFilter === 'credit' && tx.amount > 0) ||
                        (activeFilter === 'debit' && tx.amount < 0);

    return matchSearch && matchDate && matchFilter;
  });

  const handleCalendarClick = () => {
    setShowDatePicker(!showDatePicker);
  };

  const handleDateApply = () => {
    setShowDatePicker(false);
  };

  const handleDateClear = () => {
    setStartDate('');
    setEndDate('');
    setShowDatePicker(false);
  };

  const exportToCSV = () => {
    // In a real app, this would generate and download a CSV file
    alert('Export functionality would download a CSV file in a real application');
  };

  return (
    <div className="transaction-management">
      <div className="tm-header">
        <div >
          <h1 className="tm-title">Transaction History</h1>
          <p className="tm-subtitle">View and analyze all transaction records</p>
        </div>
        <button className="tm-export-btn" onClick={exportToCSV}>
          <FaDownload /> Export
        </button>
      </div>

      {/* Filters Section */}
      <div className="tm-filters-container">
        <div className="tm-search-container">
          <FaSearch className="tm-search-icon" />
          <input
            type="text"
            placeholder="Search transactions..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="tm-search"
          />
        </div>

        <div className="tm-filter-buttons">
          <button 
            className={`tm-filter-btn ${activeFilter === 'all' ? 'active' : ''}`}
            onClick={() => setActiveFilter('all')}
          >
            All Transactions
          </button>
          <button 
            className={`tm-filter-btn ${activeFilter === 'credit' ? 'active' : ''}`}
            onClick={() => setActiveFilter('credit')}
          >
            Credits
          </button>
          <button 
            className={`tm-filter-btn ${activeFilter === 'debit' ? 'active' : ''}`}
            onClick={() => setActiveFilter('debit')}
          >
            Debits
          </button>
        </div>

        <div className="tm-date-filter">
          <button className="tm-calendar-btn" onClick={handleCalendarClick}>
            <FaCalendarAlt /> Date Filter
          </button>
          
          {showDatePicker && (
            <div className="tm-date-picker">
              <div className="tm-date-inputs">
                <div>
                  <label>From:</label>
                  <input
                    type="date"
                    value={startDate}
                    onChange={(e) => setStartDate(e.target.value)}
                  />
                </div>
                <div>
                  <label>To:</label>
                  <input
                    type="date"
                    value={endDate}
                    onChange={(e) => setEndDate(e.target.value)}
                  />
                </div>
              </div>
              <div className="tm-date-actions">
                <button className="tm-date-apply" onClick={handleDateApply}>
                  Apply
                </button>
                <button className="tm-date-clear" onClick={handleDateClear}>
                  Clear
                </button>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Summary Cards */}
      <div className="tm-cards">
        <div className="tm-card">
          <div className="tm-card-icon" style={{ backgroundColor: '#e3f2fd' }}>
            <FaFilter />
          </div>
          <div>
            <p>Total Transactions</p>
            <h2>{filteredTransactions.length}</h2>
          </div>
        </div>
        <div className="tm-card">
          <div className="tm-card-icon" style={{ backgroundColor: '#e8f5e9' }}>
            ₹
          </div>
          <div>
            <p>Total Amount</p>
            <h2>₹ {filteredTransactions.reduce((sum, t) => sum + t.amount, 0).toFixed(2)}</h2>
          </div>
        </div>
        <div className="tm-card">
          <div className="tm-card-icon" style={{ backgroundColor: '#e0f7fa' }}>
            ↑
          </div>
          <div>
            <p>Total Credited</p>
            <h2 style={{ color: '#2e7d32' }}>
              ₹ {filteredTransactions.filter(t => t.amount > 0).reduce((sum, t) => sum + t.amount, 0).toFixed(2)}
            </h2>
          </div>
        </div>
        <div className="tm-card">
          <div className="tm-card-icon" style={{ backgroundColor: '#ffebee' }}>
            ↓
          </div>
          <div>
            <p>Total Debited</p>
            <h2 style={{ color: '#c62828' }}>
              ₹ {filteredTransactions.filter(t => t.amount < 0).reduce((sum, t) => sum + Math.abs(t.amount), 0).toFixed(2)}
            </h2>
          </div>
        </div>
      </div>

      {/* Transactions Table */}
      <div className="tm-table-container">
        <div className="tm-table-header">
          <h3>Recent Transactions</h3>
          <div className="tm-table-summary">
            Showing {filteredTransactions.length} of {transactions.length} transactions
          </div>
        </div>
        
        <div className="tm-table-wrapper">
          <table className="tm-table">
            <thead>
              <tr>
                <th>SR.NO.</th>
                <th>DATE & TIME</th>
                <th>SERVICE ID</th>
                <th>REFERENCE NO</th>
                <th>REMARK</th>
                <th>AMOUNT</th>
                <th>STATUS</th>
                <th>BALANCE</th>
              </tr>
            </thead>
            <tbody>
              {filteredTransactions.length > 0 ? (
                filteredTransactions.map((tx, index) => (
                  <tr key={tx.id}>
                    <td>{index + 1}</td>
                    <td>{tx.date}</td>
                    <td>{tx.serviceId}</td>
                    <td>{tx.referenceNo}</td>
                    <td>{tx.remark}</td>
                    <td style={{ color: tx.amount >= 0 ? '#2e7d32' : '#c62828', fontWeight: 500 }}>
                      {tx.amount >= 0 ? `+₹${tx.amount.toFixed(2)}` : `-₹${Math.abs(tx.amount).toFixed(2)}`}
                    </td>
                    <td>
                      <span className={`tm-status ${tx.status.toLowerCase()}`}>
                        {tx.status}
                      </span>
                    </td>
                    <td>
                      <div className="tm-balance">
                        <div>Open: ₹{tx.openingBalance.toFixed(2)}</div>
                        <div>Close: ₹{tx.closingBalance.toFixed(2)}</div>
                      </div>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan="8" className="no-data">
                    No transactions found matching your criteria
                  </td>
                </tr>
              )}
            </tbody>
          </table>
          {filteredTransactions.length > 0 && (
  <div className="tm-transaction-cards">
    {filteredTransactions.map((tx, index) => (
      <div className="tm-transaction-card" key={`card-${tx.id}`}>
        <div className="tm-transaction-card-row">
          <span className="tm-transaction-card-label">Date & Time</span>
          <span className="tm-transaction-card-value">{tx.date}</span>
        </div>
        <div className="tm-transaction-card-row">
          <span className="tm-transaction-card-label">Service ID</span>
          <span className="tm-transaction-card-value">{tx.serviceId}</span>
        </div>
        <div className="tm-transaction-card-row">
          <span className="tm-transaction-card-label">Reference No</span>
          <span className="tm-transaction-card-value">{tx.referenceNo}</span>
        </div>
        <div className="tm-transaction-card-row">
          <span className="tm-transaction-card-label">Remark</span>
          <span className="tm-transaction-card-value">{tx.remark}</span>
        </div>
        <div className="tm-transaction-card-row">
          <span className="tm-transaction-card-label">Amount</span>
          <span 
            className="tm-transaction-card-value tm-transaction-card-amount" 
            style={{ color: tx.amount >= 0 ? '#2e7d32' : '#c62828' }}
          >
            {tx.amount >= 0 ? `+₹${tx.amount.toFixed(2)}` : `-₹${Math.abs(tx.amount).toFixed(2)}`}
          </span>
        </div>
        <div className="tm-transaction-card-row">
          <span className="tm-transaction-card-label">Status</span>
          <span className={`tm-transaction-card-value tm-transaction-card-status ${tx.status.toLowerCase()}`}>
            {tx.status}
          </span>
        </div>
        <div className="tm-transaction-card-row">
          <span className="tm-transaction-card-label">Opening Balance</span>
          <span className="tm-transaction-card-value">₹{tx.openingBalance.toFixed(2)}</span>
        </div>
        <div className="tm-transaction-card-row">
          <span className="tm-transaction-card-label">Closing Balance</span>
          <span className="tm-transaction-card-value">₹{tx.closingBalance.toFixed(2)}</span>
        </div>
      </div>
    ))}
  </div>
)}
        </div>
      </div>
    </div>
  );
};

export default Transactionhistory;