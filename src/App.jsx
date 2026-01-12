import { useState } from 'react';
import Header from './components/Header';
import Scene from './components/Scene';
import Overlay from './components/Overlay';
import './App.css';

function App() {
  const [currentStep, setStep] = useState(-1);

  return (
    <>
      <Header />
      
      <div className="layout-container">
        {/* Left Column: Content */}
        <div className="col-content">
          <Overlay currentStep={currentStep} setStep={setStep} />
        </div>

        {/* Right Column: 3D Visualization */}
        <div className="col-visual">
          <Scene currentStep={currentStep} />
        </div>
      </div>
    </>
  );
}

export default App;
