// context/SettingsContext.js
import { createContext, useContext, useState } from "react";

const SettingsContext = createContext();

export function SettingsProvider({ children }) {
  const [power, setPower] = useState(1.0);
  const [greatnessThreshold, setGreatnessThreshold] = useState(8.0)
  const [scalingFactor, setScalingFactor] = useState(0.3)
  const [steepFactor, setSteepFactor] = useState(3.0)
  const [averageRatingWeight, setAverageRatingWeight] = useState(0.5)
  
  return (
    <SettingsContext.Provider 
    value={{ 
        power, setPower, 
        greatnessThreshold, setGreatnessThreshold, 
        scalingFactor, setScalingFactor, 
        steepFactor, setSteepFactor,
        averageRatingWeight, setAverageRatingWeight
        }}>
      {children}
    </SettingsContext.Provider>
  );
}

export function useSettings() {
  return useContext(SettingsContext);
}
