import { View, StyleSheet } from "react-native";
import { useEffect } from "react";
import { router, useRouter } from "expo-router";
import { makeRedirectUri } from "expo-auth-session";
import * as QueryParams from "expo-auth-session/build/QueryParams";
import * as WebBrowser from "expo-web-browser";
import * as Linking from "expo-linking";
import { supabase } from "../../lib/supabase";
import GoogleSignInButton from "../common/GoogleSignInButton";

// ref: https://supabase.com/docs/guides/auth/native-mobile-deep-linking?queryGroups=platform&platform=react-native
// The point of this file is to handle the authentication flow for the app. It includes OAuth and Magic Link authentication methods.

WebBrowser.maybeCompleteAuthSession();

const redirectTo = makeRedirectUri({
  scheme: "ie.shomi",
  path: "auth-callback",
});

const createSessionFromUrl = async (url: string) => {
  const { params, errorCode } = QueryParams.getQueryParams(url);

  if (errorCode) throw new Error(errorCode);
  const { access_token, refresh_token } = params;

  if (!access_token) return null;

  const { data, error } = await supabase.auth.setSession({
    access_token,
    refresh_token,
  });

  if (error) throw error;
  return data.session;
};

const performOAuth = async () => {
  const { data, error } = await supabase.auth.signInWithOAuth({
    provider: "google",
    options: {
      redirectTo,
      skipBrowserRedirect: true,
    },
  });
  if (error) throw error;

  const res = await WebBrowser.openAuthSessionAsync(
    data?.url ?? "",
    redirectTo
  );

  if (res.type === "success") {
    const { url } = res;
    const session = await createSessionFromUrl(url);
    if (session) router.replace("/(tabs)");
  }
};

const sendMagicLink = async () => {
  const { error } = await supabase.auth.signInWithOtp({
    email: "example@email.com",
    options: {
      emailRedirectTo: redirectTo,
    },
  });

  if (error) throw error;
};

export default function Auth() {
  const url = Linking.useURL();
  const router = useRouter();

  useEffect(() => {
    if (url) {
      createSessionFromUrl(url).then((session) => {
        if (session) router.replace("/(tabs)");
      });
    }
  }, [url]);

  return (
    <View style={{ marginTop: 20, paddingHorizontal: 16 }}>
      <GoogleSignInButton onPress={performOAuth} />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    marginTop: 20,
    paddingHorizontal: 16,
  },
  socialButton: {
    width: "100%",
    borderRadius: 8,
    alignSelf: "center",
  },
});
