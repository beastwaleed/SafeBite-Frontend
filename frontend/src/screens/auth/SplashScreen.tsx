import React from "react";
import { StyleSheet, View, Text, Image, ActivityIndicator } from "react-native";
import { COLORS, TYPOGRAPHY, SPACING } from "../../constants/theme";

export const SplashScreen: React.FC = () => {
  return (
    <View style={styles.container}>
      <View style={styles.centerContent}>
        <Image
          source={require("../../../assets/SafeBite-Logo.png")}
          style={styles.logo}
          resizeMode="contain"
        />
        <Text style={styles.title}>SafeBite</Text>
        <Text style={styles.tagline}>Understand what's in your food.</Text>
      </View>

      <View style={styles.footer}>
        <ActivityIndicator size="small" color={COLORS.primary} />
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.background,
    justifyContent: "space-between",
    alignItems: "center",
    paddingVertical: SPACING.xxl,
  },
  centerContent: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    paddingHorizontal: SPACING.xl,
  },
  logo: {
    width: 120,
    height: 120,
    marginBottom: SPACING.md,
  },
  title: {
    fontFamily: TYPOGRAPHY.fontFamily.primaryBold,
    fontSize: TYPOGRAPHY.fontSize.display,
    color: COLORS.primary,
    letterSpacing: -0.5,
  },
  tagline: {
    fontFamily: TYPOGRAPHY.fontFamily.primaryMedium,
    fontSize: TYPOGRAPHY.fontSize.md,
    color: COLORS.textSecondary,
    marginTop: SPACING.xs,
    textAlign: "center",
  },
  footer: {
    height: 40,
    justifyContent: "center",
    alignItems: "center",
  },
});

export default SplashScreen;

