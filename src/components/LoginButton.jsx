
import React from 'react';
import '../App.css';

const LoginButton = () => {
  const handleLogin = () => {
    console.log('Login button clicked');
  };

  return (
    <div className="text-left">
      <button className="btn" onClick={handleLogin}>Login</button>
    </div>
  );
};

export default LoginButton;
