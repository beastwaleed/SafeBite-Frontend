import React from "react";
import { StyleSheet, Platform } from "react-native";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import { Ionicons } from "@expo/vector-icons";
import { AppTabParamList } from "../types/navigation.types";
import { HomeDashboardScreen } from "../screens/home/HomeDashboardScreen";
import { ProfileScreen } from "../screens/profile/ProfileScreen";
import { ScanPlaceholderScreen } from "../screens/placeholders/ScanPlaceholderScreen";
import { AskAIPlaceholderScreen } from "../screens/placeholders/AskAIPlaceholderScreen";
import { SavedPlaceholderScreen } from "../screens/placeholders/SavedPlaceholderScreen";
import { COLORS, TYPOGRAPHY, DIMENSIONS } from "../constants/theme";

const Tab = createBottomTabNavigator<AppTabParamList>();

export const AppNavigator: React.FC = () => {
  return (
    <Tab.Navigator
      initialRouteName="HomeTab"
      screenOptions={({ route }) => ({
        headerShown: false,
        tabBarActiveTintColor: COLORS.primary,
        tabBarInactiveTintColor: COLORS.textMuted,
        tabBarStyle: styles.tabBar,
        tabBarLabelStyle: styles.tabBarLabel,
        tabBarIcon: ({ focused, color, size }) => {
          let iconName: keyof typeof Ionicons.glyphMap;

          switch (route.name) {
            case "HomeTab":
              iconName = focused ? "home" : "home-outline";
              break;
            case "ScanTab":
              iconName = focused ? "barcode" : "barcode-outline";
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

          return <Ionicons name={iconName} size={size || 22} color={color} />;
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
        component={SavedPlaceholderScreen}
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
    backgroundColor: COLORS.card,
    borderTopColor: COLORS.border,
    borderTopWidth: 1,
    height: Platform.OS === "ios" ? 84 : DIMENSIONS.tabBarHeight,
    paddingBottom: Platform.OS === "ios" ? 24 : 8,
    paddingTop: 8,
    elevation: 8,
  },
  tabBarLabel: {
    fontFamily: TYPOGRAPHY.fontFamily.primaryMedium,
    fontSize: 11,
  },
});

export default AppNavigator;

