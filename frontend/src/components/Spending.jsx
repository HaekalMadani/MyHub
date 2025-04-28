import React from 'react';
import { GoogleOAuthProvider, GoogleLogin } from '@react-oauth/google';
import axios from 'axios';
import { useState } from 'react';

const Spending = () => {
    const [spending, setSpending] = useState(null);

    const handleSuccess = async (credentialResponse) => {
        const accessToken = credentialResponse.credential;

        const res = await axios.post('http://localhost:4000/scan-emails', { token: accessToken });
        setSpending(res.data);
    }


    return(
        <GoogleOAuthProvider clientId='920552388273-3mpplef4rn62argnl485o7bostdvhrgm.apps.googleusercontent.com'>
            <div>
                <h1>Spending Tracker</h1>

                <GoogleLogin
                onSuccess={handleSuccess}
                onError={()=>{console.log('Login Failed')}}
                useOneTap
                
                />

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
        </GoogleOAuthProvider>
    )
}

export default Spending