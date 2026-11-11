import React from "react";
import { StyleSheet, View, Text, SafeAreaView } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { COLORS, TYPOGRAPHY, SPACING, RADIUS } from "../../constants/theme";
import { SafeBiteCard } from "../../components/common/SafeBiteCard";

export const AskAIPlaceholderScreen: React.FC = () => {
  return (
    <SafeAreaView style={styles.safeArea}>
      <View style={styles.container}>
        <View style={styles.iconCircle}>
          <Ionicons name="sparkles" size={48} color={COLORS.primary} />
        </View>

        <Text style={styles.title}>AI Food Safety Assistant</Text>

        <View style={styles.badge}>
          <Text style={styles.badgeText}>Pending Teammate Backend RAG Pipeline</Text>
        </View>

        <SafeBiteCard style={styles.infoCard}>
          <Text style={styles.infoTitle}>RAG & pgvector Grounding</Text>
          <Text style={styles.infoBody}>
            The AI assistant will leverage OpenAI GPT-4o-mini with Groq fallback, backed by
            PostgreSQL pgvector embeddings of Pakistani food safety research papers.
          </Text>
          <Text style={styles.infoSubtext}>
            In compliance with SRS V4 rules, all AI responses will be grounded in cited sources
            and will never generate ungrounded medical diagnoses.
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
  },
  badge: {
    backgroundColor: COLORS.warningBackground,
    paddingHorizontal: SPACING.md,
    paddingVertical: 4,
    borderRadius: RADIUS.pill,
    borderWidth: 1,
    borderColor: "#FDE68A",
    marginBottom: SPACING.lg,
  },
  badgeText: {
    fontFamily: TYPOGRAPHY.fontFamily.primarySemiBold,
    fontSize: TYPOGRAPHY.fontSize.xs,
    color: COLORS.warning,
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
    marginBottom: SPACING.sm,
  },
  infoSubtext: {
    fontFamily: TYPOGRAPHY.fontFamily.primary,
    fontSize: TYPOGRAPHY.fontSize.xs - 1,
    lineHeight: TYPOGRAPHY.lineHeight.xs,
    color: COLORS.textMuted,
    textAlign: "center",
  },
});

export default AskAIPlaceholderScreen;

