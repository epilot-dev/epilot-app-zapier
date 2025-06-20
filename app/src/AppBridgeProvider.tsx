import { init, epilot } from "@epilot/app-bridge";
import { useLayoutEffect, useState } from "react";
import { AppBridgeContext } from "./AppBridgeContext";
import { apiClient } from "./api";
import { i18n } from "./i18n";

export const AppBridgeProvider = ({ children }: { children: React.ReactNode }) => {
  const [token, setToken] = useState<string | null>(null);

  useLayoutEffect(() => {
    const unsubscribe = epilot.subscribeToParentMessages('app-bridge:init', (message) => {
      if (message.data?.token) {
        setToken(message.data.token);

        apiClient.defaults.headers.common['Authorization'] = `Bearer ${message.data.token}`;
      }

      if (message.data?.lang) {
        i18n.changeLanguage(message.data.lang);
      }
    });

    init();

    return () => {
      unsubscribe();
    };
  }, []);

  if (!token) {
    return <></>;
  }

  return <AppBridgeContext.Provider value={{ token }}>{children}</AppBridgeContext.Provider>;
};

