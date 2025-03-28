import React, { useEffect, useImperativeHandle } from "react";
import {
  SafeAreaView,
  StyleSheet,
  View,
} from "react-native";
import {
  useEditorBridge,
  useEditorContent,
  RichText,
  Toolbar,
  DEFAULT_TOOLBAR_ITEMS,
} from "@10play/tentap-editor";

interface ShomiTentapEditorProps {
  initialValue?: string;
  onChange?: (content: string) => void;
}

export interface ShomiTentapEditorRef {
  clear: () => void;
}

const ShomiTentapEditor = React.forwardRef<
  ShomiTentapEditorRef,
  ShomiTentapEditorProps
>(({ initialValue = "", onChange }, ref) => {
  const editor = useEditorBridge({
    initialContent: initialValue,
    avoidIosKeyboard: true,
    dynamicHeight: true,
  });

  const content = useEditorContent(editor);

  useImperativeHandle(ref, () => ({
    clear: () => {
      editor.setContent("");
      onChange?.("");
    },
  }));

  // This effect will run when the content changes and will call the onChange prop with the new content
  useEffect(() => {
    if (typeof content === "string" && content.trim().length > 0) {
      onChange?.(content);
    }
  }, [content]);

  return (
    <SafeAreaView>
      <Toolbar
        editor={editor}
        shouldHideDisabledToolbarItems
        items={[
          DEFAULT_TOOLBAR_ITEMS[0], // Bold
          DEFAULT_TOOLBAR_ITEMS[1], // Italic
          DEFAULT_TOOLBAR_ITEMS[9], // Ordered List
          DEFAULT_TOOLBAR_ITEMS[10], // Bullet List
          DEFAULT_TOOLBAR_ITEMS[13], // Undo
          DEFAULT_TOOLBAR_ITEMS[14], // Redo
        ]}
      />
      <View style={styles.editorContainer}>
        <RichText editor={editor} />
      </View>
    </SafeAreaView>
  );
});

const styles = StyleSheet.create({
  toolbarWrapper: {
    position: "absolute",
    width: "100%",
    bottom: 0,
  },
  editorContainer: {
    borderRadius: 10,
    padding: 10,
    borderWidth: 1,
    borderColor: "black",
    marginBottom: 12,
    minHeight: 100,
    width: "100%",
  },
});

export default ShomiTentapEditor;
