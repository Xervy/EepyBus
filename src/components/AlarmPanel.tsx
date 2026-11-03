import React from "react";
import { Pressable, StyleSheet, Text, View } from "react-native";
import { RADIUS_OPTIONS_M } from "../constants";
import RadiusPicker from "./RadiusPicker";

type Props = {
  hasDestination: boolean;
  active: boolean;
  radius: number;
  onRadiusChange: (meters: number) => void;
  onToggle: () => void;
  busy: boolean;
};

export default function AlarmPanel({
  hasDestination,
  active,
  radius,
  onRadiusChange,
  onToggle,
  busy,
}: Props) {
  const hint = active
    ? "Alarm is on"
    : hasDestination
      ? "Alert me when I get close to this stop"
      : "Long-press the map to set a location";

  return (
    <View style={styles.panel}>
      <Text style={styles.hint}>{hint}</Text>

      {hasDestination && (
        <RadiusPicker
          options={RADIUS_OPTIONS_M}
          value={radius}
          onChange={onRadiusChange}
          disabled={active}
        />
      )}

      <Pressable
        onPress={onToggle}
        disabled={busy}
        style={[styles.button, active && styles.buttonCancel, busy && styles.buttonBusy]}
      >
        <Text style={styles.buttonText}>{active ? "Cancel alarm" : "Set alarm"}</Text>
      </Pressable>
    </View>
  );
}

const styles = StyleSheet.create({
  panel: {
    position: "absolute",
    left: 0,
    right: 0,
    bottom: 0,
    padding: 16,
    paddingBottom: 40, // clears the Android navigation bar
    gap: 12,
    backgroundColor: "#fff",
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    elevation: 8,
  },
  hint: { fontSize: 15, color: "#37474f" },
  button: {
    paddingVertical: 14,
    borderRadius: 12,
    alignItems: "center",
    backgroundColor: "#1976d2",
  },
  buttonCancel: { backgroundColor: "#c62828" },
  buttonBusy: { opacity: 0.6 },
  buttonText: { color: "#fff", fontSize: 16, fontWeight: "600" },
});
