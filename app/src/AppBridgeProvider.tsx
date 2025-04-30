import { init } from "@epilot/app-bridge";
import { useLayoutEffect } from "react";

export const AppBridgeProvider = ({ children }: { children: React.ReactNode }) => {
  useLayoutEffect(() => {
    init();
  }, []);

  return <>{children}</>;
};
