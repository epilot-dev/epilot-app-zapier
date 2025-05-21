import { createContext, useContext } from "react";

interface IAppBridgeContext {
  token: string;
}
export const AppBridgeContext = createContext<IAppBridgeContext>({
  token: '',
});

export const useAppBridgeContext = () => useContext(AppBridgeContext);
