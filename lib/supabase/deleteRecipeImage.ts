import { supabase } from "@/lib/supabase";

// POLICY needs to be added on production bucket to allow delete
export const deleteRecipeImage = async (imageUrl: string) => {
  const path = imageUrl.split("/").slice(-1)[0];
  console.log(`Deleting image at path: ${path}`);
  
  const { error } = await supabase.storage
    .from(process.env.EXPO_PUBLIC_SUPABASE_RECIPE_BUCKET!)
    .remove([path]);



  if (error) throw error;
};