import { StatusBar } from 'expo-status-bar';
import React, { useEffect, useState } from 'react';
import { StyleSheet, Text, View, Button, Alert, ActivityIndicator } from 'react-native';
import * as Location from 'expo-location';
import * as TaskManager from 'expo-task-manager';
import * as Notifications from 'expo-notifications';

const GEOFENCE_TASK_NAME = 'TRANSIT_ALARM_GEOFENCE_TASK';

// Configure Notifications
Notifications.setNotificationHandler({
  handleNotification: async () => ({
    shouldShowBanner: true,
    shouldShowList: true,
    shouldPlaySound: true,
    shouldSetBadge: false,
  }),
});

TaskManager.defineTask(GEOFENCE_TASK_NAME, async ({ data, error }: any) => {
  if (error) {
    console.error('Geofence Task Error:', error);
    return;
  }
  const { eventType } = data;
  
  if (eventType === Location.GeofencingEventType.Enter) {
    await Notifications.scheduleNotificationAsync({
      content: {
        title: "Wake Up!",
        body: "You are approaching your stop!",
        sound: true,
        priority: Notifications.AndroidNotificationPriority.MAX,
      },
      trigger: null, // Fire immediately
    });
  }
});


export default function App() {
  const [isMonitoring, setIsMonitoring] = useState(false);

  useEffect(() => {
    (async () => {
      // 1. Request Foreground Permission
      const { status: fgStatus } = await Location.requestForegroundPermissionsAsync();
      if (fgStatus !== 'granted') {
        Alert.alert('Permission Denied', 'Foreground location access is required.');
        return;
      }

      // 2. Request Background Permission ("Allow all the time")
      const { status: bgStatus } = await Location.requestBackgroundPermissionsAsync();
      if (bgStatus !== 'granted') {
        Alert.alert('Permission Denied', 'Background location access is required to alarm while phone is locked.');
      }

      // 3. Request Notification Permission
      await Notifications.requestPermissionsAsync();

      // Check if geofence task is already active
      const hasStarted = await Location.hasStartedGeofencingAsync(GEOFENCE_TASK_NAME);
      setIsMonitoring(hasStarted);
    })();
  }, []);

  const toggleAlarm = async () => {
    if (isMonitoring) {
      await Location.stopGeofencingAsync(GEOFENCE_TASK_NAME);
      setIsMonitoring(false);
      Alert.alert('Alarm Stopped', 'Geofence tracking disabled.');
    } else {
      // Temporary test coordinates (e.g., center point with 400m radius)
      const testRegion = {
        identifier: 'BUS_STOP_TARGET',
        latitude: 49.2606,
        longitude: -123.2460,
        radius: 400, // 400 meters
        notifyOnEnter: true,
        notifyOnExit: false,
      };

      await Location.startGeofencingAsync(GEOFENCE_TASK_NAME, [testRegion]);
      setIsMonitoring(true);
      Alert.alert('Alarm Set!', 'Geofence active (400m radius). You can lock your phone now.');
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Transit Bus Alarm</Text>
      <Text style={styles.subtitle}>
        Status: {isMonitoring ? 'Active (Monitoring GPS)' : 'Inactive'}
      </Text>
      <Button 
        title={isMonitoring ? "Cancel Alarm" : "Set Test Alarm (400m Radius)"} 
        onPress={toggleAlarm} 
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, justifyContent: 'center', alignItems: 'center', padding: 20 },
  title: { fontSize: 24, fontWeight: 'bold', marginBottom: 10 },
  subtitle: { fontSize: 16, color: '#666', marginBottom: 30 },
});