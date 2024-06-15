import React from 'react';
import '../App.css';

const LogoutButton = ({ onLogout }) => {
  const handleLogout = () => {
    console.log('Logout button clicked');
    onLogout();
  };

  return (
    
    <button className="btn btn-logout" hidden onClick={handleLogout}>
  Logout
</button>
  );
};

export default LogoutButton;
