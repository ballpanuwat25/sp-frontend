import React from 'react';

const Alert = ({ message, onClose }) => {
  return (
    <div className="alert-container">
      <div className="alert alert-danger d-flex justify-content-between align-items-center gap-3 fixed-top thai--font">
        <div>{message}</div>
        <button onClick={onClose}><i class="fa-solid fa-x"></i></button>
      </div>
    </div>
  );
};

export default Alert;
