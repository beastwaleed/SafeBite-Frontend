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
  useWindowDimensions,
} from "react-native";
import { COLORS, TYPOGRAPHY, SPACING } from "../../constants/theme";

const BASE_CIRCLE_SIZE = 100;

export const SplashScreen: React.FC = () => {
  const { width, height } = useWindowDimensions();

  // Animation values
  const radialScale = useRef(new Animated.Value(0.001)).current;
  const logoScale = useRef(new Animated.Value(0.65)).current;
  const logoOpacity = useRef(new Animated.Value(0)).current;
  const textOpacity = useRef(new Animated.Value(0)).current;
  const textTranslateY = useRef(new Animated.Value(14)).current;
  const loaderOpacity = useRef(new Animated.Value(0)).current;
  const progressAnim = useRef(new Animated.Value(0)).current;

  const useNativeDriver = Platform.OS !== "web";

  // Calculate diagonal distance from center to furthest screen corner
  const screenDiagonal = Math.hypot(width || 400, height || 850);
  const targetRadialScale = Math.max(14, (screenDiagonal * 1.35) / BASE_CIRCLE_SIZE);

  useEffect(() => {
    // 1. Initial brand green pause (350ms)
    const startTimer = setTimeout(() => {
      // 2. White circle expands radially outward from center
      Animated.timing(radialScale, {
        toValue: targetRadialScale,
        duration: 850,
        easing: Easing.out(Easing.cubic),
        useNativeDriver,
      }).start();

      // 3. Logo reveal blossoms as radial expansion reaches edges (~500ms in)
      const logoTimer = setTimeout(() => {
        Animated.parallel([
          Animated.timing(logoOpacity, {
            toValue: 1,
            duration: 700,
            easing: Easing.out(Easing.cubic),
            useNativeDriver,
          }),
          Animated.spring(logoScale, {
            toValue: 1,
            friction: 6,
            tension: 40,
            useNativeDriver,
          }),
          Animated.timing(loaderOpacity, {
            toValue: 1,
            duration: 450,
            useNativeDriver,
          }),
          // 4. Loading bar fills smoothly across the bottom
          Animated.timing(progressAnim, {
            toValue: 1,
            duration: 1650,
            easing: Easing.bezier(0.2, 0, 0.2, 1),
            useNativeDriver: false,
          }),
        ]).start(() => {
          // Tagline reveals right after logo settles
          Animated.parallel([
            Animated.timing(textOpacity, {
              toValue: 1,
              duration: 500,
              easing: Easing.out(Easing.quad),
              useNativeDriver,
            }),
            Animated.timing(textTranslateY, {
              toValue: 0,
              duration: 500,
              easing: Easing.out(Easing.quad),
              useNativeDriver,
            }),
          ]).start();
        });
      }, 500);

      return () => clearTimeout(logoTimer);
    }, 350);

    return () => clearTimeout(startTimer);
  }, [
    loaderOpacity,
    logoOpacity,
    logoScale,
    progressAnim,
    radialScale,
    targetRadialScale,
    textOpacity,
    textTranslateY,
    useNativeDriver,
  ]);

  const progressBarWidth = progressAnim.interpolate({
    inputRange: [0, 1],
    outputRange: ["0%", "100%"],
  });

  return (
    <View style={styles.rootContainer}>
      {/* Step 1: Base Green Canvas */}

      {/* Step 2: Radial White Expansion from screen center */}
      <View style={styles.radialContainer} pointerEvents="none">
        <Animated.View
          style={[
            styles.radialCircle,
            {
              width: BASE_CIRCLE_SIZE,
              height: BASE_CIRCLE_SIZE,
              borderRadius: BASE_CIRCLE_SIZE / 2,
              transform: [{ scale: radialScale }],
            },
          ]}
        />
      </View>

      {/* Step 3: Foreground Content (Clean Logo reveal & loading bar) */}
      <SafeAreaView style={styles.safeArea}>
        <View style={styles.container}>
          {/* Centered Logo Reveal */}
          <View style={styles.centerContent}>
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

          {/* Step 4: Loading Progress Bar */}
          <Animated.View style={[styles.footer, { opacity: loaderOpacity }]}>
            <View style={styles.progressTrack}>
              <Animated.View
                style={[styles.progressFill, { width: progressBarWidth }]}
              />
            </View>
          </Animated.View>
        </View>
      </SafeAreaView>
    </View>
  );
};

const styles = StyleSheet.create({
  rootContainer: {
    flex: 1,
    backgroundColor: COLORS.primaryDark, // Initial deep brand green
    overflow: "hidden",
  },
  radialContainer: {
    position: "absolute",
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    justifyContent: "center",
    alignItems: "center",
    zIndex: 1,
  },
  radialCircle: {
    backgroundColor: COLORS.background, // Turns white/light (#F7F9F6) in radial form
  },
  safeArea: {
    flex: 1,
    backgroundColor: "transparent",
    zIndex: 2,
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
  logoWrapper: {
    width: 245,
    height: 245,
    justifyContent: "center",
    alignItems: "center",
    zIndex: 2,
  },
  logo: {
    width: 240,
    height: 240,
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
    width: 160,
    height: 4,
    backgroundColor: "#D9E3DA",
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
