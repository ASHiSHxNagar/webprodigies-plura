'use client';

import React, { createContext, useContext, useState } from 'react';
import useMounted from '@/hooks/useMounted';
import { PricesList, TicketDetails } from '@/lib/types';
import { Agency, Contact, Plan, User } from '@prisma/client';

export interface ModalData {
  user?: User;
  agency?: Agency;
  ticket?: TicketDetails[0];
  contact?: Contact;
  plans?: {
    defaultPriceId: Plan;
    plans: PricesList['data'];
  };
}

interface ContextModalProps {
  data: ModalData;
  isOpen: boolean;
  setOpen: (modal: React.ReactNode, fetchData?: () => Promise<Partial<ModalData>>) => void;
  setClose: () => void;
}

export const ModalContext = createContext<ContextModalProps>({
  data: {},
  isOpen: false,
  setOpen: () => undefined,
  setClose: () => {},
});

type ModalProps = {
  children: React.ReactNode;
};

export const ModalProvider: React.FC<ModalProps> = ({ children }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [data, setData] = useState<ModalData>({});
  const [showingModal, setShowingModal] = useState<React.ReactNode>(null);
  const isMounted = useMounted();

  const setOpen = async (
    modal: React.ReactNode,
    fetchData?: () => Promise<Partial<ModalData>>
  ) => {
    if (modal) {
      if (fetchData) {
        const nextData = await fetchData();
        setData((prev) => ({ ...prev, ...(nextData ?? {}) }));
      }
      setShowingModal(modal);
      setIsOpen(true);
    }
  };

  const setClose = () => {
    setIsOpen(false);
    setData({});
  };

  if (!isMounted) return <>{children}</>;

  return (
    <ModalContext.Provider
      value={{
        data,
        isOpen,
        setOpen,
        setClose,
      }}
    >
      {children}
      {showingModal}
    </ModalContext.Provider>
  );
};

export const useModal = () => {
  const context = useContext(ModalContext);
  if (!context) {
    throw new Error('useModal hook must be used within the modal provider');
  }
  return context;
};
