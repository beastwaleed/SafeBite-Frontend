import React from "react";
import { StyleSheet, View, Text, Image, ScrollView, SafeAreaView } from "react-native";
import { NativeStackNavigationProp } from "@react-navigation/native-stack";
import { AuthStackParamList } from "../../types/navigation.types";
import { COLORS, TYPOGRAPHY, SPACING, RADIUS } from "../../constants/theme";
import { SafeBiteButton } from "../../components/common/SafeBiteButton";

interface WelcomeScreenProps {
  navigation: NativeStackNavigationProp<AuthStackParamList, "Welcome">;
}

export const WelcomeScreen: React.FC<WelcomeScreenProps> = ({ navigation }) => {
  return (
    <SafeAreaView style={styles.safeArea}>
      <ScrollView contentContainerStyle={styles.container} bounces={false}>
        {/* Top/Center Hero: Logo + Headline + Subtext */}
        <View style={styles.heroSection}>
          <View style={styles.logoWrapper}>
            <Image
              source={require("../../../assets/SafeBite-Logo.png")}
              style={styles.logo}
              resizeMode="contain"
            />
          </View>

          <Text style={styles.headline}>Make more informed food choices</Text>
          <Text style={styles.subtext}>
            Scan packaged food barcodes, review heavy metal evidence reported in Pakistani
            research papers, and compare against international safety standards.
          </Text>
        </View>

        {/* Bottom Actions: Create Account, Sign In, Disclaimer */}
        <View style={styles.bottomSection}>
          <SafeBiteButton
            title="Create account"
            variant="primary"
            onPress={() => navigation.navigate("CreateAccount")}
            style={styles.createButton}
          />

          <SafeBiteButton
            title="Sign in"
            variant="secondary"
            onPress={() => navigation.navigate("SignIn")}
            style={styles.signInButton}
          />

          <View style={styles.disclaimerBox}>
            <Text style={styles.disclaimerText}>
              SafeBite is an informational platform. It does not provide medical diagnosis,
              clinical advice, or personal safety guarantees.
            </Text>
          </View>
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
    flexGrow: 1,
    justifyContent: "space-between",
    paddingHorizontal: SPACING.lg,
    paddingTop: SPACING.xxl,
    paddingBottom: SPACING.lg,
  },
  heroSection: {
    alignItems: "center",
    marginTop: SPACING.md,
  },
  logoWrapper: {
    width: 210,
    height: 210,
    justifyContent: "center",
    alignItems: "center",
    marginBottom: SPACING.md,
  },
  logo: {
    width: 200,
    height: 200,
  },
  headline: {
    fontFamily: TYPOGRAPHY.fontFamily.primaryBold,
    fontSize: TYPOGRAPHY.fontSize.title,
    lineHeight: TYPOGRAPHY.lineHeight.title,
    color: COLORS.textPrimary,
    textAlign: "center",
    marginBottom: SPACING.sm,
    paddingHorizontal: SPACING.xs,
  },
  subtext: {
    fontFamily: TYPOGRAPHY.fontFamily.primary,
    fontSize: TYPOGRAPHY.fontSize.sm,
    lineHeight: TYPOGRAPHY.lineHeight.md,
    color: COLORS.textSecondary,
    textAlign: "center",
    paddingHorizontal: SPACING.sm,
    maxWidth: 340,
  },
  bottomSection: {
    width: "100%",
    alignItems: "center",
    marginTop: SPACING.xl,
  },
  createButton: {
    marginBottom: SPACING.sm,
  },
  signInButton: {
    marginBottom: SPACING.md,
  },
  disclaimerBox: {
    paddingHorizontal: SPACING.sm,
    paddingTop: SPACING.xs,
  },
  disclaimerText: {
    fontFamily: TYPOGRAPHY.fontFamily.primary,
    fontSize: TYPOGRAPHY.fontSize.xs - 1,
    lineHeight: TYPOGRAPHY.lineHeight.xs,
    color: COLORS.textMuted,
    textAlign: "center",
  },
});

export default WelcomeScreen;
