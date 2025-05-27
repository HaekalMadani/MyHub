import { useEffect, useState, useRef, useCallback } from 'react';
import axios from 'axios';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, BarChart, Bar } from 'recharts';
import api from '../api';
import { FaArrowRight } from "react-icons/fa";
import { toast } from "react-toastify";

const Spending = () => {
    const [spending, setSpending] = useState({});
    const [loadingSpending, setLoadingSpending] = useState(true);

    const [isExpanded, setIsExpanded] = useState(false);
    const [googleLinked, setGoogleLinked] = useState(false);
    const [googleLinkCheckLoading, setGoogleLinkCheckLoading] = useState(true);

    const [spendingAmount, setSpendingAmount] = useState('');
    const [spendingMerchant, setSpendingMerchant] = useState('');
    const [spendingDate, setSpendingDate] = useState('');

    const spendingRef = useRef(null);

    const fetchSpendingData = useCallback(async () => {
        setLoadingSpending(true);
        try {
            const response = await api.get('/spending', { withCredentials: true });
            console.log('Spending data fetched:', response.data);
            if (response.data.success === false) {
                setSpending({});
            } else {
                setSpending(response.data);
            }
        } catch (err) {
            console.error('Error fetching spending:', err);
            setSpending({}); 
            toast.error("Failed to load spending data. Please try again."); 
        } finally {
            setLoadingSpending(false);
        }
    }, []);

    const checkGoogleLinkStatus = useCallback(async () => {
        setGoogleLinkCheckLoading(true);
        try {
            const res = await api.get('/spending/check', { withCredentials: true });
            if (res.data.success) {
                setGoogleLinked(true);
            } else {
                setGoogleLinked(false);
            }
        } catch (err) {
            console.error('Error checking Google Link @ front', err);
            setGoogleLinked(false); // Assume not linked on error
        } finally {
            setGoogleLinkCheckLoading(false);
        }
    }, []);

    useEffect(() => {
        checkGoogleLinkStatus();
        fetchSpendingData();
    }, [checkGoogleLinkStatus, fetchSpendingData]);

    const toggleAddSpending = () => {
        if (spendingRef.current) {
            if (spendingRef.current.open) {
                spendingRef.current.close();
            } else {
                setSpendingAmount(''); 
                setSpendingMerchant('');
                setSpendingDate('');
                spendingRef.current.showModal();
            }
        }
    };

    const toggledetails = () => {
        setIsExpanded(prev => !prev);
    };

    const handleAddSpending = async (e) => {
        e.preventDefault();

        if (!spendingAmount || !spendingMerchant || !spendingDate) {
            toast.warn("All fields are required.");
            return;
        }

        try {
            const response = await api.post('/spending',
                {
                    amount: parseFloat(spendingAmount),
                    merchant: spendingMerchant,
                    date: spendingDate
                },
                {
                    withCredentials: true
                }
            );

            console.log(response.data);
            if (response.data && response.data.success) {
                toast.success(response.data.message || "Added entry Successfully");

                setSpendingAmount('');
                setSpendingMerchant('');
                setSpendingDate('');

                spendingRef.current?.close();
                await fetchSpendingData();
            } else {
                toast.error(response.data.message || "Failed to add spending entry.");
            }
        } catch (error) {
            console.error('Error adding entry:', error);
            toast.error("Failed to add spending entry.");
        }
    };

    const handleDeleteSpending = async (spendingId) => {
        const originalSpending = { ...spending };

        console.log(spendingId)

        setSpending(prevSpending => {
            const newSpending = {};
            for(const dateKey in prevSpending){
              const entriesForDate = prevSpending[dateKey].filter(entry => entry.id !== spendingId);

              if (entriesForDate.length > 0) {
                    newSpending[dateKey] = entriesForDate;
                }
            }
            return newSpending;
        });

        try {
            const response = await api.delete(`/spending/delete-by-date-index/${spendingId}`);

            if (response.data.success) {
                toast.success(response.data.message || "Spending entry deleted.");
            } else {
                toast.error(response.data.message || "Failed to delete spending entry.");
                setSpending(originalSpending); 
            }
        } catch (error) {
            console.error('Error deleting entry:', error);
            toast.error("Error deleting spending entry.");
            setSpending(originalSpending); 
        }
    };


    const handleLinkGoogle = () => {
        window.location.href = 'http://localhost:4000/api/auth/google';
    };

    const handleUnlinkGoogle = async () => {
        try {
            const res = await axios.post('http://localhost:4000/api/auth/unlink-google', {}, { withCredentials: true });
            if (res.data.success) {
                toast.success(res.data.message || "Google account unlinked.");
                setGoogleLinked(false);
                await fetchSpendingData();
            } else {
                toast.error(res.data.message || 'Error unlinking Google account.');
            }
        } catch (err) {
            console.error('Error unlinking Google account:', err);
            toast.error('Failed to unlink Google account.');
        }
    };

    const merchantCounts = {};
    if (spending && Object.keys(spending).length > 0) {
        Object.values(spending).forEach(entries => {
            entries.forEach(({ merchant, amount }) => {
                merchantCounts[merchant] = (merchantCounts[merchant] || 0) + amount;
            });
        });
    }

    const spendingData = spending ? Object.entries(spending).sort(([a], [b]) => new Date(b) - new Date(a)).map(([date, entries]) => ({ date, amount: entries.reduce((sum, e) => sum + e.amount, 0) })) : [];

    const sortedMerchants = Object.entries(merchantCounts)
        .sort((a, b) => b[1] - a[1]);

    const topMerchants = sortedMerchants.slice(0, 5);

    const merchantChartData = topMerchants.map(([merchant, count]) => ({
        merchant,
        count,
    }));

    if (googleLinkCheckLoading || loadingSpending) {
        return <div className="spending-container"><p></p></div>;
    }

    return (
        <div className='spending-container'>
            {googleLinked === false && (
                <div className="linking-cont">
                    <a onClick={handleLinkGoogle} className="link-google-btn">
                        <div className="google-icon-cont">
                            <img className="google-icon" src="https://upload.wikimedia.org/wikipedia/commons/thumb/c/c1/Google_%22G%22_logo.svg/512px-Google_%22G%22_logo.svg.png" alt="Google icon" />
                        </div>
                        <span>Link with Google</span>
                    </a>
                </div>
            )}

            {Object.keys(spending).length === 0 && (
                <div className="noSpending-cont">
                    <p>Looks like you don't have any spending entries yet.</p>
                    <a onClick={toggleAddSpending} className='getStarted'>
                        <span>Get Started</span>
                        <div className="arrow">
                            <FaArrowRight />
                        </div>
                    </a>
                </div>
            )}

            {Object.keys(spending).length > 0 && (
                <>
                    <div className="add-spending">
                    <a onClick={toggleAddSpending} className='getStarted'>
                        <span>Add Spending</span>
                        <div className="arrow">
                        </div>
                    </a>
                    </div>
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
                                    const startDate = new Date(today.getFullYear(), today.getMonth() - 1, 1);
                                    const endDate = new Date(today.getFullYear(), today.getMonth(), 0);

                                    return Object.entries(spending).reduce((acc, [dateStr, entries]) => {
                                        const date = new Date(dateStr);
                                        date.setHours(0, 0, 0, 0);
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
                                    const startDate = new Date(year, month, 1);
                                    const endDate = new Date(year, month + 1, 0);

                                    return Object.entries(spending).reduce((acc, [dateStr, entries]) => {
                                        const date = new Date(dateStr);
                                        date.setHours(0, 0, 0, 0);
                                        if (date >= startDate && date <= endDate) {
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
                            // Get all entries from all dates and flatten the array
                            const allEntries = Object.values(spending).flat();

                            const total = allEntries.reduce((acc, entry) => acc + entry.amount, 0);

                            return allEntries.length > 0 ? Math.round(total / allEntries.length) : 0;
                          })()}</p>
                        </div>
                    </div>

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
                                                {entries.map((entry) => (
                                                    <li key={entry.id}>
                                                        ¥{entry.amount} - {entry.merchant}
                                                        <button onClick={() => handleDeleteSpending(entry.id)}>Delete</button>
                                                    </li>
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
                            <a onClick={handleUnlinkGoogle} className="link-google-btn">
                        <div className="google-icon-cont">
                            <img className="google-icon" src="https://upload.wikimedia.org/wikipedia/commons/thumb/c/c1/Google_%22G%22_logo.svg/512px-Google_%22G%22_logo.svg.png" alt="Google icon" />
                        </div>
                        <span>Unlink Google</span>
                    </a>
                        </div>
                    )}
                </>
            )}

            <dialog ref={spendingRef} className='spending-dialog'>
                <form onSubmit={handleAddSpending}>
                    <h2>Add Spending Entry</h2>
                    <div className="spending-amount-cont">
                        <label htmlFor="amount">Amount: </label>
                        <input
                            type="number"
                            value={spendingAmount}
                            placeholder='Enter spending amount...'
                            onChange={(e) => setSpendingAmount(e.target.value)}
                            step="0.01"
                            required
                        />
                    </div>

                    <div className="spending-merchant-cont">
                        <label htmlFor="merchant">Merchant: </label>
                        <input
                            type="text"
                            value={spendingMerchant}
                            placeholder='Enter merchant...'
                            onChange={(e) => setSpendingMerchant(e.target.value)}
                            required
                        />
                    </div>

                    <div className="spending-date-cont">
                        <label htmlFor="date">Date: </label>
                        <input
                            type="date"
                            value={spendingDate}
                            onChange={(e) => setSpendingDate(e.target.value)}
                            required
                        />
                    </div>

                    <div className="button-cont">
                        <button type="submit" className="submit-spending-btn">Submit</button>
                        <button type="button" onClick={() => spendingRef.current.close()}>Close</button>
                    </div>
                </form>
            </dialog>
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