import React from "react";
import { StyleSheet, View, ViewProps, ViewStyle } from "react-native";
import { COLORS, RADIUS, SPACING, SHADOWS } from "../../constants/theme";

export interface SafeBiteCardProps extends ViewProps {
  style?: ViewStyle;
  children: React.ReactNode;
}

export const SafeBiteCard: React.FC<SafeBiteCardProps> = ({
  style,
  children,
  ...rest
}) => {
  return (
    <View style={[styles.card, style]} {...rest}>
      {children}
    </View>
  );
};

const styles = StyleSheet.create({
  card: {
    width: "100%",
    backgroundColor: COLORS.card,
    borderRadius: RADIUS.card,
    padding: SPACING.md,
    borderWidth: 1,
    borderColor: COLORS.border,
    ...SHADOWS.card,
  },
});

export default SafeBiteCard;

