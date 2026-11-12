import React, { useState } from "react";
import {
  StyleSheet,
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  Modal,
  Platform,
  StatusBar,
  Alert,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { useNavigation } from "@react-navigation/native";
import { BottomTabNavigationProp } from "@react-navigation/bottom-tabs";
import { AppTabParamList } from "../../types/navigation.types";
import { COLORS, TYPOGRAPHY, SPACING, SHADOWS } from "../../constants/theme";
import { SafeBiteButton } from "../../components/common/SafeBiteButton";
import { SafeBiteInput } from "../../components/common/SafeBiteInput";
import { InlineError } from "../../components/feedback/InlineError";
import { useAuth } from "../../context/AuthContext";
import { parseApiError } from "../../api/error-handler";
import { HealthContextScreen } from "./HealthContextScreen";

export const ProfileScreen: React.FC = () => {
  const insets = useSafeAreaInsets();
  const navigation = useNavigation<BottomTabNavigationProp<AppTabParamList>>();
  const { user, signOut, updateProfile, refreshProfile } = useAuth();

  const [showSignOutModal, setShowSignOutModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [showHealthModal, setShowHealthModal] = useState(false);
  const [showInfoModal, setShowInfoModal] = useState(false);
  const [infoTitle, setInfoTitle] = useState("");
  const [infoContent, setInfoContent] = useState("");

  const [newName, setNewName] = useState(user?.fullName || "");
  const [editLoading, setEditLoading] = useState(false);
  const [editError, setEditError] = useState<string | null>(null);
  const [loadError, setLoadError] = useState(false);

  // Compute safe top inset to prevent header clipping
  const topInset = Math.max(
    insets.top,
    Platform.OS === "android" ? (StatusBar.currentHeight || 28) : 0,
    16
  );

  const handleOpenEdit = () => {
    setNewName(user?.fullName || "");
    setEditError(null);
    setShowEditModal(true);
  };

  const handleSaveProfile = async () => {
    setEditError(null);
    if (!newName.trim()) {
      setEditError("Name cannot be empty");
      return;
    }
    if (newName.length > 70) {
      setEditError("Name cannot exceed 70 characters");
      return;
    }
    if (
      /[\p{Extended_Pictographic}\p{Emoji_Presentation}\p{Cc}\p{Cf}\uFEFF\u200B-\u200F0-9]/u.test(
        newName
      )
    ) {
      setEditError("Name cannot contain numbers, emojis, or symbols");
      return;
    }

    setEditLoading(true);
    try {
      await updateProfile({ fullName: newName.trim() });
      setShowEditModal(false);
    } catch (error) {
      const parsed = parseApiError(error);
      setEditError(parsed.message);
    } finally {
      setEditLoading(false);
    }
  };

  const handleRetryLoad = async () => {
    try {
      setLoadError(false);
      await refreshProfile();
    } catch {
      setLoadError(true);
    }
  };

  const showInfo = (title: string, content: string) => {
    setInfoTitle(title);
    setInfoContent(content);
    setShowInfoModal(true);
  };

  return (
    <View style={[styles.screenContainer, { paddingTop: topInset }]}>
      {/* Top Header Bar */}
      <View style={styles.topBar}>
        <TouchableOpacity
          activeOpacity={0.7}
          onPress={() => navigation.goBack()}
          style={styles.backButton}
          hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
        >
          <Ionicons name="arrow-back" size={20} color="#084D25" />
        </TouchableOpacity>
        <Text style={styles.topBarTitle}>Profile & settings</Text>
        <View style={styles.backButtonPlaceholder} />
      </View>

      {/* Offline / Error State (Page 64 / Screen 17.2) */}
      {loadError ? (
        <View style={styles.errorContainer}>
          <View style={styles.errorCard}>
            <View style={styles.errorIconCircle}>
              <Ionicons name="person-outline" size={26} color="#A83232" />
            </View>
            <Text style={styles.errorTitle}>Profile couldn't be loaded</Text>
            <Text style={styles.errorSubtitle}>
              Your account data was not changed. Try retrieving it again.
            </Text>
            <TouchableOpacity
              activeOpacity={0.88}
              onPress={handleRetryLoad}
              style={styles.tryAgainButton}
            >
              <Text style={styles.tryAgainText}>Try again</Text>
            </TouchableOpacity>
          </View>
        </View>
      ) : (
        <ScrollView
          contentContainerStyle={styles.scrollContent}
          showsVerticalScrollIndicator={false}
        >
          {/* User Identity Card (Page 62) */}
          <View style={styles.identityCard}>
            <View style={styles.identityRow}>
              <View style={styles.avatarCircle}>
                <Ionicons name="person-outline" size={28} color="#084D25" />
              </View>
              <View style={styles.identityTextCol}>
                <Text style={styles.overline}>
                  {user ? "AUTHENTICATED IDENTITY" : "PROTOTYPE IDENTITY"}
                </Text>
                <Text style={styles.userName} numberOfLines={1}>
                  {user?.fullName || "SafeBite user"}
                </Text>
                <Text style={styles.userEmail} numberOfLines={1}>
                  {user?.email || "demo@example.invalid"}
                </Text>
              </View>
            </View>

            {/* Edit Profile Button inside card */}
            <TouchableOpacity
              activeOpacity={0.8}
              onPress={handleOpenEdit}
              style={styles.editProfileButton}
            >
              <Ionicons
                name="pencil-outline"
                size={16}
                color="#084D25"
                style={styles.editIcon}
              />
              <Text style={styles.editProfileText}>Edit profile</Text>
            </TouchableOpacity>
          </View>

          {/* Grouped Settings Navigation Card (The 6 Rows from Page 62) */}
          <View style={styles.settingsGroupCard}>
            {/* Row 1: Health Profile */}
            <TouchableOpacity
              activeOpacity={0.7}
              onPress={() => setShowHealthModal(true)}
              style={styles.settingsRow}
            >
              <View style={styles.rowIconContainer}>
                <Ionicons name="medical-outline" size={20} color="#084D25" />
              </View>
              <View style={styles.rowTextCol}>
                <Text style={styles.rowTitle}>Health Profile</Text>
                <Text style={styles.rowSubtitle}>
                  Manage optional consented health context
                </Text>
              </View>
              <Ionicons name="chevron-forward" size={16} color="#7A8C7F" />
            </TouchableOpacity>

            <View style={styles.rowDivider} />

            {/* Row 2: Search & Scan History */}
            <TouchableOpacity
              activeOpacity={0.7}
              onPress={() =>
                showInfo(
                  "Search & Scan History",
                  "SafeBite records your barcode scans and search queries locally and synchronizes with your profile for instant retrieval. You can review or clear your activity at any time."
                )
              }
              style={styles.settingsRow}
            >
              <View style={styles.rowIconContainer}>
                <Ionicons name="time-outline" size={20} color="#084D25" />
              </View>
              <View style={styles.rowTextCol}>
                <Text style={styles.rowTitle}>Search & Scan History</Text>
                <Text style={styles.rowSubtitle}>
                  Review or delete your activity
                </Text>
              </View>
              <Ionicons name="chevron-forward" size={16} color="#7A8C7F" />
            </TouchableOpacity>

            <View style={styles.rowDivider} />

            {/* Row 3: Favorites & Watchlist */}
            <TouchableOpacity
              activeOpacity={0.7}
              onPress={() => navigation.navigate("SavedTab")}
              style={styles.settingsRow}
            >
              <View style={styles.rowIconContainer}>
                <Ionicons name="bookmark-outline" size={20} color="#084D25" />
              </View>
              <View style={styles.rowTextCol}>
                <Text style={styles.rowTitle}>Favorites & Watchlist</Text>
                <Text style={styles.rowSubtitle}>View products you saved</Text>
              </View>
              <Ionicons name="chevron-forward" size={16} color="#7A8C7F" />
            </TouchableOpacity>

            <View style={styles.rowDivider} />

            {/* Row 4: Privacy & Data */}
            <TouchableOpacity
              activeOpacity={0.7}
              onPress={() =>
                showInfo(
                  "Privacy & Data Controls",
                  "SafeBite adheres to strict privacy-by-design principles. Health context tags are never used for clinical profiling, and personal data is never sold. You have complete control to revoke consent or purge your data."
                )
              }
              style={styles.settingsRow}
            >
              <View style={styles.rowIconContainer}>
                <Ionicons
                  name="shield-checkmark-outline"
                  size={20}
                  color="#084D25"
                />
              </View>
              <View style={styles.rowTextCol}>
                <Text style={styles.rowTitle}>Privacy & Data</Text>
                <Text style={styles.rowSubtitle}>
                  Account data and privacy controls
                </Text>
              </View>
              <Ionicons name="chevron-forward" size={16} color="#7A8C7F" />
            </TouchableOpacity>

            <View style={styles.rowDivider} />

            {/* Row 5: Preferences */}
            <TouchableOpacity
              activeOpacity={0.7}
              onPress={() =>
                showInfo(
                  "App Preferences",
                  "Food Contaminant Standards: Codex Alimentarius, EU Commission Regulations, and PSQCA (Pakistan Standards and Quality Control Authority).\n\nUnits: mg/kg (ppm) and percentage threshold comparisons."
                )
              }
              style={styles.settingsRow}
            >
              <View style={styles.rowIconContainer}>
                <Ionicons name="options-outline" size={20} color="#084D25" />
              </View>
              <View style={styles.rowTextCol}>
                <Text style={styles.rowTitle}>Preferences</Text>
                <Text style={styles.rowSubtitle}>
                  App display and content preferences
                </Text>
              </View>
              <Ionicons name="chevron-forward" size={16} color="#7A8C7F" />
            </TouchableOpacity>

            <View style={styles.rowDivider} />

            {/* Row 6: About SafeBite */}
            <TouchableOpacity
              activeOpacity={0.7}
              onPress={() =>
                showInfo(
                  "About SafeBite",
                  "SafeBite is an academic BSCS Final Year Project decision-support system benchmarking heavy metals (Lead, Cadmium, Arsenic, Mercury, Chromium) in packaged foods in Pakistan.\n\nSafeBite provides evidence-grounded decision support based on documented scientific studies and reference thresholds. It does not replace medical or clinical diagnoses."
                )
              }
              style={styles.settingsRow}
            >
              <View style={styles.rowIconContainer}>
                <Ionicons
                  name="information-circle-outline"
                  size={20}
                  color="#084D25"
                />
              </View>
              <View style={styles.rowTextCol}>
                <Text style={styles.rowTitle}>About SafeBite</Text>
                <Text style={styles.rowSubtitle}>
                  Decision-support scope and app information
                </Text>
              </View>
              <Ionicons name="chevron-forward" size={16} color="#7A8C7F" />
            </TouchableOpacity>
          </View>

          {/* Sign Out Button (Page 62) */}
          <TouchableOpacity
            activeOpacity={0.88}
            onPress={() => setShowSignOutModal(true)}
            style={styles.signOutButton}
          >
            <Ionicons
              name="log-out-outline"
              size={18}
              color="#A83232"
              style={styles.signOutIcon}
            />
            <Text style={styles.signOutText}>Sign out</Text>
          </TouchableOpacity>

          {/* Footer Version Label (Page 62) */}
          <Text style={styles.footerLabel}>
            SafeBite prototype • Version 1.0
          </Text>
        </ScrollView>
      )}

      {/* Page 63: Sign Out Confirmation Dialog */}
      <Modal
        visible={showSignOutModal}
        transparent
        animationType="fade"
        onRequestClose={() => setShowSignOutModal(false)}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.dialogCard}>
            <View style={styles.dialogIconCircle}>
              <Ionicons name="log-out-outline" size={26} color="#A83232" />
            </View>

            <Text style={styles.dialogTitle}>Sign out of SafeBite?</Text>
            <Text style={styles.dialogMessage}>
              You will need to sign in again to access account history,
              favorites, watchlist items, and profile settings.
            </Text>

            <View style={styles.dialogButtonsRow}>
              <TouchableOpacity
                activeOpacity={0.7}
                onPress={() => setShowSignOutModal(false)}
                style={styles.dialogCancelButton}
              >
                <Text style={styles.dialogCancelText}>Cancel</Text>
              </TouchableOpacity>

              <TouchableOpacity
                activeOpacity={0.88}
                onPress={async () => {
                  setShowSignOutModal(false);
                  await signOut();
                }}
                style={styles.dialogConfirmButton}
              >
                <Text style={styles.dialogConfirmText}>Sign out</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>

      {/* Edit Profile Name Modal */}
      <Modal
        visible={showEditModal}
        transparent
        animationType="fade"
        onRequestClose={() => setShowEditModal(false)}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.editModalCard}>
            <View style={styles.editModalHeader}>
              <Text style={styles.editModalTitle}>Edit Profile Name</Text>
              <TouchableOpacity
                onPress={() => setShowEditModal(false)}
                hitSlop={{ top: 8, bottom: 8, left: 8, right: 8 }}
              >
                <Ionicons name="close" size={22} color={COLORS.textPrimary} />
              </TouchableOpacity>
            </View>

            {editError && <InlineError message={editError} />}

            <SafeBiteInput
              label="Full Name"
              placeholder="e.g. Ayesha Khan"
              value={newName}
              onChangeText={setNewName}
              leftIcon="person-outline"
              helperText="Alphabetic letters and approved punctuation only"
              autoFocus
            />

            <SafeBiteButton
              title="Save Changes"
              variant="primary"
              loading={editLoading}
              onPress={handleSaveProfile}
              style={styles.saveProfileButton}
            />
          </View>
        </View>
      </Modal>

      {/* Informational Dialog */}
      <Modal
        visible={showInfoModal}
        transparent
        animationType="fade"
        onRequestClose={() => setShowInfoModal(false)}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.infoModalCard}>
            <View style={styles.infoModalHeader}>
              <Text style={styles.infoModalTitle}>{infoTitle}</Text>
              <TouchableOpacity
                onPress={() => setShowInfoModal(false)}
                hitSlop={{ top: 8, bottom: 8, left: 8, right: 8 }}
              >
                <Ionicons name="close" size={22} color={COLORS.textPrimary} />
              </TouchableOpacity>
            </View>
            <Text style={styles.infoModalText}>{infoContent}</Text>
            <SafeBiteButton
              title="Close"
              variant="secondary"
              onPress={() => setShowInfoModal(false)}
              style={styles.infoCloseButton}
            />
          </View>
        </View>
      </Modal>

      {/* Health Context Preferences Modal */}
      <Modal
        visible={showHealthModal}
        animationType="slide"
        onRequestClose={() => setShowHealthModal(false)}
      >
        <HealthContextScreen onClose={() => setShowHealthModal(false)} />
      </Modal>
    </View>
  );
};

const styles = StyleSheet.create({
  screenContainer: {
    flex: 1,
    backgroundColor: COLORS.background,
  },
  topBar: {
    height: 52,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: SPACING.md,
    marginTop: 4,
    marginBottom: 8,
  },
  backButton: {
    width: 44,
    height: 44,
    borderRadius: 14,
    backgroundColor: "#FFFFFF",
    borderWidth: 1,
    borderColor: "#E5EAE5",
    justifyContent: "center",
    alignItems: "center",
    ...SHADOWS.sm,
  },
  topBarTitle: {
    fontFamily: TYPOGRAPHY.fontFamily.primaryBold,
    fontSize: 18,
    color: "#084D25",
    textAlign: "center",
  },
  backButtonPlaceholder: {
    width: 44,
  },
  scrollContent: {
    paddingHorizontal: SPACING.md,
    paddingTop: 6,
    paddingBottom: SPACING.xl,
  },
  identityCard: {
    backgroundColor: "#FFFFFF",
    borderRadius: 18,
    padding: 16,
    marginBottom: 16,
    borderWidth: 1,
    borderColor: "#E5EAE5",
    ...SHADOWS.sm,
  },
  identityRow: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 14,
  },
  avatarCircle: {
    width: 56,
    height: 56,
    borderRadius: 16,
    backgroundColor: "#D9EADD",
    justifyContent: "center",
    alignItems: "center",
    marginRight: 14,
  },
  identityTextCol: {
    flex: 1,
  },
  overline: {
    fontFamily: TYPOGRAPHY.fontFamily.primarySemiBold,
    fontSize: 10,
    letterSpacing: 0.5,
    color: "#7A8C7F",
    marginBottom: 2,
  },
  userName: {
    fontFamily: TYPOGRAPHY.fontFamily.primaryBold,
    fontSize: 18,
    color: "#084D25",
  },
  userEmail: {
    fontFamily: TYPOGRAPHY.fontFamily.primary,
    fontSize: 12,
    color: "#7A8C7F",
    marginTop: 2,
  },
  editProfileButton: {
    height: 44,
    borderRadius: 12,
    backgroundColor: "#FFFFFF",
    borderWidth: 1.5,
    borderColor: "#085F2D",
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
  },
  editIcon: {
    marginRight: 8,
  },
  editProfileText: {
    fontFamily: TYPOGRAPHY.fontFamily.primaryBold,
    fontSize: 13,
    color: "#085F2D",
  },
  settingsGroupCard: {
    backgroundColor: "#FFFFFF",
    borderRadius: 18,
    borderWidth: 1,
    borderColor: "#E5EAE5",
    overflow: "hidden",
    marginBottom: 20,
    ...SHADOWS.sm,
  },
  settingsRow: {
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 16,
    paddingVertical: 14,
  },
  rowIconContainer: {
    width: 40,
    height: 40,
    borderRadius: 12,
    backgroundColor: "#D9EADD",
    justifyContent: "center",
    alignItems: "center",
    marginRight: 14,
  },
  rowTextCol: {
    flex: 1,
  },
  rowTitle: {
    fontFamily: TYPOGRAPHY.fontFamily.primaryBold,
    fontSize: 14,
    color: "#1A291E",
  },
  rowSubtitle: {
    fontFamily: TYPOGRAPHY.fontFamily.primary,
    fontSize: 11,
    color: "#7A8C7F",
    marginTop: 2,
  },
  rowDivider: {
    height: 1,
    backgroundColor: "#F0F4F1",
    marginLeft: 70,
  },
  signOutButton: {
    height: 50,
    borderRadius: 14,
    backgroundColor: "#FFFFFF",
    borderWidth: 1.5,
    borderColor: "#A83232",
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    marginBottom: 16,
  },
  signOutIcon: {
    marginRight: 8,
  },
  signOutText: {
    fontFamily: TYPOGRAPHY.fontFamily.primaryBold,
    fontSize: 14,
    color: "#A83232",
  },
  footerLabel: {
    fontFamily: TYPOGRAPHY.fontFamily.primary,
    fontSize: 11,
    color: "#8A988D",
    textAlign: "center",
    marginBottom: 24,
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: "rgba(0, 0, 0, 0.45)",
    justifyContent: "center",
    alignItems: "center",
    padding: 24,
  },
  dialogCard: {
    width: "100%",
    maxWidth: 340,
    backgroundColor: "#FFFFFF",
    borderRadius: 20,
    padding: 24,
    alignItems: "center",
    ...SHADOWS.elevated,
  },
  dialogIconCircle: {
    width: 56,
    height: 56,
    borderRadius: 16,
    backgroundColor: "#FBE8E8",
    justifyContent: "center",
    alignItems: "center",
    marginBottom: 4,
  },
  dialogTitle: {
    fontFamily: TYPOGRAPHY.fontFamily.primaryBold,
    fontSize: 18,
    color: "#084D25",
    marginTop: 12,
    textAlign: "center",
  },
  dialogMessage: {
    fontFamily: TYPOGRAPHY.fontFamily.primary,
    fontSize: 12,
    lineHeight: 18,
    color: "#66716A",
    textAlign: "center",
    marginTop: 8,
  },
  dialogButtonsRow: {
    flexDirection: "row",
    width: "100%",
    marginTop: 22,
  },
  dialogCancelButton: {
    flex: 1,
    height: 46,
    borderRadius: 12,
    borderWidth: 1.5,
    borderColor: "#C5D6C7",
    backgroundColor: "#FFFFFF",
    justifyContent: "center",
    alignItems: "center",
    marginRight: 10,
  },
  dialogCancelText: {
    fontFamily: TYPOGRAPHY.fontFamily.primaryBold,
    fontSize: 13,
    color: "#4A624E",
  },
  dialogConfirmButton: {
    flex: 1,
    height: 46,
    borderRadius: 12,
    backgroundColor: "#A83232",
    justifyContent: "center",
    alignItems: "center",
  },
  dialogConfirmText: {
    fontFamily: TYPOGRAPHY.fontFamily.primaryBold,
    fontSize: 13,
    color: "#FFFFFF",
  },
  editModalCard: {
    width: "100%",
    maxWidth: 360,
    backgroundColor: "#FFFFFF",
    borderRadius: 18,
    padding: 20,
    ...SHADOWS.elevated,
  },
  editModalHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 16,
  },
  editModalTitle: {
    fontFamily: TYPOGRAPHY.fontFamily.primaryBold,
    fontSize: 17,
    color: "#084D25",
  },
  saveProfileButton: {
    marginTop: 12,
  },
  infoModalCard: {
    width: "100%",
    maxWidth: 360,
    backgroundColor: "#FFFFFF",
    borderRadius: 18,
    padding: 20,
    ...SHADOWS.elevated,
  },
  infoModalHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 12,
  },
  infoModalTitle: {
    fontFamily: TYPOGRAPHY.fontFamily.primaryBold,
    fontSize: 16,
    color: "#084D25",
    flex: 1,
    marginRight: 8,
  },
  infoModalText: {
    fontFamily: TYPOGRAPHY.fontFamily.primary,
    fontSize: 13,
    lineHeight: 19,
    color: COLORS.textSecondary,
    marginBottom: 16,
  },
  infoCloseButton: {
    alignSelf: "flex-end",
    minWidth: 100,
  },
  errorContainer: {
    flex: 1,
    padding: SPACING.md,
    justifyContent: "flex-start",
  },
  errorCard: {
    backgroundColor: "#FFFFFF",
    borderRadius: 18,
    padding: 24,
    alignItems: "center",
    borderWidth: 1,
    borderColor: "#E5EAE5",
    ...SHADOWS.sm,
  },
  errorIconCircle: {
    width: 56,
    height: 56,
    borderRadius: 16,
    backgroundColor: "#FBE8E8",
    justifyContent: "center",
    alignItems: "center",
    marginBottom: 12,
  },
  errorTitle: {
    fontFamily: TYPOGRAPHY.fontFamily.primaryBold,
    fontSize: 18,
    color: "#084D25",
    marginBottom: 6,
    textAlign: "center",
  },
  errorSubtitle: {
    fontFamily: TYPOGRAPHY.fontFamily.primary,
    fontSize: 12,
    color: "#66716A",
    textAlign: "center",
    lineHeight: 17,
    marginBottom: 18,
  },
  tryAgainButton: {
    height: 46,
    backgroundColor: COLORS.primary,
    borderRadius: 12,
    paddingHorizontal: 24,
    justifyContent: "center",
    alignItems: "center",
  },
  tryAgainText: {
    fontFamily: TYPOGRAPHY.fontFamily.primaryBold,
    fontSize: 13,
    color: "#FFFFFF",
  },
});

export default ProfileScreen;
