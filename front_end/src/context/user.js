import { createContext, useState, useEffect } from 'react';

import { fetchBbApi } from "../utils/bullbitcoin.js";

export const UserContext = createContext({
    data: null, 
    refresh: () => {},
    loading: false,
    isMaintenance: false,
    hasGroup: () => {},
    getKyc: () => {},
})

export const UserProvider = ({ children }) => {
    const [user, setUser] = useState(null);
    const [loading, setLoading] = useState(true);
    const [isMaintenance, setIsMaintenance] = useState(false);
  
    const handleLogin = async () => {
      const response = await fetchBbApi({
        service: "api-users",
        method: "getMyUser",
        params: {
          includes: ["kycs", "groups", "balances"]
        },
      });
  
      setLoading(false);

      if (response.error) {
        if (response.data?.status === 503) {
          setIsMaintenance(true);
        }
        return;
      }
  
      setUser(response.element);
    };
  
    useEffect(() => {
      handleLogin();
    }, []);
  
    const userContext = {
      data: user,
      refresh: handleLogin,
      loading: loading,
      isMaintenance: isMaintenance,
      hasGroup: (groupCode) => user?.groups.find((el) => el.group.groupCode === groupCode) ? true : false,
      getKyc: (type, value) => {
        if (!user) return "";
        const kyc = user.kycs.find((el) => el.type === type);
        if (kyc && !value) return kyc;
        if (kyc && kyc[value]) return kyc[value];
        return "";
      }
    };
  
    return (
      <UserContext.Provider value={userContext}>
        {children}
      </UserContext.Provider>
    );
  };