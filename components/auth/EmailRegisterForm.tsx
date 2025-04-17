import React, { useState } from "react";
import { View, Alert, Pressable, Keyboard } from "react-native";
import { Input, Text, useTheme } from "@rneui/themed";
import { Formik } from "formik";
import { supabase } from "@/lib/supabase";
import ShomiButton from "../common/ShomiButton";
import { useRouter } from "expo-router";
import RegisterSchema from "@/validation/RegisterSchema";
import { showToast } from "@/utils/toast";

export default function EmailRegisterForm() {
  const { theme } = useTheme();
  const router = useRouter();
  const [loading, setLoading] = useState(false);

  const isDark = theme.mode === "dark";
  const textColor = isDark ? theme.colors.white : theme.colors.black;
  const placeholderColor = isDark ? theme.colors.grey2 : theme.colors.grey3;

  const handleRegister = async (
    name: string,
    email: string,
    password: string
  ) => {
    Keyboard.dismiss();
    setLoading(true);

    const {
      data: { session },
      error,
    } = await supabase.auth.signUp({
      email,
      password,
      options: {
        data: { full_name: name },
      },
    });

    setLoading(false);

    if (error) {
      showToast("error", error.message);
      return;
    }

    if (!session) {
      showToast("success", "Check your email for confirmation.");
    }
  };

  return (
    <View
      style={{
        flex: 1,
        padding: 20,
        backgroundColor: theme.colors.background,
      }}
    >
      <Text
        h3
        style={{
          textAlign: "center",
          marginBottom: 20,
          fontWeight: "bold",
          color: theme.colors.primary,
        }}
      >
        Create an Account
      </Text>

      <Formik
        initialValues={{ name: "", email: "", password: "" }}
        validationSchema={RegisterSchema}
        onSubmit={({ name, email, password }) =>
          handleRegister(name, email, password)
        }
      >
        {({
          handleChange,
          handleBlur,
          handleSubmit,
          values,
          errors,
          touched,
        }) => (
          <>
            <Input
              label="Full Name"
              placeholder="John Doe"
              value={values.name}
              onChangeText={handleChange("name")}
              onBlur={handleBlur("name")}
              inputStyle={{ color: textColor }}
              labelStyle={{ color: textColor }}
              placeholderTextColor={placeholderColor}
              errorMessage={
                touched.name && errors.name ? errors.name : undefined
              }
            />
            <Input
              label="Email"
              placeholder="email@example.com"
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
                touched.password && errors.password
                  ? errors.password
                  : undefined
              }
            />

            <ShomiButton
              title="Register"
              onPress={handleSubmit as any}
              loading={loading}
              disabled={loading}
            />

            <Pressable
              onPress={() => router.push("/login")}
              style={{ marginTop: 16, alignItems: "center" }}
            >
              <Text style={{ fontSize: 14, color: theme.colors.grey2 }}>
                Already have an account?{" "}
                <Text
                  style={{ color: theme.colors.primary, fontWeight: "bold" }}
                >
                  Sign in
                </Text>
              </Text>
            </Pressable>
          </>
        )}
      </Formik>
    </View>
  );
}
