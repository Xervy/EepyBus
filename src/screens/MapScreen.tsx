import React, { useEffect, useRef, useState } from "react";
import { Alert, StyleSheet, View } from "react-native";
import MapView, { Circle, Marker, PROVIDER_GOOGLE } from "react-native-maps";
import AlarmPanel from "../components/AlarmPanel";
import { DEFAULT_MAP_CENTER, DEFAULT_RADIUS_M } from "../constants";
import { useAlarm } from "../hooks/useAlarm";
import { getCurrentCoords, getLastKnownCoords } from "../services/location";
import { ensureForegroundLocation } from "../services/permissions";
import type { Destination } from "../types";

const START_DELTA = 0.05; // how zoomed-in the map starts (degrees)

export default function MapScreen() {
  const { active, config, arm, cancel } = useAlarm();
  const mapRef = useRef<MapView>(null);

  const [destination, setDestination] = useState<Destination | null>(null);
  const [radius, setRadius] = useState(DEFAULT_RADIUS_M);
  const [locationGranted, setLocationGranted] = useState(false);
  const [busy, setBusy] = useState(false);

  // Center the map on the user once we know where they are.
  useEffect(() => {
    (async () => {
      const granted = await ensureForegroundLocation();
      setLocationGranted(granted);
      if (!granted) return;
      try {
        const here = (await getLastKnownCoords()) ?? (await getCurrentCoords());
        mapRef.current?.animateToRegion(
          { ...here, latitudeDelta: START_DELTA, longitudeDelta: START_DELTA },
          500,
        );
      } catch {
        // No fix yet; the map just stays on the default center.
      }
    })();
  }, []);

  // If an alarm is already running (e.g. app reopened), show its pin and radius.
  useEffect(() => {
    if (config) {
      setDestination(config.destination);
      setRadius(config.radiusMeters);
    }
  }, [config]);

  const onToggle = async () => {
    if (active) {
      setBusy(true);
      await cancel();
      setBusy(false);
      return;
    }
    if (!destination) {
      Alert.alert("Pick your stop", "Long-press the map to drop a pin.");
      return;
    }
    setBusy(true);
    const result = await arm(destination, radius);
    setBusy(false);
    if (!result.ok) Alert.alert("Couldn't set alarm", result.reason);
  };

  return (
    <View style={styles.container}>
      <MapView
        ref={mapRef}
        style={StyleSheet.absoluteFill}
        provider={PROVIDER_GOOGLE}
        initialRegion={{
          ...DEFAULT_MAP_CENTER,
          latitudeDelta: START_DELTA,
          longitudeDelta: START_DELTA,
        }}
        showsUserLocation={locationGranted}
        // Pin can't move while the alarm is running.
        onLongPress={(e) => {
          if (!active) setDestination(e.nativeEvent.coordinate);
        }}
      >
        {destination && (
          <>
            <Marker coordinate={destination} />
            <Circle
              center={destination}
              radius={radius}
              strokeWidth={2}
              strokeColor="rgba(25, 118, 210, 0.9)"
              fillColor="rgba(25, 118, 210, 0.2)"
            />
          </>
        )}
      </MapView>

      <AlarmPanel
        hasDestination={destination !== null}
        active={active}
        radius={radius}
        onRadiusChange={setRadius}
        onToggle={onToggle}
        busy={busy}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
});
