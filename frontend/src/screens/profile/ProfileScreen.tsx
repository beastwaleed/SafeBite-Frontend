import React, { useState } from "react";
import {
  StyleSheet,
  View,
  Text,
  ScrollView,
  SafeAreaView,
  TouchableOpacity,
  Modal,
  Alert,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { COLORS, TYPOGRAPHY, SPACING, RADIUS, SHADOWS } from "../../constants/theme";
import { SafeBiteCard } from "../../components/common/SafeBiteCard";
import { SafeBiteButton } from "../../components/common/SafeBiteButton";
import { SafeBiteInput } from "../../components/common/SafeBiteInput";
import { ConfirmationDialog } from "../../components/feedback/ConfirmationDialog";
import { InlineError } from "../../components/feedback/InlineError";
import { useAuth } from "../../context/AuthContext";
import { parseApiError } from "../../api/error-handler";
import { ENV } from "../../config/env";
import { HealthContextScreen } from "./HealthContextScreen";

export const ProfileScreen: React.FC = () => {
  const { user, signOut, updateProfile } = useAuth();
  const [showSignOutModal, setShowSignOutModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [showHealthModal, setShowHealthModal] = useState(false);
  const [newName, setNewName] = useState(user?.fullName || "");
  const [editLoading, setEditLoading] = useState(false);
  const [editError, setEditError] = useState<string | null>(null);

  const formattedDate = user?.createdAt
    ? new Date(user.createdAt).toLocaleDateString("en-US", {
        year: "numeric",
        month: "short",
        day: "numeric",
      })
    : "Recently joined";

  const handleOpenEdit = () => {
    setNewName(user?.fullName || "");
    setEditError(null);
    setShowEditModal(true);
  };

  const handleSaveProfile = async () => {
    setEditError(null);
    if (newName.length > 70) {
      setEditError("Name cannot exceed 70 characters");
      return;
    }
    if (/[\p{Extended_Pictographic}\p{Emoji_Presentation}\p{Cc}\p{Cf}\uFEFF\u200B-\u200F0-9]/u.test(newName)) {
      setEditError("Name cannot contain numbers, emojis, or symbols");
      return;
    }

    setEditLoading(true);
    try {
      await updateProfile({ fullName: newName.trim() });
      setShowEditModal(false);
      Alert.alert("Success", "Your profile name has been updated.");
    } catch (error) {
      const parsed = parseApiError(error);
      setEditError(parsed.message);
    } finally {
      setEditLoading(false);
    }
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      <ScrollView contentContainerStyle={styles.container} showsVerticalScrollIndicator={false}>
        {/* Header Title */}
        <View style={styles.header}>
          <Text style={styles.screenTitle}>Profile & Settings</Text>
        </View>

        {/* User Card */}
        <SafeBiteCard style={styles.userCard}>
          <View style={styles.avatarRow}>
            <View style={styles.avatar}>
              <Ionicons name="person" size={32} color={COLORS.primary} />
            </View>
            <View style={styles.userInfo}>
              <View style={styles.nameRow}>
                <Text style={styles.userName} numberOfLines={1}>
                  {user?.fullName || "SafeBite Member"}
                </Text>
                <TouchableOpacity
                  activeOpacity={0.7}
                  onPress={handleOpenEdit}
                  style={styles.editIconButton}
                  hitSlop={{ top: 8, bottom: 8, left: 8, right: 8 }}
                >
                  <Ionicons name="pencil" size={16} color={COLORS.primary} />
                </TouchableOpacity>
              </View>
              <Text style={styles.userEmail} numberOfLines={1}>
                {user?.email}
              </Text>
              <View style={styles.badgeRow}>
                <View style={styles.roleBadge}>
                  <Text style={styles.roleBadgeText}>{user?.role || "USER"}</Text>
                </View>
                <Text style={styles.joinDate}>Member since {formattedDate}</Text>
              </View>
            </View>
          </View>
        </SafeBiteCard>

        {/* Health Profile Status */}
        <SafeBiteCard style={styles.sectionCard}>
          <View style={styles.sectionHeaderRow}>
            <Ionicons name="fitness-outline" size={20} color={COLORS.primary} />
            <Text style={styles.sectionCardTitle}>Health Context Profile</Text>
          </View>
          <Text style={styles.sectionCardBody}>
            {user?.healthConsent
              ? "Health context active. Contaminant data will be matched with your physiological criteria."
              : "Health profile is optional and requires explicit consent. Set up tags to receive curated contamination context."}
          </Text>

          {user?.healthConsent && user?.healthTags && user.healthTags.length > 0 && (
            <View style={styles.activeTagsRow}>
              {user.healthTags.map((tag) => (
                <View key={tag} style={styles.activeTagBadge}>
                  <Text style={styles.activeTagBadgeText}>{tag.replace("_", " ")}</Text>
                </View>
              ))}
            </View>
          )}

          <View style={styles.healthStatusRow}>
            <Text style={styles.healthStatusLabel}>Consent Status:</Text>
            <Text
              style={[
                styles.healthStatusValue,
                { color: user?.healthConsent ? COLORS.success : COLORS.textMuted },
              ]}
            >
              {user?.healthConsent ? "Granted" : "Not configured"}
            </Text>
          </View>

          <TouchableOpacity
            activeOpacity={0.8}
            onPress={() => setShowHealthModal(true)}
            style={styles.manageHealthButton}
          >
            <Text style={styles.manageHealthText}>
              {user?.healthConsent ? "Manage Health Context Tags" : "Set Up Health Context"}
            </Text>
            <Ionicons name="chevron-forward" size={16} color={COLORS.primary} />
          </TouchableOpacity>
        </SafeBiteCard>

        {/* Account Details Group */}
        <SafeBiteCard style={styles.sectionCard}>
          <View style={styles.sectionHeaderRow}>
            <Ionicons name="shield-checkmark-outline" size={20} color={COLORS.primary} />
            <Text style={styles.sectionCardTitle}>System & Safety Baseline</Text>
          </View>

          <View style={styles.rowItem}>
            <Text style={styles.rowLabel}>API Base URL</Text>
            <Text style={styles.rowValue} numberOfLines={1}>
              {ENV.API_BASE_URL}
            </Text>
          </View>

          <View style={styles.divider} />

          <View style={styles.rowItem}>
            <Text style={styles.rowLabel}>Food Standards</Text>
            <Text style={styles.rowValue}>Codex, EU & PSQCA</Text>
          </View>

          <View style={styles.divider} />

          <View style={styles.rowItem}>
            <Text style={styles.rowLabel}>App Version</Text>
            <Text style={styles.rowValue}>1.0.0 (Phase 1 Baseline)</Text>
          </View>
        </SafeBiteCard>

        {/* Sign Out Button */}
        <View style={styles.signOutWrapper}>
          <SafeBiteButton
            title="Sign out"
            variant="danger"
            onPress={() => setShowSignOutModal(true)}
            leftIcon={<Ionicons name="log-out-outline" size={18} color={COLORS.textInverse} />}
          />
        </View>

        {/* Disclaimer */}
        <View style={styles.disclaimerContainer}>
          <Text style={styles.disclaimerText}>
            SafeBite decision-support data is grounded in published research and reference standards.
            It does not replace professional medical or dietary consultation.
          </Text>
        </View>
      </ScrollView>

      {/* Sign Out Confirmation Dialog */}
      <ConfirmationDialog
        visible={showSignOutModal}
        title="Sign Out"
        message="Are you sure you want to end your current session? You will need to sign in again to access your saved items."
        confirmText="Sign Out"
        cancelText="Cancel"
        confirmVariant="danger"
        onConfirm={async () => {
          setShowSignOutModal(false);
          await signOut();
        }}
        onCancel={() => setShowSignOutModal(false)}
      />

      {/* Edit Profile Modal */}
      <Modal
        visible={showEditModal}
        transparent
        animationType="slide"
        onRequestClose={() => setShowEditModal(false)}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalCard}>
            <View style={styles.modalHeader}>
              <Text style={styles.modalTitle}>Edit Profile Name</Text>
              <TouchableOpacity
                onPress={() => setShowEditModal(false)}
                hitSlop={{ top: 8, bottom: 8, left: 8, right: 8 }}
              >
                <Ionicons name="close" size={24} color={COLORS.textPrimary} />
              </TouchableOpacity>
            </View>

            {editError && <InlineError message={editError} />}

            <SafeBiteInput
              label="Full Name"
              placeholder="e.g. Waleed Khan"
              value={newName}
              onChangeText={setNewName}
              leftIcon="person-outline"
              helperText="Letters and approved punctuation only (no numbers or emojis)"
            />

            <View style={styles.modalActions}>
              <SafeBiteButton
                title="Save Changes"
                variant="primary"
                loading={editLoading}
                onPress={handleSaveProfile}
              />
            </View>
          </View>
        </View>
      </Modal>

      {/* Health Context Preferences Modal */}
      <Modal
        visible={showHealthModal}
        animationType="slide"
        onRequestClose={() => setShowHealthModal(false)}
      >
        <HealthContextScreen
          onClose={() => setShowHealthModal(false)}
        />
      </Modal>
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
    paddingBottom: SPACING.xxl,
  },
  header: {
    marginVertical: SPACING.md,
  },
  screenTitle: {
    fontFamily: TYPOGRAPHY.fontFamily.primaryBold,
    fontSize: TYPOGRAPHY.fontSize.title,
    color: COLORS.textPrimary,
  },
  userCard: {
    marginBottom: SPACING.md,
  },
  avatarRow: {
    flexDirection: "row",
    alignItems: "center",
  },
  avatar: {
    width: 60,
    height: 60,
    borderRadius: RADIUS.pill,
    backgroundColor: COLORS.surfaceLightGreen,
    justifyContent: "center",
    alignItems: "center",
    marginRight: SPACING.md,
  },
  userInfo: {
    flex: 1,
  },
  nameRow: {
    flexDirection: "row",
    alignItems: "center",
  },
  userName: {
    fontFamily: TYPOGRAPHY.fontFamily.primaryBold,
    fontSize: TYPOGRAPHY.fontSize.lg,
    color: COLORS.textPrimary,
    flexShrink: 1,
  },
  editIconButton: {
    marginLeft: SPACING.xs,
    padding: 2,
  },
  userEmail: {
    fontFamily: TYPOGRAPHY.fontFamily.primary,
    fontSize: TYPOGRAPHY.fontSize.sm,
    color: COLORS.textSecondary,
    marginTop: 2,
  },
  badgeRow: {
    flexDirection: "row",
    alignItems: "center",
    marginTop: SPACING.xs,
  },
  roleBadge: {
    backgroundColor: COLORS.surfaceLightGreen,
    borderRadius: RADIUS.pill,
    paddingHorizontal: SPACING.xs + 2,
    paddingVertical: 2,
    marginRight: SPACING.sm,
  },
  roleBadgeText: {
    fontFamily: TYPOGRAPHY.fontFamily.primarySemiBold,
    fontSize: 10,
    color: COLORS.primary,
  },
  joinDate: {
    fontFamily: TYPOGRAPHY.fontFamily.primary,
    fontSize: 10,
    color: COLORS.textMuted,
  },
  sectionCard: {
    marginBottom: SPACING.md,
  },
  sectionHeaderRow: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: SPACING.xs,
  },
  sectionCardTitle: {
    fontFamily: TYPOGRAPHY.fontFamily.primarySemiBold,
    fontSize: TYPOGRAPHY.fontSize.md,
    color: COLORS.textPrimary,
    marginLeft: SPACING.xs,
  },
  sectionCardBody: {
    fontFamily: TYPOGRAPHY.fontFamily.primary,
    fontSize: TYPOGRAPHY.fontSize.xs,
    lineHeight: TYPOGRAPHY.lineHeight.sm,
    color: COLORS.textSecondary,
    marginBottom: SPACING.xs,
  },
  healthStatusRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginTop: SPACING.xs,
    paddingTop: SPACING.xs,
    borderTopWidth: 1,
    borderTopColor: COLORS.borderLight,
  },
  healthStatusLabel: {
    fontFamily: TYPOGRAPHY.fontFamily.primaryMedium,
    fontSize: TYPOGRAPHY.fontSize.xs,
    color: COLORS.textSecondary,
  },
  healthStatusValue: {
    fontFamily: TYPOGRAPHY.fontFamily.primarySemiBold,
    fontSize: TYPOGRAPHY.fontSize.xs,
  },
  activeTagsRow: {
    flexDirection: "row",
    flexWrap: "wrap",
    marginTop: SPACING.xs,
    marginBottom: SPACING.xs,
  },
  activeTagBadge: {
    backgroundColor: COLORS.surfaceLightGreen,
    borderRadius: RADIUS.pill,
    paddingHorizontal: SPACING.sm,
    paddingVertical: 3,
    marginRight: 6,
    marginBottom: 6,
  },
  activeTagBadgeText: {
    fontFamily: TYPOGRAPHY.fontFamily.primarySemiBold,
    fontSize: 10,
    color: COLORS.primaryDark,
  },
  manageHealthButton: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    marginTop: SPACING.sm,
    paddingTop: SPACING.xs,
    borderTopWidth: 1,
    borderTopColor: COLORS.borderLight,
  },
  manageHealthText: {
    fontFamily: TYPOGRAPHY.fontFamily.primarySemiBold,
    fontSize: TYPOGRAPHY.fontSize.xs,
    color: COLORS.primary,
  },
  rowItem: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingVertical: 4,
  },
  rowLabel: {
    fontFamily: TYPOGRAPHY.fontFamily.primaryMedium,
    fontSize: TYPOGRAPHY.fontSize.xs,
    color: COLORS.textSecondary,
  },
  rowValue: {
    fontFamily: TYPOGRAPHY.fontFamily.scientificMedium,
    fontSize: TYPOGRAPHY.fontSize.xs,
    color: COLORS.textPrimary,
    flexShrink: 1,
    marginLeft: SPACING.sm,
  },
  divider: {
    height: 1,
    backgroundColor: COLORS.borderLight,
    marginVertical: SPACING.xs,
  },
  signOutWrapper: {
    marginTop: SPACING.sm,
    marginBottom: SPACING.lg,
  },
  disclaimerContainer: {
    padding: SPACING.sm,
    backgroundColor: COLORS.surfaceGreenSubtle,
    borderRadius: RADIUS.sm,
    borderWidth: 1,
    borderColor: COLORS.surfaceLightGreen,
  },
  disclaimerText: {
    fontFamily: TYPOGRAPHY.fontFamily.primary,
    fontSize: TYPOGRAPHY.fontSize.xs - 1,
    lineHeight: TYPOGRAPHY.lineHeight.xs,
    color: COLORS.textSecondary,
    textAlign: "center",
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: COLORS.modalOverlay,
    justifyContent: "center",
    alignItems: "center",
    padding: SPACING.lg,
  },
  modalCard: {
    width: "100%",
    maxWidth: 360,
    backgroundColor: COLORS.card,
    borderRadius: RADIUS.card,
    padding: SPACING.lg,
    ...SHADOWS.elevated,
  },
  modalHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: SPACING.md,
  },
  modalTitle: {
    fontFamily: TYPOGRAPHY.fontFamily.primaryBold,
    fontSize: TYPOGRAPHY.fontSize.lg,
    color: COLORS.textPrimary,
  },
  modalActions: {
    marginTop: SPACING.sm,
  },
});

export default ProfileScreen;

