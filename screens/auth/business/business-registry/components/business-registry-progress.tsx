import Text from "@/components/text";
import { View, StyleSheet } from "react-native";

interface Props {
  step: 1 | 2 | 3 | 4;
  percentageOverride?: string;
}

export const BusinessRegistryProgress = ({ step, percentageOverride }: Props) => {
  const percentage =
    percentageOverride ||
    (step === 1 ? '25%' : step === 2 ? '50%' : step === 3 ? '75%' : '100%');

  return (
    <View style={styles.container}>
      <View style={styles.row}>
        <Text style={styles.stepText}>Step {step} of 4</Text>
        <Text style={styles.percentageText}>{percentage} Completed</Text>
      </View>
      <View style={styles.progressBarBg}>
        <View style={[styles.progressBarFill, { width: percentage as any }]} />
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    gap: 12,
  },
  row: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  stepText: {
    fontSize: 16,
    fontWeight: '600',
    color: '#111111',
  },
  percentageText: {
    fontSize: 16,
    fontWeight: '700',
    color: '#8B5CF6',
  },
  progressBarBg: {
    height: 8,
    borderRadius: 100,
    backgroundColor: '#E2E8F0',
  },
  progressBarFill: {
    height: 8,
    borderRadius: 100,
    backgroundColor: '#8B5CF6',
  }
});
