import React, { useState, useEffect, useCallback } from "react";
import {
  StyleSheet,
  View,
  Text,
  ScrollView,
  SafeAreaView,
  TouchableOpacity,
  RefreshControl,
  ActivityIndicator,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { BottomTabNavigationProp } from "@react-navigation/bottom-tabs";
import { AppTabParamList } from "../../types/navigation.types";
import { COLORS, TYPOGRAPHY, SPACING, RADIUS, SHADOWS } from "../../constants/theme";
import { SafeBiteCard } from "../../components/common/SafeBiteCard";
import { SafeBiteButton } from "../../components/common/SafeBiteButton";
import { userService } from "../../api/user.service";
import { parseApiError } from "../../api/error-handler";

type ActiveTab = "favorites" | "watchlist";

interface SavedProductsScreenProps {
  navigation: BottomTabNavigationProp<AppTabParamList, "SavedTab">;
}

export const SavedProductsScreen: React.FC<SavedProductsScreenProps> = ({ navigation }) => {
  const [activeTab, setActiveTab] = useState<ActiveTab>("favorites");
  const [favorites, setFavorites] = useState<any[]>([]);
  const [watchlist, setWatchlist] = useState<any[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [refreshing, setRefreshing] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  const loadData = useCallback(async () => {
    setError(null);
    try {
      const [favs, watch] = await Promise.all([
        userService.getFavorites(),
        userService.getWatchlist(),
      ]);
      setFavorites(favs);
      setWatchlist(watch);
    } catch (err) {
      const parsed = parseApiError(err);
      setError(parsed.message);
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  }, []);

  useEffect(() => {
    loadData();
  }, [loadData]);

  const onRefresh = () => {
    setRefreshing(true);
    loadData();
  };

  const currentList = activeTab === "favorites" ? favorites : watchlist;

  return (
    <SafeAreaView style={styles.safeArea}>
      <View style={styles.header}>
        <Text style={styles.title}>Saved Products</Text>
        <Text style={styles.subtitle}>
          Track your favorite foods and monitor contamination evidence
        </Text>
      </View>

      {/* Segmented Tab Controls */}
      <View style={styles.tabBarContainer}>
        <TouchableOpacity
          activeOpacity={0.8}
          onPress={() => setActiveTab("favorites")}
          style={[styles.tabButton, activeTab === "favorites" && styles.tabButtonActive]}
        >
          <Ionicons
            name={activeTab === "favorites" ? "bookmark" : "bookmark-outline"}
            size={18}
            color={activeTab === "favorites" ? COLORS.primary : COLORS.textSecondary}
            style={styles.tabIcon}
          />
          <Text
            style={[styles.tabLabel, activeTab === "favorites" && styles.tabLabelActive]}
          >
            Favorites ({favorites.length})
          </Text>
        </TouchableOpacity>

        <TouchableOpacity
          activeOpacity={0.8}
          onPress={() => setActiveTab("watchlist")}
          style={[styles.tabButton, activeTab === "watchlist" && styles.tabButtonActive]}
        >
          <Ionicons
            name={activeTab === "watchlist" ? "eye" : "eye-outline"}
            size={18}
            color={activeTab === "watchlist" ? COLORS.primary : COLORS.textSecondary}
            style={styles.tabIcon}
          />
          <Text
            style={[styles.tabLabel, activeTab === "watchlist" && styles.tabLabelActive]}
          >
            Watchlist ({watchlist.length})
          </Text>
        </TouchableOpacity>
      </View>

      <ScrollView
        contentContainerStyle={styles.container}
        refreshControl={
          <RefreshControl
            refreshing={refreshing}
            onRefresh={onRefresh}
            colors={[COLORS.primary]}
            tintColor={COLORS.primary}
          />
        }
      >
        {loading ? (
          <View style={styles.centerLoading}>
            <ActivityIndicator size="large" color={COLORS.primary} />
            <Text style={styles.loadingText}>Syncing saved items...</Text>
          </View>
        ) : currentList.length === 0 ? (
          <View style={styles.emptyContainer}>
            <View
              style={[
                styles.emptyIconCircle,
                activeTab === "watchlist" && styles.emptyIconCircleWatchlist,
              ]}
            >
              <Ionicons
                name={activeTab === "favorites" ? "bookmark-outline" : "eye-outline"}
                size={48}
                color={activeTab === "favorites" ? COLORS.primary : COLORS.warning}
              />
            </View>

            <Text style={styles.emptyTitle}>
              {activeTab === "favorites" ? "No Favorites Saved Yet" : "Watchlist Is Empty"}
            </Text>

            <Text style={styles.emptyBody}>
              {activeTab === "favorites"
                ? "When browsing or scanning foods, bookmark products to access their heavy metal analysis quickly."
                : "Add products with elevated heavy metal measurements to monitor new research and threshold updates."}
            </Text>

            <SafeBiteCard style={styles.infoCard}>
              <View style={styles.infoRow}>
                <Ionicons
                  name="shield-checkmark-outline"
                  size={18}
                  color={COLORS.primary}
                  style={styles.infoIcon}
                />
                <Text style={styles.infoText}>
                  {activeTab === "favorites"
                    ? "Favorites are synchronized securely with your SafeBite account."
                    : "SafeBite will flag new scientific studies for items on your watchlist."}
                </Text>
              </View>
            </SafeBiteCard>

            <SafeBiteButton
              title="Scan a Product"
              variant="primary"
              onPress={() => navigation.navigate("ScanTab")}
              leftIcon={<Ionicons name="barcode-outline" size={20} color={COLORS.textInverse} />}
              style={styles.scanButton}
            />
          </View>
        ) : (
          <View style={styles.listContainer}>
            {currentList.map((item, idx) => (
              <SafeBiteCard key={item.id || idx} style={styles.productCard}>
                <Text style={styles.productName}>{item.name || "Packaged Food Product"}</Text>
                <Text style={styles.productBrand}>{item.brand || "Category Sample"}</Text>
              </SafeBiteCard>
            ))}
          </View>
        )}

        {/* Regulatory Disclaimer */}
        <View style={styles.disclaimerContainer}>
          <Text style={styles.disclaimerText}>
            Saved products are checked against published research datasets. SafeBite does not
            guarantee food safety or provide medical diagnoses.
          </Text>
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
  header: {
    paddingHorizontal: SPACING.md,
    paddingTop: SPACING.md,
    paddingBottom: SPACING.xs,
  },
  title: {
    fontFamily: TYPOGRAPHY.fontFamily.primaryBold,
    fontSize: TYPOGRAPHY.fontSize.title,
    color: COLORS.textPrimary,
  },
  subtitle: {
    fontFamily: TYPOGRAPHY.fontFamily.primary,
    fontSize: TYPOGRAPHY.fontSize.xs,
    color: COLORS.textSecondary,
    marginTop: 2,
  },
  tabBarContainer: {
    flexDirection: "row",
    backgroundColor: COLORS.card,
    marginHorizontal: SPACING.md,
    marginTop: SPACING.sm,
    borderRadius: RADIUS.card,
    padding: 4,
    borderWidth: 1,
    borderColor: COLORS.border,
  },
  tabButton: {
    flex: 1,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    paddingVertical: 8,
    borderRadius: RADIUS.md,
  },
  tabButtonActive: {
    backgroundColor: COLORS.surfaceLightGreen,
  },
  tabIcon: {
    marginRight: 6,
  },
  tabLabel: {
    fontFamily: TYPOGRAPHY.fontFamily.primaryMedium,
    fontSize: TYPOGRAPHY.fontSize.xs,
    color: COLORS.textSecondary,
  },
  tabLabelActive: {
    fontFamily: TYPOGRAPHY.fontFamily.primarySemiBold,
    color: COLORS.primaryDark,
  },
  container: {
    flexGrow: 1,
    justifyContent: "space-between",
    padding: SPACING.md,
  },
  centerLoading: {
    paddingVertical: SPACING.xxl,
    alignItems: "center",
  },
  loadingText: {
    fontFamily: TYPOGRAPHY.fontFamily.primary,
    fontSize: TYPOGRAPHY.fontSize.xs,
    color: COLORS.textSecondary,
    marginTop: SPACING.sm,
  },
  emptyContainer: {
    alignItems: "center",
    paddingVertical: SPACING.xl,
  },
  emptyIconCircle: {
    width: 90,
    height: 90,
    borderRadius: RADIUS.pill,
    backgroundColor: COLORS.surfaceLightGreen,
    justifyContent: "center",
    alignItems: "center",
    marginBottom: SPACING.md,
  },
  emptyIconCircleWatchlist: {
    backgroundColor: COLORS.warningBackground,
  },
  emptyTitle: {
    fontFamily: TYPOGRAPHY.fontFamily.primaryBold,
    fontSize: TYPOGRAPHY.fontSize.lg,
    color: COLORS.textPrimary,
    marginBottom: SPACING.xs,
  },
  emptyBody: {
    fontFamily: TYPOGRAPHY.fontFamily.primary,
    fontSize: TYPOGRAPHY.fontSize.xs,
    lineHeight: TYPOGRAPHY.lineHeight.sm,
    color: COLORS.textSecondary,
    textAlign: "center",
    maxWidth: 310,
    marginBottom: SPACING.lg,
  },
  infoCard: {
    width: "100%",
    backgroundColor: COLORS.card,
    marginBottom: SPACING.lg,
  },
  infoRow: {
    flexDirection: "row",
    alignItems: "center",
  },
  infoIcon: {
    marginRight: SPACING.sm,
  },
  infoText: {
    flex: 1,
    fontFamily: TYPOGRAPHY.fontFamily.primary,
    fontSize: TYPOGRAPHY.fontSize.xs,
    lineHeight: TYPOGRAPHY.lineHeight.xs,
    color: COLORS.textSecondary,
  },
  scanButton: {
    width: "100%",
  },
  listContainer: {
    width: "100%",
  },
  productCard: {
    marginBottom: SPACING.sm,
  },
  productName: {
    fontFamily: TYPOGRAPHY.fontFamily.primaryBold,
    fontSize: TYPOGRAPHY.fontSize.md,
    color: COLORS.textPrimary,
  },
  productBrand: {
    fontFamily: TYPOGRAPHY.fontFamily.primary,
    fontSize: TYPOGRAPHY.fontSize.xs,
    color: COLORS.textSecondary,
    marginTop: 2,
  },
  disclaimerContainer: {
    padding: SPACING.sm,
    backgroundColor: COLORS.surfaceGreenSubtle,
    borderRadius: RADIUS.sm,
    borderWidth: 1,
    borderColor: COLORS.surfaceLightGreen,
    marginTop: SPACING.lg,
  },
  disclaimerText: {
    fontFamily: TYPOGRAPHY.fontFamily.primary,
    fontSize: TYPOGRAPHY.fontSize.xs - 1,
    lineHeight: TYPOGRAPHY.lineHeight.xs,
    color: COLORS.textSecondary,
    textAlign: "center",
  },
});

export default SavedProductsScreen;
