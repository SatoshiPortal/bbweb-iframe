import { createContext, useState, useEffect } from 'react';

export const AlertContext = createContext({
    data: {}, 
    refresh: () => {}
});

export const AlertProvider = ({ children }) => {
    const [alertData, setAlertData] = useState(null);
  
    const getAlertData = async () => {
      const response = await fetch(`/alert`);
  
      if (!response || response.status !== 200) {
        return;
      }
  
      const data = await response.json();
  
      if (data.error) {
        return;
      }

      setAlertData(data.data);
    };
  
    useEffect(() => {
      getAlertData();
      const intervalId = setInterval(getAlertData, 1000 * 60);
  
      return () => {
        clearInterval(intervalId);
      };
    }, []);
  
    const alertContext = {
      data: alertData,
      refresh: getAlertData,
    };
  
    return (
      <AlertContext.Provider value={alertContext}>
        {children}
      </AlertContext.Provider>
    );
  }