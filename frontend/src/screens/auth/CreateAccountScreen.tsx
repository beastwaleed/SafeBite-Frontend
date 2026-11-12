import React, { useState } from "react";
import {
  StyleSheet,
  View,
  Text,
  ScrollView,
  SafeAreaView,
  TouchableOpacity,
  KeyboardAvoidingView,
  Platform,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { NativeStackNavigationProp } from "@react-navigation/native-stack";
import { AuthStackParamList } from "../../types/navigation.types";
import { COLORS, TYPOGRAPHY, SPACING, RADIUS } from "../../constants/theme";
import { SafeBiteButton } from "../../components/common/SafeBiteButton";
import { SafeBiteInput } from "../../components/common/SafeBiteInput";
import { InlineError } from "../../components/feedback/InlineError";
import { useAuth } from "../../context/AuthContext";
import { parseApiError } from "../../api/error-handler";
import { authService } from "../../api/auth.service";

interface CreateAccountScreenProps {
  navigation: NativeStackNavigationProp<AuthStackParamList, "CreateAccount">;
}

export const CreateAccountScreen: React.FC<CreateAccountScreenProps> = ({ navigation }) => {
  const { signUp } = useAuth();
  const [fullName, setFullName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [fieldErrors, setFieldErrors] = useState<Record<string, string>>({});
  const [emailSuggestion, setEmailSuggestion] = useState<string | null>(null);

  // Strict backend name policy validation (GR-S-01)
  const validateFullName = (name: string): string | null => {
    if (!name.trim()) return null; // fullName is optional
    if (name.length > 70) return "Name cannot exceed 70 characters";
    if (/[\p{Extended_Pictographic}\p{Emoji_Presentation}\p{Cc}\p{Cf}\uFEFF\u200B-\u200F0-9]/u.test(name)) {
      return "Name cannot contain numbers, emojis, or symbols";
    }
    const strictNameRegex = /^[\p{L}]+(?:[' -][\p{L}]+)*$/u;
    if (!strictNameRegex.test(name.normalize("NFC"))) {
      return "Name must only contain letters, single spaces, hyphens, or apostrophes";
    }
    return null;
  };

  const validate = (): boolean => {
    const errors: Record<string, string> = {};

    const nameError = validateFullName(fullName);
    if (nameError) {
      errors.fullName = nameError;
    }

    if (!email.trim()) {
      errors.email = "Email address is required";
    } else if (!/\S+@\S+\.\S+/.test(email.trim())) {
      errors.email = "Enter a valid email address";
    }

    if (!password) {
      errors.password = "Password is required";
    } else if (password.length < 6) {
      errors.password = "Password must be at least 6 characters";
    } else if (password.length > 72) {
      errors.password = "Password cannot exceed 72 characters";
    }

    setFieldErrors(errors);
    return Object.keys(errors).length === 0;
  };

  // Optional domain typo verification
  const checkEmailTypo = async (candidateEmail: string) => {
    if (!candidateEmail.includes("@") || !candidateEmail.includes(".")) {
      setEmailSuggestion(null);
      return;
    }
    try {
      const check = await authService.validateEmail(candidateEmail);
      if (check.suggestion && check.suggestion.toLowerCase() !== candidateEmail.toLowerCase()) {
        setEmailSuggestion(check.suggestion);
      } else {
        setEmailSuggestion(null);
      }
    } catch {
      setEmailSuggestion(null);
    }
  };

  const handleSignUp = async () => {
    setErrorMessage(null);
    if (!validate()) {
      setErrorMessage("Please complete all required fields correctly.");
      return;
    }

    setLoading(true);
    try {
      const cleanEmail = email.trim().toLowerCase();
      const result = await signUp({
        email: cleanEmail,
        password,
        fullName: fullName.trim() || undefined,
      });

      if (result.requiresEmailVerification) {
        navigation.navigate("VerifyEmail", {
          email: cleanEmail,
          fullName: fullName.trim() || undefined,
        });
      }
    } catch (error) {
      const parsed = parseApiError(error);
      setErrorMessage(parsed.message);
      if (parsed.fieldErrors) {
        setFieldErrors(parsed.fieldErrors);
      }
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
          {/* Top Bar with Back Arrow */}
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

          {/* Heading */}
          <View style={styles.header}>
            <Text style={styles.title}>Create your account</Text>
            <Text style={styles.subtitle}>
              Sign up to save favorite products, view scan history, and access food safety insights.
            </Text>
          </View>

          {/* Form */}
          <View style={styles.form}>
            {errorMessage && (
              <InlineError
                message={errorMessage}
                onRetry={handleSignUp}
                style={styles.errorBanner}
              />
            )}

            <SafeBiteInput
              label="Full name (optional)"
              placeholder="e.g. Waleed Khan"
              value={fullName}
              onChangeText={(text) => {
                setFullName(text);
                if (fieldErrors.fullName) {
                  setFieldErrors((prev) => ({ ...prev, fullName: "" }));
                }
              }}
              leftIcon="person-outline"
              error={fieldErrors.fullName}
              helperText="Only letters and approved punctuation (no numbers or emojis)"
            />

            <SafeBiteInput
              label="Email address"
              placeholder="e.g. user@example.com"
              value={email}
              onChangeText={(text) => {
                setEmail(text);
                if (fieldErrors.email) {
                  setFieldErrors((prev) => ({ ...prev, email: "" }));
                }
                if (emailSuggestion) setEmailSuggestion(null);
              }}
              onBlur={() => checkEmailTypo(email)}
              keyboardType="email-address"
              autoComplete="email"
              leftIcon="mail-outline"
              error={fieldErrors.email}
            />

            {/* Email Typo Suggestion Pill */}
            {emailSuggestion && (
              <TouchableOpacity
                activeOpacity={0.8}
                onPress={() => {
                  setEmail(emailSuggestion);
                  setEmailSuggestion(null);
                }}
                style={styles.suggestionPill}
              >
                <Ionicons name="sparkles-outline" size={14} color={COLORS.primary} style={styles.suggestionIcon} />
                <Text style={styles.suggestionText}>
                  Did you mean <Text style={styles.suggestionHighlight}>{emailSuggestion}</Text>? Tap to use
                </Text>
              </TouchableOpacity>
            )}

            <SafeBiteInput
              label="Password"
              placeholder="At least 6 characters"
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

            <SafeBiteButton
              title="Create account"
              variant="primary"
              onPress={handleSignUp}
              loading={loading}
              style={styles.signUpButton}
            />
          </View>

          {/* Footer */}
          <View style={styles.footer}>
            <Text style={styles.footerText}>Already have an account? </Text>
            <TouchableOpacity
              activeOpacity={0.7}
              onPress={() => navigation.navigate("SignIn")}
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
  header: {
    marginTop: SPACING.xs,
    marginBottom: SPACING.lg,
  },
  title: {
    fontFamily: TYPOGRAPHY.fontFamily.primaryBold,
    fontSize: TYPOGRAPHY.fontSize.title,
    color: COLORS.textPrimary,
  },
  subtitle: {
    fontFamily: TYPOGRAPHY.fontFamily.primary,
    fontSize: TYPOGRAPHY.fontSize.sm,
    lineHeight: TYPOGRAPHY.lineHeight.md,
    color: COLORS.textSecondary,
    marginTop: SPACING.xs,
  },
  form: {
    width: "100%",
  },
  errorBanner: {
    marginBottom: SPACING.md,
  },
  suggestionPill: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: COLORS.surfaceLightGreen,
    borderWidth: 1,
    borderColor: COLORS.primaryLight,
    paddingHorizontal: SPACING.sm,
    paddingVertical: SPACING.xs,
    borderRadius: RADIUS.sm,
    marginTop: -SPACING.xs,
    marginBottom: SPACING.sm,
  },
  suggestionIcon: {
    marginRight: 6,
  },
  suggestionText: {
    fontFamily: TYPOGRAPHY.fontFamily.primary,
    fontSize: TYPOGRAPHY.fontSize.xs,
    color: COLORS.textPrimary,
  },
  suggestionHighlight: {
    fontFamily: TYPOGRAPHY.fontFamily.primaryBold,
    color: COLORS.primary,
    textDecorationLine: "underline",
  },
  signUpButton: {
    marginTop: SPACING.sm,
    marginBottom: SPACING.md,
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

export default CreateAccountScreen;
