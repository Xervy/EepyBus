# EepyBus

Have you ever been on the bus home and either you just arent paying attention or want to sleep but can't because you are afraid of missing your stop? Well ur in the right place cuz this app is peak.

TOMORROW I WILL GET SCREENSHOTS (im not tryna dox myself rn)

## Why

I take the bus home from university and wanted to sleep without missing my stop. Existing apps either needed the screen on or only gave directions, so I built an alarm that works while the phone is locked.

## Features

- Long-press anywhere on the map to set your stop
- Choose the alert radius (500 m to 3 km); the radius is drawn on the map
- Works with the phone locked or the app in the background
- Sends a high-priority wake-up notification once, then turns itself off
- Refuses to start if you are already inside the radius, so you are never told "alarm set" when it can't fire
- Reopening the app while an alarm is running shows its pin and radius again

## How it works

1. You press **Set alarm**. The app asks for location ("Allow all the time") and notification permissions, then saves the stop and radius to the phone's storage.
2. It starts a background location task backed by an Android foreground service, which shows a persistent "alarm is on" notification so Android keeps it alive.
3. Each time the phone reports a new position (at most every 15 seconds, and only after moving 100 m), the task measures the distance to your stop with the haversine formula.
4. Positions with poor accuracy (worse than 300 m) are ignored, so a rough cell-tower fix can't trigger the alarm early.
5. When you are inside the radius, the task sends the wake-up notification and stops tracking.

### Why not geofencing?

The first version used Android geofencing, which is battery-efficient and built for "tell me when I enter this area". On a real bus ride it never fired. Switching to location updates with my own distance check costs more battery while an alarm is active, but gives control over how often the position is checked and lets me filter out bad GPS fixes.

## Tech stack

- React Native with Expo (development and preview builds via EAS Build)
- TypeScript
- `expo-location` and `expo-task-manager` for background tracking
- `expo-notifications` for the alert
- `react-native-maps` (Google Maps on Android)
- `@react-native-async-storage/async-storage` to share the alarm's settings with the background task

## Project structure

The code follows one rule: UI calls hooks, hooks call services, and services call Expo. Each file has one job.

```
App.tsx                      renders the screen
index.ts                     registers the background task first, then the app
src/
  screens/MapScreen.tsx      the map and its state
  components/                AlarmPanel (bottom card), RadiusPicker (radius chips)
  hooks/useAlarm.ts          alarm state and actions for the UI
  services/
    tracking.ts              start/stop background location updates
    alarmStorage.ts          save/load the active alarm on disk
    permissions.ts           location and notification permissions
    notifications.ts         Android alarm channel and the wake-up alert
    location.ts              current and last-known position
  tasks/locationTask.ts      background task: distance check, then alert
  utils/                     distance (haversine) and distance formatting
  constants.ts, types.ts
```

## Getting started

This app needs a development or preview build. It does not run in Expo Go, because Expo Go doesn't support background location.

### Prerequisites

- Node.js and npm
- An [Expo](https://expo.dev) account and the EAS CLI (`npm install -g eas-cli`)
- A Google Cloud API key with **Maps SDK for Android** enabled

### Install

```
git clone https://github.com/xervy/EepyBus.git
cd EepyBus
npm install
```

### Google Maps API key

The key is not stored in this repository. `app.config.js` reads it from the `GOOGLE_MAPS_API_KEY` environment variable at build time. Store it with EAS:

```
eas env:set --name GOOGLE_MAPS_API_KEY --value YOUR_KEY --environment preview --visibility sensitive
```

Restrict the key in Google Cloud to your app's package name (`com.xervy.eepybus`) and your build's SHA-1 fingerprint (`eas credentials` shows it). If you fork this project, use your own package name, which also means your own signing key.

### Build an installable APK

```
eas build --profile preview --platform android
```

When the build finishes, open the link on your phone and install the APK.

### Development build

```
eas build --profile development --platform android
npx expo start --dev-client
```

### First launch on the phone

1. Allow location, and choose **Allow all the time** when asked.
2. Allow notifications.
3. In Settings, Apps, EepyBus, Battery, set the app to **Unrestricted**, or the phone may stop the tracking while you sleep.
4. Keep the phone off silent mode, or the alert will be silent.

## Known limitations

- Android only so far; the iOS configuration is in place but untested
- Uses more battery than geofencing while an alarm is running
- Position updates are spaced out, so at bus speed the alert can arrive a few hundred meters after the radius edge; use a radius of 1 km or more
- A single notification, not a repeating alarm, so a deep sleeper could miss it
- Some phone makers close background apps aggressively; see the battery setting above

## Roadmap

- Clock-style alarm that keeps ringing until dismissed
- Radius slider from 50 m to 10 km, with finer control at short distances
- Saved, named stops
- Saved routes: a list of stops that starts the next one automatically (for transfers)