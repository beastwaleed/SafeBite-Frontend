import React, { useEffect, useRef } from "react";
import {
  StyleSheet,
  View,
  Text,
  Image,
  Animated,
  Easing,
  Platform,
  SafeAreaView,
} from "react-native";
import { COLORS, TYPOGRAPHY, SPACING } from "../../constants/theme";

export const SplashScreen: React.FC = () => {
  // Animation values for smooth logo reveal
  const logoScale = useRef(new Animated.Value(0.68)).current;
  const logoOpacity = useRef(new Animated.Value(0)).current;
  const glowScale = useRef(new Animated.Value(0.75)).current;
  const glowOpacity = useRef(new Animated.Value(0)).current;
  const textOpacity = useRef(new Animated.Value(0)).current;
  const textTranslateY = useRef(new Animated.Value(14)).current;
  const progressAnim = useRef(new Animated.Value(0)).current;

  const useNativeDriver = Platform.OS !== "web";

  useEffect(() => {
    // 1. Reveal Phase: Logo & Ambient Aura expand and fade in
    Animated.parallel([
      Animated.timing(logoOpacity, {
        toValue: 1,
        duration: 750,
        easing: Easing.out(Easing.cubic),
        useNativeDriver,
      }),
      Animated.spring(logoScale, {
        toValue: 1,
        friction: 6,
        tension: 42,
        useNativeDriver,
      }),
      Animated.timing(glowOpacity, {
        toValue: 0.85,
        duration: 850,
        easing: Easing.out(Easing.cubic),
        useNativeDriver,
      }),
      Animated.timing(glowScale, {
        toValue: 1.12,
        duration: 950,
        easing: Easing.out(Easing.cubic),
        useNativeDriver,
      }),
      // Continuous progress line along the bottom
      Animated.timing(progressAnim, {
        toValue: 1,
        duration: 2700,
        easing: Easing.bezier(0.2, 0.0, 0.2, 1),
        useNativeDriver: false,
      }),
    ]).start(() => {
      // 2. Tagline floats in smoothly right after the logo settles
      Animated.parallel([
        Animated.timing(textOpacity, {
          toValue: 1,
          duration: 550,
          easing: Easing.out(Easing.quad),
          useNativeDriver,
        }),
        Animated.timing(textTranslateY, {
          toValue: 0,
          duration: 550,
          easing: Easing.out(Easing.quad),
          useNativeDriver,
        }),
      ]).start();

      // 3. Gentle ambient pulsing of the background aura
      Animated.loop(
        Animated.sequence([
          Animated.timing(glowScale, {
            toValue: 1.22,
            duration: 1100,
            easing: Easing.inOut(Easing.ease),
            useNativeDriver,
          }),
          Animated.timing(glowScale, {
            toValue: 1.1,
            duration: 1100,
            easing: Easing.inOut(Easing.ease),
            useNativeDriver,
          }),
        ])
      ).start();
    });
  }, [
    glowOpacity,
    glowScale,
    logoOpacity,
    logoScale,
    progressAnim,
    textOpacity,
    textTranslateY,
    useNativeDriver,
  ]);

  const progressBarWidth = progressAnim.interpolate({
    inputRange: [0, 1],
    outputRange: ["0%", "100%"],
  });

  return (
    <SafeAreaView style={styles.safeArea}>
      <View style={styles.container}>
        {/* Centered Logo Reveal presentation */}
        <View style={styles.centerContent}>
          {/* Ambient Glowing Aura */}
          <Animated.View
            style={[
              styles.glowAura,
              {
                opacity: glowOpacity,
                transform: [{ scale: glowScale }],
              },
            ]}
          />

          {/* SafeBite Animated Logo */}
          <Animated.View
            style={[
              styles.logoWrapper,
              {
                opacity: logoOpacity,
                transform: [{ scale: logoScale }],
              },
            ]}
          >
            <Image
              source={require("../../../assets/SafeBite-Logo.png")}
              style={styles.logo}
              resizeMode="contain"
            />
          </Animated.View>

          {/* Slogan directly below logo */}
          <Animated.View
            style={[
              styles.taglineWrapper,
              {
                opacity: textOpacity,
                transform: [{ translateY: textTranslateY }],
              },
            ]}
          >
            <Text style={styles.slogan}>Make more informed food choices</Text>
          </Animated.View>
        </View>

        {/* Minimalist modern progress bar indicator */}
        <View style={styles.footer}>
          <View style={styles.progressTrack}>
            <Animated.View
              style={[styles.progressFill, { width: progressBarWidth }]}
            />
          </View>
        </View>
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
    justifyContent: "space-between",
    alignItems: "center",
    paddingHorizontal: SPACING.xl,
    paddingTop: SPACING.xxxl,
    paddingBottom: SPACING.xxl,
  },
  centerContent: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    width: "100%",
  },
  glowAura: {
    position: "absolute",
    width: 250,
    height: 250,
    borderRadius: 125,
    backgroundColor: "rgba(8, 95, 45, 0.08)",
    borderWidth: 1,
    borderColor: "rgba(8, 95, 45, 0.12)",
  },
  logoWrapper: {
    width: 220,
    height: 220,
    justifyContent: "center",
    alignItems: "center",
    zIndex: 2,
  },
  logo: {
    width: 215,
    height: 215,
  },
  taglineWrapper: {
    marginTop: SPACING.lg,
    paddingHorizontal: SPACING.md,
    alignItems: "center",
    zIndex: 2,
  },
  slogan: {
    fontFamily: TYPOGRAPHY.fontFamily.primaryBold,
    fontSize: TYPOGRAPHY.fontSize.lg,
    lineHeight: TYPOGRAPHY.lineHeight.lg,
    color: COLORS.textPrimary,
    textAlign: "center",
    letterSpacing: 0.2,
  },
  footer: {
    alignItems: "center",
    width: "100%",
    marginBottom: SPACING.md,
  },
  progressTrack: {
    width: 140,
    height: 3,
    backgroundColor: "#E1E7E1",
    borderRadius: 2,
    overflow: "hidden",
  },
  progressFill: {
    height: "100%",
    backgroundColor: COLORS.primary,
    borderRadius: 2,
  },
});

export default SplashScreen;
