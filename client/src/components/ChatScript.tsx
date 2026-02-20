import { useEffect } from "react";

const ChatScript = () => {
  useEffect(() => {
    // 1. Define the first script (The Engine)
    const injectScript = document.createElement("script");
    injectScript.src = "https://cdn.botpress.cloud/desk/webchat/v3.4/inject.js";
    injectScript.async = true;

    // 2. Define what happens AFTER the engine loads
    injectScript.onload = () => {
      const configScript = document.createElement("script");
      // Use your exact config URL here
      configScript.src = "https://files.bpcontent.cloud/2026/02/20/22/20260220222510-MTWDTY82.js";
      configScript.async = true;
      configScript.defer = true;
      document.body.appendChild(configScript);
    };

    // 3. Start the process by adding the engine to the DOM
    document.body.appendChild(injectScript);

    // Cleanup: Remove them when the component unmounts to prevent multiple bots
    return () => {
      // Logic to remove scripts if needed, though usually, 
      // for a global bot, you can just let them stay.
      const botContainer = document.getElementById("bp-web-widget-container");
      if (botContainer) botContainer.remove();
    };
  }, []);

  return null;
};

export default ChatScript;