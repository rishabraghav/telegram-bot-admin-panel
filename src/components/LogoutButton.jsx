import React from 'react';

const LogoutButton = ({setUser}) => {
    const handleLogout = () => {
        // Remove user data from state and localStorage
        setUser(null);
        localStorage.removeItem('user');
      };
    return (
        <a onClick={handleLogout} className='border active:opacity-50 flex items-center rounded-md h-fit font-medium text-base w-fit pl-1 py-1 px-2 text-white bg-blue-500'  href="http://localhost:3000/auth/logout">
        Logout</a>
    );
};

export default LogoutButton;