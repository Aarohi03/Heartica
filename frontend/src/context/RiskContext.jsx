import { createContext, useContext, useState } from "react";

const RiskContext = createContext();

export function RiskProvider({ children }) {
  const [riskData, setRiskData] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);

  return (
    <RiskContext.Provider value={{ riskData, setRiskData, isLoading, setIsLoading, error, setError }}>
      {children}
    </RiskContext.Provider>
  );
}

export function useRiskContext() {
  const context = useContext(RiskContext);
  if (!context) {
    throw new Error("useRiskContext must be used within RiskProvider");
  }
  return context;
}
