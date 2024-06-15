import React, { useState } from 'react';
import './App.css'; 
import LoginComponent from './components/LoginComponent';
import AccountSettings from './components/AccountSettings';
import ErrorMessage from './components/ErrorMessage';
import LogoutButton from './components/LogoutButton';

function App() {
  const [currentUser, setCurrentUser] = useState(null);
  const [errorMessage, setErrorMessage] = useState('');

  const handleLogin = (user) => {
    setCurrentUser(user);
    setErrorMessage('');
  };

  const handleLogout = () => {
    setCurrentUser(null);
    console.log('User logged out');
  };

  const handleError = (message) => {
    setErrorMessage(message);
  };

  console.log('App rendered');
  console.log('currentUser:', currentUser);

  return (
    <div className="App">
      {!currentUser && (
        <LoginComponent onLogin={handleLogin} onError={handleError} />
      )}
      {currentUser && (
        <>
          <AccountSettings user={currentUser} onLogout={handleLogout} />
          <LogoutButton onLogout={handleLogout} />
        </>
      )}
      {errorMessage && <ErrorMessage message={errorMessage} />}
    </div>
  );
}

export default App;
