import React from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import Home from './pages/Home';
import About from './pages/About';
import Feedback from './pages/Feedback';
import Disclaimer from './pages/Disclaimer';  
import BirdDetail from './pages/BirdDetail';
import PrivacyPolicy from './pages/PrivacyPolicy';
import Navbar from './components/Navbar';
import Footer from './components/Footer';

// Import new pages
import UploadPage from './pages/UploadPage';  // For Predict page
import Methodology from './pages/Methodology';  // For Methodology page

const App: React.FC = () => {
  return (
    <Router>
      <Navbar />
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/about" element={<About />} />
        <Route path="/feedback" element={<Feedback />} />
        <Route path="/disclaimer" element={<Disclaimer />} />  
        <Route path="/privacy-policy" element={<PrivacyPolicy />} />  

        <Route path="/bird/:id" element={<BirdDetail />} />  
        
        {/* New routes for Predict and Methodology pages */}
        <Route path="/predict" element={<UploadPage />} />  {/* Predict page */}
        <Route path="/methodology" element={<Methodology />} />  {/* Methodology page */}
      </Routes>
      <Footer />
    </Router>
  );
};

export default App;
