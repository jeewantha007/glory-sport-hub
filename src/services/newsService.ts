import { supabase } from "@/integrations/supabase/client";
import { NewsPost } from "@/integrations/supabase/types";

export const newsService = {
  // Fetch all news posts
  async fetchAllNews() {
    const { data, error } = await supabase
      .from("news_posts")
      .select("*")
      .order("created_at", { ascending: false });

    return { data, error };
  },

  // Fetch a single news post by ID
  async fetchNewsById(id: string) {
    const { data, error } = await supabase
      .from("news_posts")
      .select("*")
      .eq("id", id)
      .single();

    return { data, error };
  },

  // Fetch a single news post by slug
  async fetchNewsBySlug(slug: string) {
    const { data, error } = await supabase
      .from("news_posts")
      .select("*")
      .eq("slug", slug)
      .single();

    return { data, error };
  }
};