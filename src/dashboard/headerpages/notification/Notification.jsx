import React, { useState } from "react";

const Notification = () => {
  // Sample notifications data
  const notificationsData = [
    {
      _id: "6839632b37a3ffdf98b76611",
      user: "681464c1aa406fa11f23d83a",
      from: {
        _id: "6815a820dbddadf487a6ac94",
        name: "Harsh",
        email: "hpnera123@gmail.com",
      },
      subject: "Digital Signature Completed",
      body: "Your digital signature for the agreement is now complete and verified.Your digital signature for the agreement is now complete and verified.Your digital signature for the agreement is now complete and verified.Your digital signature for the agreement is now complete and verified.Your digital signature for the agreement is now complete and verified.Your digital signature for the agreement is now complete and verified.",
      isSeen: "1",
      createdAt: "2025-05-30T07:50:03.341Z",
    },
    {
      "_id": "6839632b37a3ff98b76612",
      "user": "681464c1aa406fa11f23d83a",
      "from": {
        "_id": "6815a820dbddadf487a6ac95",
        "name": "Alice",
        "email": "alice@example.com"
      },
      "subject": "Meeting Reminder",
      "body": "Don't forget about our meeting tomorrow at 10 AM.",
      "isSeen": "0",
      "createdAt": "2025-05-29T14:30:00.000Z"
    },
    {
      "_id": "6839632b37a3ffdf76613",
      "user": "681464c1aa406fa11f23d83a",
      "from": {
        "_id": "6815a820dbddadf487a6ac96",
        "name": "Bob",
        "email": "bob@example.com"
      },
      "subject": "Payment Received",
      "body": "We've received your payment of $250. Thank you!",
      "isSeen": "1",
      "createdAt": "2025-05-28T09:15:45.000Z"
    }
    ,
    {
      "_id": "6839632b37a3ffdb76613",
      "user": "681464c1aa406fa11f23d83a",
      "from": {
        "_id": "6815a820dbddadf487a6ac96",
        "name": "Bob",
        "email": "bob@example.com"
      },
      "subject": "Payment Received",
      "body": "We've received your payment of $250. Thank you!",
      "isSeen": "1",
      "createdAt": "2025-05-28T09:15:45.000Z"
    }
    ,
    {
      "_id": "6839632b37a3ffdf976613",
      "user": "681464c1aa406fa11f23d83a",
      "from": {
        "_id": "6815a820dbddadf487a6ac96",
        "name": "Bob",
        "email": "bob@example.com"
      },
      "subject": "Payment Received",
      "body": "We've received your payment of $250. Thank you!",
      "isSeen": "1",
      "createdAt": "2025-05-28T09:15:45.000Z"
    }
    ,
    {
      "_id": "6839632b37a3ffdf98b7663",
      "user": "681464c1aa406fa11f23d83a",
      "from": {
        "_id": "6815a820dbddadf487a6ac96",
        "name": "Bob",
        "email": "bob@example.com"
      },
      "subject": "Payment Received",
      "body": "We've received your payment of $250. Thank you!",
      "isSeen": "1",
      "createdAt": "2025-05-28T09:15:45.000Z"
    }
  ];

  const [searchTerm, setSearchTerm] = useState("");
  const [expandedId, setExpandedId] = useState(null); // track which notification is expanded

  // Filter notifications based on search term
  const filteredNotifications = notificationsData.filter((notification) => {
    const searchLower = searchTerm.toLowerCase();
    return (
      notification.from.name.toLowerCase().includes(searchLower) ||
      notification.subject.toLowerCase().includes(searchLower) ||
      notification.body.toLowerCase().includes(searchLower)
    );
  });

  // Format the date
  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleString("en-US", {
      month: "short",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  const toggleExpand = (id) => {
    setExpandedId(expandedId === id ? null : id);
  };

  return (
    <div className="max-w-md mx-auto bg-white rounded-xl shadow-md overflow-hidden md:max-w-2xl">
      <div className="p-4 border-b bg-white sticky top-0 z-10">
        <input
          type="text"
          placeholder="Search notifications..."
          className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />
      </div>

      <div className="divide-y overflow-y-auto" style={{ maxHeight: 'calc(100vh - 120px)' }}>
        {filteredNotifications.length > 0 ? (
          filteredNotifications.map(notification => (
            <div key={notification._id} className="p-4 hover:bg-gray-50">
              <div className="flex justify-between items-start">
                <div className="flex space-x-3">
                  <div className="flex-shrink-0 h-8 w-8 mt-1 rounded-full bg-blue-500 flex items-center justify-center text-white font-bold">
                    {notification.from.name.charAt(0)}
                  </div>
                  <div>
                    <h3 className="text-sm font-semibold text-gray-900">{notification.subject}</h3>
                    <p className="text-sm text-gray-500">From: {notification.from.name}</p>
                  </div>
                </div>
                <span className="text-xs text-gray-400">{formatDate(notification.createdAt)}</span>
              </div>

              <div className="mt-4">
                <p className="text-gray-700">
                  {expandedId === notification._id
                    ? notification.body
                    : `${notification.body.slice(0, 100)}...`}
                </p>
              </div>

              <div className="mt-4 flex justify-between items-center">
                <span className={`px-2 py-1 text-xs rounded-full ${notification.isSeen === "1" ? 'bg-green-100 text-green-800' : 'bg-blue-100 text-blue-800'}`}>
                  {notification.isSeen === "1" ? 'Read' : 'Unread'}
                </span>
                <button
                  onClick={() => toggleExpand(notification._id)}
                  className="text-blue-600 hover:text-blue-800 text-sm font-medium"
                >
                  {expandedId === notification._id ? "Hide Details" : "View Details"}
                </button>
              </div>
            </div>
          ))
        ) : (
          <div className="p-4 text-center text-gray-500">
            No notifications found matching your search.
          </div>
        )}
      </div>
    </div>
  );
};

export default Notification;
