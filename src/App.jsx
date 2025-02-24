import { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import {  getCurrentUser } from '@aws-amplify/auth';
import Login from './pages/Login';
import SignUp from './pages/SignUp';
import Joingroup from './pages/Joingroup';
import Dashboard from './pages/Dashboard';

const App = () => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [userGroup, setUserGroup] = useState(null);

  useEffect(() => {
    const checkAuthState = async () => {
      try {
        const currentUser = await getCurrentUser();
        setUser(currentUser);
        
        // Fetch user group
        const groupResponse = await fetch('/api/user/group', {
          headers: {
            Authorization: `Bearer ${(await Auth.currentSession()).getIdToken().getJwtToken()}`
          }
        });
        if (groupResponse.ok) {
          const groupData = await groupResponse.json();
          setUserGroup(groupData);
        }
      } catch (error) {
        console.log('User is not signed in');
      } finally {
        setLoading(false);
      }
    };

    checkAuthState();
  }, []);

  if (loading) {
    return <div className="flex items-center justify-center min-h-screen">Loading...</div>;
  }

  return (
    <Router>
      <Routes>
        {/* Redirect logged-in users directly to dashboard */}
        <Route path="/" element={user ? <Navigate to="/dashboard" /> : <Login setUser={setUser} />} />
        <Route path="/signup" element={user ? <Navigate to="/dashboard" /> : <SignUp setUser={setUser} />} />
        
        {/* Protected routes */}
        <Route path="/group" element={user ? <Joingroup /> : <Navigate to="/" />} />
        <Route path="/dashboard" element={user ? <Dashboard /> : <Navigate to="/" />} />
      </Routes>
    </Router>
  );
};

export default App;
