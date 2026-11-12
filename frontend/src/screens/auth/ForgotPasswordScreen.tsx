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
import { SafeBiteInput } from "../../components/common/SafeBiteInput";
import { InlineError } from "../../components/feedback/InlineError";
import { authService } from "../../api/auth.service";
import { parseApiError } from "../../api/error-handler";

type ForgotPasswordScreenProps = NativeStackScreenProps<AuthStackParamList, "ForgotPassword">;

type ResetStep = "EMAIL" | "OTP" | "NEW_PASSWORD" | "SUCCESS";

export const ForgotPasswordScreen: React.FC<ForgotPasswordScreenProps> = ({
  navigation,
  route,
}) => {
  const initialEmail = route.params?.initialEmail || "";

  // Wizard state
  const [step, setStep] = useState<ResetStep>("EMAIL");
  const [email, setEmail] = useState(initialEmail);
  const [otp, setOtp] = useState("");
  const [resetToken, setResetToken] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

  // Loading & error handling
  const [loading, setLoading] = useState(false);
  const [resending, setResending] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [statusMessage, setStatusMessage] = useState<string | null>(null);
  const [cooldownSeconds, setCooldownSeconds] = useState(0);

  // 30s cooldown timer for OTP resend
  useEffect(() => {
    if (cooldownSeconds <= 0) return;
    const timer = setInterval(() => {
      setCooldownSeconds((prev) => (prev > 0 ? prev - 1 : 0));
    }, 1000);
    return () => clearInterval(timer);
  }, [cooldownSeconds]);

  // Step 1: Request Password Reset Code
  const handleRequestOtp = async () => {
    setErrorMessage(null);
    setStatusMessage(null);

    const cleanEmail = email.trim().toLowerCase();
    if (!cleanEmail || !/\S+@\S+\.\S+/.test(cleanEmail)) {
      setErrorMessage("Please enter a valid email address.");
      return;
    }

    setLoading(true);
    try {
      const message = await authService.forgotPassword({ email: cleanEmail });
      setStatusMessage(message);
      setCooldownSeconds(30);
      setStep("OTP");
    } catch (error) {
      const parsed = parseApiError(error);
      setErrorMessage(parsed.message);
    } finally {
      setLoading(false);
    }
  };

  // Step 2: Verify 6-digit OTP
  const handleVerifyOtp = async () => {
    setErrorMessage(null);
    setStatusMessage(null);

    const cleanOtp = otp.trim();
    if (!/^\d{6}$/.test(cleanOtp)) {
      setErrorMessage("Please enter the complete 6-digit verification code.");
      return;
    }

    setLoading(true);
    try {
      const data = await authService.verifyResetOtp({
        email: email.trim().toLowerCase(),
        otp: cleanOtp,
      });
      setResetToken(data.resetToken);
      setStatusMessage("Code verified. Please choose your new password.");
      setStep("NEW_PASSWORD");
    } catch (error) {
      const parsed = parseApiError(error);
      setErrorMessage(parsed.message);
    } finally {
      setLoading(false);
    }
  };

  // Step 2 Resend: Resend OTP
  const handleResendOtp = async () => {
    if (cooldownSeconds > 0 || resending) return;

    setErrorMessage(null);
    setStatusMessage(null);
    setResending(true);

    try {
      const message = await authService.forgotPassword({ email: email.trim().toLowerCase() });
      setStatusMessage(message || "A new 6-digit verification code has been sent.");
      setCooldownSeconds(30);
    } catch (error) {
      const parsed = parseApiError(error);
      setErrorMessage(parsed.message);
    } finally {
      setResending(false);
    }
  };

  // Step 3: Set New Password
  const handleResetPassword = async () => {
    setErrorMessage(null);
    setStatusMessage(null);

    if (!newPassword || newPassword.length < 6) {
      setErrorMessage("Password must be at least 6 characters.");
      return;
    }

    if (newPassword.length > 72) {
      setErrorMessage("Password cannot exceed 72 characters.");
      return;
    }

    if (newPassword !== confirmPassword) {
      setErrorMessage("Passwords do not match. Please re-enter.");
      return;
    }

    setLoading(true);
    try {
      await authService.resetPassword({
        resetToken,
        newPassword,
      });
      setStep("SUCCESS");
    } catch (error) {
      const parsed = parseApiError(error);
      setErrorMessage(parsed.message);
    } finally {
      setLoading(false);
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
              onPress={() => {
                if (step === "OTP") setStep("EMAIL");
                else if (step === "NEW_PASSWORD") setStep("OTP");
                else navigation.goBack();
              }}
              style={styles.backButton}
              hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
            >
              <Ionicons name="arrow-back" size={24} color={COLORS.textPrimary} />
            </TouchableOpacity>
          </View>

          {/* Step Breadcrumbs */}
          {step !== "SUCCESS" && (
            <View style={styles.stepIndicatorRow}>
              <View style={[styles.stepDot, styles.stepActive]}>
                <Text style={styles.stepDotText}>1</Text>
              </View>
              <View style={[styles.stepLine, (step === "OTP" || step === "NEW_PASSWORD") && styles.stepLineActive]} />
              <View style={[styles.stepDot, (step === "OTP" || step === "NEW_PASSWORD") && styles.stepActive]}>
                <Text style={[styles.stepDotText, !(step === "OTP" || step === "NEW_PASSWORD") && styles.stepDotInactiveText]}>2</Text>
              </View>
              <View style={[styles.stepLine, step === "NEW_PASSWORD" && styles.stepLineActive]} />
              <View style={[styles.stepDot, step === "NEW_PASSWORD" && styles.stepActive]}>
                <Text style={[styles.stepDotText, step !== "NEW_PASSWORD" && styles.stepDotInactiveText]}>3</Text>
              </View>
            </View>
          )}

          {/* STEP 1: Enter Email */}
          {step === "EMAIL" && (
            <View style={styles.stepCard}>
              <View style={styles.iconCircle}>
                <Ionicons name="key-outline" size={40} color={COLORS.primary} />
              </View>

              <Text style={styles.title}>Forgot password?</Text>
              <Text style={styles.subtitle}>
                Enter the email address associated with your SafeBite account to receive a 6-digit recovery code.
              </Text>

              {errorMessage && (
                <InlineError
                  message={errorMessage}
                  onRetry={handleRequestOtp}
                  style={styles.errorBanner}
                />
              )}

              <SafeBiteInput
                label="Email address"
                placeholder="e.g. user@example.com"
                value={email}
                onChangeText={(text) => {
                  setEmail(text);
                  if (errorMessage) setErrorMessage(null);
                }}
                keyboardType="email-address"
                autoComplete="email"
                leftIcon="mail-outline"
                autoFocus
              />

              <SafeBiteButton
                title="Send Recovery Code"
                variant="primary"
                onPress={handleRequestOtp}
                loading={loading}
                style={styles.actionButton}
              />
            </View>
          )}

          {/* STEP 2: Enter OTP */}
          {step === "OTP" && (
            <View style={styles.stepCard}>
              <View style={styles.iconCircle}>
                <Ionicons name="shield-checkmark-outline" size={40} color={COLORS.primary} />
              </View>

              <Text style={styles.title}>Enter verification code</Text>
              <Text style={styles.subtitle}>
                We sent a 6-digit code to
              </Text>
              <Text style={styles.emailBadge}>{email}</Text>

              {statusMessage && (
                <View style={styles.successBanner}>
                  <Ionicons name="information-circle-outline" size={18} color={COLORS.primary} style={styles.bannerIcon} />
                  <Text style={styles.statusText}>{statusMessage}</Text>
                </View>
              )}

              {errorMessage && (
                <InlineError
                  message={errorMessage}
                  onRetry={handleVerifyOtp}
                  style={styles.errorBanner}
                />
              )}

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
                />
              </View>

              <SafeBiteButton
                title="Verify Code"
                variant="primary"
                onPress={handleVerifyOtp}
                loading={loading}
                disabled={otp.length !== 6 || loading}
                style={styles.actionButton}
              />

              <View style={styles.resendContainer}>
                <Text style={styles.resendPrompt}>Didn't receive the code? </Text>
                {cooldownSeconds > 0 ? (
                  <Text style={styles.cooldownText}>
                    Resend in {cooldownSeconds}s
                  </Text>
                ) : (
                  <TouchableOpacity
                    activeOpacity={0.7}
                    onPress={handleResendOtp}
                    disabled={resending}
                  >
                    <Text style={styles.resendLink}>
                      {resending ? "Sending..." : "Resend code"}
                    </Text>
                  </TouchableOpacity>
                )}
              </View>

              <TouchableOpacity
                activeOpacity={0.7}
                onPress={() => setStep("EMAIL")}
                style={styles.changeEmailButton}
              >
                <Text style={styles.changeEmailText}>Change email address</Text>
              </TouchableOpacity>
            </View>
          )}

          {/* STEP 3: Enter New Password */}
          {step === "NEW_PASSWORD" && (
            <View style={styles.stepCard}>
              <View style={styles.iconCircle}>
                <Ionicons name="lock-closed-outline" size={40} color={COLORS.primary} />
              </View>

              <Text style={styles.title}>Create new password</Text>
              <Text style={styles.subtitle}>
                Choose a strong password with at least 6 characters.
              </Text>

              {errorMessage && (
                <InlineError
                  message={errorMessage}
                  onRetry={handleResetPassword}
                  style={styles.errorBanner}
                />
              )}

              <SafeBiteInput
                label="New password"
                placeholder="At least 6 characters"
                value={newPassword}
                onChangeText={(text) => {
                  setNewPassword(text);
                  if (errorMessage) setErrorMessage(null);
                }}
                isPassword
                leftIcon="lock-closed-outline"
                autoFocus
              />

              <SafeBiteInput
                label="Confirm new password"
                placeholder="Re-enter your new password"
                value={confirmPassword}
                onChangeText={(text) => {
                  setConfirmPassword(text);
                  if (errorMessage) setErrorMessage(null);
                }}
                isPassword
                leftIcon="lock-closed-outline"
              />

              <SafeBiteButton
                title="Reset Password"
                variant="primary"
                onPress={handleResetPassword}
                loading={loading}
                disabled={!newPassword || !confirmPassword || loading}
                style={styles.actionButton}
              />
            </View>
          )}

          {/* STEP 4: Success Confirmation */}
          {step === "SUCCESS" && (
            <View style={styles.stepCard}>
              <View style={styles.successIconCircle}>
                <Ionicons name="checkmark-circle" size={56} color={COLORS.primary} />
              </View>

              <Text style={styles.title}>Password reset complete!</Text>
              <Text style={styles.subtitle}>
                Your password has been securely updated. You can now sign in with your new credentials.
              </Text>

              <SafeBiteButton
                title="Sign In Now"
                variant="primary"
                onPress={() => navigation.navigate("SignIn", { prefilledEmail: email })}
                style={styles.actionButton}
              />
            </View>
          )}

          {/* Footer Back to Sign In */}
          {step !== "SUCCESS" && (
            <View style={styles.footer}>
              <Text style={styles.footerText}>Remember your password? </Text>
              <TouchableOpacity
                activeOpacity={0.7}
                onPress={() => navigation.navigate("SignIn")}
              >
                <Text style={styles.footerLink}>Sign in</Text>
              </TouchableOpacity>
            </View>
          )}
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
  stepIndicatorRow: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    marginBottom: SPACING.md,
    marginTop: -SPACING.xs,
  },
  stepDot: {
    width: 28,
    height: 28,
    borderRadius: 14,
    backgroundColor: COLORS.card,
    borderWidth: 1.5,
    borderColor: COLORS.border,
    justifyContent: "center",
    alignItems: "center",
  },
  stepActive: {
    backgroundColor: COLORS.primary,
    borderColor: COLORS.primary,
  },
  stepDotText: {
    fontFamily: TYPOGRAPHY.fontFamily.primaryBold,
    fontSize: 12,
    color: "#FFFFFF",
  },
  stepDotInactiveText: {
    color: COLORS.textMuted,
  },
  stepLine: {
    width: 44,
    height: 2,
    backgroundColor: COLORS.border,
    marginHorizontal: SPACING.xs,
  },
  stepLineActive: {
    backgroundColor: COLORS.primary,
  },
  stepCard: {
    alignItems: "center",
    width: "100%",
    paddingVertical: SPACING.sm,
  },
  iconCircle: {
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: COLORS.surfaceLightGreen,
    justifyContent: "center",
    alignItems: "center",
    marginBottom: SPACING.md,
  },
  successIconCircle: {
    width: 96,
    height: 96,
    borderRadius: 48,
    backgroundColor: COLORS.surfaceLightGreen,
    justifyContent: "center",
    alignItems: "center",
    marginBottom: SPACING.lg,
    marginTop: SPACING.xl,
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
    lineHeight: TYPOGRAPHY.lineHeight.md,
    paddingHorizontal: SPACING.sm,
    marginBottom: SPACING.md,
  },
  emailBadge: {
    fontFamily: TYPOGRAPHY.fontFamily.primaryBold,
    fontSize: TYPOGRAPHY.fontSize.md,
    color: COLORS.primary,
    textAlign: "center",
    marginTop: -SPACING.xs,
    marginBottom: SPACING.md,
  },
  errorBanner: {
    width: "100%",
    marginBottom: SPACING.md,
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
  statusText: {
    fontFamily: TYPOGRAPHY.fontFamily.primaryMedium,
    fontSize: TYPOGRAPHY.fontSize.xs,
    color: COLORS.primaryDark,
    flex: 1,
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
  actionButton: {
    width: "100%",
    marginTop: SPACING.xs,
    marginBottom: SPACING.md,
  },
  resendContainer: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    marginBottom: SPACING.sm,
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
  changeEmailButton: {
    paddingVertical: SPACING.xs,
  },
  changeEmailText: {
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

export default ForgotPasswordScreen;
