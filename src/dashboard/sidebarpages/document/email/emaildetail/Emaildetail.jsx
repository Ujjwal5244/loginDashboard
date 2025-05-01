import React, { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { FiArrowLeft, FiStar, FiTrash2, FiArchive, FiClock, FiTag, FiPrinter, FiMail } from 'react-icons/fi';
import './Emaildetail.css';

const EmailDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [emails, setEmails] = useState([
    { 
      id: 1, 
      subject: 'Welcome to Gmail', 
      sender: 'Google', 
      email: 'no-reply@google.com', 
      body: 'Thanks for signing up to Gmail! We\'re excited to have you on board. You now have access to 15GB of free storage across Gmail, Google Drive, and Google Photos.', 
      date: '10:30 AM, Apr 28, 2024',
      starred: false,
      read: true,
      attachments: []
    },
    { 
      id: 2, 
      subject: 'React Updates - Version 19 Released', 
      sender: 'React Team', 
      email: 'updates@reactjs.org', 
      body: 'New features in React 19 include concurrent rendering by default, automatic batching improvements, and a new JSX transform. The release also includes performance improvements and several deprecations.\n\nKey Changes:\n1. Concurrent Features enabled by default\n2. New React DOM client APIs\n3. Automatic batching for all event handlers\n4. Improved server-side rendering performance\n\nPlease review the migration guide before updating your production applications.', 
      date: '2:15 PM, Apr 27, 2024',
      starred: true,
      read: false,
      attachments: [
        { name: 'React_19_Release_Notes.pdf', size: '2.4MB' },
        { name: 'Migration_Guide.docx', size: '1.1MB' }
      ]
    },
    { 
      id: 3, 
      subject: 'Meeting Reminder: Quarterly Planning', 
      sender: 'HR Team', 
      email: 'hr@company.com', 
      body: 'Don\'t forget the 3 PM meeting today in Conference Room B. We\'ll be discussing Q3 goals and resource allocation. Please bring your department reports.\n\nAgenda:\n1. Q2 Performance Review (15 mins)\n2. Q3 Objectives (30 mins)\n3. Resource Allocation (30 mins)\n4. Open Discussion (15 mins)', 
      date: '9:00 AM, Apr 25, 2024',
      starred: false,
      read: true,
      attachments: [
        { name: 'Q3_Planning_Deck.pptx', size: '5.7MB' }
      ]
    },
  ]);
  
  const email = emails.find(e => e.id === parseInt(id));

  if (!email) return <div className="email-not-found">Email not found</div>;

  const toggleStar = () => {
    setEmails(emails.map(e => 
      e.id === parseInt(id) ? { ...e, starred: !e.starred } : e
    ));
  };

  const markAsUnread = () => {
    setEmails(emails.map(e => 
      e.id === parseInt(id) ? { ...e, read: false } : e
    ));
    navigate('/Maindashboard/Email');
  };

  const moveToTrash = () => {
    setEmails(emails.map(e => 
      e.id === parseInt(id) ? { ...e, folder: 'trash' } : e
    ));
    navigate('/Maindashboard/Email/trash'); // Add this line
  };


  const downloadAttachment = (attachmentName) => {
    // Simulate download
    console.log(`Downloading ${attachmentName}`);
    alert(`Downloading ${attachmentName}`);
  };

  const handleReply = (type) => {
    // In a real app, this would open a compose window
    alert(`Opening ${type} window for email ${id}`);
  };

  return (
    <div className="email-detail-container">
      {/* Email Toolbar */}
      <div className="email-toolbar">
        <button className="toolbar-back-button" onClick={() => navigate('/Maindashboard/Email')}>
          <FiArrowLeft /> Back
        </button>
        
        <div className="toolbar-actions">
          <button className="toolbar-button">
            <FiArchive /> Archive
          </button>
          <button className="toolbar-button" onClick={moveToTrash}>
          <FiTrash2 style={{ color: "red" }} />
          Trash
          </button>
          <button className="toolbar-button" onClick={markAsUnread}>
            <FiMail /> Mark as Unread
          </button>
          <button 
            className={`toolbar-button ${email.starred ? 'starred' : ''}`}
            onClick={toggleStar}
          >
            <FiStar /> {email.starred ? 'Starred' : 'Star'}
          </button>
          <button className="toolbar-button">
            <FiClock /> Snooze
          </button>
          <button className="toolbar-button">
            <FiTag /> Labels
          </button>
          <button className="toolbar-button" onClick={() => window.print()}>
            <FiPrinter /> Print
          </button>
        </div>
      </div>

      {/* Email Content */}
      <div className="email-content">
        <div className="email-header">
          <h1>{email.subject}</h1>
          
          <div className="sender-info">
            <div className="sender-avatar">
              {email.sender.charAt(0).toUpperCase()}
            </div>
            <div className="sender-details">
              <div className="sender-name">{email.sender}</div>
              <div className="sender-email">{email.email}</div>
              <div className="email-date">{email.date}</div>
            </div>
          </div>
        </div>

        <div className="email-body">
          {email.body.split('\n').map((paragraph, i) => (
            <p key={i}>{paragraph}</p>
          ))}
        </div>

        {/* Attachments */}
        {email.attachments.length > 0 && (
          <div className="email-attachments">
            <h3>Attachments ({email.attachments.length})</h3>
            <div className="attachments-list">
              {email.attachments.map((file, index) => (
                <div key={index} className="attachment-item">
                  <div className="attachment-icon">
                    {file.name.endsWith('.pdf') ? '📄' : 
                     file.name.endsWith('.docx') ? '📝' : 
                     file.name.endsWith('.pptx') ? '📊' : '📎'}
                  </div>
                  <div className="attachment-info">
                    <div className="attachment-name">{file.name}</div>
                    <div className="attachment-size">{file.size}</div>
                  </div>
                  <button 
                    className="download-button"
                    onClick={() => downloadAttachment(file.name)}
                  >
                    Download
                  </button>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Reply Options */}
        <div className="email-reply">
          <button className="reply-button" onClick={() => handleReply('reply')}>
            Reply
          </button>
          <button className="reply-button" onClick={() => handleReply('reply-all')}>
            Reply All
          </button>
          <button className="reply-button" onClick={() => handleReply('forward')}>
            Forward
          </button>
        </div>
      </div>
    </div>
  );
};

export default EmailDetail;