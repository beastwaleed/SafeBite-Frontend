import React from "react";
import {
  StyleSheet,
  Text,
  TouchableOpacity,
  ActivityIndicator,
  ViewStyle,
  TextStyle,
  View,
} from "react-native";
import { COLORS, TYPOGRAPHY, SPACING, RADIUS, DIMENSIONS } from "../../constants/theme";

export type ButtonVariant = "primary" | "secondary" | "light" | "danger" | "ghost";

export interface SafeBiteButtonProps {
  title: string;
  onPress: () => void;
  variant?: ButtonVariant;
  loading?: boolean;
  disabled?: boolean;
  leftIcon?: React.ReactNode;
  rightIcon?: React.ReactNode;
  style?: ViewStyle;
  textStyle?: TextStyle;
  fullWidth?: boolean;
}

export const SafeBiteButton: React.FC<SafeBiteButtonProps> = ({
  title,
  onPress,
  variant = "primary",
  loading = false,
  disabled = false,
  leftIcon,
  rightIcon,
  style,
  textStyle,
  fullWidth = true,
}) => {
  const getContainerStyle = (): ViewStyle => {
    switch (variant) {
      case "primary":
        return {
          backgroundColor: disabled ? COLORS.borderDark : COLORS.primary,
        };
      case "secondary":
        return {
          backgroundColor: "transparent",
          borderWidth: 1.5,
          borderColor: disabled ? COLORS.borderDark : COLORS.primary,
        };
      case "light":
        return {
          backgroundColor: disabled ? COLORS.borderLight : COLORS.surfaceLightGreen,
        };
      case "danger":
        return {
          backgroundColor: disabled ? COLORS.borderDark : COLORS.error,
        };
      case "ghost":
        return {
          backgroundColor: "transparent",
        };
    }
  };

  const getTextStyle = (): TextStyle => {
    switch (variant) {
      case "primary":
      case "danger":
        return {
          color: COLORS.textInverse,
        };
      case "secondary":
      case "light":
        return {
          color: disabled ? COLORS.textMuted : COLORS.primary,
        };
      case "ghost":
        return {
          color: disabled ? COLORS.textMuted : COLORS.textSecondary,
        };
    }
  };

  const indicatorColor =
    variant === "primary" || variant === "danger"
      ? COLORS.textInverse
      : COLORS.primary;

  return (
    <TouchableOpacity
      activeOpacity={0.8}
      onPress={onPress}
      disabled={disabled || loading}
      style={[
        styles.buttonBase,
        getContainerStyle(),
        fullWidth && styles.fullWidth,
        style,
      ]}
    >
      {loading ? (
        <ActivityIndicator size="small" color={indicatorColor} />
      ) : (
        <View style={styles.contentRow}>
          {leftIcon && <View style={styles.leftIconWrapper}>{leftIcon}</View>}
          <Text style={[styles.textBase, getTextStyle(), textStyle]}>
            {title}
          </Text>
          {rightIcon && <View style={styles.rightIconWrapper}>{rightIcon}</View>}
        </View>
      )}
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  buttonBase: {
    height: DIMENSIONS.buttonHeight,
    borderRadius: RADIUS.card,
    justifyContent: "center",
    alignItems: "center",
    paddingHorizontal: SPACING.md,
  },
  fullWidth: {
    width: "100%",
  },
  contentRow: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
  },
  leftIconWrapper: {
    marginRight: SPACING.sm,
  },
  rightIconWrapper: {
    marginLeft: SPACING.sm,
  },
  textBase: {
    fontFamily: TYPOGRAPHY.fontFamily.primarySemiBold,
    fontSize: TYPOGRAPHY.fontSize.md,
    letterSpacing: 0.1,
  },
});

export default SafeBiteButton;

