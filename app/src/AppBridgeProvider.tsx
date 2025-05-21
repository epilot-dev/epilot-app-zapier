import { init, epilot } from "@epilot/app-bridge";
import { useEffect, useState } from "react";
import { AppBridgeContext } from "./AppBridgeContext";
import { apiClient } from "./api";

export const AppBridgeProvider = ({ children }: { children: React.ReactNode }) => {
  const [token, setToken] = useState<string | null>(null);

  useEffect(() => {
    epilot.subscribeToParentMessages('app-bridge:init', (message) => {
      console.debug('app-bridge:init', message);
      if (message.data?.token) {
        setToken(message.data.token);

        apiClient.defaults.headers.common['Authorization'] = `Bearer ${message.data.token}`;
      }
    });

    init();
  }, []);

  if (!token) {
    return <></>;
  }

  return <AppBridgeContext.Provider value={{ token }}>{children}</AppBridgeContext.Provider>;
};

