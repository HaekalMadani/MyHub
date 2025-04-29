import { useState } from 'react';
import { useGoogleLogin, GoogleOAuthProvider } from '@react-oauth/google';
import axios from 'axios';

const Spending = () => {
  const [spending, setSpending] = useState(null);

  const login = useGoogleLogin({
    onSuccess: async tokenResponse => {
      const accessToken = tokenResponse.access_token;
      const res = await axios.post('http://localhost:4000/scan-emails', { token: accessToken });
      setSpending(res.data);
    },
    onError: () => console.log('Login Failed'),
    scope: 'https://www.googleapis.com/auth/gmail.readonly',
    flow: 'implicit', // important for frontend-only
  });

  return (
    <div>
      <h1>Spending Tracker</h1>
      <button onClick={() => login()}>
        Login with Google
      </button>

      {spending && (
        <div>
          <h2>Daily Spending</h2>
          <ul>
            {Object.entries(spending).map(([date, amount]) => (
              <li key={date}>{date}: ¥{amount}</li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
};

export default Spending;
