import React from 'react';

const LoginButton = () => {
    return (
        <a href="http://localhost:3000/auth/google" className='border active:opacity-50 flex items-center rounded-md font-medium text-base w-fit pl-1 py-1 px-2 text-white bg-blue-500'>
        <img className='mr-8 rounded-md bg-white' width="48" height="48" src="https://img.icons8.com/color/48/google-logo.png" alt="google-logo"/>
        Login with Google
        </a>
    );
};

export default LoginButton;