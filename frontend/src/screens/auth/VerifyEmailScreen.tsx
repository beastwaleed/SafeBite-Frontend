import React, { useState, useEffect } from "react";
import {
  StyleSheet,
  View,
  Text,
  ScrollView,
  SafeAreaView,
  TouchableOpacity,
  KeyboardAvoidingView,
  Platform,
  TextInput,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { NativeStackScreenProps } from "@react-navigation/native-stack";
import { AuthStackParamList } from "../../types/navigation.types";
import { COLORS, TYPOGRAPHY, SPACING, RADIUS } from "../../constants/theme";
import { SafeBiteButton } from "../../components/common/SafeBiteButton";
import { InlineError } from "../../components/feedback/InlineError";
import { useAuth } from "../../context/AuthContext";
import { parseApiError } from "../../api/error-handler";

type VerifyEmailScreenProps = NativeStackScreenProps<AuthStackParamList, "VerifyEmail">;

export const VerifyEmailScreen: React.FC<VerifyEmailScreenProps> = ({ navigation, route }) => {
  const { email } = route.params;
  const { verifyEmail, resendVerificationOtp } = useAuth();

  const [otp, setOtp] = useState("");
  const [loading, setLoading] = useState(false);
  const [resending, setResending] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [successNotice, setSuccessNotice] = useState<string | null>(null);
  const [cooldownSeconds, setCooldownSeconds] = useState(30);

  // 30-second cooldown countdown timer
  useEffect(() => {
    if (cooldownSeconds <= 0) return;
    const timer = setInterval(() => {
      setCooldownSeconds((prev) => (prev > 0 ? prev - 1 : 0));
    }, 1000);
    return () => clearInterval(timer);
  }, [cooldownSeconds]);

  const handleVerify = async () => {
    setErrorMessage(null);
    setSuccessNotice(null);

    const cleanOtp = otp.trim();
    if (!/^\d{6}$/.test(cleanOtp)) {
      setErrorMessage("Please enter the complete 6-digit verification code.");
      return;
    }

    setLoading(true);
    try {
      await verifyEmail({
        email: email.trim().toLowerCase(),
        otp: cleanOtp,
      });
      // Authentication state changes automatically route to AppNavigator
    } catch (error) {
      const parsed = parseApiError(error);
      setErrorMessage(parsed.message);
    } finally {
      setLoading(false);
    }
  };

  const handleResendCode = async () => {
    if (cooldownSeconds > 0 || resending) return;

    setErrorMessage(null);
    setSuccessNotice(null);
    setResending(true);

    try {
      const message = await resendVerificationOtp(email);
      setSuccessNotice(message || "A fresh 6-digit code has been sent to your email.");
      setCooldownSeconds(30);
    } catch (error) {
      const parsed = parseApiError(error);
      setErrorMessage(parsed.message);
    } finally {
      setResending(false);
    }
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      <KeyboardAvoidingView
        style={styles.keyboardView}
        behavior={Platform.OS === "ios" ? "padding" : undefined}
        enabled={Platform.OS !== "web"}
      >
        <ScrollView
          contentContainerStyle={styles.container}
          keyboardShouldPersistTaps={Platform.OS === "web" ? "always" : "handled"}
        >
          {/* Top Bar */}
          <View style={styles.topBar}>
            <TouchableOpacity
              activeOpacity={0.7}
              onPress={() => navigation.goBack()}
              style={styles.backButton}
              hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
            >
              <Ionicons name="arrow-back" size={24} color={COLORS.textPrimary} />
            </TouchableOpacity>
          </View>

          {/* Main Card Content */}
          <View style={styles.content}>
            <View style={styles.iconCircle}>
              <Ionicons name="mail-open-outline" size={44} color={COLORS.primary} />
            </View>

            <Text style={styles.title}>Check your email</Text>
            <Text style={styles.subtitle}>
              We sent a 6-digit verification code to
            </Text>
            <Text style={styles.emailBadge}>{email}</Text>

            {/* Success notice */}
            {successNotice && (
              <View style={styles.successBanner}>
                <Ionicons name="checkmark-circle" size={18} color={COLORS.primary} style={styles.bannerIcon} />
                <Text style={styles.successText}>{successNotice}</Text>
              </View>
            )}

            {/* Error notice */}
            {errorMessage && (
              <InlineError
                message={errorMessage}
                onRetry={handleVerify}
                style={styles.errorBanner}
              />
            )}

            {/* OTP Input */}
            <View style={styles.inputContainer}>
              <Text style={styles.inputLabel}>Enter 6-digit code</Text>
              <TextInput
                value={otp}
                onChangeText={(text) => {
                  const cleaned = text.replace(/[^0-9]/g, "").slice(0, 6);
                  setOtp(cleaned);
                  if (errorMessage) setErrorMessage(null);
                }}
                keyboardType="number-pad"
                maxLength={6}
                placeholder="000000"
                placeholderTextColor={COLORS.textMuted}
                style={styles.otpInput}
                autoFocus
                textContentType="oneTimeCode"
                autoComplete="one-time-code"
              />
            </View>

            {/* Verify Button */}
            <SafeBiteButton
              title="Verify & Continue"
              variant="primary"
              onPress={handleVerify}
              loading={loading}
              disabled={otp.length !== 6 || loading}
              style={styles.verifyButton}
            />

            {/* Resend OTP Section */}
            <View style={styles.resendContainer}>
              <Text style={styles.resendPrompt}>Didn't receive the email? </Text>
              {cooldownSeconds > 0 ? (
                <Text style={styles.cooldownText}>
                  Resend in {cooldownSeconds}s
                </Text>
              ) : (
                <TouchableOpacity
                  activeOpacity={0.7}
                  onPress={handleResendCode}
                  disabled={resending}
                >
                  <Text style={styles.resendLink}>
                    {resending ? "Sending..." : "Resend code"}
                  </Text>
                </TouchableOpacity>
              )}
            </View>

            {/* Edit Email option */}
            <TouchableOpacity
              activeOpacity={0.7}
              onPress={() => navigation.goBack()}
              style={styles.editEmailButton}
            >
              <Text style={styles.editEmailText}>Change email address</Text>
            </TouchableOpacity>
          </View>

          {/* Footer */}
          <View style={styles.footer}>
            <Text style={styles.footerText}>Already verified? </Text>
            <TouchableOpacity
              activeOpacity={0.7}
              onPress={() => navigation.navigate("SignIn", { prefilledEmail: email })}
            >
              <Text style={styles.footerLink}>Sign in</Text>
            </TouchableOpacity>
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: COLORS.background,
  },
  keyboardView: {
    flex: 1,
  },
  container: {
    flexGrow: 1,
    justifyContent: "space-between",
    paddingHorizontal: SPACING.lg,
    paddingBottom: SPACING.lg,
  },
  topBar: {
    height: 48,
    justifyContent: "center",
    marginTop: SPACING.xs,
  },
  backButton: {
    padding: SPACING.xs,
    marginLeft: -SPACING.xs,
  },
  content: {
    alignItems: "center",
    width: "100%",
    paddingVertical: SPACING.md,
  },
  iconCircle: {
    width: 84,
    height: 84,
    borderRadius: 42,
    backgroundColor: COLORS.surfaceLightGreen,
    justifyContent: "center",
    alignItems: "center",
    marginBottom: SPACING.lg,
  },
  title: {
    fontFamily: TYPOGRAPHY.fontFamily.primaryBold,
    fontSize: TYPOGRAPHY.fontSize.title,
    color: COLORS.textPrimary,
    textAlign: "center",
  },
  subtitle: {
    fontFamily: TYPOGRAPHY.fontFamily.primary,
    fontSize: TYPOGRAPHY.fontSize.sm,
    color: COLORS.textSecondary,
    textAlign: "center",
    marginTop: SPACING.xs,
  },
  emailBadge: {
    fontFamily: TYPOGRAPHY.fontFamily.primaryBold,
    fontSize: TYPOGRAPHY.fontSize.md,
    color: COLORS.primary,
    textAlign: "center",
    marginTop: 4,
    marginBottom: SPACING.lg,
    paddingHorizontal: SPACING.sm,
  },
  successBanner: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: COLORS.surfaceLightGreen,
    borderWidth: 1,
    borderColor: COLORS.primaryLight,
    paddingHorizontal: SPACING.md,
    paddingVertical: SPACING.sm,
    borderRadius: RADIUS.md,
    marginBottom: SPACING.md,
    width: "100%",
  },
  bannerIcon: {
    marginRight: SPACING.xs,
  },
  successText: {
    fontFamily: TYPOGRAPHY.fontFamily.primaryMedium,
    fontSize: TYPOGRAPHY.fontSize.xs,
    color: COLORS.primaryDark,
    flex: 1,
  },
  errorBanner: {
    width: "100%",
    marginBottom: SPACING.md,
  },
  inputContainer: {
    width: "100%",
    marginBottom: SPACING.lg,
  },
  inputLabel: {
    fontFamily: TYPOGRAPHY.fontFamily.primaryMedium,
    fontSize: TYPOGRAPHY.fontSize.xs,
    color: COLORS.textSecondary,
    marginBottom: SPACING.xs,
    textAlign: "center",
  },
  otpInput: {
    backgroundColor: COLORS.card,
    borderWidth: 1.5,
    borderColor: COLORS.border,
    borderRadius: RADIUS.md,
    height: 56,
    fontFamily: TYPOGRAPHY.fontFamily.primaryBold,
    fontSize: 26,
    letterSpacing: 12,
    textAlign: "center",
    color: COLORS.textPrimary,
    ...(Platform.OS === "web" ? { outlineStyle: "none" as any } : {}),
  },
  verifyButton: {
    width: "100%",
    marginBottom: SPACING.lg,
  },
  resendContainer: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    marginBottom: SPACING.md,
  },
  resendPrompt: {
    fontFamily: TYPOGRAPHY.fontFamily.primary,
    fontSize: TYPOGRAPHY.fontSize.sm,
    color: COLORS.textSecondary,
  },
  cooldownText: {
    fontFamily: TYPOGRAPHY.fontFamily.primaryMedium,
    fontSize: TYPOGRAPHY.fontSize.sm,
    color: COLORS.textMuted,
  },
  resendLink: {
    fontFamily: TYPOGRAPHY.fontFamily.primaryBold,
    fontSize: TYPOGRAPHY.fontSize.sm,
    color: COLORS.primary,
  },
  editEmailButton: {
    paddingVertical: SPACING.xs,
  },
  editEmailText: {
    fontFamily: TYPOGRAPHY.fontFamily.primaryMedium,
    fontSize: TYPOGRAPHY.fontSize.xs,
    color: COLORS.textSecondary,
    textDecorationLine: "underline",
  },
  footer: {
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
    marginTop: SPACING.md,
  },
  footerText: {
    fontFamily: TYPOGRAPHY.fontFamily.primary,
    fontSize: TYPOGRAPHY.fontSize.sm,
    color: COLORS.textSecondary,
  },
  footerLink: {
    fontFamily: TYPOGRAPHY.fontFamily.primaryBold,
    fontSize: TYPOGRAPHY.fontSize.sm,
    color: COLORS.primary,
  },
});

export default VerifyEmailScreen;
