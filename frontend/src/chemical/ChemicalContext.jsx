import React, { createContext, useContext, useState } from 'react';

export const ChemicalContext = createContext();

export const useChemical = () => {
  return useContext(ChemicalContext);
};

export const ChemicalProvider = ({ children,selectedItem }) => {
  const [selectedChemicalName, setSelectedChemicalName] = useState(null);

  const setChemicalName = (name) => {
    setSelectedChemicalName(name);
  };

  return (
    <ChemicalContext.Provider value={{  selectedItem }}>
      {children}
    </ChemicalContext.Provider>
  );
};
