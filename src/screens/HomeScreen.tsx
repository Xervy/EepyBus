import React from "react";
import { Alert, Button, StyleSheet, Text, View } from "react-native";
import { DEFAULT_RADIUS_M, TEST_DESTINATION } from "../constants";
import { useAlarm } from "../hooks/useAlarm";

export default function HomeScreen() {
  const { active, arm, cancel } = useAlarm();

  const onPress = async () => {
    if (active) {
      await cancel();
      Alert.alert("Alarm stopped", "Geofence tracking disabled.");
      return;
    }

    const result = await arm(TEST_DESTINATION, DEFAULT_RADIUS_M);
    if (result.ok) {
      Alert.alert(
        "Alarm set!",
        `You'll be alerted within ${DEFAULT_RADIUS_M} m. You can lock your phone now.`,
      );
    } else {
      Alert.alert("Couldn't set alarm", result.reason);
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Transit Bus Alarm</Text>
      <Text style={styles.subtitle}>
        Status: {active ? "Active (monitoring)" : "Inactive"}
      </Text>
      <Button
        title={active ? "Cancel Alarm" : `Set Test Alarm (${DEFAULT_RADIUS_M} m)`}
        onPress={onPress}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    padding: 20,
  },
  title: { fontSize: 24, fontWeight: "bold", marginBottom: 10 },
  subtitle: { fontSize: 16, color: "#666", marginBottom: 30 },
});
