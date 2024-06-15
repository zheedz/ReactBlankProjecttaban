import React, { useState } from 'react';
import accounts from '../backend/accounts.json'; 
import '../App.css'; 

const LoginComponent = ({ onLogin }) => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [errorMessage, setErrorMessage] = useState('');

  const handleUsernameChange = (event) => {
    setUsername(event.target.value);
  };

  const handlePasswordChange = (event) => {
    setPassword(event.target.value);
  };

  const handleSubmit = (event) => {
    event.preventDefault();

   if (!username || !password) {
      setErrorMessage('Please enter both username and password.');
      return;
    }

    const matchingAccount = accounts.find(
      (account) => account.username === username && account.password === password
    );

    if (matchingAccount) {
      onLogin(matchingAccount);
      setErrorMessage(''); 
    } else {
      
      const usernameExists = accounts.some(account => account.username === username);
      if (usernameExists) {
        setErrorMessage('Account exists, Incorrect Password.');
      } else {
        setErrorMessage('Account does not exist, Incorrect password.');
        
      }
    }
  };

  return (
    <div className="container">
      <div className="card">
        <div className="form">
          <div className="input-group">
            <label htmlFor="username" className="input-label">Username:</label>
            <input
              type="text"
              id="username"
              value={username}
              onChange={handleUsernameChange}
              className="input-box"
              placeholder="Enter your username"
              
            />
             {errorMessage && <p className="error-message text-center">{errorMessage}</p>}
          </div>
          <div className="input-group">
            <label htmlFor="password" className="input-label">Password:</label>
            <input
              type="password"
              id="password"
              value={password}
              onChange={handlePasswordChange}
              className="input-box"
              placeholder="Enter your password"
            />
             {errorMessage && <p className="error-message text-center">{errorMessage}</p>}
          </div>
          <button type="submit" className="btn" onClick={handleSubmit}>Login</button>
        </div>
        
      </div>
    </div>
  );
};

export default LoginComponent;
