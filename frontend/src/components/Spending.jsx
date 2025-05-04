import { useState } from 'react';
import { useGoogleLogin, GoogleOAuthProvider } from '@react-oauth/google';
import axios from 'axios';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';


const Spending = () => {
  const [spending, setSpending] = useState(null);
  const [loggedIn, setLoggedIn] = useState(false);
  const [loading, setLoading] = useState(false);
  const spendingData = spending ? Object.entries(spending).map(([date, amount]) => ({ date, amount })) : [];
  
  const login = useGoogleLogin({
    onSuccess: async tokenResponse => {
      try{
      const accessToken = tokenResponse.access_token;
      setLoading(true);
      const res = await axios.post('http://localhost:4000/scan-emails', { token: accessToken });
      setSpending(res.data);
      setLoggedIn(true);
      }
      catch (error) {
        console.error('Error fetching spending data:', error);
      } finally {
        setLoading(false);
      }
    },

    onError: () => console.log('Login Failed'),
    scope: 'https://www.googleapis.com/auth/gmail.readonly',
    flow: 'implicit', // for better compatibility
  });

  return (
    <div>
      <h1>Spending Tracker</h1>

      {!loggedIn && (
      <button className="google-button" onClick={() => login()} disabled={loading}>
      <img
      src="https://developers.google.com/identity/images/g-logo.png"
      alt="Google"
      className="google-icon"
      />
      <span>{loading ? 'Logging in...' : 'Sign in with Google'}</span>
       </button>
)}



      {loading && 
        <>
          <span className="spinner"></span>  Retrieving Data...
        </>}
      {spending && !loading && (
        <div>
          <h2>Daily Spending</h2> 
          <ResponsiveContainer width='100%' height={300}>
            <LineChart data={spendingData}>
              <XAxis dataKey="date" reversed={true} />
              <YAxis />
              <Tooltip content={<CustomToolTip />} />
              <Line type="monotone" dataKey="amount" stroke="hsl(240, 80%, 80%)" strokeWidth={2} />
            </LineChart>
          </ResponsiveContainer>
          <div className='spending-details'>
            <div className="total-spending">
            <p className='detail-title'>Total Monthly Spending:</p>
            <p className='detail-data'>
            ¥{Object.entries(spending).filter(([date, _]) => {
                const day = parseInt(date.split('-')[2], 10);
                return day >= 15;
                })
                .reduce((acc, [_, amount]) => acc + amount, 0)
              }
</p>

          </div>
          <div className="average-spending">
            <p className='detail-title'>Average Spending: </p>
            <p className='detail-data'>¥{(() => {
                const entries = Object.entries(spending).filter(([date]) => parseInt(date.split('-')[2], 10) >= 15);
                const total = entries.reduce((acc, [, amount]) => acc + amount, 0);
                return entries.length > 0 ? Math.round(total / entries.length) : 0;
              })()
  }
</p>
          </div>
          </div>

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

const CustomToolTip = ({ active, payload }) => {
  if (active && payload && payload.length) {
    return (
      <div className="custom-tooltip">
        <p className='spent'>{`Amount: `}</p>
        <p className='data1'>{`¥${payload[0].value}`}</p>
        <p className='date'>{`Date:`}</p>
        <p className='data2'>{` ${payload[0].payload.date}`}</p>
      </div>
    );
  }
  return null;
};

export default Spending;
