import * as Notifications from "expo-notifications";
import { ALARM_CHANNEL_ID } from "../constants";

// Controls how notifications look while the app is in the foreground.
Notifications.setNotificationHandler({
  handleNotification: async () => ({
    shouldShowBanner: true,
    shouldShowList: true,
    shouldPlaySound: true,
    shouldSetBadge: false,
  }),
});

/** Android only: loudness/vibration live on the channel, not the notification. */
export async function setupAlarmChannel() {
  await Notifications.setNotificationChannelAsync(ALARM_CHANNEL_ID, {
    name: "Stop alarm",
    importance: Notifications.AndroidImportance.MAX,
    vibrationPattern: [0, 500, 300, 500, 300, 500],
    sound: "default",
    bypassDnd: true,
  });
}

export async function sendWakeUpAlert() {
  // Safe to call repeatedly; the headless task may run before the app UI ever did.
  await setupAlarmChannel();

  await Notifications.scheduleNotificationAsync({
    content: {
      title: "Wake up!",
      body: "You're almost at your stop.",
      sound: true,
      interruptionLevel: "timeSensitive", // iOS 15+
    },
    trigger: { channelId: ALARM_CHANNEL_ID },
  });
}
