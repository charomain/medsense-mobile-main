import {createContext, useContext} from 'react';

export type AppTenant = 'medsense' | 'toothcase';
export type ITenantContext = {
  tenant: AppTenant;
};

export const TenantContext = createContext<ITenantContext | undefined>(
  undefined,
);

export const useTenant = () => {
  const ctx = useContext(TenantContext);
  return ctx?.tenant;
};
