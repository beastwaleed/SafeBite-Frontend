import React from "react";
import { StyleSheet, View, Text, SafeAreaView } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { COLORS, TYPOGRAPHY, SPACING, RADIUS } from "../../constants/theme";
import { SafeBiteCard } from "../../components/common/SafeBiteCard";

export const SavedPlaceholderScreen: React.FC = () => {
  return (
    <SafeAreaView style={styles.safeArea}>
      <View style={styles.container}>
        <View style={styles.iconCircle}>
          <Ionicons name="bookmark-outline" size={48} color={COLORS.primary} />
        </View>

        <Text style={styles.title}>Saved Products & Watchlist</Text>

        <View style={styles.badge}>
          <Text style={styles.badgeText}>Ready for Phase 2 Integration</Text>
        </View>

        <SafeBiteCard style={styles.infoCard}>
          <Text style={styles.infoTitle}>Favorites & Watchlist Sync</Text>
          <Text style={styles.infoBody}>
            The backend user data endpoints (`/api/user/favorites` and `/api/user/watchlist`)
            are ready. Once product details screens are built, you will be able to pin
            frequently purchased items and track evidence updates here.
          </Text>
        </SafeBiteCard>
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
    alignItems: "center",
    justifyContent: "center",
    paddingHorizontal: SPACING.lg,
  },
  iconCircle: {
    width: 96,
    height: 96,
    borderRadius: RADIUS.pill,
    backgroundColor: COLORS.surfaceLightGreen,
    justifyContent: "center",
    alignItems: "center",
    marginBottom: SPACING.md,
  },
  title: {
    fontFamily: TYPOGRAPHY.fontFamily.primaryBold,
    fontSize: TYPOGRAPHY.fontSize.title,
    color: COLORS.textPrimary,
    marginBottom: SPACING.xs,
    textAlign: "center",
  },
  badge: {
    backgroundColor: COLORS.surfaceLightGreen,
    paddingHorizontal: SPACING.md,
    paddingVertical: 4,
    borderRadius: RADIUS.pill,
    borderWidth: 1,
    borderColor: "#CBE4D2",
    marginBottom: SPACING.lg,
  },
  badgeText: {
    fontFamily: TYPOGRAPHY.fontFamily.primarySemiBold,
    fontSize: TYPOGRAPHY.fontSize.xs,
    color: COLORS.primary,
  },
  infoCard: {
    alignItems: "center",
  },
  infoTitle: {
    fontFamily: TYPOGRAPHY.fontFamily.primarySemiBold,
    fontSize: TYPOGRAPHY.fontSize.md,
    color: COLORS.textPrimary,
    marginBottom: SPACING.xs,
  },
  infoBody: {
    fontFamily: TYPOGRAPHY.fontFamily.primary,
    fontSize: TYPOGRAPHY.fontSize.xs,
    lineHeight: TYPOGRAPHY.lineHeight.sm,
    color: COLORS.textSecondary,
    textAlign: "center",
  },
});

export default SavedPlaceholderScreen;

