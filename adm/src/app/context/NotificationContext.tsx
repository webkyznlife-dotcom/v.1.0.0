import React, { createContext, useContext, useState, ReactNode } from "react";
import SuccessNotificationDialog from "../../../src/app/components/ui/dialogs/SuccessNotificationDialog";
import ErrorDialog from "../../../src/app/components/ui/dialogs/ErrorDialog";

interface NotificationContextType {
  showSuccess: (message?: string) => void;
  showError: (message?: string) => void;
  hide: () => void;
}

const NotificationContext = createContext<NotificationContextType | undefined>(undefined);

export const NotificationProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [successVisible, setSuccessVisible] = useState(false);
  const [errorVisible, setErrorVisible] = useState(false);
  const [message, setMessage] = useState<string>("");

  const showSuccess = (msg?: string) => {
    setMessage(msg || "Success");
    setErrorVisible(false); // pastikan error modal ditutup dulu
    setSuccessVisible(true);
  };

  const showError = (msg?: string) => {
    setMessage(msg || "Something went wrong");
    setSuccessVisible(false); // pastikan success modal ditutup dulu
    setErrorVisible(true);
  };

  const hide = () => {
    setSuccessVisible(false);
    setErrorVisible(false);
  };

  return (
    <NotificationContext.Provider value={{ showSuccess, showError, hide }}>
      {children}

      {/* Success dialog */}
      <SuccessNotificationDialog
        visible={successVisible}
        onClose={hide}
        message={message}
        zIndex={2000} // pastikan selalu di depan
      />

      {/* Error dialog */}
      <ErrorDialog
        visible={errorVisible}
        onClose={hide}
        message={message}
        zIndex={2000} // pastikan selalu di depan
      />
    </NotificationContext.Provider>
  );
};

export const useNotification = (): NotificationContextType => {
  const context = useContext(NotificationContext);
  if (!context) {
    throw new Error("useNotification must be used within a NotificationProvider");
  }
  return context;
};
