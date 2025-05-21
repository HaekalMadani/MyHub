import { useEffect, useState } from 'react';
import axios from 'axios';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, BarChart, Bar } from 'recharts';
import api from '../api';

const Spending = () => {
  const [spending, setSpending] = useState(null);
  const [isExpanded, setIsExpanded] = useState(false);
  const [googleLinked, setGoogleLinked] = useState(false);
  
  const merchantCounts = {};

  const toggledetails = () => {
    setIsExpanded(prev => !prev);
  }

  useEffect(() => {
    api.get('/spending/check')
    .then(res => {
      if(res.data.success){
        setGoogleLinked(true)
      }else{
        setGoogleLinked(false)
      }
    })
    
    .catch(err => {
      console.error('Error checking Google Link @ front', err)
    })

  }, [])

  useEffect(() => {
    fetch('/api/spending', {
      method: 'GET',
      credentials: 'include'
    })

    .then(res => res.json())
    .then(data => {
      console.log('spending data:', data);
      if(data.success === false){
        setSpending(null)
      }else{
        setSpending(data)
      }
    })
    .catch(err => {
      console.error('Error fetching spending:', err);
      setSpending(null)})
  }, []);

  const spendingData = spending ? Object.entries(spending).sort(([a], [b]) => new Date(b) - new Date(a)).map(([date, entries]) => ({ date, amount: entries.reduce((sum, e) => sum + e.amount, 0) })) : [];

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

  if (spending) {
    Object.values(spending).forEach(entries => {
      entries.forEach(({ merchant, amount }) => {
        merchantCounts[merchant] = (merchantCounts[merchant] || 0) + amount;
      });
    });
  }


  const sortedMerchants = Object.entries(merchantCounts)
  .sort((a, b) => b[1] - a[1]);

  const topMerchants = sortedMerchants.slice(0, 5); 

  const merchantChartData = topMerchants.map(([merchant, count]) => ({
  merchant,
  count,
  }));

  return (
    <div className='spending-container'>
      {spending === null && (
        <div>
          <p>No spending data found.</p>
        </div>
      )}
      {googleLinked === false && (
        <div className="">
          <button onClick={handleLinkGoogle} className="link-google-btn">Link Google Account</button>
        </div>
      )}

      {spending && Object.keys(spending).length > 0 && (
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

                  return Object.entries(spending).reduce((acc, [dateStr, entries]) => {
                    const date = new Date(dateStr);
                    if (date >= startDate && date <= endDate) {
                      return acc + entries.reduce((sum, e) => sum + e.amount, 0);
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

              return Object.entries(spending).reduce((acc, [dateStr, entries]) => {
                const date = new Date(dateStr);
                if (date >= startDate && date < endDate) {
                  return acc + entries.reduce((sum, e) => sum + e.amount, 0);
                }
                return acc;
              }, 0);
            })()}
            </p>
            </div>


            <div className="average-spending">
              <p className='detail-title'>Average Spending: </p>
              <p className='detail-data'>¥{(() => {
                const filtered = Object.entries(spending).flatMap(([dateStr, entries]) => {
                  const day = parseInt(dateStr.split('-')[2], 10);
                  if (day >= 15) return entries;
                  return [];
                });

                const total = filtered.reduce((acc, entry) => acc + entry.amount, 0);
                return filtered.length > 0 ? Math.round(total / filtered.length) : 0;
              })()}</p>
            </div>
          </div>
          
          {spending &&  (
            <div className="spend-chart" style={{ width: '100%', height: '40vh' }}>
              <h2>My "investments"</h2>
              <ResponsiveContainer height="90%">
                <BarChart
                  data={merchantChartData}
                  margin={{ top: 20, right: 30, left: 20, bottom: 5 }}
                >
                  <Tooltip content={MerchantToolTip} />
                  <CartesianGrid strokeDasharray="1 1" />
                  <XAxis dataKey="merchant" type="category" />
                  <YAxis type="number" width={150} />
                  <Bar dataKey="count" fill="hsl(240, 80%, 70%)" />
                </BarChart>
              </ResponsiveContainer>
            </div>
          )}

          <div className="details">
            <button onClick={toggledetails} className='more-details'>
            {isExpanded ? 'Hide Details' : 'Show Details'}
          </button>

          {isExpanded && (
            <div className="">
            <ul>
              {Object.entries(spending).sort(([a], [b]) => new Date(b) - new Date(a)).map(([date, entries]) => (
              <li key={date}>
                <strong>{date}</strong>
                <ul>
                  {entries.map((entry, idx) => (
                    <li key={idx}>¥{entry.amount} - {entry.merchant}</li>
                  ))}
                </ul>
              </li>
            ))}
            </ul>
            </div>
          )}
          </div>


          {googleLinked === true && (
            <div className="unlink-google">
            <button onClick={handleUnlinkGoogle} className="link-google-btn">Unlink Google Account</button>
          </div>
          )}
          
          
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

const MerchantToolTip = ({ active, payload }) => {
  if (active && payload && payload.length) {
    return (
      <div className="custom-tooltip">
        <p className='spent'>Total Spent:</p>
        <p className='data1'>¥{payload[0].value}</p>
      </div>
    );
  }
  return null;
};

export default Spending;
