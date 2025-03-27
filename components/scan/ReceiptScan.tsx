// import React, { useState } from 'react';
// import { View, Text, Button, ActivityIndicator, StyleSheet, Image } from 'react-native';
// import * as ImagePicker from 'expo-image-picker';
// import axios from 'axios';

// type ReceiptScanProps = {
//     onStopScanning: () => void; //change to product info later
// };

// const ReceiptScan = ({ onStopScanning } : ReceiptScanProps) => {
//     const [isLoading, setIsLoading] = useState(false);
//     const [receiptText, setReceiptText] = useState('');
//     const [imageUri, setImageUri] = useState<string | null>(null);

//     // needs testing
//     const requestPermissions = async () => {
//         const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
//         if (status !== 'granted') {
//             alert('Sorry, we need camera roll permissions to make this work!');
//         }

//         const cameraStatus = await ImagePicker.requestCameraPermissionsAsync();
//         if (cameraStatus.status !== 'granted') {
//             alert('Sorry, we need camera permissions to make this work!');
//         }
//     };

//     // allows user to take a photo and upload it to the ocr
//     const takePhoto = async () => {
//         setIsLoading(true);
//         let result = await ImagePicker.launchCameraAsync({
//             mediaTypes: 'images',
//             allowsEditing: true,
//             aspect: [4, 3],
//             quality: 1,
//         });

//         if (!result.canceled) {
//             const uri = result.assets[0].uri;
//             setImageUri(uri);
//             await processImage(uri);
//         }
//         setIsLoading(false);
//     };

//     // allows user to upload a photo from their gallery
//     const pickImage = async () => {
//         setIsLoading(true);
//         let result = await ImagePicker.launchImageLibraryAsync({
//             mediaTypes: 'images',
//             allowsEditing: true,
//             aspect: [4, 3],
//             quality: 1,
//         });

//         if (!result.canceled) {
//             const uri = result.assets[0].uri;
//             setImageUri(uri);
//             await processImage(uri);
//         }
//         setIsLoading(false);
//     };

//     // processes the image and extracts the text
//     const processImage = async (uri: string) => {
//         try {
//             const apiKey = process.env.EXPO_PUBLIC_GOOGLE_API_KEY;
//             const apiUrl = `${process.env.EXPO_PUBLIC_GOOGLE_API_URL}?key=${apiKey}`;
//             console.log('API URL:', apiUrl);

//             const base64ImageData = await convertImageToBase64(uri);

//             const requestData = {
//                 requests: [
//                     {
//                         image: {
//                             content: base64ImageData,
//                         },
//                         //potentially add label detection (give it a banana and it will be able to identify it)
//                         features: [
//                             {
//                                 type: 'TEXT_DETECTION',
//                             },
//                         ],
//                     },
//                 ],
//             };

//             const response = await axios.post(apiUrl, requestData);
//             console.log('Response:', response.data);

//             const text = response.data.responses[0].fullTextAnnotation?.text || 'No text found';
//             setReceiptText(text);
//         } catch (error) {
//             console.error('Error processing image:', error);
//             setReceiptText('Failed to process the receipt. Please try again.');
//         }
//     };

//     // converts the image to base64
//     const convertImageToBase64 = async (uri: string) => {
//         const response = await fetch(uri);
//         const blob = await response.blob();
//         return new Promise((resolve, reject) => {
//             const reader = new FileReader();
//             reader.onloadend = () => {
//                 const base64data = reader.result?.toString().split(',')[1];
//                 resolve(base64data);
//             };
//             reader.onerror = reject;
//             reader.readAsDataURL(blob);
//         });
//     };

//     return (
//         <View style={styles.container}>
//             <Button title="Take a Photo" onPress={takePhoto} />
//             <Text style={styles.orText}>OR</Text>
//             <Button title="Upload a Photo" onPress={pickImage} />

//             {isLoading && <ActivityIndicator size="large" color="#0000ff" />}

//             {imageUri && (
//                 <Image source={{ uri: imageUri }} style={styles.image} />
//             )}

//             {receiptText ? (
//                 <View style={styles.textContainer}>
//                     <Text style={styles.text}>Extracted Text:</Text>
//                     <Text style={styles.text}>{receiptText}</Text>
//                 </View>
//             ) : null}

//             <Button title="Stop Scanning" onPress={onStopScanning} />
//         </View>
//     );
// };

// const styles = StyleSheet.create({
//     container: {
//         flex: 1,
//         justifyContent: 'center',
//         alignItems: 'center',
//         padding: 20,
//     },
//     orText: {
//         marginVertical: 10,
//         fontSize: 16,
//     },
//     image: {
//         width: 300,
//         height: 200,
//         marginVertical: 20,
//     },
//     textContainer: {
//         marginTop: 20,
//         padding: 10,
//         backgroundColor: '#f0f0f0',
//         borderRadius: 5,
//     },
//     text: {
//         fontSize: 16,
//     },
// });

// export default ReceiptScan;
