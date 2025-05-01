import React, { useState } from 'react';
import './Apicredential.css';
import { MdDownloadForOffline } from "react-icons/md";

const Apicredential = () => {
  const [showForm, setShowForm] = useState(false);
  const [credentials, setCredentials] = useState([
    {
      id: 1,
      description: 'Project Alpha Key',
      createdAt: '2025-04-26',
      apiKey: 'alpha12345',
      iv: 'iv001',
      encryptionKey: 'enc001'
    },
    {
      id: 2,
      description: 'Beta API Integration',
      createdAt: '2025-04-25',
      apiKey: 'beta98765',
      iv: 'iv002',
      encryptionKey: 'enc002'
    },
    {
      id: 3,
      description: 'Gamma Service Key',
      createdAt: '2025-04-24',
      apiKey: 'gamma45678',
      iv: 'iv003',
      encryptionKey: 'enc003'
    },
  ]);
  const [newDescription, setNewDescription] = useState('');

  const handleDownload = () => {
    const link = document.createElement('a');
    link.href = '/sample.pdf'; // Update this link
    link.download = 'API_Credentials.pdf';
    link.click();
  };

  const handleNewCredential = () => {
    setShowForm(!showForm);
  };

  const handleSaveCredential = () => {
    if (newDescription.trim() === '') return;

    const newCredential = {
      id: credentials.length + 1,
      description: newDescription,
      createdAt: new Date().toISOString().split('T')[0], // today's date
      apiKey: Math.random().toString(36).substr(2, 10), // random key
      iv: Math.random().toString(36).substr(2, 5),
      encryptionKey: Math.random().toString(36).substr(2, 8),
    };

    setCredentials([...credentials, newCredential]);
    setNewDescription('');
    setShowForm(false);
  };

  return (
    <section className='apicredential'>
      <div className='top-apicredential-container'>
        <div className='top-apicredential-header'>
          <h1 className='apicredential-title'>API Credential</h1>
          <p className='apicredential-para'>Securely manage your API keys and credentials.</p>
        </div>

        <div className='top-apicredential-button'>
          <button className='apicredential-button' onClick={handleNewCredential}>
            + New Credential
          </button>
          <button className='apicredential-download-button' onClick={handleDownload}>
            <MdDownloadForOffline /> Download PDF
          </button>
        </div>
      </div>

      {/* Form Section */}
{showForm && (
  <div className="apicredential-form">
    <input
      type="text"
      placeholder="Enter Description"
      value={newDescription}
      onChange={(e) => setNewDescription(e.target.value)}
    />
    <div className="apicredential-form-buttons">
      <button className="apicredential-save-btn" onClick={handleSaveCredential}>
        Save Credential
      </button>
      <button className="apicredential-cancel-btn" onClick={() => { setShowForm(false); setNewDescription(''); }}>
        Cancel
      </button>
    </div>
  </div>
)}

     {/* Table Section */}
<div className='apicredential-table'>
  <table className='apicredential-table-content'>
    <thead>
      <tr>
        <th>SR.NO</th>
        <th>Description</th>
        <th>Created At</th>
        <th>API Key</th>
        <th>IV</th>
        <th>Encryption Key</th>
      </tr>
    </thead>
    <tbody>
      {credentials.map((cred) => (
        <tr key={cred.id}>
          <td>{cred.id}</td>
          <td>{cred.description}</td>
          <td>{cred.createdAt}</td>
          <td>{cred.apiKey}</td>
          <td>{cred.iv}</td>
          <td>{cred.encryptionKey}</td>
        </tr>
      ))}
    </tbody>
  </table>
</div>

{/* Card Layout for Mobile */}
<div className='apicredential-card-wrapper'>
  <div className='apicredential-card-container'>
    {credentials.map((cred) => (
      <div key={cred.id} className="apicredential-card">
        <h3>{cred.description}</h3>
        <p><strong>SR.NO:</strong> {cred.id}</p>
        <p><strong>Created At:</strong> {cred.createdAt}</p>
        <p><strong>API Key:</strong> {cred.apiKey}</p>
        <p><strong>IV:</strong> {cred.iv}</p>
        <p><strong>Encryption Key:</strong> {cred.encryptionKey}</p>
      </div>
    ))}
  </div>
</div>
      
    </section>
  );
};

export default Apicredential;