import { supabase } from "@/integrations/supabase/client";
import { NewsPost } from "@/integrations/supabase/types";
import { Json } from "@/integrations/supabase/types";

/**
 * Generate a unique slug based on the news post title.
 */
const generateUniqueSlug = async (title: string) => {
  const baseSlug = title
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9]+/g, "-") // spaces/special chars → hyphens
    .replace(/^-+|-+$/g, "");    // remove leading/trailing hyphens

  let slug = baseSlug;
  let count = 1;

  while (true) {
    const { data } = await supabase
      .from("news_posts")
      .select("id")
      .eq("slug", slug)
      .single();

    if (!data) break; // slug is unique
    slug = `${baseSlug}-${count++}`;
  }

  return slug;
};

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

  // Fetch a single news post by slug
  async fetchNewsPostBySlug(slug: string) {
    const { data, error } = await supabase
      .from("news_posts")
      .select("*")
      .eq("slug", slug)
      .single();

    return { data, error };
  },

  // Create a new news post with automatic slug
  async createNewsPost(postData: NewsPostCreate) {
    const slug = await generateUniqueSlug(postData.title);
    
    // Convert sections to JSON-compatible format
    const postDataJson: any = {
      ...postData,
      slug,
      sections: postData.sections ? JSON.stringify(postData.sections) as unknown as Json : null
    };

    const { data, error } = await supabase
      .from("news_posts")
      .insert([postDataJson])
      .select()
      .single();

    // ✅ Auto-ping Google if post created successfully
    if (data && !error) {
      try {
        await fetch(
          "https://www.google.com/ping?sitemap=https://www.gloryofsport.com/sitemap.xml"
        );
        console.log("Google notified about sitemap update");
      } catch (err) {
        console.error("Failed to ping Google:", err);
      }
    }

    return { data, error };
  },

  // Update an existing news post (regenerate slug if title changed)
  async updateNewsPost(id: string, postData: NewsPostUpdate) {
    let updateData: any = { ...postData };

    if (postData.title) {
      // Regenerate slug if title changed
      const slug = await generateUniqueSlug(postData.title);
      updateData.slug = slug;
    }

    // Convert sections to JSON-compatible format
    updateData.sections = postData.sections ? JSON.stringify(postData.sections) as unknown as Json : null;

    const { data, error } = await supabase
      .from("news_posts")
      .update(updateData)
      .eq("id", id)
      .select()
      .single();

    // ✅ Auto-ping Google if post updated successfully
    if (data && !error) {
      try {
        await fetch(
          "https://www.google.com/ping?sitemap=https://www.gloryofsport.com/sitemap.xml"
        );
        console.log("Google notified about sitemap update");
      } catch (err) {
        console.error("Failed to ping Google:", err);
      }
    }

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
