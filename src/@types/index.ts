export type ChildrenProps = {
  children: React.ReactNode;
};

export type ContextType = {
  name: string;
  email: string;
  role: 'AGENCY_OWNER' | 'AGENCY_ADMIN' | 'SUBACCOUNT_USER' | 'SUBACCOUNT_GUEST';
};
