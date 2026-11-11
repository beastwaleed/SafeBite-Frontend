import React from "react";
import {
  StyleSheet,
  Text,
  View,
  Image,
  ActivityIndicator,
  SafeAreaView,
  ScrollView,
} from "react-native";
import { StatusBar } from "expo-status-bar";
import {
  useFonts,
  Poppins_400Regular,
  Poppins_500Medium,
  Poppins_600SemiBold,
  Poppins_700Bold,
} from "@expo-google-fonts/poppins";
import {
  Inter_400Regular,
  Inter_500Medium,
  Inter_600SemiBold,
} from "@expo-google-fonts/inter";
import { COLORS, TYPOGRAPHY, SPACING, RADIUS, SHADOWS } from "./src/constants/theme";
import { ENV } from "./src/config/env";

export default function App() {
  const [fontsLoaded] = useFonts({
    Poppins_400Regular,
    Poppins_500Medium,
    Poppins_600SemiBold,
    Poppins_700Bold,
    Inter_400Regular,
    Inter_500Medium,
    Inter_600SemiBold,
  });

  if (!fontsLoaded) {
    return (
      <View style={styles.loadingContainer}>
        <StatusBar style="dark" />
        <ActivityIndicator size="large" color={COLORS.primary} />
      </View>
    );
  }

  return (
    <SafeAreaView style={styles.safeArea}>
      <StatusBar style="dark" />
      <ScrollView contentContainerStyle={styles.scrollContent}>
        {/* Header / Logo Section */}
        <View style={styles.header}>
          <Image
            source={require("./assets/SafeBite-Logo.png")}
            style={styles.logo}
            resizeMode="contain"
          />
          <Text style={styles.appName}>SafeBite</Text>
          <Text style={styles.tagline}>Understand what's in your food.</Text>
        </View>

        {/* Foundation Status Card */}
        <View style={styles.card}>
          <View style={styles.badgeRow}>
            <View style={styles.statusBadge}>
              <Text style={styles.statusBadgeText}>Stage 1 Foundation Ready</Text>
            </View>
          </View>
          <Text style={styles.cardTitle}>Mobile Architecture Initialized</Text>
          <Text style={styles.cardBody}>
            Expo SDK 58 TypeScript foundation established with SafeBite design tokens,
            Poppins & Inter typography, and secure storage scaffolding.
          </Text>

          <View style={styles.divider} />

          <View style={styles.infoRow}>
            <Text style={styles.infoLabel}>Configured API:</Text>
            <Text style={styles.infoValue} numberOfLines={1}>
              {ENV.API_BASE_URL}
            </Text>
          </View>

          <View style={styles.infoRow}>
            <Text style={styles.infoLabel}>Platform Target:</Text>
            <Text style={styles.infoValue}>Android 393 × 852 (Responsive)</Text>
          </View>
        </View>

        {/* Design System Palette Verification */}
        <View style={styles.card}>
          <Text style={styles.cardSubtitle}>Design Tokens Verification</Text>

          <View style={styles.paletteRow}>
            <View style={[styles.colorBox, { backgroundColor: COLORS.primary }]}>
              <Text style={styles.colorLabelLight}>Primary</Text>
              <Text style={styles.colorHexLight}>#085F2D</Text>
            </View>
            <View style={[styles.colorBox, { backgroundColor: COLORS.surfaceLightGreen }]}>
              <Text style={styles.colorLabelDark}>Light Green</Text>
              <Text style={styles.colorHexDark}>#E5F2E9</Text>
            </View>
            <View style={[styles.colorBox, { backgroundColor: COLORS.card, borderColor: COLORS.border, borderWidth: 1 }]}>
              <Text style={styles.colorLabelDark}>Surface</Text>
              <Text style={styles.colorHexDark}>#FFFFFF</Text>
            </View>
          </View>

          <View style={styles.paletteRow}>
            <View style={[styles.statusBox, { backgroundColor: COLORS.status.belowLimit }]}>
              <Text style={styles.statusBoxText}>Below Limit</Text>
            </View>
            <View style={[styles.statusBox, { backgroundColor: COLORS.status.closeToLimit }]}>
              <Text style={styles.statusBoxText}>Close to Limit</Text>
            </View>
            <View style={[styles.statusBox, { backgroundColor: COLORS.status.aboveLimit }]}>
              <Text style={styles.statusBoxText}>Above Limit</Text>
            </View>
          </View>
        </View>

        {/* Regulatory & Decision-Support Disclaimer (SRS Requirement) */}
        <View style={styles.disclaimerContainer}>
          <Text style={styles.disclaimerText}>
            SafeBite provides food-safety decision support based on documented research
            and regulatory standards. It does not provide medical diagnoses or safety
            guarantees. Missing data is never treated as evidence of safety.
          </Text>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: COLORS.background,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: COLORS.background,
  },
  scrollContent: {
    padding: SPACING.md,
    alignItems: "center",
  },
  header: {
    alignItems: "center",
    marginTop: SPACING.lg,
    marginBottom: SPACING.lg,
  },
  logo: {
    width: 90,
    height: 90,
    marginBottom: SPACING.sm,
  },
  appName: {
    fontFamily: TYPOGRAPHY.fontFamily.primaryBold,
    fontSize: TYPOGRAPHY.fontSize.title,
    color: COLORS.primary,
    letterSpacing: -0.5,
  },
  tagline: {
    fontFamily: TYPOGRAPHY.fontFamily.primaryMedium,
    fontSize: TYPOGRAPHY.fontSize.sm,
    color: COLORS.textSecondary,
    marginTop: 2,
  },
  card: {
    width: "100%",
    backgroundColor: COLORS.card,
    borderRadius: RADIUS.card,
    padding: SPACING.md,
    marginBottom: SPACING.md,
    borderWidth: 1,
    borderColor: COLORS.border,
    ...SHADOWS.card,
  },
  badgeRow: {
    flexDirection: "row",
    marginBottom: SPACING.xs,
  },
  statusBadge: {
    backgroundColor: COLORS.surfaceLightGreen,
    paddingHorizontal: SPACING.sm,
    paddingVertical: 4,
    borderRadius: RADIUS.pill,
  },
  statusBadgeText: {
    fontFamily: TYPOGRAPHY.fontFamily.primarySemiBold,
    fontSize: TYPOGRAPHY.fontSize.xs,
    color: COLORS.primary,
  },
  cardTitle: {
    fontFamily: TYPOGRAPHY.fontFamily.primarySemiBold,
    fontSize: TYPOGRAPHY.fontSize.lg,
    color: COLORS.textPrimary,
    marginTop: SPACING.xs,
  },
  cardSubtitle: {
    fontFamily: TYPOGRAPHY.fontFamily.primarySemiBold,
    fontSize: TYPOGRAPHY.fontSize.md,
    color: COLORS.textPrimary,
    marginBottom: SPACING.sm,
  },
  cardBody: {
    fontFamily: TYPOGRAPHY.fontFamily.primary,
    fontSize: TYPOGRAPHY.fontSize.sm,
    lineHeight: TYPOGRAPHY.lineHeight.md,
    color: COLORS.textSecondary,
    marginTop: SPACING.xs,
  },
  divider: {
    height: 1,
    backgroundColor: COLORS.border,
    marginVertical: SPACING.sm,
  },
  infoRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginVertical: 4,
  },
  infoLabel: {
    fontFamily: TYPOGRAPHY.fontFamily.primaryMedium,
    fontSize: TYPOGRAPHY.fontSize.xs,
    color: COLORS.textSecondary,
  },
  infoValue: {
    fontFamily: TYPOGRAPHY.fontFamily.scientificMedium,
    fontSize: TYPOGRAPHY.fontSize.xs,
    color: COLORS.textPrimary,
    flexShrink: 1,
    marginLeft: SPACING.sm,
  },
  paletteRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: SPACING.sm,
  },
  colorBox: {
    flex: 1,
    height: 52,
    borderRadius: RADIUS.sm,
    justifyContent: "center",
    alignItems: "center",
    marginHorizontal: 3,
  },
  colorLabelLight: {
    fontFamily: TYPOGRAPHY.fontFamily.primarySemiBold,
    fontSize: 10,
    color: COLORS.textInverse,
  },
  colorHexLight: {
    fontFamily: TYPOGRAPHY.fontFamily.scientific,
    fontSize: 9,
    color: COLORS.textInverse,
    opacity: 0.85,
  },
  colorLabelDark: {
    fontFamily: TYPOGRAPHY.fontFamily.primarySemiBold,
    fontSize: 10,
    color: COLORS.textPrimary,
  },
  colorHexDark: {
    fontFamily: TYPOGRAPHY.fontFamily.scientific,
    fontSize: 9,
    color: COLORS.textSecondary,
  },
  statusBox: {
    flex: 1,
    paddingVertical: 6,
    borderRadius: RADIUS.sm,
    justifyContent: "center",
    alignItems: "center",
    marginHorizontal: 3,
  },
  statusBoxText: {
    fontFamily: TYPOGRAPHY.fontFamily.primaryMedium,
    fontSize: 10,
    color: COLORS.textInverse,
  },
  disclaimerContainer: {
    width: "100%",
    padding: SPACING.sm,
    backgroundColor: COLORS.surfaceGreenSubtle,
    borderRadius: RADIUS.sm,
    borderWidth: 1,
    borderColor: COLORS.surfaceLightGreen,
    marginTop: SPACING.xs,
  },
  disclaimerText: {
    fontFamily: TYPOGRAPHY.fontFamily.primary,
    fontSize: TYPOGRAPHY.fontSize.xs,
    lineHeight: TYPOGRAPHY.lineHeight.xs,
    color: COLORS.textSecondary,
    textAlign: "center",
  },
});
