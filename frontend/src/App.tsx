import React from "react";
import { StatusBar } from "expo-status-bar";
import AppNavigator from "./navigation/AppNavigator";
import AuthNavigator from "./navigation/AuthNavigator";
const isAuthed = true;

export default function App(){
  return (
    <>
      <StatusBar style="light" />
      {isAuthed ? <AppNavigator /> : <AuthNavigator />}
    </>
  );
}