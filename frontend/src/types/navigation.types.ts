import { NavigatorScreenParams } from "@react-navigation/native";

export type AuthStackParamList = {
  Splash: undefined;
  Welcome: undefined;
  SignIn: undefined;
  CreateAccount: undefined;
};

export type AppTabParamList = {
  HomeTab: undefined;
  ScanTab: undefined;
  AskAITab: undefined;
  SavedTab: undefined;
  ProfileTab: undefined;
};

export type RootStackParamList = {
  Auth: NavigatorScreenParams<AuthStackParamList>;
  App: NavigatorScreenParams<AppTabParamList>;
};

