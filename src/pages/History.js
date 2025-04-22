import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Line } from 'react-chartjs-2';
import { Chart as ChartJS, CategoryScale, LinearScale, PointElement, LineElement, Title, Tooltip, Legend } from 'chart.js';

// Register ChartJS components
ChartJS.register(CategoryScale, LinearScale, PointElement, LineElement, Title, Tooltip, Legend);

function History() {
  const [historicalData, setHistoricalData] = useState([]);
  const [co2Data, setCo2Data] = useState([]);
  const [coData, setCoData] = useState([]);
  const [so2Data, setSo2Data] = useState([]);
  const [o3Data, setO3Data] = useState([]);
  const [loading, setLoading] = useState(true);

  // Fetch historical AQI data for Palanan, Makati, Casino Street (for example, past 30 days)
  useEffect(() => {
    axios.get('https://api.openaq.org/v2/measurements?city=Palanan&street=Casino%20Street&parameter=pm25&date_gte=2023-03-01&date_lte=2023-03-30')
      .then((response) => {
        setHistoricalData(response.data.results);
        setLoading(false);
      })
      .catch((error) => {
        console.error('Error fetching historical PM2.5 data:', error);
        setLoading(false);
      });

    // Fetch CO2 data
    axios.get('https://api.openaq.org/v2/measurements?city=Palanan&street=Casino%20Street&parameter=co2&date_gte=2023-03-01&date_lte=2023-03-30')
      .then((response) => {
        setCo2Data(response.data.results);
      })
      .catch((error) => {
        console.error('Error fetching CO2 data:', error);
      });

    // Fetch CO data
    axios.get('https://api.openaq.org/v2/measurements?city=Palanan&street=Casino%20Street&parameter=co&date_gte=2023-03-01&date_lte=2023-03-30')
      .then((response) => {
        setCoData(response.data.results);
      })
      .catch((error) => {
        console.error('Error fetching CO data:', error);
      });

    // Fetch SO2 data
    axios.get('https://api.openaq.org/v2/measurements?city=Palanan&street=Casino%20Street&parameter=so2&date_gte=2023-03-01&date_lte=2023-03-30')
      .then((response) => {
        setSo2Data(response.data.results);
      })
      .catch((error) => {
        console.error('Error fetching SO2 data:', error);
      });

    // Fetch O3 data
    axios.get('https://api.openaq.org/v2/measurements?city=Palanan&street=Casino%20Street&parameter=o3&date_gte=2023-03-01&date_lte=2023-03-30')
      .then((response) => {
        setO3Data(response.data.results);
      })
      .catch((error) => {
        console.error('Error fetching O3 data:', error);
      });
  }, []);

  // Extract historical AQI data for charting
  const chartData = {
    labels: historicalData.map((item) => item.date), // Dates for x-axis
    datasets: [
      {
        label: 'PM2.5 AQI Over Time',
        data: historicalData.map((item) => item.value), // AQI values for y-axis
        borderColor: 'rgb(238, 255, 0)',
        backgroundColor: 'rgba(75, 192, 192, 0.2)',
        fill: true,
      },
      {
        label: 'CO2 Over Time',
        data: co2Data.map((item) => item.value),
        borderColor: 'rgba(0, 229, 255, 1)',
        backgroundColor: 'rgba(255, 99, 132, 0.2)',
        fill: true,
      },
      {
        label: 'CO Over Time',
        data: coData.map((item) => item.value),
        borderColor: 'rgba(255, 112, 67, 1)',
        backgroundColor: 'rgba(255, 204, 0, 0.2)',
        fill: true,
      },
      {
        label: 'SO2 Over Time',
        data: so2Data.map((item) => item.value),
        borderColor: 'rgba(171, 71, 188, 1)',
        backgroundColor: 'rgba(153, 102, 255, 0.2)',
        fill: true,
      },
      {
        label: 'O3 Over Time',
        data: o3Data.map((item) => item.value),
        borderColor: 'rgba(102, 187, 106, 1)',
        backgroundColor: 'rgba(255, 20, 147, 0.2)',
        fill: true,
      }
    ],
  };

  return (
    <div style={{
      padding: '40px',
      fontFamily: 'Arial, sans-serif',
      background: 'linear-gradient(135deg, #c2e9fb 0%, #a1c4fd 100%)',
      color: '#2e2e2e',
      minHeight: '100vh',
    }}>
      {/* Header */}
      <h1 style={{
        fontSize: '2.5em',
        textAlign: 'center',
        marginBottom: '30px',
        fontWeight: 'bold',
      }}>
        AQI History - Palanan, Makati (Casino Street)
      </h1>

      {/* Loading state */}
      {loading ? (
        <div style={{
          textAlign: 'center',
          fontSize: '1.5em',
          marginTop: '50px',
        }}>
          <p>Loading historical data...</p>
        </div>
      ) : (
        <div>
          {/* Chart display */}
          <div style={{
            maxWidth: '80%',
            margin: '0 auto',
            marginTop: '50px',
            padding: '30px',
            borderRadius: '15px',
            backgroundColor: 'rgba(244, 240, 240, 0.6)',
            boxShadow: '0px 8px 20px rgba(0, 0, 0, 0.3)',
          }}>
            <h2 style={{ fontSize: '1.8em', textAlign: 'center', marginBottom: '20px' }}>
              Air Quality Trends Over Time
            </h2>
            <Line data={chartData} />
          </div>

          {/* Historical Data */}
          <div style={{
            marginTop: '60px',
            padding: '20px',
            backgroundColor: 'rgba(180, 30, 30, 0.1)',
            borderRadius: '15px',
            boxShadow: '0px 8px 20px rgba(0, 0, 0, 0.3)',
          }}>
            <h2 style={{ fontSize: '1.8em', textAlign: 'center', marginBottom: '20px' }}>
              Detailed Historical AQI Data
            </h2>
            <table style={{
              width: '100%',
              margin: '0 auto',
              borderCollapse: 'collapse',
              color: '#fff',
            }}>
              <thead>
                <tr>
                  <th style={{ padding: '10px', textAlign: 'left' }}>Date</th>
                  <th style={{ padding: '10px', textAlign: 'left' }}>Value (µg/m³)</th>
                  <th style={{ padding: '10px', textAlign: 'left' }}>Pollutant</th>
                </tr>
              </thead>
              <tbody>
                {historicalData.map((item, index) => (
                  <tr key={index} style={{
                    backgroundColor: index % 2 === 0 ? 'rgb(238, 255, 0)' : 'rgb(238, 255, 1)',
                  }}>
                    <td style={{ padding: '10px' }}>{item.date}</td>
                    <td style={{ padding: '10px' }}>{item.value} µg/m³</td>
                    <td style={{ padding: '10px' }}>PM2.5</td>
                  </tr>
                ))}
                {co2Data.map((item, index) => (
                  <tr key={index} style={{
                    backgroundColor: index % 2 === 0 ? 'rgba(0, 229, 255, 1)' : 'rgb(5, 226, 251)',
                  }}>
                    <td style={{ padding: '10px' }}>{item.date}</td>
                    <td style={{ padding: '10px' }}>{item.value} µg/m³</td>
                    <td style={{ padding: '10px' }}>CO2</td>
                  </tr>
                ))}
                {coData.map((item, index) => (
                  <tr key={index} style={{
                    backgroundColor: index % 2 === 0 ? 'rgba(255, 112, 67, 1)' : 'rgb(251, 107, 64)',
                  }}>
                    <td style={{ padding: '10px' }}>{item.date}</td>
                    <td style={{ padding: '10px' }}>{item.value} µg/m³</td>
                    <td style={{ padding: '10px' }}>CO</td>
                  </tr>
                ))}
                {so2Data.map((item, index) => (
                  <tr key={index} style={{
                    backgroundColor: index % 2 === 0 ? 'rgba(171, 71, 188, 1)' : 'rgb(177, 71, 196)',
                  }}>
                    <td style={{ padding: '10px' }}>{item.date}</td>
                    <td style={{ padding: '10px' }}>{item.value} µg/m³</td>
                    <td style={{ padding: '10px' }}>SO2</td>
                  </tr>
                ))}
                {o3Data.map((item, index) => (
                  <tr key={index} style={{
                    backgroundColor: index % 2 === 0 ? 'rgba(102, 187, 106, 1)' : 'rgb(100, 192, 104)',
                  }}>
                    <td style={{ padding: '10px' }}>{item.date}</td>
                    <td style={{ padding: '10px' }}>{item.value} µg/m³</td>
                    <td style={{ padding: '10px' }}>O3</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
}

export default History;
