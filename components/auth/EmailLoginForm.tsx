import React, { useState } from "react";
import { View, StyleSheet, Alert, Keyboard } from "react-native";
import { Input, useTheme } from "@rneui/themed";
import { Formik } from "formik";
import * as Yup from "yup";
import { supabase } from "@/lib/supabase";
import ShomiButton from "../common/ShomiButton";
import LoginSchema from "@/validation/LoginSchema";
import { useToast } from "@/utils/toast";

export default function EmailLoginForm() {
  const { theme } = useTheme();
  const isDark = theme.mode === "dark";
  const textColor = isDark ? theme.colors.white : theme.colors.black;
  const placeholderColor = isDark ? theme.colors.grey2 : theme.colors.grey3;
  const { showToast } = useToast();

  const [loading, setLoading] = useState(false);

  const handleLogin = async (email: string, password: string) => {
    Keyboard.dismiss();
    setLoading(true);

    const { error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });

    setLoading(false);

    if (error) {
      showToast("error", error.message, "", "bottom");
    } else {
      showToast("success", "Signed in successfully!", "", "bottom");
    }
  };

  return (
    <Formik
      initialValues={{ email: "", password: "" }}
      validationSchema={LoginSchema}
      onSubmit={({ email, password }) => handleLogin(email, password)}
    >
      {({
        handleChange,
        handleBlur,
        handleSubmit,
        values,
        errors,
        touched,
      }) => (
        <View style={styles.container}>
          <Input
            label="Email"
            placeholder="Shomi@example.com"
            value={values.email}
            onChangeText={handleChange("email")}
            onBlur={handleBlur("email")}
            inputStyle={{ color: textColor }}
            labelStyle={{ color: textColor }}
            placeholderTextColor={placeholderColor}
            errorMessage={
              touched.email && errors.email ? errors.email : undefined
            }
          />
          <Input
            label="Password"
            placeholder="Password"
            secureTextEntry
            value={values.password}
            onChangeText={handleChange("password")}
            onBlur={handleBlur("password")}
            inputStyle={{ color: textColor }}
            labelStyle={{ color: textColor }}
            placeholderTextColor={placeholderColor}
            errorMessage={
              touched.password && errors.password ? errors.password : undefined
            }
          />
          <ShomiButton
            title="Login"
            onPress={handleSubmit as any}
            loading={loading}
            disabled={loading}
          />
        </View>
      )}
    </Formik>
  );
}

const styles = StyleSheet.create({
  container: { padding: 20 },
});
