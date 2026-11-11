import React, { useState, useEffect } from "react";
import {
  StyleSheet,
  View,
  Text,
  ScrollView,
  SafeAreaView,
  TouchableOpacity,
  ActivityIndicator,
  Alert,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { COLORS, TYPOGRAPHY, SPACING, RADIUS, SHADOWS } from "../../constants/theme";
import { SafeBiteButton } from "../../components/common/SafeBiteButton";
import { SafeBiteCard } from "../../components/common/SafeBiteCard";
import { InlineError } from "../../components/feedback/InlineError";
import { ConfirmationDialog } from "../../components/feedback/ConfirmationDialog";
import { userService } from "../../api/user.service";
import { useAuth } from "../../context/AuthContext";
import { parseApiError } from "../../api/error-handler";
import { HealthTag } from "../../types/api.types";

interface TagMeta {
  key: HealthTag;
  title: string;
  description: string;
  icon: keyof typeof Ionicons.glyphMap;
}

const APPROVED_TAGS: TagMeta[] = [
  {
    key: "PREGNANCY",
    title: "Pregnancy",
    description: "Prenatal sensitivity to heavy metal exposure (e.g. Lead, Methylmercury)",
    icon: "heart-outline",
  },
  {
    key: "INFANT",
    title: "Infants & Young Children",
    description: "Developing neurological and physiological vulnerability",
    icon: "happy-outline",
  },
  {
    key: "KIDNEY_ISSUE",
    title: "Kidney Sensitivity",
    description: "Renal clearance and heavy metal bioaccumulation factors (e.g. Cadmium)",
    icon: "medkit-outline",
  },
  {
    key: "HYPERTENSION",
    title: "Hypertension",
    description: "Cardiovascular sensitivity to heavy metal exposure",
    icon: "pulse-outline",
  },
  {
    key: "DIABETES",
    title: "Diabetes",
    description: "Metabolic and dietary considerations",
    icon: "fitness-outline",
  },
  {
    key: "CELIAC",
    title: "Celiac / Gluten Sensitivity",
    description: "Gluten-free considerations and grain sourcing",
    icon: "nutrition-outline",
  },
  {
    key: "NUT_ALLERGY",
    title: "Nut Allergy",
    description: "Severe allergen sensitivity",
    icon: "warning-outline",
  },
  {
    key: "HEART_CONDITION",
    title: "Heart Condition",
    description: "Cardiovascular health considerations",
    icon: "heart-circle-outline",
  },
  {
    key: "ELDERLY",
    title: "Elderly Population",
    description: "Age-associated vulnerability and chronic bioaccumulation",
    icon: "person-outline",
  },
  {
    key: "GENERAL_POPULATION",
    title: "General Population Baseline",
    description: "Standard international adult dietary reference limits (Codex/PSQCA)",
    icon: "people-outline",
  },
];

interface HealthContextScreenProps {
  onClose: () => void;
  onUpdated?: () => void;
}

export const HealthContextScreen: React.FC<HealthContextScreenProps> = ({
  onClose,
  onUpdated,
}) => {
  const { refreshProfile } = useAuth();
  const [hasConsent, setHasConsent] = useState(false);
  const [selectedTags, setSelectedTags] = useState<HealthTag[]>([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [showRevokeModal, setShowRevokeModal] = useState(false);

  useEffect(() => {
    loadHealthProfile();
  }, []);

  const loadHealthProfile = async () => {
    setLoading(true);
    setError(null);
    try {
      const profile = await userService.getHealthProfile();
      setHasConsent(Boolean(profile.consent));
      setSelectedTags(profile.tags || []);
    } catch (err) {
      const parsed = parseApiError(err);
      setError(parsed.message);
    } finally {
      setLoading(false);
    }
  };

  const toggleTag = (tag: HealthTag) => {
    if (!hasConsent) {
      Alert.alert(
        "Consent Required",
        "Please provide explicit consent above before selecting health-context tags."
      );
      return;
    }

    if (selectedTags.includes(tag)) {
      setSelectedTags(selectedTags.filter((t) => t !== tag));
    } else {
      if (selectedTags.length >= 10) {
        Alert.alert("Limit Reached", "You may select at most 10 health-context tags.");
        return;
      }
      setSelectedTags([...selectedTags, tag]);
    }
  };

  const handleSave = async () => {
    setError(null);
    if (hasConsent && selectedTags.length === 0) {
      setError("Please select at least one health tag, or uncheck consent.");
      return;
    }

    setSaving(true);
    try {
      // 1. Update consent
      await userService.setHealthConsent(hasConsent);

      // 2. If consent granted, update tags
      if (hasConsent && selectedTags.length > 0) {
        await userService.updateHealthTags(selectedTags);
      }

      await refreshProfile();
      if (onUpdated) onUpdated();
      Alert.alert("Saved", "Your health context preferences have been updated.", [
        { text: "OK", onPress: onClose },
      ]);
    } catch (err) {
      const parsed = parseApiError(err);
      setError(parsed.message);
    } finally {
      setSaving(false);
    }
  };

  const handleRevokeConsent = async () => {
    setSaving(true);
    setError(null);
    try {
      await userService.clearHealthProfile();
      setHasConsent(false);
      setSelectedTags([]);
      await refreshProfile();
      if (onUpdated) onUpdated();
      setShowRevokeModal(false);
      Alert.alert("Revoked", "Health context consent and all tags have been cleared.", [
        { text: "OK", onPress: onClose },
      ]);
    } catch (err) {
      const parsed = parseApiError(err);
      setError(parsed.message);
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <SafeAreaView style={styles.safeArea}>
        <View style={styles.centerLoading}>
          <ActivityIndicator size="large" color={COLORS.primary} />
          <Text style={styles.loadingText}>Loading health profile...</Text>
        </View>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.safeArea}>
      <View style={styles.topBar}>
        <TouchableOpacity
          activeOpacity={0.7}
          onPress={onClose}
          style={styles.backButton}
          hitSlop={{ top: 8, bottom: 8, left: 8, right: 8 }}
        >
          <Ionicons name="arrow-back" size={24} color={COLORS.textPrimary} />
        </TouchableOpacity>
        <Text style={styles.topBarTitle}>Health Context Tags</Text>
        <View style={{ width: 24 }} />
      </View>

      <ScrollView contentContainerStyle={styles.container} showsVerticalScrollIndicator={false}>
        {error && <InlineError message={error} onRetry={loadHealthProfile} />}

        {/* Regulatory & Scope Explanation */}
        <SafeBiteCard style={styles.infoCard}>
          <View style={styles.infoHeader}>
            <Ionicons name="shield-checkmark" size={20} color={COLORS.primary} />
            <Text style={styles.infoTitle}>Privacy-First Health Context</Text>
          </View>
          <Text style={styles.infoBody}>
            Health-context tags are completely optional. They are used exclusively to highlight
            curated research context deterministically matched to relevant physiological factors.
          </Text>
          <View style={styles.ruleList}>
            <Text style={styles.ruleItem}>• SafeBite never calculates personal clinical doses.</Text>
            <Text style={styles.ruleItem}>• SafeBite never diagnoses or guarantees safety.</Text>
            <Text style={styles.ruleItem}>• SafeBite never labels a product safe/unsafe for a person.</Text>
          </View>
        </SafeBiteCard>

        {/* Explicit Consent Box */}
        <TouchableOpacity
          activeOpacity={0.85}
          onPress={() => setHasConsent(!hasConsent)}
          style={[styles.consentBox, hasConsent && styles.consentBoxActive]}
        >
          <View style={styles.checkboxWrapper}>
            <Ionicons
              name={hasConsent ? "checkbox" : "square-outline"}
              size={24}
              color={hasConsent ? COLORS.primary : COLORS.textMuted}
            />
          </View>
          <View style={styles.consentTextCol}>
            <Text style={styles.consentTitle}>Explicit Informed Consent</Text>
            <Text style={styles.consentDescription}>
              I consent to using selected tags to display relevant, cited food-safety research
              information. I understand this does not replace medical advice.
            </Text>
          </View>
        </TouchableOpacity>

        {/* Tag Selection Section */}
        <View style={styles.sectionHeader}>
          <Text style={styles.sectionTitle}>Select Approved Health Tags</Text>
          <Text style={styles.sectionSubtitle}>
            {hasConsent
              ? `Selected (${selectedTags.length}/10)`
              : "Enable consent above to select tags"}
          </Text>
        </View>

        <View style={styles.tagsContainer}>
          {APPROVED_TAGS.map((tag) => {
            const isSelected = selectedTags.includes(tag.key);
            return (
              <TouchableOpacity
                key={tag.key}
                activeOpacity={0.8}
                onPress={() => toggleTag(tag.key)}
                style={[
                  styles.tagCard,
                  isSelected && styles.tagCardSelected,
                  !hasConsent && styles.tagCardDisabled,
                ]}
              >
                <View style={styles.tagCardHeader}>
                  <View
                    style={[
                      styles.tagIconWrapper,
                      isSelected && styles.tagIconWrapperSelected,
                    ]}
                  >
                    <Ionicons
                      name={tag.icon}
                      size={18}
                      color={isSelected ? COLORS.textInverse : COLORS.primary}
                    />
                  </View>
                  <Text
                    style={[
                      styles.tagCardTitle,
                      isSelected && styles.tagCardTitleSelected,
                    ]}
                  >
                    {tag.title}
                  </Text>
                  {isSelected && (
                    <Ionicons
                      name="checkmark-circle"
                      size={18}
                      color={COLORS.primary}
                      style={styles.tagCheckmark}
                    />
                  )}
                </View>
                <Text
                  style={[
                    styles.tagCardDescription,
                    isSelected && styles.tagCardDescSelected,
                  ]}
                >
                  {tag.description}
                </Text>
              </TouchableOpacity>
            );
          })}
        </View>

        {/* Save & Clear Actions */}
        <View style={styles.actionsContainer}>
          <SafeBiteButton
            title="Save Preferences"
            variant="primary"
            loading={saving}
            onPress={handleSave}
            style={styles.saveButton}
          />

          {hasConsent && (
            <SafeBiteButton
              title="Clear & Revoke Consent"
              variant="danger"
              loading={saving}
              onPress={() => setShowRevokeModal(true)}
              style={styles.revokeButton}
            />
          )}
        </View>
      </ScrollView>

      {/* Revocation Confirmation Dialog */}
      <ConfirmationDialog
        visible={showRevokeModal}
        title="Revoke Health Consent"
        message="Are you sure you want to delete your health profile? All selected health-context tags will be permanently removed from your account."
        confirmText="Revoke & Delete"
        cancelText="Keep"
        confirmVariant="danger"
        onConfirm={handleRevokeConsent}
        onCancel={() => setShowRevokeModal(false)}
      />
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: COLORS.background,
  },
  topBar: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: SPACING.md,
    height: 52,
    borderBottomWidth: 1,
    borderBottomColor: COLORS.borderLight,
    backgroundColor: COLORS.card,
  },
  backButton: {
    padding: SPACING.xs,
  },
  topBarTitle: {
    fontFamily: TYPOGRAPHY.fontFamily.primaryBold,
    fontSize: TYPOGRAPHY.fontSize.md,
    color: COLORS.textPrimary,
  },
  container: {
    padding: SPACING.md,
    paddingBottom: SPACING.xxxl,
  },
  centerLoading: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  loadingText: {
    fontFamily: TYPOGRAPHY.fontFamily.primary,
    fontSize: TYPOGRAPHY.fontSize.sm,
    color: COLORS.textSecondary,
    marginTop: SPACING.sm,
  },
  infoCard: {
    backgroundColor: COLORS.surfaceLightGreen,
    borderColor: "#CBE4D2",
    marginBottom: SPACING.md,
  },
  infoHeader: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: SPACING.xs,
  },
  infoTitle: {
    fontFamily: TYPOGRAPHY.fontFamily.primaryBold,
    fontSize: TYPOGRAPHY.fontSize.sm,
    color: COLORS.primaryDark,
    marginLeft: SPACING.xs,
  },
  infoBody: {
    fontFamily: TYPOGRAPHY.fontFamily.primary,
    fontSize: TYPOGRAPHY.fontSize.xs,
    lineHeight: TYPOGRAPHY.lineHeight.sm,
    color: COLORS.textSecondary,
    marginBottom: SPACING.xs,
  },
  ruleList: {
    marginTop: 4,
  },
  ruleItem: {
    fontFamily: TYPOGRAPHY.fontFamily.primaryMedium,
    fontSize: 11,
    color: COLORS.primaryDark,
    lineHeight: 16,
  },
  consentBox: {
    flexDirection: "row",
    alignItems: "flex-start",
    backgroundColor: COLORS.card,
    borderRadius: RADIUS.card,
    padding: SPACING.md,
    borderWidth: 1.5,
    borderColor: COLORS.border,
    marginBottom: SPACING.lg,
    ...SHADOWS.sm,
  },
  consentBoxActive: {
    borderColor: COLORS.primary,
    backgroundColor: "#F2F9F4",
  },
  checkboxWrapper: {
    marginRight: SPACING.sm,
    marginTop: 2,
  },
  consentTextCol: {
    flex: 1,
  },
  consentTitle: {
    fontFamily: TYPOGRAPHY.fontFamily.primaryBold,
    fontSize: TYPOGRAPHY.fontSize.sm,
    color: COLORS.textPrimary,
    marginBottom: 2,
  },
  consentDescription: {
    fontFamily: TYPOGRAPHY.fontFamily.primary,
    fontSize: TYPOGRAPHY.fontSize.xs,
    lineHeight: TYPOGRAPHY.lineHeight.sm,
    color: COLORS.textSecondary,
  },
  sectionHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: SPACING.sm,
  },
  sectionTitle: {
    fontFamily: TYPOGRAPHY.fontFamily.primaryBold,
    fontSize: TYPOGRAPHY.fontSize.md,
    color: COLORS.textPrimary,
  },
  sectionSubtitle: {
    fontFamily: TYPOGRAPHY.fontFamily.primaryMedium,
    fontSize: TYPOGRAPHY.fontSize.xs,
    color: COLORS.textSecondary,
  },
  tagsContainer: {
    width: "100%",
  },
  tagCard: {
    backgroundColor: COLORS.card,
    borderRadius: RADIUS.card,
    padding: SPACING.md,
    borderWidth: 1.5,
    borderColor: COLORS.border,
    marginBottom: SPACING.sm,
  },
  tagCardSelected: {
    borderColor: COLORS.primary,
    backgroundColor: "#F6FAF7",
  },
  tagCardDisabled: {
    opacity: 0.6,
  },
  tagCardHeader: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 4,
  },
  tagIconWrapper: {
    width: 28,
    height: 28,
    borderRadius: RADIUS.pill,
    backgroundColor: COLORS.surfaceLightGreen,
    justifyContent: "center",
    alignItems: "center",
    marginRight: SPACING.sm,
  },
  tagIconWrapperSelected: {
    backgroundColor: COLORS.primary,
  },
  tagCardTitle: {
    fontFamily: TYPOGRAPHY.fontFamily.primaryBold,
    fontSize: TYPOGRAPHY.fontSize.sm,
    color: COLORS.textPrimary,
    flex: 1,
  },
  tagCardTitleSelected: {
    color: COLORS.primaryDark,
  },
  tagCheckmark: {
    marginLeft: SPACING.xs,
  },
  tagCardDescription: {
    fontFamily: TYPOGRAPHY.fontFamily.primary,
    fontSize: TYPOGRAPHY.fontSize.xs,
    lineHeight: TYPOGRAPHY.lineHeight.sm,
    color: COLORS.textSecondary,
    marginLeft: 36,
  },
  tagCardDescSelected: {
    color: COLORS.textPrimary,
  },
  actionsContainer: {
    marginTop: SPACING.md,
    marginBottom: SPACING.lg,
  },
  saveButton: {
    marginBottom: SPACING.sm,
  },
  revokeButton: {
    marginTop: SPACING.xs,
  },
});

export default HealthContextScreen;

