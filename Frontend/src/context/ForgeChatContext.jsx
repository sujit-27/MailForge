import { createContext, useContext, useState } from "react";

const ForgeChatContext = createContext();

export const ForgeChatProvider = ({ children }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [isDestroyed, setIsDestroyed] = useState(false);

  const openChat = () => {
    setIsDestroyed(false);
    setIsOpen(true);
  };

  const closeChat = () => setIsOpen(false);
  const destroyChat = () => {
    setIsOpen(false);
    setIsDestroyed(true);
  };

  return (
    <ForgeChatContext.Provider value={{
      isOpen,
      isDestroyed,
      openChat,
      closeChat,
      destroyChat
    }}>
      {children}
    </ForgeChatContext.Provider>
  );
};

export const useForgeChat = () => useContext(ForgeChatContext);
