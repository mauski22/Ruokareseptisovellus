import React from 'react';

const FakeStats = () => {
  // Kovakoodattu feikkistatistiikka
  const stats = {
    totalIdeas: 150,
    ideasSold: 100,
    ideasPending: 50,
    revenueGenerated: 12000 // oletetaan, että tämä on euroissa
  };

  // Funktio muotoilee numerot näyttävämmäksi
  const formatNumber = (num) => {
    return num.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
  };

  return (
    <div style={{ textAlign: 'center', padding: '20px', backgroundColor: '#f5f5f5', borderRadius: '8px', boxShadow: '0 2px 4px rgba(0,0,0,0.1)' }}>
      <h2>Statistiikkaa Myydyistä Ideoista</h2>
      <div style={{ display: 'flex', justifyContent: 'space-around', padding: '20px 0' }}>
        <div>
          <h3>{formatNumber(stats.totalIdeas)}</h3>
          <p>Kokonaisideoita</p>
        </div>
        <div>
          <h3>{formatNumber(stats.ideasSold)}</h3>
          <p>Myytyjä Ideoita</p>
        </div>
        <div>
          <h3>{formatNumber(stats.ideasPending)}</h3>
          <p>Odottavia Ideoita</p>
        </div>
        <div>
          <h3>{formatNumber(stats.revenueGenerated)}€</h3>
          <p>Liikevaihto</p>
        </div>
      </div>
    </div>
  );
};

export default FakeStats;
