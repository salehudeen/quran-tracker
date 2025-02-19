import { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
// import  Auth  from '@aws-amplify/auth';
import Login from './pages/Login';
import SignUp from './pages/SignUp';
import Joingroup from './pages/Joingroup';
import Dashboard from './pages/Dashboard';

const App = () => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [userGroup, setUserGroup] = useState(null);

  useEffect(() => {
    checkAuthState();
  }, []);

  const checkAuthState = async () => {
    try {
      const currentUser = await Auth.currentAuthenticatedUser();
      setUser(currentUser);
      // Check if user has a group - you'll need to implement this API call
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

  if (loading) {
    return <div className="flex items-center justify-center min-h-screen">Loading...</div>;
  }

  return (
    <Router>
      <Routes>
        {/* Public routes */}
        <Route 
          path="/" 
          element={
            !user ? (
              <Login setUser={setUser} />
            ) : (
              <Navigate to={userGroup ? '/dashboard': '/'} />
            )
          } 
        />
        <Route 
          path="/signup" 
          element={
            !user ? (
              <SignUp setUser={setUser} />
            ) : (
              <Navigate to={userGroup ? '/dashboard' : '/'} />
            )
          } 
        />

        {/* Protected routes */}
        <Route 
          path="/group" 
          element={
           <Joingroup />
          } 
        />
         <Route 
          path="/dashboard" 
          element={
           <Dashboard />
          } 
        />
        

       
        
      </Routes>
    </Router>
  );
};

export default App