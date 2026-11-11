/**
 * SafeBite Design System
 * 
 * Master design tokens based on SafeBite SRS V4, Frontend Design Guide,
 * and project specifications.
 */

export const COLORS = {
  // Brand Greens
  primary: "#085F2D", // Primary brand forest green
  primaryDark: "#064621",
  primaryLight: "#176B4D", // Alternative forest green from SRS guide
  surfaceLightGreen: "#E5F2E9", // Light green tint for badges and icon backgrounds
  surfaceGreenSubtle: "#F0F7F2",

  // Backgrounds & Surfaces
  background: "#F7F9F6", // Main app background
  backgroundWarm: "#F7F8F5", // Alternate warm background
  card: "#FFFFFF", // Card surface
  modalOverlay: "rgba(0, 0, 0, 0.45)",

  // Typography Colors
  textPrimary: "#202923", // Main text
  textSecondary: "#66716A", // Secondary / caption text
  textMuted: "#8C9790", // Muted / placeholder text
  textInverse: "#FFFFFF", // White text on dark green surfaces

  // Borders & Dividers
  border: "#E1E7E1",
  borderLight: "#EEF2EE",
  borderDark: "#C5D0C6",

  // Status & Feedback Colors (SRS Status Catalogue)
  status: {
    belowLimit: "#059669", // Green (Safe / Below Limit)
    closeToLimit: "#D97706", // Amber / Warning
    atLimit: "#EA580C", // Deep Amber / Warning
    aboveLimit: "#DC2626", // Red / Error / Concern
    notTested: "#6B7280", // Gray
    noLimitFound: "#9CA3AF",
    notComparable: "#6B7280",
  },

  // Semantic UI
  warning: "#D97706",
  warningBackground: "#FEF3C7",
  error: "#DC2626",
  errorBackground: "#FEE2E2",
  success: "#059669",
  successBackground: "#D1FAE5",
  info: "#2563EB",
  infoBackground: "#DBEAFE",
} as const;

export const TYPOGRAPHY = {
  // Font families (Expo Google Fonts)
  fontFamily: {
    primary: "Poppins_400Regular",
    primaryMedium: "Poppins_500Medium",
    primarySemiBold: "Poppins_600SemiBold",
    primaryBold: "Poppins_700Bold",
    scientific: "Inter_400Regular", // Secondary for numerical/scientific data
    scientificMedium: "Inter_500Medium",
    scientificSemiBold: "Inter_600SemiBold",
    scientificBold: "Inter_700Bold",
  },
  // Font sizes
  fontSize: {
    xs: 11,
    sm: 13,
    md: 15,
    lg: 17,
    xl: 20,
    xxl: 24,
    title: 28,
    display: 34,
  },
  // Line heights
  lineHeight: {
    xs: 15,
    sm: 18,
    md: 22,
    lg: 24,
    xl: 28,
    xxl: 32,
    title: 36,
    display: 42,
  },
} as const;

export const SPACING = {
  // 8px base scale
  xxs: 2,
  xs: 4,
  sm: 8,
  md: 16,
  lg: 24,
  xl: 32,
  xxl: 48,
  xxxl: 64,
} as const;

export const RADIUS = {
  xs: 4,
  sm: 8,
  md: 12,
  card: 16, // Default card radius (12-20px range)
  lg: 20,
  pill: 9999,
} as const;

export const DIMENSIONS = {
  buttonHeight: 52, // 48-54px standard button target
  buttonHeightSm: 40,
  inputHeight: 52,
  tabBarHeight: 64,
  iconSizeSm: 18,
  iconSizeMd: 24,
  iconSizeLg: 32,
  // Target design reference frame
  targetFrameWidth: 393,
  targetFrameHeight: 852,
} as const;

export const SHADOWS = {
  sm: {
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 2,
    elevation: 1,
  },
  card: {
    shadowColor: "#085F2D",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.06,
    shadowRadius: 8,
    elevation: 2,
  },
  elevated: {
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 12,
    elevation: 4,
  },
} as const;

export default {
  COLORS,
  TYPOGRAPHY,
  SPACING,
  RADIUS,
  DIMENSIONS,
  SHADOWS,
};

