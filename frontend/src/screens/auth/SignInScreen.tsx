import React, { useState, useEffect } from "react";
import {
  StyleSheet,
  View,
  Text,
  Image,
  ScrollView,
  SafeAreaView,
  TouchableOpacity,
  KeyboardAvoidingView,
  Platform,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { NativeStackScreenProps } from "@react-navigation/native-stack";
import { AuthStackParamList } from "../../types/navigation.types";
import { COLORS, TYPOGRAPHY, SPACING, RADIUS } from "../../constants/theme";
import { SafeBiteButton } from "../../components/common/SafeBiteButton";
import { SafeBiteInput } from "../../components/common/SafeBiteInput";
import { InlineError } from "../../components/feedback/InlineError";
import { useAuth } from "../../context/AuthContext";
import { parseApiError } from "../../api/error-handler";

type SignInScreenProps = NativeStackScreenProps<AuthStackParamList, "SignIn">;

export const SignInScreen: React.FC<SignInScreenProps> = ({ navigation, route }) => {
  const { signIn, resendVerificationOtp } = useAuth();
  const [email, setEmail] = useState(route.params?.prefilledEmail || "");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [fieldErrors, setFieldErrors] = useState<Record<string, string>>({});
  const [isUnverifiedAccount, setIsUnverifiedAccount] = useState(false);

  useEffect(() => {
    if (route.params?.prefilledEmail) {
      setEmail(route.params.prefilledEmail);
    }
  }, [route.params?.prefilledEmail]);

  const validate = (): boolean => {
    const errors: Record<string, string> = {};
    if (!email.trim()) {
      errors.email = "Email address is required";
    } else if (!/\S+@\S+\.\S+/.test(email.trim())) {
      errors.email = "Enter a valid email address";
    }

    if (!password) {
      errors.password = "Password is required";
    }

    setFieldErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const handleSignIn = async () => {
    setErrorMessage(null);
    setIsUnverifiedAccount(false);

    if (!validate()) {
      setErrorMessage("Please enter your email and password.");
      return;
    }

    setLoading(true);
    try {
      await signIn({
        email: email.trim().toLowerCase(),
        password,
      });
      // Navigation is automatically updated by AuthNavigator reacting to isAuthenticated
    } catch (error) {
      const parsed = parseApiError(error);
      const isUnverified =
        parsed.statusCode === 403 ||
        parsed.message.toLowerCase().includes("not verified") ||
        parsed.message.toLowerCase().includes("verification code");

      if (isUnverified) {
        setIsUnverifiedAccount(true);
        setErrorMessage(
          "Your email address has not been verified yet. Please enter the 6-digit confirmation code."
        );
      } else {
        setErrorMessage(parsed.message);
      }

      if (parsed.fieldErrors) {
        setFieldErrors(parsed.fieldErrors);
      }
    } finally {
      setLoading(false);
    }
  };

  const handleNavigateToVerification = async () => {
    const targetEmail = email.trim().toLowerCase();
    try {
      await resendVerificationOtp(targetEmail);
    } catch {
      // Ignore if rate limited; navigate regardless
    }
    navigation.navigate("VerifyEmail", { email: targetEmail });
  };

  const handleForgotPassword = () => {
    navigation.navigate("ForgotPassword", {
      initialEmail: email.trim() || undefined,
    });
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
          {/* Header Section */}
          <View style={styles.header}>
            <Image
              source={require("../../../assets/SafeBite-Logo.png")}
              style={styles.logo}
              resizeMode="contain"
            />
            <Text style={styles.title}>Welcome back</Text>
            <Text style={styles.subtitle}>
              Sign in to access food safety analyses and insights
            </Text>
          </View>

          {/* Form Section */}
          <View style={styles.form}>
            {errorMessage && !isUnverifiedAccount && (
              <InlineError
                message={errorMessage}
                onRetry={handleSignIn}
                style={styles.errorBanner}
              />
            )}

            {/* Unverified Account Banner with CTA */}
            {isUnverifiedAccount && (
              <View style={styles.unverifiedBanner}>
                <View style={styles.unverifiedRow}>
                  <Ionicons name="mail-unread-outline" size={22} color={COLORS.warning || "#B86200"} style={styles.unverifiedIcon} />
                  <Text style={styles.unverifiedTitle}>Email Verification Required</Text>
                </View>
                <Text style={styles.unverifiedText}>
                  Your account requires 6-digit email confirmation before you can sign in.
                </Text>
                <TouchableOpacity
                  activeOpacity={0.8}
                  onPress={handleNavigateToVerification}
                  style={styles.verifyNowButton}
                >
                  <Text style={styles.verifyNowText}>Verify Email Now</Text>
                  <Ionicons name="arrow-forward" size={16} color="#FFFFFF" />
                </TouchableOpacity>
              </View>
            )}

            <SafeBiteInput
              label="Email address"
              placeholder="e.g. user@example.com"
              value={email}
              onChangeText={(text) => {
                setEmail(text);
                if (fieldErrors.email) {
                  setFieldErrors((prev) => ({ ...prev, email: "" }));
                }
                if (isUnverifiedAccount) setIsUnverifiedAccount(false);
              }}
              keyboardType="email-address"
              autoComplete="email"
              leftIcon="mail-outline"
              error={fieldErrors.email}
            />

            <SafeBiteInput
              label="Password"
              placeholder="Enter your password"
              value={password}
              onChangeText={(text) => {
                setPassword(text);
                if (fieldErrors.password) {
                  setFieldErrors((prev) => ({ ...prev, password: "" }));
                }
              }}
              isPassword
              leftIcon="lock-closed-outline"
              error={fieldErrors.password}
            />

            <View style={styles.forgotRow}>
              <TouchableOpacity
                activeOpacity={0.7}
                onPress={handleForgotPassword}
              >
                <Text style={styles.forgotText}>Forgot password?</Text>
              </TouchableOpacity>
            </View>

            <SafeBiteButton
              title="Sign in"
              variant="primary"
              onPress={handleSignIn}
              loading={loading}
              style={styles.signInButton}
            />
          </View>

          {/* Footer Section */}
          <View style={styles.footer}>
            <Text style={styles.footerText}>Don't have an account? </Text>
            <TouchableOpacity
              activeOpacity={0.7}
              onPress={() => navigation.navigate("CreateAccount")}
            >
              <Text style={styles.footerLink}>Create account</Text>
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
    paddingVertical: SPACING.lg,
  },
  header: {
    alignItems: "center",
    marginTop: SPACING.sm,
    marginBottom: SPACING.md,
  },
  logo: {
    width: 180,
    height: 180,
    marginBottom: SPACING.xs,
  },
  title: {
    fontFamily: TYPOGRAPHY.fontFamily.primaryBold,
    fontSize: TYPOGRAPHY.fontSize.title,
    color: COLORS.textPrimary,
  },
  subtitle: {
    fontFamily: TYPOGRAPHY.fontFamily.primary,
    fontSize: TYPOGRAPHY.fontSize.sm,
    color: COLORS.textSecondary,
    textAlign: "center",
    marginTop: 4,
    paddingHorizontal: SPACING.md,
  },
  form: {
    width: "100%",
  },
  errorBanner: {
    marginBottom: SPACING.md,
  },
  unverifiedBanner: {
    backgroundColor: "#FFF8E1",
    borderWidth: 1,
    borderColor: "#FFE082",
    borderRadius: RADIUS.md,
    padding: SPACING.md,
    marginBottom: SPACING.md,
  },
  unverifiedRow: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 4,
  },
  unverifiedIcon: {
    marginRight: 6,
  },
  unverifiedTitle: {
    fontFamily: TYPOGRAPHY.fontFamily.primaryBold,
    fontSize: TYPOGRAPHY.fontSize.sm,
    color: "#8D4004",
  },
  unverifiedText: {
    fontFamily: TYPOGRAPHY.fontFamily.primary,
    fontSize: TYPOGRAPHY.fontSize.xs,
    color: "#5D3002",
    lineHeight: TYPOGRAPHY.lineHeight.sm,
    marginBottom: SPACING.sm,
  },
  verifyNowButton: {
    backgroundColor: COLORS.primary,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    paddingVertical: SPACING.xs + 2,
    paddingHorizontal: SPACING.md,
    borderRadius: RADIUS.sm,
  },
  verifyNowText: {
    fontFamily: TYPOGRAPHY.fontFamily.primaryBold,
    fontSize: TYPOGRAPHY.fontSize.xs,
    color: "#FFFFFF",
    marginRight: 6,
  },
  forgotRow: {
    alignItems: "flex-end",
    marginBottom: SPACING.lg,
    marginTop: -SPACING.xs,
  },
  forgotText: {
    fontFamily: TYPOGRAPHY.fontFamily.primaryMedium,
    fontSize: TYPOGRAPHY.fontSize.xs,
    color: COLORS.primary,
  },
  signInButton: {
    marginBottom: SPACING.md,
  },
  footer: {
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
    marginTop: SPACING.md,
    marginBottom: SPACING.sm,
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

export default SignInScreen;
