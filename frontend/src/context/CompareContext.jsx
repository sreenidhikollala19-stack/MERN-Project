import React, { createContext, useContext, useState, useEffect } from 'react';
import toast from 'react-hot-toast';

const CompareContext = createContext(null);

export const CompareProvider = ({ children }) => {
  const [compareList, setCompareList] = useState(() => {
    try {
      const saved = localStorage.getItem('eventease_compare');
      return saved ? JSON.parse(saved) : [];
    } catch {
      return [];
    }
  });

  useEffect(() => {
    localStorage.setItem('eventease_compare', JSON.stringify(compareList));
  }, [compareList]);

  const addToCompare = (vendor) => {
    if (compareList.some((item) => item._id === vendor._id)) {
      removeFromCompare(vendor._id);
      return;
    }

    if (compareList.length >= 3) {
      toast.error('You can compare a maximum of 3 vendors at a time.');
      return;
    }

    setCompareList((prev) => [...prev, vendor]);
    toast.success(`Added ${vendor.businessName} to compare`);
  };

  const removeFromCompare = (vendorId) => {
    setCompareList((prev) => prev.filter((item) => item._id !== vendorId));
    toast.success('Removed from compare');
  };

  const clearCompare = () => {
    setCompareList([]);
  };

  const isInCompare = (vendorId) => {
    return compareList.some((item) => item._id === vendorId);
  };

  return (
    <CompareContext.Provider
      value={{
        compareList,
        addToCompare,
        removeFromCompare,
        clearCompare,
        isInCompare,
      }}
    >
      {children}
    </CompareContext.Provider>
  );
};

export const useCompare = () => {
  const context = useContext(CompareContext);
  if (!context) {
    throw new Error('useCompare must be used within a CompareProvider');
  }
  return context;
};

