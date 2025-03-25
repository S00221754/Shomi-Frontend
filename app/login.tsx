import React, { useState } from "react";
import { View, ActivityIndicator } from "react-native";
import { useTheme, Text, Input, Button } from "@rneui/themed";
import { useAuth } from "@/providers/AuthProvider";
import Auth from "@/components/auth/Auth";
import EmailForm from "@/components/auth/Email.Form";

export default function Login() {

  return (
    <>
      <EmailForm />
      <Auth />
    </>
  );
}
