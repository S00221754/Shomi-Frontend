import React, { useState } from "react";
import {
  View,
  StyleSheet,
  TextInput,
  Keyboard,
  Text,
  TouchableOpacity,
} from "react-native";
import { Button, useTheme } from "@rneui/themed";
import ShomiButton from "@/components/common/ShomiButton";
import { Divider } from "@rneui/base";

export default function HomeScreen() {
  const { theme } = useTheme();
  const textColor = theme.mode === "dark" ? "white" : "black";

  const [tags, setTags] = useState<string[]>([]);
  const [input, setInput] = useState("");

  const handleAddTag = () => {
    const trimmed = input.trim();
    if (trimmed && !tags.includes(trimmed)) {
      setTags((prev) => [...prev, trimmed]);
      setInput("");
      Keyboard.dismiss();
    }
  };

  const removeTag = (tagToRemove: string) => {
    setTags((prev) => prev.filter((tag) => tag !== tagToRemove));
  };

  const handlePantrySearch = () => {
    console.log("Pantry search triggered.");
  };

  const handleScan = () => {
    console.log("Scan barcode triggered.");
  };

  const handleSearchWithTags = () => {
    console.log("Searching recipes with prioritized tags:", tags);
  };

  return (
    <View
      style={[styles.container, { backgroundColor: theme.colors.background }]}
    >
      {/* Welcome */}
      <Text style={[styles.heading, { color: textColor }]}>
        Welcome To Shomi
      </Text>

      <ShomiButton icon="magnify" title="Search with Pantry" onPress={handlePantrySearch} />
      <Text style= {{textAlign: "center", fontSize: 30}}>or</Text>
      <ShomiButton icon="barcode" title="Scan a Barcode" onPress={handleScan} />

      {/* Tag Input Section */}
      <View style={styles.tagSection}>
        <Text style={[styles.label, { color: textColor }]}>
          Prioritize Ingredients
        </Text>

        <TextInput
          placeholder="e.g. chicken"
          placeholderTextColor={theme.colors.grey3}
          value={input}
          onChangeText={setInput}
          onSubmitEditing={handleAddTag}
          style={[
            styles.input,
            {
              borderColor: theme.colors.grey3,
              color: textColor,
            },
          ]}
          returnKeyType="done"
        />
        <View style={styles.tagsWrapper}>
          {tags.map((tag) => (
            <View
              key={tag}
              style={[styles.tag, { backgroundColor: theme.colors.primary }]}
            >
              <Text style={{ color: theme.colors.white }}>{tag}</Text>
              <TouchableOpacity onPress={() => removeTag(tag)}>
                <Text style={{ color: theme.colors.white, marginLeft: 6 }}>
                  ✕
                </Text>
              </TouchableOpacity>
            </View>
          ))}
        </View>

        {/* Show this only when tags exist */}
        {tags.length > 0 && (
          <Button
            title="Search Recipes"
            onPress={handleSearchWithTags}
            containerStyle={styles.searchButton}
          />
        )}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingTop: 50,
    paddingHorizontal: 20,
  },
  heading: {
    fontSize: 26,
    fontWeight: "600",
    textAlign: "center",
    marginBottom: 20,
  },
  topButtonContainer: {
    marginBottom: 40,
    alignItems: "center",
  },
  fullWidthButton: {
    width: "100%",
    marginBottom: 12,
  },
  primaryButton: {
    paddingVertical: 14,
  },
  orText: {
    fontSize: 16,
    marginBottom: 12,
  },
  tagSection: {
    marginTop: "auto",
    marginBottom: 30,
  },
  label: {
    fontSize: 16,
    marginBottom: 8,
    fontWeight: "500",
  },
  input: {
    borderWidth: 1,
    borderRadius: 8,
    paddingHorizontal: 12,
    paddingVertical: 10,
    fontSize: 16,
    marginBottom: 12,
  },
  tagsWrapper: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 8,
    marginBottom: 20,
  },
  tag: {
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 20,
  },
  searchButton: {
    width: "100%",
  },
});
