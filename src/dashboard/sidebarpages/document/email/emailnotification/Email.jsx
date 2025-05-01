import React, { useState } from 'react';
import { useNavigate, useOutletContext } from 'react-router-dom';
import { FiSearch, FiStar, FiTrash2 } from 'react-icons/fi';
import './Email.css';

const Email = () => {
  const [search, setSearch] = useState('');
  const [emails, setEmails] = useState([
    {
      id: 1,
      subject: 'Welcome to Gmail',
      sender: 'Google',
      body: 'Thanks for signing up to Gmail! We\'re excited to have you on board. You now have access to 15GB of free storage across Gmail, Google Drive, and Google Photos.',
      date: '10:30 AM',
      read: true,
      starred: false,
      folder: 'inbox'
    },
    {
      id: 2,
      subject: 'React Updates - Version 19 Released',
      sender: 'React Team',
      body: 'New features in React 19 include concurrent rendering by default, automatic batching improvements, and a new JSX transform.',
      date: 'Yesterday',
      read: false,
      starred: true,
      folder: 'inbox'
    },
    {
      id: 3,
      subject: 'Meeting Reminder: Quarterly Planning',
      sender: 'HR Team',
      body: 'Don\'t forget the 3 PM meeting today in Conference Room B.',
      date: 'Apr 25',
      read: true,
      starred: false,
      folder: 'inbox'
    },
    {
      id: 4,
      subject: 'Your subscription is expiring soon',
      sender: 'Netflix',
      body: 'Your premium subscription will renew on May 15.',
      date: 'Apr 24',
      read: false,
      starred: false,
      folder: 'inbox'
    },
    {
      id: 5,
      subject: 'Invoice #12345 for your recent purchase',
      sender: 'Amazon',
      body: 'Thank you for your order! Your invoice for $49.99 is attached.',
      date: 'Apr 22',
      read: true,
      starred: true,
      folder: 'inbox'
    },
  ]);

  const navigate = useNavigate();

  const filteredEmails = emails.filter(email =>
    (email.subject.toLowerCase().includes(search.toLowerCase()) ||
     email.sender.toLowerCase().includes(search.toLowerCase()))
    && email.folder === 'inbox'
  );

  const toggleStar = (emailId, e) => {
    e.stopPropagation();
    setEmails(emails.map(email =>
      email.id === emailId ? { ...email, starred: !email.starred } : email
    ));
  };

  const markAsRead = (emailId) => {
    setEmails(emails.map(email =>
      email.id === emailId ? { ...email, read: true } : email
    ));
    navigate(`/Maindashboard/Email/${emailId}`);
  };

  const moveToTrash = (emailId, e) => {
    e.stopPropagation();
    setEmails(emails.map(email =>
      email.id === emailId ? { ...email, folder: 'trash' } : email
    ));
  };

  return (
    <div className="email-content">
      <div className="email-header">
        <h2>Inbox</h2>
        <div className="search-box">
          <FiSearch className="search-icon" />
          <input
            type="text"
            placeholder="Search emails..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="search-input"
          />
        </div>
      </div>

      <div className="email-list">
        {filteredEmails.length > 0 ? (
          filteredEmails.map(email => (
            <div
              key={email.id}
              className={`email-item ${!email.read ? 'unread' : ''}`}
              onClick={() => markAsRead(email.id)}
            >
              <div className="email-item-left">
                <button
                  className={`star-button ${email.starred ? 'starred' : ''}`}
                  onClick={(e) => toggleStar(email.id, e)}
                >
                  <FiStar />
                </button>
                <span className="sender">{email.sender}</span>
              </div>
              <div className="email-item-middle">
                <span className="subject">{email.subject}</span>
                <span className="preview"> - {email.body.substring(0, 60)}...</span>
              </div>
              <div className="email-item-right">
                <span className="date">{email.date}</span>
                <button
                  className="trash-button"
                  onClick={(e) => {
                    e.stopPropagation();
                    moveToTrash(email.id);
                  }}
                >
                  <FiTrash2 />
                </button>
              </div>
            </div>
          ))
        ) : (
          <div className="no-results">No emails found.</div>
        )}
      </div>
    </div>
  );
};

export default Email;
