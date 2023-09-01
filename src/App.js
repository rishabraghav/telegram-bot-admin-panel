
import './App.css';
import { useState, useEffect } from 'react';
import LoginButton from './components/LoginButton';
import LogoutButton from './components/LogoutButton';
import Dashboard from './components/Dashboard';
function App() {
  const [user, setUser] = useState(localStorage.getItem('user') || null);

    useEffect(() => {
        // Parse user data from query parameters
        const queryString = window.location.search;
        const urlParams = new URLSearchParams(queryString);
        const userParam = urlParams.get('user');

        if (userParam) {
            const parsedUser = JSON.parse(userParam);
            localStorage.setItem('user', JSON.stringify(parsedUser));
            console.log("parsed: ", parsedUser);
            setUser(parsedUser)
        }

        let storedUser = localStorage.getItem('user')
        if(storedUser) {
          storedUser = JSON.parse(storedUser)
          setUser(storedUser)
        }
    }, []);
  return (
     <div className='flex fixed overflow-scroll h-screen w-screen justify-center items-center text-5xl font-serif max-sm:pb-36 max-sm:mb-96'>
            {user ? (
                <div className='h-screen w-screen flex flex-col'>
                <div className='flex w-full justify-between h-fit bg-white items-center px-2 drop-shadow-md py-2 text-3xl'>
                    <h2 className='text-slate-600'>Welcome, <span className='text-blue-500 font-thin'>{user.displayName}!</span></h2>
                    <LogoutButton setUser={setUser} />
                </div>
                    <Dashboard />
                </div>
            ) : (
                <div className='flex flex-col items-center space-y-8'>
                    <h2>Login to access the admin panel</h2>
                    <LoginButton />
                </div>
            )}
        </div>
  );
}

export default App;
