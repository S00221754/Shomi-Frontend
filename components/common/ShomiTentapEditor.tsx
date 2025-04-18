import React, { useEffect, useImperativeHandle } from "react";
import { SafeAreaView, StyleSheet, View } from "react-native";
import {
  useEditorBridge,
  useEditorContent,
  RichText,
  Toolbar,
  DEFAULT_TOOLBAR_ITEMS,
} from "@10play/tentap-editor";
import { useTheme } from "@rneui/themed";

// This component is a wrapper around the Tentap editor, which is a rich text editor for React Native. It provides a toolbar with various formatting options and allows for dynamic height adjustment.
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
  const { theme } = useTheme();
  const isDark = theme.mode === "dark";

  const editor = useEditorBridge({
    initialContent: initialValue,
    avoidIosKeyboard: true,
    dynamicHeight: true,
    theme: {
      webview: {
        backgroundColor: isDark ? theme.colors.background : "#fff",
      },
      toolbar: {
        toolbarBody: {
          borderTopWidth: 0,
          borderBottomWidth: 1,
          height: 48,
          backgroundColor: isDark
            ? theme.colors.background
            : theme.colors.white,
          borderColor: isDark
            ? theme.colors.greyOutline
            : theme.colors.greyOutline,
        },
        toolbarButton: {
          backgroundColor: isDark
            ? theme.colors.background
            : theme.colors.white,
        },
        icon: {
          tintColor: isDark ? theme.colors.white : theme.colors.black,
          width: 24,
          height: 24,
        },
        iconDisabled: {
          tintColor: isDark ? theme.colors.grey3 : theme.colors.grey4,
          opacity: 0.5,
          width: 24,
          height: 24,
        },
        iconActive: {
          tintColor: theme.colors.primary,
          width: 24,
          height: 24,
        },
        iconWrapper: {
          justifyContent: "center",
          alignItems: "center",
          padding: 6,
          backgroundColor: isDark ? theme.colors.grey0 : theme.colors.white,
        },
        iconWrapperDisabled: {
          opacity: 0.5,
          backgroundColor: isDark ? theme.colors.black : theme.colors.white,
        },
        iconWrapperActive: {
          backgroundColor: isDark ? theme.colors.grey0 : theme.colors.grey4,
          borderRadius: 6,
        },
      },
    },
  });

  const content = useEditorContent(editor);

  useImperativeHandle(ref, () => ({
    clear: () => {
      editor.setContent("");
      onChange?.("");
    },
  }));

  useEffect(() => {
    if (typeof content === "string") {
      onChange?.(content);
    }
  }, [content]);

  useEffect(() => {
    const color = isDark ? theme.colors.white : theme.colors.black;
    const borderColor = isDark ? "#444" : "#ccc";
    const backgroundColor = isDark ? theme.colors.black : theme.colors.white;


    // couldnt override some style properties in the tentap editor, so we are injecting css to override them
    editor.injectCSS(`
      .editor-wrapper {
        border: 1px solid ${borderColor};
        border-radius: 10px;
        background-color: ${backgroundColor};
        overflow: hidden;
      }

      .ProseMirror {
        color: ${color};
        padding: 10px;
        border: none;
        outline: none;
        min-height: 100px;
      }

      .ProseMirror:focus-within {
        border-top: none;
        border-radius: 0 0 10px 10px;
      }

      .tentap-toolbar {
        border-bottom: 1px solid ${borderColor};
        background-color: ${backgroundColor};
        border-radius: 10px 10px 0 0;
      }

      .ProseMirror:focus-within + .tentap-toolbar {
        border-bottom: none;
      }

      ::placeholder {
        color: ${isDark ? "#aaa" : "#888"};
      }
    `);
  }, [isDark, editor]);

  return (
    <SafeAreaView>
      <View style={styles.editorWrapper} className="editor-wrapper">
        <Toolbar
          editor={editor}
          shouldHideDisabledToolbarItems
          items={[
            DEFAULT_TOOLBAR_ITEMS[9], // Ordered List
            DEFAULT_TOOLBAR_ITEMS[10], // Bullet List
            DEFAULT_TOOLBAR_ITEMS[13], // Undo
            DEFAULT_TOOLBAR_ITEMS[14], // Redo
          ]}
        />
        <RichText editor={editor} />
      </View>
    </SafeAreaView>
  );
});

const styles = StyleSheet.create({
  editorWrapper: {
    borderRadius: 10,
    borderWidth: 1,
    overflow: "hidden",
    marginBottom: 12,
  },
});

export default ShomiTentapEditor;
