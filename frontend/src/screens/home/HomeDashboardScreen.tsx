import React, { useState } from "react";
import {
  StyleSheet,
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  TextInput,
  Platform,
  StatusBar,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { BottomTabNavigationProp } from "@react-navigation/bottom-tabs";
import { AppTabParamList } from "../../types/navigation.types";
import { COLORS, TYPOGRAPHY, SPACING, RADIUS, SHADOWS } from "../../constants/theme";

interface HomeDashboardScreenProps {
  navigation: BottomTabNavigationProp<AppTabParamList, "HomeTab">;
}

interface SampleProduct {
  id: string;
  name: string;
  category: string;
  bgColor: string;
  iconColor: string;
  labelColor: string;
}

const RECENT_PRODUCTS: SampleProduct[] = [
  {
    id: "1",
    name: "Oat cereal",
    category: "Breakfast foods",
    bgColor: "#F2E5BC",
    iconColor: "#7D651E",
    labelColor: "#8F772E",
  },
  {
    id: "2",
    name: "Tomato soup",
    category: "Canned foods",
    bgColor: "#F3D5CA",
    iconColor: "#8F4B38",
    labelColor: "#9E5B49",
  },
  {
    id: "3",
    name: "Trail mix",
    category: "Snacks",
    bgColor: "#DCEBDD",
    iconColor: "#35653E",
    labelColor: "#4B7B54",
  },
];

export const HomeDashboardScreen: React.FC<HomeDashboardScreenProps> = ({ navigation }) => {
  const insets = useSafeAreaInsets();
  const [searchQuery, setSearchQuery] = useState("");
  const [isOffline] = useState(false); // Can be toggled or connected to NetInfo

  // Robust top inset calculation to prevent clipping on Android status bars and iOS notches
  const topInset = Math.max(
    insets.top,
    Platform.OS === "android" ? (StatusBar.currentHeight || 28) : 0,
    16
  );

  // Time-based greeting with "Good morning" baseline
  const getGreeting = () => {
    const hour = new Date().getHours();
    if (hour < 12) return "Good morning";
    if (hour < 18) return "Good afternoon";
    return "Good evening";
  };

  return (
    <View style={[styles.screenContainer, { paddingTop: topInset }]}>
      <ScrollView
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        {/* Top Header Row */}
        <View style={styles.headerRow}>
          <View style={styles.greetingCol}>
            <Text style={styles.greetingLabel}>{getGreeting()}</Text>
            <Text style={styles.headerTitle}>
              What would you like to{"\n"}explore?
            </Text>
          </View>
          <TouchableOpacity
            activeOpacity={0.8}
            onPress={() => navigation.navigate("ProfileTab")}
            style={styles.profileButton}
            hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
          >
            <Ionicons name="person-outline" size={22} color={COLORS.primary} />
          </TouchableOpacity>
        </View>

        {/* Offline Banner (Screen 5.1 / Page 7) */}
        {isOffline && (
          <View style={styles.offlineBanner}>
            <Ionicons
              name="cloud-offline-outline"
              size={22}
              color="#8D6018"
              style={styles.offlineIcon}
            />
            <View style={styles.offlineTextCol}>
              <Text style={styles.offlineTitle}>You're offline</Text>
              <Text style={styles.offlineSubtitle}>
                Some saved content may still be available.
              </Text>
            </View>
          </View>
        )}

        {/* Search Products Input Bar */}
        <View style={styles.searchBar}>
          <Ionicons
            name="search-outline"
            size={20}
            color={COLORS.primaryDark}
            style={styles.searchIcon}
          />
          <TextInput
            value={searchQuery}
            onChangeText={setSearchQuery}
            placeholder="Search products"
            placeholderTextColor="#7A8C7F"
            style={styles.searchInput}
            returnKeyType="search"
          />
        </View>

        {/* Primary Action Button 1: Solid Dark Green Scan */}
        <TouchableOpacity
          activeOpacity={0.88}
          style={styles.primaryScanButton}
          onPress={() => navigation.navigate("ScanTab")}
        >
          <Ionicons
            name="scan-outline"
            size={20}
            color="#FFFFFF"
            style={styles.buttonIcon}
          />
          <Text style={styles.primaryButtonText}>Scan a product</Text>
        </TouchableOpacity>

        {/* Primary Action Button 2: White with Green Border Search */}
        <TouchableOpacity
          activeOpacity={0.88}
          style={styles.secondarySearchButton}
          onPress={() => navigation.navigate("ScanTab")}
        >
          <Ionicons
            name="search-outline"
            size={18}
            color={COLORS.primary}
            style={styles.buttonIcon}
          />
          <Text style={styles.secondaryButtonText}>Search products</Text>
        </TouchableOpacity>

        {/* Recently Viewed Section */}
        <View style={styles.recentlyViewedSection}>
          <View style={styles.sectionHeaderRow}>
            <View style={styles.sectionTitleRow}>
              <Text style={styles.sectionTitle}>Recently viewed</Text>
              <View style={styles.prototypeBadge}>
                <Text style={styles.prototypeBadgeText}>Prototype data</Text>
              </View>
            </View>
            <TouchableOpacity
              activeOpacity={0.7}
              onPress={() => navigation.navigate("SavedTab")}
            >
              <Text style={styles.viewAllLink}>View all</Text>
            </TouchableOpacity>
          </View>

          <ScrollView
            horizontal
            showsHorizontalScrollIndicator={false}
            contentContainerStyle={styles.carouselContainer}
          >
            {RECENT_PRODUCTS.map((item) => (
              <TouchableOpacity
                key={item.id}
                activeOpacity={0.88}
                style={styles.productCard}
                onPress={() => navigation.navigate("ScanTab")}
              >
                {/* Upper Color Box Container */}
                <View
                  style={[
                    styles.productImageContainer,
                    { backgroundColor: item.bgColor },
                  ]}
                >
                  <Ionicons
                    name="cube-outline"
                    size={32}
                    color={item.iconColor}
                  />
                  <Text
                    style={[
                      styles.imagePlaceholderText,
                      { color: item.labelColor },
                    ]}
                  >
                    Image placeholder
                  </Text>
                </View>

                {/* Text section */}
                <Text style={styles.productName} numberOfLines={1}>
                  {item.name}
                </Text>
                <Text style={styles.productCategory} numberOfLines={1}>
                  {item.category}
                </Text>
              </TouchableOpacity>
            ))}
          </ScrollView>
        </View>

        {/* Bottom Action Card 1: Ask SafeBite (Solid Forest Green) */}
        <TouchableOpacity
          activeOpacity={0.9}
          style={styles.askSafeBiteCard}
          onPress={() => navigation.navigate("AskAITab")}
        >
          <View style={styles.askIconCircle}>
            <Ionicons name="sparkles" size={20} color={COLORS.primary} />
          </View>
          <View style={styles.askTextCol}>
            <Text style={styles.askTitle}>Ask SafeBite</Text>
            <Text style={styles.askSubtitle}>
              Ask about data sources and comparisons.
            </Text>
          </View>
          <Ionicons name="chevron-forward" size={18} color="#FFFFFF" />
        </TouchableOpacity>

        {/* Bottom Action Card 2: Saved Items (White with light green icon) */}
        <TouchableOpacity
          activeOpacity={0.9}
          style={styles.savedItemsCard}
          onPress={() => navigation.navigate("SavedTab")}
        >
          <View style={styles.savedIconCircle}>
            <Ionicons
              name="bookmark-outline"
              size={20}
              color={COLORS.primary}
            />
          </View>
          <View style={styles.savedTextCol}>
            <Text style={styles.savedTitle}>Saved items</Text>
            <Text style={styles.savedSubtitle}>
              Return to products you saved.
            </Text>
          </View>
          <Ionicons
            name="chevron-forward"
            size={18}
            color={COLORS.primary}
          />
        </TouchableOpacity>
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  screenContainer: {
    flex: 1,
    backgroundColor: COLORS.background,
  },
  scrollContent: {
    paddingHorizontal: SPACING.md,
    paddingTop: SPACING.xs,
    paddingBottom: SPACING.xl,
  },
  headerRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "flex-start",
    marginTop: 4,
    marginBottom: SPACING.md,
  },
  greetingCol: {
    flex: 1,
    paddingRight: SPACING.sm,
  },
  greetingLabel: {
    fontFamily: TYPOGRAPHY.fontFamily.primaryMedium,
    fontSize: 14,
    color: "#2D5A3C",
    marginBottom: 4,
  },
  headerTitle: {
    fontFamily: TYPOGRAPHY.fontFamily.primaryBold,
    fontSize: 24,
    lineHeight: 30,
    color: "#084D25",
  },
  profileButton: {
    width: 44,
    height: 44,
    borderRadius: 14,
    backgroundColor: "#FFFFFF",
    borderWidth: 1,
    borderColor: "#E5EAE5",
    justifyContent: "center",
    alignItems: "center",
    marginTop: 4,
    ...SHADOWS.sm,
  },
  offlineBanner: {
    backgroundColor: "#FEF7E6",
    borderColor: "#F5DEB3",
    borderWidth: 1,
    borderRadius: 14,
    paddingHorizontal: 14,
    paddingVertical: 12,
    flexDirection: "row",
    alignItems: "center",
    marginBottom: SPACING.md,
  },
  offlineIcon: {
    marginRight: 10,
  },
  offlineTextCol: {
    flex: 1,
  },
  offlineTitle: {
    fontFamily: TYPOGRAPHY.fontFamily.primaryBold,
    fontSize: 13,
    color: "#7A4F00",
  },
  offlineSubtitle: {
    fontFamily: TYPOGRAPHY.fontFamily.primary,
    fontSize: 11,
    color: "#8D6018",
    marginTop: 2,
  },
  searchBar: {
    flexDirection: "row",
    alignItems: "center",
    height: 50,
    backgroundColor: "#FFFFFF",
    borderRadius: 14,
    paddingHorizontal: 16,
    borderWidth: 1.5,
    borderColor: "#C5D6C7",
    marginBottom: SPACING.md,
  },
  searchIcon: {
    marginRight: 10,
  },
  searchInput: {
    flex: 1,
    fontFamily: TYPOGRAPHY.fontFamily.primary,
    fontSize: 14,
    color: COLORS.textPrimary,
    height: "100%",
    ...(Platform.OS === "web" ? { outlineStyle: "none" as any } : {}),
  },
  primaryScanButton: {
    height: 50,
    backgroundColor: COLORS.primary,
    borderRadius: 14,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    marginBottom: 12,
  },
  primaryButtonText: {
    fontFamily: TYPOGRAPHY.fontFamily.primaryBold,
    fontSize: 15,
    color: "#FFFFFF",
  },
  secondarySearchButton: {
    height: 50,
    backgroundColor: "#FFFFFF",
    borderRadius: 14,
    borderWidth: 1.5,
    borderColor: COLORS.primary,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    marginBottom: 24,
  },
  secondaryButtonText: {
    fontFamily: TYPOGRAPHY.fontFamily.primaryBold,
    fontSize: 15,
    color: COLORS.primary,
  },
  buttonIcon: {
    marginRight: 8,
  },
  recentlyViewedSection: {
    marginBottom: 20,
  },
  sectionHeaderRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 12,
  },
  sectionTitleRow: {
    flexDirection: "row",
    alignItems: "center",
  },
  sectionTitle: {
    fontFamily: TYPOGRAPHY.fontFamily.primaryBold,
    fontSize: 18,
    color: "#084D25",
  },
  prototypeBadge: {
    backgroundColor: "#E2ECE4",
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: 12,
    marginLeft: 8,
  },
  prototypeBadgeText: {
    fontFamily: TYPOGRAPHY.fontFamily.primaryMedium,
    fontSize: 11,
    color: "#4A624E",
  },
  viewAllLink: {
    fontFamily: TYPOGRAPHY.fontFamily.primaryBold,
    fontSize: 13,
    color: COLORS.primary,
  },
  carouselContainer: {
    paddingVertical: 4,
    paddingRight: 16,
  },
  productCard: {
    width: 136,
    backgroundColor: "#FFFFFF",
    borderRadius: 16,
    padding: 10,
    marginRight: 12,
    borderWidth: 1,
    borderColor: "#E8EFE9",
    ...SHADOWS.sm,
  },
  productImageContainer: {
    height: 105,
    borderRadius: 12,
    justifyContent: "center",
    alignItems: "center",
    marginBottom: 8,
  },
  imagePlaceholderText: {
    fontFamily: TYPOGRAPHY.fontFamily.primary,
    fontSize: 9,
    marginTop: 4,
  },
  productName: {
    fontFamily: TYPOGRAPHY.fontFamily.primaryBold,
    fontSize: 13,
    color: COLORS.textPrimary,
  },
  productCategory: {
    fontFamily: TYPOGRAPHY.fontFamily.primary,
    fontSize: 11,
    color: COLORS.textMuted,
    marginTop: 2,
  },
  askSafeBiteCard: {
    backgroundColor: COLORS.primary,
    borderRadius: 18,
    padding: 16,
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 12,
  },
  askIconCircle: {
    width: 44,
    height: 44,
    borderRadius: 12,
    backgroundColor: "#FFFFFF",
    justifyContent: "center",
    alignItems: "center",
    marginRight: 14,
  },
  askTextCol: {
    flex: 1,
  },
  askTitle: {
    fontFamily: TYPOGRAPHY.fontFamily.primaryBold,
    fontSize: 15,
    color: "#FFFFFF",
  },
  askSubtitle: {
    fontFamily: TYPOGRAPHY.fontFamily.primary,
    fontSize: 12,
    color: "#D8ECDD",
    marginTop: 2,
  },
  savedItemsCard: {
    backgroundColor: "#FFFFFF",
    borderRadius: 18,
    padding: 16,
    flexDirection: "row",
    alignItems: "center",
    borderWidth: 1,
    borderColor: "#E1E8E2",
    marginBottom: 20,
    ...SHADOWS.sm,
  },
  savedIconCircle: {
    width: 44,
    height: 44,
    borderRadius: 12,
    backgroundColor: "#D9EADD",
    justifyContent: "center",
    alignItems: "center",
    marginRight: 14,
  },
  savedTextCol: {
    flex: 1,
  },
  savedTitle: {
    fontFamily: TYPOGRAPHY.fontFamily.primaryBold,
    fontSize: 15,
    color: COLORS.textPrimary,
  },
  savedSubtitle: {
    fontFamily: TYPOGRAPHY.fontFamily.primary,
    fontSize: 12,
    color: COLORS.textSecondary,
    marginTop: 2,
  },
});

export default HomeDashboardScreen;
