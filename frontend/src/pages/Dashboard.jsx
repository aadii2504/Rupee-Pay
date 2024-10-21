import { useEffect, useState } from 'react';
import axios from 'axios';
import { Appbar } from "../components/Appbar";
import { Balance } from "../components/Balance";
import { Users } from "../components/Users";

export const Dashboard = () => {
    const [balance, setBalance] = useState(null); // State to store the balance
    const [loading, setLoading] = useState(true); // State for loading status
    const [error, setError] = useState(null); // State for error handling

    useEffect(() => {
        // Fetch balance from API
        const fetchBalance = async () => {
            try {
                const token = localStorage.getItem("token"); // Fetch token from localStorage
                const response = await axios.get('http://localhost:3000/api/v1/account/balance', {
                    headers: {
                        Authorization: `Bearer ${token}`,
                    },
                });
                setBalance(response.data.balance); // Set balance from API response
            } catch (err) {
                setError('Failed to load balance');
            } finally {
                setLoading(false);
            }
        };

        fetchBalance(); // Call the function to fetch balance
    }, []); // Empty dependency array ensures this runs once when the component mounts

    if (loading) {
        return <div>Loading balance...</div>;
    }

    if (error) {
        return <div>{error}</div>;
    }

    return (
        <div>
            <Appbar />
            <div className="m-8">
                <Balance value={balance} /> {/* Pass dynamic balance to the Balance component */}
                <Users />
            </div>
        </div>
    );
};
