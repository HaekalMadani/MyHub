import { useEffect, useState } from 'react';
import axios from 'axios';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';

const Spending = () => {
  const [spending, setSpending] = useState(null);
  const [loading, setLoading] = useState(true);
  const [isExpanded, setIsExpanded] = useState(false);

  const toggledetails = () => {
    setIsExpanded(prev => !prev);
  }

  useEffect(() => {
    axios.get('http://localhost:4000/api/spending', { withCredentials: true })
      .then(res => {
        // If Gmail not linked, backend should return a 401 or empty object
        if (Object.keys(res.data).length === 0) {
          setSpending(null); // Treat as unlinked or no data
        } else {
          setSpending(res.data);
        }
      })
      .catch(err => {
        console.error('Error fetching spending data:', err);
        setSpending(null);
      })
      .finally(() => setLoading(false));
  }, []);

  const spendingData = spending ? Object.entries(spending).map(([date, amount]) => ({ date, amount })) : [];

  const handleLinkGoogle = () => {
    // Redirect to your backend's Google OAuth endpoint
    window.location.href = 'http://localhost:4000/api/auth/google';
  };

  const handleUnlinkGoogle = () => {
    // Call your backend to unlink the Google account
    axios.post('http://localhost:4000/api/auth/unlink-google', {}, { withCredentials: true })
      .then(res => {
        if (res.data.success) {
          setSpending(null); // Clear spending data on unlink
        } else {
          console.error('Error unlinking Google account(1):', res.data.message);
        }
      })
      .catch(err => {
        console.error('Error unlinking Google account(2):', err);
      });
  }

  return (
    <div className='spending-container'>
      {loading && <><span className="spinner"></span> Retrieving Data...</>}

      {!loading && spending === null && (
        <div>
          <p>No spending data found.</p>
          <button onClick={handleLinkGoogle} className="link-google-btn">Link Google Account</button>
        </div>
      )}

      {spending && (
        <>
          <div className="spend-chart">
            <h2>Daily Spending</h2>
            <ResponsiveContainer width='100%' height={300}>
              <LineChart data={spendingData}>
                <XAxis dataKey="date" reversed={true} />
                <YAxis />
                <Tooltip content={<CustomToolTip />} />
                <Line type="monotone" dataKey="amount" stroke="hsl(240, 80%, 80%)" strokeWidth={2} />
              </LineChart>
            </ResponsiveContainer>
          </div>
          
          <div className='spending-details'>

            <div className="lastMonth-total">
              <p className='detail-title'>Total Spending Last Month:</p>
              <p className='detail-data'>
                ¥{(() => {
                  const today = new Date();
                  const lastMonth = new Date(today.getFullYear(), today.getMonth() - 1, 1);
                  const startDate = new Date(lastMonth.getFullYear(), lastMonth.getMonth(), 1);
                  const endDate = new Date(lastMonth.getFullYear(), lastMonth.getMonth() + 1, 0);

                  return Object.entries(spending).reduce((acc, [dateStr, amount]) => {
                    const date = new Date(dateStr);
                    if (date >= startDate && date <= endDate) {
                      return acc + amount;
                    }
                    return acc;
                  }, 0);
                })()}
              </p>
            </div>

            <div className="total-spending">
            <p className='detail-title'>Total Spending This Month:</p>
            <p className='detail-data'>
            ¥{(() => {
              const today = new Date();
              const year = today.getFullYear();
              const month = today.getMonth(); 
              const startDate = today.getDate() >= 15
                ? new Date(year, month, 15)
                : new Date(year, month - 1, 15);
              const endDate = new Date(startDate.getFullYear(), startDate.getMonth() + 1, 15);

              return Object.entries(spending).reduce((acc, [dateStr, amount]) => {
                const date = new Date(dateStr);
                if (date >= startDate && date < endDate) {
                  return acc + amount;
                }
                return acc;
              }, 0);
            })()}
            </p>
            </div>


            <div className="average-spending">
              <p className='detail-title'>Average Spending: </p>
              <p className='detail-data'>¥{(() => {
                const entries = Object.entries(spending).filter(([date]) => parseInt(date.split('-')[2], 10) >= 15);
                const total = entries.reduce((acc, [, amount]) => acc + amount, 0);
                return entries.length > 0 ? Math.round(total / entries.length) : 0;
              })()}</p>
            </div>
          </div>
          
          <div className="details">
            <button onClick={toggledetails} className='more-details'>
            {isExpanded ? 'Hide Details' : 'Show Details'}
          </button>

          {isExpanded && (
            <div className="">
            <ul>
              {Object.entries(spending).map(([date, amount]) => (
                <li key={date}>{date}: ¥{amount}</li>
              ))}
            </ul>
            </div>
          )}
          </div>
          
          <div className="unlink-google">
            <button onClick={handleUnlinkGoogle} className="link-google-btn">Unlink Google Account</button>
          </div>
          
        </>
      )}
    </div>
  );
};

const CustomToolTip = ({ active, payload }) => {
  if (active && payload && payload.length) {
    return (
      <div className="custom-tooltip">
        <p className='spent'>Amount:</p>
        <p className='data1'>¥{payload[0].value}</p>
        <p className='date'>Date:</p>
        <p className='data2'>{payload[0].payload.date}</p>
      </div>
    );
  }
  return null;
};

export default Spending;
