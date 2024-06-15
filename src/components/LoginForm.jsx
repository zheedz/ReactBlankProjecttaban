import React from 'react';
import '../App';


const LoginForm = () => {
  return (
    <div className="form">
      <div className="input-group">
        <label htmlFor="username" className="input-label">Username:</label>
        <input type="text" name="username" id="username" className="input-box" placeholder="Username" />
      </div>
      <div className="input-group">
        <label htmlFor="password" className="input-label">Password:</label>
        <input type="password" name="password" id="password" className="input-box" placeholder="Password" />
      </div>
    </div>
  );
};

export default LoginForm;
