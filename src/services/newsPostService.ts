import { supabase } from "@/integrations/supabase/client";
import { NewsPost } from "@/integrations/supabase/types";
import { Json } from "@/integrations/supabase/types";

// Define the section structure
interface Section {
  id: string;
  subtitle: string;
  description: string;
  images: string[];
  video: string;
  videoType: "upload" | "url";
}

// Update the NewsPost interface to use the proper section structure
interface NewsPostWithSections extends Omit<NewsPost, 'sections'> {
  sections: Section[] | null;
}

// Type for creating a news post (without id)
export type NewsPostCreate = Omit<NewsPostWithSections, "id" | "created_at" | "updated_at">;

// Type for updating a news post (all properties optional)
export type NewsPostUpdate = Partial<Omit<NewsPostWithSections, "id" | "created_at" | "updated_at">>;

export const newsPostService = {
  // Fetch all news posts
  async fetchNewsPosts() {
    const { data, error } = await supabase
      .from("news_posts")
      .select("*")
      .order("created_at", { ascending: false });

    return { data, error };
  },

  // Fetch a single news post by ID
  async fetchNewsPostById(id: string) {
    const { data, error } = await supabase
      .from("news_posts")
      .select("*")
      .eq("id", id)
      .single();

    return { data, error };
  },

  // Create a new news post
  async createNewsPost(postData: NewsPostCreate) {
    // Convert sections to JSON-compatible format
    const postDataJson: any = {
      ...postData,
      sections: postData.sections ? JSON.stringify(postData.sections) as unknown as Json : null
    };

    const { data, error } = await supabase
      .from("news_posts")
      .insert([postDataJson])
      .select()
      .single();

    return { data, error };
  },

  // Update an existing news post
  async updateNewsPost(id: string, postData: NewsPostUpdate) {
    // Convert sections to JSON-compatible format
    const postDataJson: any = {
      ...postData,
      sections: postData.sections ? JSON.stringify(postData.sections) as unknown as Json : null
    };

    const { data, error } = await supabase
      .from("news_posts")
      .update(postDataJson)
      .eq("id", id)
      .select()
      .single();

    return { data, error };
  },

  // Delete a news post
  async deleteNewsPost(id: string) {
    const { error } = await supabase
      .from("news_posts")
      .delete()
      .eq("id", id);

    return { error };
  },

  // Upload file to storage
  async uploadFile(
    file: File,
    bucket: string
  ): Promise<{ url: string | null; error: any }> {
    try {
      const fileExt = file.name.split(".").pop();
      const fileName = `${Math.random()
        .toString(36)
        .substring(2)}-${Date.now()}.${fileExt}`;
      const { error } = await supabase.storage
        .from(bucket)
        .upload(fileName, file, { upsert: false });
      
      if (error) throw error;

      const {
        data: { publicUrl },
      } = supabase.storage.from(bucket).getPublicUrl(fileName);
      
      return { url: publicUrl, error: null };
    } catch (error: any) {
      return { url: null, error };
    }
  }
};