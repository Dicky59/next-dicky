'use client';

import { useState } from 'react';
import Notification from './Notification';

const NotificationExample = () => {
  const [notification, setNotification] = useState({
    show: false,
    message: '',
    type: 'success'
  });

  const showNotification = (message, type = 'success') => {
    setNotification({
      show: true,
      message,
      type
    });
  };

  return (
    <div className="p-6 space-y-4">
      <h2 className="text-xl font-semibold">Notification Examples</h2>
      
      <div className="space-y-2">
        <button
          onClick={() => showNotification('Success message!', 'success')}
          className="px-4 py-2 bg-green-500 text-white rounded hover:bg-green-600"
        >
          Show Success
        </button>
        
        <button
          onClick={() => showNotification('Error message!', 'error')}
          className="px-4 py-2 bg-red-500 text-white rounded hover:bg-red-600 ml-2"
        >
          Show Error
        </button>
        
        <button
          onClick={() => showNotification('Warning message!', 'warning')}
          className="px-4 py-2 bg-yellow-500 text-white rounded hover:bg-yellow-600 ml-2"
        >
          Show Warning
        </button>
        
        <button
          onClick={() => showNotification('Info message!', 'info')}
          className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600 ml-2"
        >
          Show Info
        </button>
      </div>

      <Notification
        isVisible={notification.show}
        message={notification.message}
        type={notification.type}
        onClose={() => setNotification(prev => ({ ...prev, show: false }))}
      />
    </div>
  );
};

export default NotificationExample;
