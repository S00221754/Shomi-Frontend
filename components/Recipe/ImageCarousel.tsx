import React, { useState } from "react";
import { View, Image, TouchableOpacity } from "react-native";
import { Ionicons } from "@expo/vector-icons";

interface ImageCarouselProps {
  images: string[];
  width: number;
}

// no valid carousel lirary for react native, so we are using a custom implementation
const ImageCarousel: React.FC<ImageCarouselProps> = ({ images, width }) => {
  const [currentImageIndex, setCurrentImageIndex] = useState(0);

  const goToPrevious = () => {
    if (currentImageIndex > 0) {
      setCurrentImageIndex(currentImageIndex - 1);
    }
  };

  const goToNext = () => {
    if (currentImageIndex < images.length - 1) {
      setCurrentImageIndex(currentImageIndex + 1);
    }
  };

  return (
    <View style={{ flex: 1, alignItems: "center", justifyContent: "center" }}>
      {images.length > 1 && (
        <View style={{ position: "absolute", left: 10, top: "50%", zIndex: 1 }}>
          <TouchableOpacity onPress={goToPrevious}>
            <Ionicons name="chevron-back-circle" size={40} color="black" />
          </TouchableOpacity>
        </View>
      )}

      <Image
        source={{ uri: images[currentImageIndex] }}
        style={{
          width: width * 0.9,
          height: 300,
          borderRadius: 12,
        }}
        resizeMode="cover"
      />

      {images.length > 1 && (
        <View
          style={{ position: "absolute", right: 10, top: "50%", zIndex: 1 }}
        >
          <TouchableOpacity onPress={goToNext}>
            <Ionicons name="chevron-forward-circle" size={40} color="black" />
          </TouchableOpacity>
        </View>
      )}
    </View>
  );
};

export default ImageCarousel;
