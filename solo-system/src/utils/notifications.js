export const systemNotifications = {
  requestPermission: async () => {
    if (!("Notification" in window)) {
      console.log("This browser does not support desktop notification");
      return;
    }
    if (Notification.permission !== "granted") {
      await Notification.requestPermission();
    }
  },

  sendWarning: (message) => {
    if (Notification.permission === "granted") {
      new Notification("⚠️ SYSTEM WARNING", {
        body: message,
        icon: "/logo192.png", // Ensure you have a logo in your public folder
        vibrate: [200, 100, 200],
        silent: false,
      });
    }
  }
};