import React from "react";
import { StyleSheet, Platform, View } from "react-native";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import { Ionicons } from "@expo/vector-icons";
import { AppTabParamList } from "../types/navigation.types";
import { HomeDashboardScreen } from "../screens/home/HomeDashboardScreen";
import { ProfileScreen } from "../screens/profile/ProfileScreen";
import { ScanPlaceholderScreen } from "../screens/placeholders/ScanPlaceholderScreen";
import { AskAIPlaceholderScreen } from "../screens/placeholders/AskAIPlaceholderScreen";
import { SavedProductsScreen } from "../screens/saved/SavedProductsScreen";
import { COLORS, TYPOGRAPHY, DIMENSIONS } from "../constants/theme";

const Tab = createBottomTabNavigator<AppTabParamList>();

export const AppNavigator: React.FC = () => {
  return (
    <Tab.Navigator
      initialRouteName="HomeTab"
      screenOptions={({ route }) => ({
        headerShown: false,
        tabBarActiveTintColor: COLORS.primary,
        tabBarInactiveTintColor: "#7A8C7F",
        tabBarStyle: styles.tabBar,
        tabBarLabelStyle: styles.tabBarLabel,
        tabBarIcon: ({ focused, color }) => {
          let iconName: keyof typeof Ionicons.glyphMap;

          switch (route.name) {
            case "HomeTab":
              iconName = focused ? "home" : "home-outline";
              break;
            case "ScanTab":
              iconName = "scan-outline";
              break;
            case "AskAITab":
              iconName = focused ? "sparkles" : "sparkles-outline";
              break;
            case "SavedTab":
              iconName = focused ? "bookmark" : "bookmark-outline";
              break;
            case "ProfileTab":
              iconName = focused ? "person" : "person-outline";
              break;
            default:
              iconName = "ellipse-outline";
          }

          if (focused && route.name === "HomeTab") {
            return (
              <View style={styles.activePillContainer}>
                <Ionicons name={iconName} size={22} color={COLORS.primary} />
              </View>
            );
          }

          return <Ionicons name={iconName} size={22} color={color} />;
        },
      })}
    >
      <Tab.Screen
        name="HomeTab"
        component={HomeDashboardScreen}
        options={{ tabBarLabel: "Home" }}
      />
      <Tab.Screen
        name="ScanTab"
        component={ScanPlaceholderScreen}
        options={{ tabBarLabel: "Scan" }}
      />
      <Tab.Screen
        name="AskAITab"
        component={AskAIPlaceholderScreen}
        options={{ tabBarLabel: "Ask AI" }}
      />
      <Tab.Screen
        name="SavedTab"
        component={SavedProductsScreen}
        options={{ tabBarLabel: "Saved" }}
      />
      <Tab.Screen
        name="ProfileTab"
        component={ProfileScreen}
        options={{ tabBarLabel: "Profile" }}
      />
    </Tab.Navigator>
  );
};

const styles = StyleSheet.create({
  tabBar: {
    backgroundColor: "#FFFFFF",
    borderTopColor: "#E8EFE9",
    borderTopWidth: 1,
    height: Platform.OS === "ios" ? 84 : DIMENSIONS.tabBarHeight,
    paddingBottom: Platform.OS === "ios" ? 22 : 6,
    paddingTop: 6,
    elevation: 6,
  },
  tabBarLabel: {
    fontFamily: TYPOGRAPHY.fontFamily.primaryMedium,
    fontSize: 11,
  },
  activePillContainer: {
    backgroundColor: "#EDF4EE",
    borderRadius: 14,
    paddingHorizontal: 12,
    paddingVertical: 2,
    alignItems: "center",
    justifyContent: "center",
  },
});

export default AppNavigator;
