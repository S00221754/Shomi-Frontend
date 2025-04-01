import { supabase } from "../supabase";
import * as FileSystem from "expo-file-system";
import { v4 as uuidv4 } from "uuid";

export const uploadRecipeImage = async (uri: string): Promise<string> => {
  const base64 = await FileSystem.readAsStringAsync(uri, {
    encoding: FileSystem.EncodingType.Base64,
  });

  const fileExt = uri.split(".").pop();
  const fileName = `${uuidv4()}.${fileExt}`;
  const contentType = `image/${fileExt}`;

  const { error } = await supabase.storage
    .from(process.env.EXPO_PUBLIC_SUPABASE_RECIPE_BUCKET!)
    .upload(fileName, Buffer.from(base64, "base64"), {
      contentType,
      upsert: true,
    });

  if (error) throw new Error(error.message);

  const { data } = supabase.storage
    .from(process.env.EXPO_PUBLIC_SUPABASE_RECIPE_BUCKET!)
    .getPublicUrl(fileName);

  return data.publicUrl;
};
