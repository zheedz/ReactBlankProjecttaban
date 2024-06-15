import React, { useState, useEffect } from 'react';
import axios from 'axios';
import '../App.css';

function AccountSettings({ user, onLogout }) {
  const [newUsername, setNewUsername] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [errorMessage, setErrorMessage] = useState('');
  const [passwordErrorMessage, setPasswordErrorMessage] = useState('');
  const [updateButtonDisabled, setUpdateButtonDisabled] = useState(true);
  const [usernameErrorMessage, setUsernameErrorMessage] = useState('');
  const [usernameAvailabilityMessage, setUsernameAvailabilityMessage] = useState('');

  const validatePassword = (password) => {
    const minLength = 8;
    const hasUppercase = /[A-Z]/.test(password);
    const hasLowercase = /[a-z]/.test(password);
    const hasNumber = /\d/.test(password);
    const hasSymbol = /[!@#$%^&*(),.?":{}|<>]/.test(password);

    if (password.length < minLength) {
      return 'Password must be at least 8 characters long.';
    }
    if (!hasUppercase) {
      return 'Password must contain at least one uppercase letter.';
    }
    if (!hasLowercase) {
      return 'Password must contain at least one lowercase letter.';
    }
    if (!hasNumber) {
      return 'Password must contain at least one number.';
    }
    if (!hasSymbol) {
      return 'Password must contain at least one symbol.';
    }
    return '';
  };

  const checkUsernameAvailability = async (username) => {
    try {
      const response = await axios.get(`http://localhost:8080/api/checkUsername`, {
        params: { username }
      });
  
      // Handle response based on status
      if (response.status === 200) {
        if (response.data.exists) {
          setUsernameAvailabilityMessage('Username already exists. Please use a different username.');
        } else {
          setUsernameAvailabilityMessage('Username available!');
        }
      } else {
        
      }
    } catch (error) {
      
      setUsernameAvailabilityMessage('');
    }
  };
  
  
  
  


const handleUpdateDetails = async () => {
  // Check if either new username or password is provided
  if (!newUsername.trim() && !newPassword.trim()) {
    setErrorMessage('Please enter a new username or password.');
    return;
  }

  // Validate if the new username is different from the current one
  if (newUsername === user.username) {
    setUsernameErrorMessage('New username must be different from the current one.');
    return;
  } else {
    setUsernameErrorMessage('');
  }

  // Check username availability
  await checkUsernameAvailability(newUsername);

  // If the username is not available, return without further action
  if (usernameAvailabilityMessage) {
    return;
  }

  // Optional: Validate new password if provided
  if (newPassword) {
    const passwordError = validatePassword(newPassword);
    if (passwordError) {
      setPasswordErrorMessage(passwordError);
      return;
    } else {
      setPasswordErrorMessage('');
    }
  }

  try {
    // Update account details using the API
    const response = await axios.post('http://localhost:8080/api/updateAccounts', {
      username: user.username,
      newUsername: newUsername || undefined,
      newPassword: newPassword || undefined
    });

    // Handle successful update
    setErrorMessage('');
    setPasswordErrorMessage('');
    setUsernameErrorMessage('');
    setUsernameAvailabilityMessage('');
    setNewUsername('');
    setNewPassword('');
    alert('Details updated successfully!');
  } catch (error) {
    // Handle API request errors
    console.error('Error updating accounts:', error);
    setErrorMessage('Failed to update account');
  }
};

  const handleLogout = () => {
    if (typeof onLogout === 'function') {
      onLogout();
    }
  };

  const handleUsernameChange = (e) => {
    const { value } = e.target;
    setNewUsername(value);
    setUsernameErrorMessage('');
    setUsernameAvailabilityMessage('');
    if (value.trim()) {
      checkUsernameAvailability(value);
    }
  };

  useEffect(() => {
    validateAndUpdateButton();
  }, [newUsername, newPassword, passwordErrorMessage, usernameErrorMessage, usernameAvailabilityMessage]);

  const validateAndUpdateButton = () => {
    if ((newUsername.trim() || newPassword.trim()) && !passwordErrorMessage && !usernameErrorMessage && !usernameAvailabilityMessage) {
      setUpdateButtonDisabled(false);
    } else {
      setUpdateButtonDisabled(true);
    }
  };

  return (
    <div className="container">
      <div className="card">
        <div className="form">
          <h2 className="text-center">Hi {user.username},</h2>
          <div className="input-group">
            <label htmlFor="newUsername" className="input-label">New Username:</label>
            <input
              type="text"
              id="newUsername"
              value={newUsername}
              onChange={(e) => {
                setNewUsername(e.target.value);
                setUsernameErrorMessage('');
                setUsernameAvailabilityMessage('');
              }}
              onBlur={(e) => {
                if (e.target.value.trim()) {
                  checkUsernameAvailability(e.target.value);
                }
              }}
              className="input-box"
              placeholder="Enter new username (optional)"
            />
          </div>
          {usernameErrorMessage && <p className="error-message text-center">{usernameErrorMessage}</p>}
          {usernameAvailabilityMessage && <p className="error-message text-center">{usernameAvailabilityMessage}</p>}
          <div className="input-group">
            <label htmlFor="newPassword" className="input-label">New Password:</label>
            <input
              type="password"
              id="newPassword"
              value={newPassword}
              onChange={(e) => {
                setNewPassword(e.target.value);
                setPasswordErrorMessage(''); // Clear password error message on input change
              }}
              className="input-box"
              placeholder="Enter new password (optional)"
            />
          </div>
          {passwordErrorMessage && <p className="error-message text-center">{passwordErrorMessage}</p>}
          <button className="btn btn-update" onClick={handleUpdateDetails} disabled={updateButtonDisabled}>
            Update Details
          </button>
          <button className="btn btn-logout" onClick={handleLogout}>
            Logout
          </button>
          {errorMessage && <p className="error-message text-center">{errorMessage}</p>}
        </div>
      </div>
    </div>
  );
}

export default AccountSettings;
