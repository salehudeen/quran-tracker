import {  useState } from 'react';
import { confirmSignUp, getCurrentUser, resendSignUpCode, signIn, signOut } from '@aws-amplify/auth';
import { generateClient } from '@aws-amplify/api';
import * as mutations from '../graphql/mutations'
// import { v4  } from 'uuid';
const client = generateClient();

const VerificationModal = ({ name,email,password, onClose, }) => {
         
  const [code, setCode] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  
  const [username, setUsername] = useState('');
  const [userName, setName] = useState('');
  const handleConfirm = async () => {
    setUsername(email)
    setName(name)
    
    setError('');
    setLoading(true);
    
    try {
      signOut()
      await confirmSignUp({
        username:email,
        confirmationCode: code
      });

      await signIn({
        username: email,
        password: password, // You'll need to pass the password from the signup form
      });

      
      const  idUser  = await getCurrentUser();
     

      // const userId = v4();
      
      const newUser = {
        input: {
          id:idUser.userId , // Use email as ID or fetch Cognito user ID if needed
          name: name , // Use provided name or a default
          email: email,
        }
      };
      
      await client.graphql({
        query: mutations.createUser,
        variables: newUser,
      });
      onClose();
     
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };
  
  const handleResend = async () => {
    setError('');
    setLoading(true);
    try {
      await resendSignUpCode(username);
      alert('Verification code resent! Check your email.');
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };
  
  return (
    <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50">
      <div className="bg-white p-6 rounded-lg shadow-lg w-96">
        <h2 className="text-lg font-bold">Verify Your Account</h2>
        <p className="text-sm text-gray-600">Enter the verification code sent to {email}</p>
        {error && <p className="text-red-500 text-sm">{error}</p>}
        <input
          type="text"
          value={code}
          onChange={(e) => setCode(e.target.value)}
          placeholder="Enter code"
          className="w-full p-2 border rounded mt-2"
        />
        <div className="mt-4 flex justify-between">
          <button
            onClick={handleResend}
            disabled={loading}
            className="text-blue-600 hover:underline"
          >
            Resend Code
          </button>
          <div>
            <button onClick={onClose} className="px-4 py-2 mr-2 border rounded">Cancel</button>
            <button
              onClick={handleConfirm}
              disabled={loading}
              className="px-4 py-2 bg-blue-600 text-white rounded"
            >
              {loading ? 'Verifying...' : 'Confirm'}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default VerificationModal;
