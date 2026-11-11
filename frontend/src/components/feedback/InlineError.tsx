import React from "react";
import { StyleSheet, Text, View, TouchableOpacity, ViewStyle } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { COLORS, TYPOGRAPHY, SPACING, RADIUS } from "../../constants/theme";

export interface InlineErrorProps {
  message: string;
  onRetry?: () => void;
  style?: ViewStyle;
}

export const InlineError: React.FC<InlineErrorProps> = ({
  message,
  onRetry,
  style,
}) => {
  if (!message) return null;

  return (
    <View style={[styles.container, style]}>
      <Ionicons name="alert-circle" size={20} color={COLORS.error} style={styles.icon} />
      <Text style={styles.message}>{message}</Text>
      {onRetry && (
        <TouchableOpacity activeOpacity={0.7} onPress={onRetry} style={styles.retryButton}>
          <Text style={styles.retryText}>Retry</Text>
        </TouchableOpacity>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: COLORS.errorBackground,
    borderRadius: RADIUS.sm,
    padding: SPACING.sm,
    borderWidth: 1,
    borderColor: "#FECACA",
    marginVertical: SPACING.xs,
    width: "100%",
  },
  icon: {
    marginRight: SPACING.sm,
  },
  message: {
    flex: 1,
    fontFamily: TYPOGRAPHY.fontFamily.primaryMedium,
    fontSize: TYPOGRAPHY.fontSize.xs,
    lineHeight: TYPOGRAPHY.lineHeight.sm,
    color: COLORS.error,
  },
  retryButton: {
    marginLeft: SPACING.sm,
    paddingHorizontal: SPACING.xs,
    paddingVertical: 2,
  },
  retryText: {
    fontFamily: TYPOGRAPHY.fontFamily.primarySemiBold,
    fontSize: TYPOGRAPHY.fontSize.xs,
    color: COLORS.error,
    textDecorationLine: "underline",
  },
});

export default InlineError;

