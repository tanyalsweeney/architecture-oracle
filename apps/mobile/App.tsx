import { useCallback, useEffect, useState } from "react";
import { SafeAreaView, ScrollView, StatusBar, StyleSheet, Text, View } from "react-native";
import { API_BASE } from "./src/config";

interface HealthPayload {
  status: string;
  service: string;
  timestamp: string;
}

export default function App() {
  const [health, setHealth] = useState<HealthPayload | null>(null);
  const [error, setError] = useState<string | null>(null);

  const fetchHealth = useCallback(async () => {
    try {
      const res = await fetch(`${API_BASE}/health`);
      if (!res.ok) {
        throw new Error(`Bad status ${res.status}`);
      }
      const json = (await res.json()) as HealthPayload;
      setHealth(json);
      setError(null);
    } catch (err) {
      setError((err as Error).message);
    }
  }, []);

  useEffect(() => {
    void fetchHealth();
  }, [fetchHealth]);

  return (
    <SafeAreaView style={styles.root}>
      <StatusBar barStyle="light-content" />
      <ScrollView contentContainerStyle={styles.content}>
        <View style={styles.card}>
          <Text style={styles.eyebrow}>Architecture Oracle</Text>
          <Text style={styles.title}>React Native Client</Text>
          <Text style={styles.body}>
            This screen pings the Express API to prove the stack is wired up. Update
            `API_BASE` in `src/config.ts` when you deploy.
          </Text>
        </View>
        <View style={styles.card}>
          <Text style={styles.eyebrow}>API status</Text>
          {health ? (
            <Text style={styles.body}>
              {health.service} responded at {new Date(health.timestamp).toLocaleTimeString()}
            </Text>
          ) : (
            <Text style={styles.body}>{error ?? "Fetching..."}</Text>
          )}
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  root: {
    flex: 1,
    backgroundColor: "#020617"
  },
  content: {
    padding: 24,
    gap: 16
  },
  card: {
    backgroundColor: "#0f172a",
    borderRadius: 18,
    padding: 20,
    borderWidth: 1,
    borderColor: "rgba(148, 163, 184, 0.4)"
  },
  eyebrow: {
    textTransform: "uppercase",
    letterSpacing: 4,
    color: "#a5b4fc",
    fontSize: 12,
    marginBottom: 12
  },
  title: {
    fontSize: 28,
    color: "#f8fafc",
    marginBottom: 10,
    fontWeight: "600"
  },
  body: {
    color: "#e2e8f0",
    fontSize: 16,
    lineHeight: 22
  }
});
