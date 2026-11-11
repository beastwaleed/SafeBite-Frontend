import React from "react";
import {
  StyleSheet,
  View,
  Text,
  ScrollView,
  SafeAreaView,
  TouchableOpacity,
  Image,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { BottomTabNavigationProp } from "@react-navigation/bottom-tabs";
import { AppTabParamList } from "../../types/navigation.types";
import { COLORS, TYPOGRAPHY, SPACING, RADIUS, SHADOWS } from "../../constants/theme";
import { SafeBiteCard } from "../../components/common/SafeBiteCard";
import { useAuth } from "../../context/AuthContext";

interface HomeDashboardScreenProps {
  navigation: BottomTabNavigationProp<AppTabParamList, "HomeTab">;
}

export const HomeDashboardScreen: React.FC<HomeDashboardScreenProps> = ({ navigation }) => {
  const { user } = useAuth();
  const displayName = user?.fullName?.split(" ")[0] || "there";

  return (
    <SafeAreaView style={styles.safeArea}>
      <ScrollView contentContainerStyle={styles.container} showsVerticalScrollIndicator={false}>
        {/* Top Header */}
        <View style={styles.headerRow}>
          <View>
            <Text style={styles.greetingText}>Hello, {displayName}</Text>
            <Text style={styles.headerSubtitle}>Ready to check your food?</Text>
          </View>
          <TouchableOpacity
            activeOpacity={0.8}
            onPress={() => navigation.navigate("ProfileTab")}
            style={styles.avatarButton}
          >
            <Ionicons name="person-circle" size={40} color={COLORS.primary} />
          </TouchableOpacity>
        </View>

        {/* Search Shortcut Bar */}
        <TouchableOpacity
          activeOpacity={0.9}
          style={styles.searchBar}
          onPress={() => navigation.navigate("ScanTab")}
        >
          <Ionicons name="search-outline" size={20} color={COLORS.textMuted} style={styles.searchIcon} />
          <Text style={styles.searchPlaceholder}>Search products, brands, or categories...</Text>
        </TouchableOpacity>

        {/* Dominant Action Card: Scan Product */}
        <SafeBiteCard style={styles.scanCard}>
          <View style={styles.scanBadge}>
            <Text style={styles.scanBadgeText}>Primary Feature</Text>
          </View>
          <View style={styles.scanContentRow}>
            <View style={styles.scanTextCol}>
              <Text style={styles.scanTitle}>Scan Product Barcode</Text>
              <Text style={styles.scanDescription}>
                Instantly retrieve heavy metal contamination evidence and verify against
                Codex, EU, and PSQCA standards.
              </Text>
              <TouchableOpacity
                activeOpacity={0.85}
                style={styles.scanActionButton}
                onPress={() => navigation.navigate("ScanTab")}
              >
                <Ionicons name="barcode-outline" size={20} color={COLORS.textInverse} style={styles.buttonIcon} />
                <Text style={styles.scanActionText}>Open Scanner</Text>
              </TouchableOpacity>
            </View>
          </View>
        </SafeBiteCard>

        {/* Optional Health Context Setup Card */}
        {!user?.healthConsent && (
          <TouchableOpacity
            activeOpacity={0.88}
            onPress={() => navigation.navigate("ProfileTab")}
          >
            <SafeBiteCard style={styles.healthBannerCard}>
              <View style={styles.healthBannerHeader}>
                <View style={styles.healthIconWrapper}>
                  <Ionicons name="shield-checkmark-outline" size={20} color={COLORS.primary} />
                </View>
                <View style={styles.healthTextCol}>
                  <Text style={styles.healthBannerTitle}>Personalize Safety Warnings (Optional)</Text>
                  <Text style={styles.healthBannerSub}>
                    Opt-in to highlight heavy metal risks for pregnancy, kidney, or infant care.
                  </Text>
                </View>
                <Ionicons name="chevron-forward" size={18} color={COLORS.textMuted} />
              </View>
            </SafeBiteCard>
          </TouchableOpacity>
        )}

        {/* Ask AI Shortcut Card */}
        <SafeBiteCard style={styles.aiCard}>
          <View style={styles.aiHeader}>
            <View style={styles.aiIconWrapper}>
              <Ionicons name="sparkles" size={22} color={COLORS.primary} />
            </View>
            <View style={styles.aiHeaderTextWrapper}>
              <Text style={styles.aiTitle}>Ask SafeBite AI</Text>
              <Text style={styles.aiSubtitle}>Grounded in real food-safety research</Text>
            </View>
          </View>
          <Text style={styles.aiBody}>
            Have questions about lead or cadmium in everyday Pakistani foods? Ask our
            RAG-powered food safety assistant.
          </Text>
          <TouchableOpacity
            activeOpacity={0.8}
            style={styles.aiLinkRow}
            onPress={() => navigation.navigate("AskAITab")}
          >
            <Text style={styles.aiLinkText}>Chat with AI Assistant</Text>
            <Ionicons name="arrow-forward" size={16} color={COLORS.primary} />
          </TouchableOpacity>
        </SafeBiteCard>

        {/* Quick Highlights / Recent Activity Shell */}
        <View style={styles.sectionHeader}>
          <Text style={styles.sectionTitle}>Recent Food Safety Insights</Text>
        </View>

        <SafeBiteCard style={styles.insightCard}>
          <View style={styles.insightHeader}>
            <Ionicons name="information-circle-outline" size={20} color={COLORS.primary} />
            <Text style={styles.insightTitle}>Pakistan Food Standards Baseline</Text>
          </View>
          <Text style={styles.insightBody}>
            SafeBite benchmarks reported food contaminants against Codex Alimentarius
            (WHO/FAO) and PSQCA reference thresholds.
          </Text>
        </SafeBiteCard>

        {/* Mandatory Decision-Support Disclaimer */}
        <View style={styles.disclaimerContainer}>
          <Text style={styles.disclaimerText}>
            SafeBite provides food-safety decision support based on documented scientific studies.
            It does not provide medical diagnoses or individual health guarantees.
          </Text>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: COLORS.background,
  },
  container: {
    paddingHorizontal: SPACING.md,
    paddingTop: SPACING.sm,
    paddingBottom: SPACING.xl,
  },
  headerRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginTop: SPACING.sm,
    marginBottom: SPACING.md,
  },
  greetingText: {
    fontFamily: TYPOGRAPHY.fontFamily.primaryBold,
    fontSize: TYPOGRAPHY.fontSize.xl,
    color: COLORS.textPrimary,
  },
  headerSubtitle: {
    fontFamily: TYPOGRAPHY.fontFamily.primary,
    fontSize: TYPOGRAPHY.fontSize.sm,
    color: COLORS.textSecondary,
    marginTop: 2,
  },
  avatarButton: {
    padding: 2,
  },
  searchBar: {
    flexDirection: "row",
    alignItems: "center",
    height: 48,
    backgroundColor: COLORS.card,
    borderRadius: RADIUS.card,
    paddingHorizontal: SPACING.md,
    borderWidth: 1,
    borderColor: COLORS.border,
    marginBottom: SPACING.md,
    ...SHADOWS.sm,
  },
  searchIcon: {
    marginRight: SPACING.sm,
  },
  searchPlaceholder: {
    fontFamily: TYPOGRAPHY.fontFamily.primary,
    fontSize: TYPOGRAPHY.fontSize.sm,
    color: COLORS.textMuted,
  },
  scanCard: {
    backgroundColor: COLORS.surfaceLightGreen,
    borderColor: "#CBE4D2",
    marginBottom: SPACING.md,
    padding: SPACING.md,
  },
  scanBadge: {
    alignSelf: "flex-start",
    backgroundColor: COLORS.primary,
    borderRadius: RADIUS.pill,
    paddingHorizontal: SPACING.sm,
    paddingVertical: 2,
    marginBottom: SPACING.xs,
  },
  scanBadgeText: {
    fontFamily: TYPOGRAPHY.fontFamily.primarySemiBold,
    fontSize: 10,
    color: COLORS.textInverse,
  },
  scanContentRow: {
    marginTop: 4,
  },
  scanTextCol: {
    width: "100%",
  },
  scanTitle: {
    fontFamily: TYPOGRAPHY.fontFamily.primaryBold,
    fontSize: TYPOGRAPHY.fontSize.lg,
    color: COLORS.primaryDark,
    marginBottom: 4,
  },
  scanDescription: {
    fontFamily: TYPOGRAPHY.fontFamily.primary,
    fontSize: TYPOGRAPHY.fontSize.xs,
    lineHeight: TYPOGRAPHY.lineHeight.sm,
    color: COLORS.textSecondary,
    marginBottom: SPACING.md,
  },
  scanActionButton: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    height: 46,
    backgroundColor: COLORS.primary,
    borderRadius: RADIUS.card,
  },
  buttonIcon: {
    marginRight: SPACING.sm,
  },
  scanActionText: {
    fontFamily: TYPOGRAPHY.fontFamily.primarySemiBold,
    fontSize: TYPOGRAPHY.fontSize.sm,
    color: COLORS.textInverse,
  },
  healthBannerCard: {
    backgroundColor: "#F2F8F4",
    borderColor: "#D2E7D8",
    marginBottom: SPACING.md,
  },
  healthBannerHeader: {
    flexDirection: "row",
    alignItems: "center",
  },
  healthIconWrapper: {
    width: 38,
    height: 38,
    borderRadius: RADIUS.pill,
    backgroundColor: "#E2F0E6",
    justifyContent: "center",
    alignItems: "center",
    marginRight: SPACING.sm,
  },
  healthTextCol: {
    flex: 1,
    marginRight: SPACING.xs,
  },
  healthBannerTitle: {
    fontFamily: TYPOGRAPHY.fontFamily.primarySemiBold,
    fontSize: TYPOGRAPHY.fontSize.sm,
    color: COLORS.textPrimary,
  },
  healthBannerSub: {
    fontFamily: TYPOGRAPHY.fontFamily.primary,
    fontSize: 11,
    lineHeight: 15,
    color: COLORS.textSecondary,
    marginTop: 2,
  },
  aiCard: {
    marginBottom: SPACING.md,
  },
  aiHeader: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: SPACING.xs,
  },
  aiIconWrapper: {
    width: 36,
    height: 36,
    borderRadius: RADIUS.pill,
    backgroundColor: COLORS.surfaceLightGreen,
    justifyContent: "center",
    alignItems: "center",
    marginRight: SPACING.sm,
  },
  aiHeaderTextWrapper: {
    flex: 1,
  },
  aiTitle: {
    fontFamily: TYPOGRAPHY.fontFamily.primarySemiBold,
    fontSize: TYPOGRAPHY.fontSize.md,
    color: COLORS.textPrimary,
  },
  aiSubtitle: {
    fontFamily: TYPOGRAPHY.fontFamily.primary,
    fontSize: TYPOGRAPHY.fontSize.xs,
    color: COLORS.textSecondary,
  },
  aiBody: {
    fontFamily: TYPOGRAPHY.fontFamily.primary,
    fontSize: TYPOGRAPHY.fontSize.xs,
    lineHeight: TYPOGRAPHY.lineHeight.sm,
    color: COLORS.textSecondary,
    marginBottom: SPACING.sm,
  },
  aiLinkRow: {
    flexDirection: "row",
    alignItems: "center",
  },
  aiLinkText: {
    fontFamily: TYPOGRAPHY.fontFamily.primarySemiBold,
    fontSize: TYPOGRAPHY.fontSize.xs,
    color: COLORS.primary,
    marginRight: 4,
  },
  sectionHeader: {
    marginVertical: SPACING.xs,
  },
  sectionTitle: {
    fontFamily: TYPOGRAPHY.fontFamily.primarySemiBold,
    fontSize: TYPOGRAPHY.fontSize.md,
    color: COLORS.textPrimary,
  },
  insightCard: {
    marginTop: SPACING.xs,
    marginBottom: SPACING.md,
  },
  insightHeader: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 4,
  },
  insightTitle: {
    fontFamily: TYPOGRAPHY.fontFamily.primarySemiBold,
    fontSize: TYPOGRAPHY.fontSize.sm,
    color: COLORS.textPrimary,
    marginLeft: SPACING.xs,
  },
  insightBody: {
    fontFamily: TYPOGRAPHY.fontFamily.primary,
    fontSize: TYPOGRAPHY.fontSize.xs,
    lineHeight: TYPOGRAPHY.lineHeight.sm,
    color: COLORS.textSecondary,
  },
  disclaimerContainer: {
    padding: SPACING.sm,
    backgroundColor: COLORS.surfaceGreenSubtle,
    borderRadius: RADIUS.sm,
    borderWidth: 1,
    borderColor: COLORS.surfaceLightGreen,
    marginTop: SPACING.xs,
  },
  disclaimerText: {
    fontFamily: TYPOGRAPHY.fontFamily.primary,
    fontSize: TYPOGRAPHY.fontSize.xs - 1,
    lineHeight: TYPOGRAPHY.lineHeight.xs,
    color: COLORS.textSecondary,
    textAlign: "center",
  },
});

export default HomeDashboardScreen;

