import { NavigatorScreenParams } from "@react-navigation/native";

export type AuthStackParamList = {
  Splash: undefined;
  Welcome: undefined;
  SignIn: { prefilledEmail?: string } | undefined;
  CreateAccount: undefined;
  VerifyEmail: { email: string; fullName?: string };
  ForgotPassword: { initialEmail?: string } | undefined;
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
