import React from "react";
import { Pressable, StyleSheet, Text, View } from "react-native";
import { formatDistance } from "../utils/formatDistance";

type Props = {
  options: number[];
  value: number;
  onChange: (meters: number) => void;
  disabled?: boolean;
};

export default function RadiusPicker({ options, value, onChange, disabled }: Props) {
  return (
    <View style={styles.row}>
      {options.map((meters) => {
        const selected = meters === value;
        return (
          <Pressable
            key={meters}
            disabled={disabled}
            onPress={() => onChange(meters)}
            style={[
              styles.chip,
              selected && styles.chipSelected,
              disabled && styles.chipDisabled,
            ]}
          >
            <Text style={[styles.label, selected && styles.labelSelected]}>
              {formatDistance(meters)}
            </Text>
          </Pressable>
        );
      })}
    </View>
  );
}

const styles = StyleSheet.create({
  row: { flexDirection: "row", flexWrap: "wrap", gap: 8 },
  chip: {
    paddingVertical: 8,
    paddingHorizontal: 14,
    borderRadius: 20,
    borderWidth: 1,
    borderColor: "#b0bec5",
    backgroundColor: "#fff",
  },
  chipSelected: { backgroundColor: "#1976d2", borderColor: "#1976d2" },
  chipDisabled: { opacity: 0.5 },
  label: { fontSize: 14, color: "#37474f" },
  labelSelected: { color: "#fff", fontWeight: "600" },
});
