import React from "react";
import {
  SafeAreaView,
  KeyboardAvoidingView,
  Platform,
  StyleSheet,
} from "react-native";
import { useEditorBridge, RichText, Toolbar } from "@10play/tentap-editor";

interface ShomiTentapEditorProps {
  initialValue?: string;
  onChange?: (content: string) => void;
}

const ShomiTentapEditor: React.FC<ShomiTentapEditorProps> = ({
  initialValue = "",
  onChange,
}) => {
  const editor = useEditorBridge({
    initialContent: initialValue,
    autofocus: true,
    avoidIosKeyboard: true,
    dynamicHeight: true, // ⬅️ grow as user types
    onChange: () => {
      const state = editor.getEditorState() as unknown as { content: any };
      const content = state.content;
      console.log("📝 TenTap content:", content);
      onChange?.(JSON.stringify(content));
    },
  });

  return (
    <SafeAreaView style={styles.container}>
      <KeyboardAvoidingView
        behavior={Platform.OS === "ios" ? "padding" : "height"}
        style={{ flex: 1 }}
      >
        <RichText editor={editor} />
        <Toolbar editor={editor} />
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 12,
  },
  toolbarWrapper: {
    position: "absolute",
    width: "100%",
    bottom: 0,
  },
});

export default ShomiTentapEditor;
