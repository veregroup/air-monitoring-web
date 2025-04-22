import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Line } from 'react-chartjs-2';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend
} from 'chart.js';

// Register ChartJS components
ChartJS.register(CategoryScale, LinearScale, PointElement, LineElement, Title, Tooltip, Legend);

function Home() {
  const [aqiData, setAqiData] = useState([]);
  const [currentAqi, setCurrentAqi] = useState(null);

  // New state for added pollutants
  const [pollutants, setPollutants] = useState({
    pm25: null,
    co2: null,
    co: null,
    so2: null,
    o3: null
  });

  // New states for each pollutant's historical data
  const [co2Data, setCo2Data] = useState([]);
  const [coData, setCoData] = useState([]);
  const [so2Data, setSo2Data] = useState([]);
  const [o3Data, setO3Data] = useState([]);

  // Additive: Pollutant info and toggle state
  const pollutantInfo = {
    pm25: "PM2.5 are tiny particles that can penetrate deep into the lungs and even enter the bloodstream, causing respiratory issues and other health problems.",
    co2: "Carbon Dioxide (CO₂) is a naturally occurring gas, but high levels can lead to headaches, dizziness, and in extreme cases, unconsciousness.",
    co: "Carbon Monoxide (CO) is a colorless, odorless gas that can cause sudden illness and death by preventing oxygen from entering the body.",
    so2: "Sulfur Dioxide (SO₂) can irritate the respiratory system, especially in people with asthma, and contributes to acid rain.",
    o3: "Ozone (O₃) at ground level can cause chest pain, coughing, throat irritation, and worsen bronchitis or asthma."
  };

  const [showInfo, setShowInfo] = useState({
    pm25: false,
    co2: false,
    co: false,
    so2: false,
    o3: false
  });

  const toggleInfo = (key) => {
    setShowInfo(prev => ({ ...prev, [key]: !prev[key] }));
  };

  // Time-based greeting
  const getGreeting = () => {
    const hour = new Date().getHours();
    if (hour < 12) return "Good Morning";
    if (hour < 18) return "Good Afternoon";
    return "Good Evening";
  };

  // Fetch AQI data
  useEffect(() => {
    axios.get('https://api.openaq.org/v2/latest?city=Makati&parameter=pm25')
      .then((response) => {
        const latestData = response.data.results[0];
        const pm25Value = latestData.measurements[0].value;
        setCurrentAqi(pm25Value);
        setAqiData(latestData.measurements.map(item => item.value));
        setPollutants(prev => ({ ...prev, pm25: pm25Value }));
      })
      .catch((error) => console.error('Error fetching AQI data:', error));

    // Fetch additional pollutants
    const pollutantParams = ['co2', 'co', 'so2', 'o3'];
    pollutantParams.forEach(param => {
      axios.get(`https://api.openaq.org/v2/latest?city=Makati&parameter=${param}`)
        .then(response => {
          const pollutantValue = response.data.results[0]?.measurements[0]?.value ?? null;
          setPollutants(prev => ({ ...prev, [param]: pollutantValue }));
        })
        .catch(error => console.error(`Error fetching ${param.toUpperCase()} data:`, error));
    });

    // Fetch time series for pollutants
    axios.get('https://api.openaq.org/v2/measurements?city=Makati&parameter=co2&limit=10')
      .then(res => setCo2Data(res.data.results.map(d => d.value)))
      .catch(err => console.error('Error fetching CO2 history:', err));

    axios.get('https://api.openaq.org/v2/measurements?city=Makati&parameter=co&limit=10')
      .then(res => setCoData(res.data.results.map(d => d.value)))
      .catch(err => console.error('Error fetching CO history:', err));

    axios.get('https://api.openaq.org/v2/measurements?city=Makati&parameter=so2&limit=10')
      .then(res => setSo2Data(res.data.results.map(d => d.value)))
      .catch(err => console.error('Error fetching SO2 history:', err));

    axios.get('https://api.openaq.org/v2/measurements?city=Makati&parameter=o3&limit=10')
      .then(res => setO3Data(res.data.results.map(d => d.value)))
      .catch(err => console.error('Error fetching O3 history:', err));
  }, []);

  // AQI advice based on current value
  const getAqiAdvice = (aqi) => {
    if (aqi <= 50) return "🟢 Air quality is good. Enjoy your day outside!";
    else if (aqi <= 100) return "🟡 Air is acceptable. Sensitive individuals should limit prolonged outdoor exertion.";
    else if (aqi <= 150) return "🟠 Unhealthy for sensitive groups. Consider staying indoors during peak hours.";
    else if (aqi <= 200) return "🔴 Unhealthy. Limit prolonged outdoor activities.";
    else if (aqi <= 300) return "🟣 Very unhealthy. Stay indoors and use air purifiers if available.";
    else return "🟤 Hazardous! Avoid going outside and keep windows closed.";
  };

  // AQI color card styling
  const getAqiCardStyle = (aqi) => {
    if (aqi <= 50) return { backgroundColor: '#6BFF6C', color: '#000' }; // Good
    if (aqi <= 100) return { backgroundColor: '#FFEB3B', color: '#000' }; // Moderate
    if (aqi <= 150) return { backgroundColor: '#FF8C00', color: '#fff' }; // Unhealthy for sensitive groups
    if (aqi <= 200) return { backgroundColor: '#FF2D00', color: '#fff' }; // Unhealthy
    if (aqi <= 300) return { backgroundColor: '#8F3F97', color: '#fff' }; // Very Unhealthy
    return { backgroundColor: '#7E0023', color: '#fff' }; // Hazardous
  };

  // Chart generator
  const createChart = (label, data, color) => ({
    labels: data.map((_, i) => `T${i + 1}`),
    datasets: [{
      label,
      data,
      borderColor: color,
      backgroundColor: `${color}44`,
      fill: true,
      tension: 0.3,
    }]
  });

  return (
    <div style={{
      padding: '40px',
      fontFamily: 'Arial, sans-serif',
      background: 'linear-gradient(135deg, #e0c3fc 0%, #8ec5fc 100%)',
      color: '#2e2e2e',
      minHeight: '100vh',
    }}>
      <h1 style={{ fontSize: '2.5em', textAlign: 'center', marginBottom: '20px' }}>
        {getGreeting()}, Welcome to Air Quality Monitor!
      </h1>

      {/* Hidden original AQI section */}
      <div style={{
        display: 'none',
        background: 'rgba(0, 0, 0, 0.7)',
        padding: '20px',
        marginTop: '20px',
        borderRadius: '15px',
        justifyContent: 'space-between',
        alignItems: 'center',
        boxShadow: '0px 8px 20px rgba(0, 0, 0, 0.3)',
      }}>
        <div>
          <h2 style={{ fontSize: '1.8em', marginBottom: '10px' }}>Current AQI (PM2.5)</h2>
          <p style={{ fontSize: '2.5em', fontWeight: 'bold', color: '#FFEB3B' }}>
            {currentAqi ? `${currentAqi} µg/m³` : 'Loading...'}
          </p>
          {currentAqi && (
            <p style={{
              fontSize: '1.1em',
              marginTop: '10px',
              backgroundColor: 'rgba(255, 255, 255, 0.2)',
              padding: '10px 15px',
              borderRadius: '8px',
              color: '#fff',
              fontStyle: 'italic'
            }}>
              {getAqiAdvice(currentAqi)}
            </p>
          )}
        </div>
        <div>
          <img
            src="https://www.freeiconspng.com/uploads/air-quality-icon-2.png"
            alt="AQI Icon"
            style={{ width: '80px', opacity: '0.8' }}
          />
        </div>
      </div>

      {/* Pollutants Section */}
      <div style={{ marginTop: '40px' }}>
        <h2 style={{ fontSize: '1.8em', textAlign: 'center' }}>Air Pollutants</h2>
        <div style={{
          display: 'flex',
          flexWrap: 'wrap',
          gap: '20px',
          justifyContent: 'center',
          marginTop: '20px'
        }}>
          {[
            { key: 'pm25', label: 'PM2.5 (Particulate Matter)', value: pollutants.pm25, color: '#FFEB3B' },
            { key: 'co2', label: 'Carbon Dioxide (CO₂)', value: pollutants.co2, color: '#00E5FF' },
            { key: 'co', label: 'Carbon Monoxide (CO)', value: pollutants.co, color: '#FF7043' },
            { key: 'so2', label: 'Sulfur Dioxide (SO₂)', value: pollutants.so2, color: '#AB47BC' },
            { key: 'o3', label: 'Ozone (O₃)', value: pollutants.o3, color: '#66BB6A' },
          ].map((pollutant, idx) => (
            <div key={idx} style={{
              backgroundColor: pollutant.color,
              padding: '15px 20px',
              borderRadius: '12px',
              minWidth: '250px',
              textAlign: 'center',
              color: '#000',
              fontWeight: 'bold'
            }}>
              <h3>{pollutant.label}</h3>
              <p>{pollutant.value !== null ? `${pollutant.value} µg/m³` : 'Loading...'}</p>
              <button
                onClick={() => toggleInfo(pollutant.key)}
                style={{
                  marginTop: '10px',
                  padding: '6px 12px',
                  borderRadius: '6px',
                  backgroundColor: '#000',
                  color: '#fff',
                  border: 'none',
                  cursor: 'pointer'
                }}
              >
                {showInfo[pollutant.key] ? 'Hide Info' : 'More Info'}
              </button>
              {showInfo[pollutant.key] && (
                <p style={{ marginTop: '10px', fontWeight: 'normal', fontSize: '0.95em' }}>
                  {pollutantInfo[pollutant.key]}
                </p>
              )}
            </div>
          ))}
        </div>
      </div>

      {/* PM2.5 Chart */}
      <div style={{ marginTop: '40px' }}>
        <h2 style={{ fontSize: '1.8em', textAlign: 'center' }}>PM2.5 AQI Trends</h2>
        <div style={{ maxWidth: '80%', margin: '0 auto' }}>
          <Line data={createChart('PM2.5 AQI', aqiData, 'rgb(238, 255, 0)')} />
        </div>
      </div>

      {/* Additional Charts */}
      {[
        { label: 'CO₂ Levels', data: co2Data, color: 'rgba(0, 229, 255, 1)' },
        { label: 'CO Levels', data: coData, color: 'rgba(255, 112, 67, 1)' },
        { label: 'SO₂ Levels', data: so2Data, color: 'rgba(171, 71, 188, 1)' },
        { label: 'O₃ Levels', data: o3Data, color: 'rgba(102, 187, 106, 1)' },
      ].map((item, idx) => (
        <div key={idx} style={{ marginTop: '40px' }}>
          <h2 style={{ fontSize: '1.8em', textAlign: 'center' }}>{item.label}</h2>
          <div style={{ maxWidth: '80%', margin: '0 auto' }}>
            <Line data={createChart(item.label, item.data, item.color)} />
          </div>
        </div>
      ))}

      {/* AQI Info Cards */}
      <div style={{ display: 'flex', gap: '20px', marginTop: '40px', flexWrap: 'wrap' }}>
        {[50, 75, 125, 175, 250, 350].map((aqiValue, index) => {
          const labels = [
            "Good",
            "Moderate",
            "Unhealthy for Sensitive Groups",
            "Unhealthy",
            "Very Unhealthy",
            "Hazardous"
          ];
          const descriptions = [
            "AQI 0–50: Air quality is considered satisfactory, and air pollution poses little or no risk.",
            "AQI 51–100: Air quality is acceptable; however, some pollutants may slightly affect a very small number of sensitive individuals.",
            "AQI 101–150: Members of sensitive groups may experience health effects. The general public is less likely to be affected.",
            "AQI 151–200: Everyone may begin to experience health effects; members of sensitive groups may experience more serious effects.",
            "AQI 201–300: Health alert: everyone may experience more serious health effects.",
            "AQI 301+: Health warning of emergency conditions. The entire population is more likely to be affected."
          ];
          return (
            <div
              key={index}
              style={{
                flex: 1,
                ...getAqiCardStyle(aqiValue),
                borderRadius: '15px',
                padding: '20px',
                textAlign: 'center',
                boxShadow: '0px 8px 15px rgba(0, 0, 0, 0.3)',
              }}
            >
              <h3>{labels[index]}</h3>
              <p>{descriptions[index]}</p>
            </div>
          );
        })}
      </div>
    </div>
  );
}

export default Home;
