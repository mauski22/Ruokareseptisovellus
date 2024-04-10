import React, { useState, useEffect } from 'react';

function Company() {
    // Initialize state
    const [ideasPurchased, setIdeasPurchased] = useState(0);
    const [totalValue, setTotalValue] = useState(0);
    const [uniqueIndividuals, setUniqueIndividuals] = useState(0);

    // Simulate fetching data from an API
    useEffect(() => {
        // Replace this with your actual data fetching logic
        const fetchData = async () => {
            // Example data fetching logic
            const response = await fetch('your-api-url-here');
            const data = await response.json();

            // Update state with fetched data
            setIdeasPurchased(data.ideasPurchased);
            setTotalValue(data.totalValue);
            setUniqueIndividuals(data.uniqueIndividuals);
        };

        fetchData();
    }, []);

    return (
        <div>
            <h1>Yritysnäkymä</h1>
            <p>Yritys on ostanut {ideasPurchased} ideaa.</p>
            <p>Yhteen laskettu arvo ideoista jotka on ostettu: {totalValue}</p>
            <p>Kuinka monelta eri henkilöltä on ostettu ideoita: {uniqueIndividuals}</p>
        </div>
    );
}

export default Company;