import { useState } from 'react';
import { confirmSignUp, resendSignUpCode } from '@aws-amplify/auth';
import { generateClient } from '@aws-amplify/api';
import * as mutations from '../graphql/mutations'

const client = generateClient();

const VerificationModal = ({ email,name, onClose, onVerified }) => {
  const [code, setCode] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [username, setUsername] = useState('');

  const handleConfirm = async () => {
    setUsername(email)
    setError('');
    setLoading(true);
    
    try {
      console.log(username,code)
      await confirmSignUp({
        username,
        confirmationCode: code
      });
      const newUser = {
        input: {
          id: email, // Use email as ID or fetch Cognito user ID if needed
          name: name || "New User", // Use provided name or a default
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
