import { LocalNotifications } from '@capacitor/local-notifications';

export const setupAlarmSystem = async () => {
  // 1. Request permissions
  const perm = await LocalNotifications.requestPermissions();
  if (perm.display !== 'granted') return;

  // 2. Create the "System Alarm" Channel
  // Note: We delete first to ensure any sound changes are applied
  await LocalNotifications.deleteChannel({ id: 'system-alarm' });
  
  await LocalNotifications.createChannel({
    id: 'system-alarm',
    name: 'System Alarms',
    description: 'Critical System Warnings and Alarms',
    importance: 5, // High Importance
    visibility: 1,
    sound: 'alarm_sound', // References android/app/src/main/res/raw/alarm_sound.mp3
    vibration: true,
  });
};

// ADDED 'export' KEYWORD HERE
export const checkAlarmPermissions = async () => {
  // Check if we have permission to schedule exact alarms (Android 12+)
  const status = await LocalNotifications.checkExactNotificationSetting();
  
  if (status.exact_alarm !== 'granted') {
    // This opens the native Android settings for the user
    await LocalNotifications.changeExactNotificationSetting();
  }
};

export const scheduleWakeUpAlarm = async (timeString) => {
  if (!timeString) return;
  
  const [hours, minutes] = timeString.split(':').map(Number);

  // 1. Cancel all previous alarms to stop the "Every Minute" spam
  await LocalNotifications.cancel({ notifications: [{ id: 100 }] });

  // 2. Schedule using the 'on' property (Best for Daily Alarms)
  await LocalNotifications.schedule({
    notifications: [
      {
        title: "🚨 SYSTEM INITIALIZED",
        body: "Time to wake up, Hunter. Your daily quests have been reset.",
        id: 100,
        schedule: { 
            on: { hour: hours, minute: minutes }, // Fires exactly at this time
            allowWhileIdle: true, 
            repeats: true,
            // 'every' is NOT needed when using 'on' for daily repeats
        },
        channelId: 'system-alarm',
        actionTypeId: 'OPEN_APP',
        importance: 5,
      }
    ]
  });
  console.log(`Alarm set for ${hours}:${minutes} daily.`);
};