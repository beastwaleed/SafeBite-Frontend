import React from "react";
import {
  StyleSheet,
  View,
  Text,
  Image,
  ActivityIndicator,
  SafeAreaView,
} from "react-native";
import { COLORS, TYPOGRAPHY, SPACING, RADIUS } from "../../constants/theme";

export const SplashScreen: React.FC = () => {
  return (
    <SafeAreaView style={styles.safeArea}>
      <View style={styles.container}>
        {/* Centered Brand Presentation */}
        <View style={styles.centerContent}>
          <View style={styles.logoWrapper}>
            <Image
              source={require("../../../assets/SafeBite-Logo.png")}
              style={styles.logo}
              resizeMode="contain"
            />
          </View>

          <Text style={styles.headline}>Make more informed food choices</Text>
          <Text style={styles.subtext}>
            Food safety intelligence & research-backed evidence
          </Text>
        </View>

        {/* Bottom Loading & Status */}
        <View style={styles.footer}>
          <ActivityIndicator size="small" color={COLORS.primary} />
          <Text style={styles.loadingText}>Initializing SafeBite...</Text>

          <View style={styles.badge}>
            <Text style={styles.badgeText}>Decision-Support Platform • Pakistan</Text>
          </View>
        </View>
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: COLORS.background,
  },
  container: {
    flex: 1,
    justifyContent: "space-between",
    alignItems: "center",
    paddingHorizontal: SPACING.xl,
    paddingTop: SPACING.xxxl,
    paddingBottom: SPACING.xl,
  },
  centerContent: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    width: "100%",
    marginTop: -SPACING.xl,
  },
  logoWrapper: {
    width: 220,
    height: 220,
    justifyContent: "center",
    alignItems: "center",
    marginBottom: SPACING.lg,
  },
  logo: {
    width: 210,
    height: 210,
  },
  headline: {
    fontFamily: TYPOGRAPHY.fontFamily.primaryBold,
    fontSize: TYPOGRAPHY.fontSize.xxl,
    lineHeight: TYPOGRAPHY.lineHeight.xxl,
    color: COLORS.textPrimary,
    textAlign: "center",
    maxWidth: 320,
    marginBottom: SPACING.xs,
  },
  subtext: {
    fontFamily: TYPOGRAPHY.fontFamily.primaryMedium,
    fontSize: TYPOGRAPHY.fontSize.sm,
    lineHeight: TYPOGRAPHY.lineHeight.md,
    color: COLORS.textSecondary,
    textAlign: "center",
    maxWidth: 290,
  },
  footer: {
    alignItems: "center",
    width: "100%",
  },
  loadingText: {
    fontFamily: TYPOGRAPHY.fontFamily.primary,
    fontSize: TYPOGRAPHY.fontSize.xs,
    color: COLORS.textMuted,
    marginTop: SPACING.xs,
    marginBottom: SPACING.md,
  },
  badge: {
    backgroundColor: COLORS.surfaceLightGreen,
    borderRadius: RADIUS.pill,
    paddingHorizontal: SPACING.md,
    paddingVertical: 5,
    borderWidth: 1,
    borderColor: "#CBE4D2",
  },
  badgeText: {
    fontFamily: TYPOGRAPHY.fontFamily.primarySemiBold,
    fontSize: 10,
    color: COLORS.primary,
    letterSpacing: 0.3,
  },
});

export default SplashScreen;
