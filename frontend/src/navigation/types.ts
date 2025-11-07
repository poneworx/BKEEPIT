import { NavigatorScreenParams } from "@react-navigation/native";

/**
 * Auth Stack routes
 */
export type AuthStackParamList = {
  Login: undefined;
  Register: undefined;
  VerifyEmail: { email?: string } | undefined;
  SetPIN: { userId?: string } | undefined;
  EnterPIN: undefined;
};

/**
 * App (Tab) routes
 */
export type AppTabParamList = {
  Theme: undefined;
  Dashboard: undefined;
  Budget: undefined;
  Investments: undefined;
  Profile: undefined;
};

/**
 * Root navigation combines both stacks
 * (useful if you ever nest navigators)
 */
export type RootStackParamList = {
  Auth: NavigatorScreenParams<AuthStackParamList>;
  App: NavigatorScreenParams<AppTabParamList>;
};
