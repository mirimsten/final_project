import React, { useState } from 'react';
import axios from 'axios';

const NewTrip = () => {
  const [startDate, setStartDate] = useState('');
  const [destinationCountry, setDestinationCountry] = useState('');
  const [destinationCity, setDestinationCity] = useState('');
  const [lodging, setLodging] = useState('no'); // Default to 'no'
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [successMessage, setSuccessMessage] = useState('');
  const [flights, setFlights] = useState([]);

  const userCountry = 'Israel'; // Example user country; replace with actual user data

  const handleSearch = async () => {
    setLoading(true);
    setError('');

    try {
      // URL for data.gov.il API
      const resourceId = 'e83f763b-b7d7-479e-b172-ae981ddc6de5';
      const limit = 10;
      const filter = encodeURIComponent(JSON.stringify({ CHLOC1T: destinationCity }));
      const url = `https://data.gov.il/api/3/action/datastore_search?resource_id=${resourceId}&limit=${limit}&filters=${filter}`;

      // Fetch data from data.gov.il API
      const response = await axios.get(url);
      const data = response.data.result.records;
      console.log(data);

      if (!data.length) {
        setError('לא נמצאו נתונים');
        setFlights([]);
        setLoading(false);
        return;
      }

    //   Filter flights based on departure date
      const filteredFlights = data.filter(flight => 
        new Date(flight.CHSTOL).toISOString().split('T')[0] === startDate
      );

      setFlights(filteredFlights);
    // setFlights(data);
    } catch (err) {
      console.error('Error fetching data from API:', err);
      setError(`שגיאה בשליפת נתונים מה-API: ${err.message}`);
    }

    setLoading(false);
  };

  return (
    <div>
      <h1>New Trip</h1>
      <div>
        <label>Start Date: </label>
        <input 
          type="date" 
          value={startDate} 
          onChange={(e) => setStartDate(e.target.value)} 
        />
      </div>
      <div>
        <label>Destination Country: </label>
        <input 
          type="text" 
          value={destinationCountry} 
          onChange={(e) => setDestinationCountry(e.target.value)} 
        />
      </div>
      <div>
        <label>Destination City: </label>
        <input 
          type="text" 
          value={destinationCity} 
          onChange={(e) => setDestinationCity(e.target.value)} 
        />
      </div>
      <div>
        <label>Lodging: </label>
        <select 
          value={lodging} 
          onChange={(e) => setLodging(e.target.value)}
        >
          <option value="yes">Yes</option>
          <option value="no">No</option>
        </select>
      </div>
      <button onClick={handleSearch} disabled={loading}>

      <div>
        {flights.length > 0 && (
          <div>
            <h2>תוצאות חיפוש:</h2>
            <ul>
              {flights.map((flight, index) => (
                <li key={index}>
                  <div>
                    <p>חברת תעופה: {flight.CHOPERD}</p>
                    <p>מספר טיסה: {flight.CHFLTN}</p>
                    <p>נמל יציאה: {flight.origin_airport}</p>
                    <p>זמן יציאה: {new Date(flight.CHSTOL).toLocaleString()}</p>
                    <p>נמל הגעה: {flight.destination_airport}</p>
                    <p>זמן הגעה: {new Date(flight.CHPTOL).toLocaleString()}</p>
                    <p>סטטוס: {flight.CHRMINE}</p>
                    <a href={`https://www.google.com/search?q=${flight.CHOPERD} ${flight.CHFLTN} flight`} target="_blank" rel="noopener noreferrer">
                      פרטים נוספים
                    </a>
                  </div>
                </li>
              ))}
            </ul>
          </div>
        )}
      </div>

        {loading ? 'Creating Itinerary...' : 'Create Itinerary'}
      </button>

      {error && <p style={{ color: 'red' }}>{error}</p>}
      {successMessage && <p style={{ color: 'green' }}>{successMessage}</p>}
    </div>
  );
};

export default NewTrip;