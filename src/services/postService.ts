import { supabase } from "@/integrations/supabase/client";
import { Post } from "@/integrations/supabase/types";

export const postService = {
  // Fetch all posts
  async fetchPosts() {
    const { data, error } = await supabase
      .from("posts")
      .select("*")
      .order("created_at", { ascending: false });

    return { data, error };
  },

  // Create a new post
  async createPost(postData: Omit<Post, "id">) {
    const { data, error } = await supabase
      .from("posts")
      .insert([postData])
      .select()
      .single();

    return { data, error };
  },

  // Update an existing post
  async updatePost(id: string, postData: Partial<Post>) {
    const { data, error } = await supabase
      .from("posts")
      .update(postData)
      .eq("id", id)
      .select()
      .single();

    return { data, error };
  },

  // Delete a post
  async deletePost(id: string) {
    const { error } = await supabase
      .from("posts")
      .delete()
      .eq("id", id);

    return { error };
  },

  // Bulk delete posts
  async bulkDeletePosts(ids: string[]) {
    const deletePromises = ids.map(id =>
      supabase.from("posts").delete().eq("id", id)
    );

    const results = await Promise.all(deletePromises);
    const errors = results.filter(result => result.error);

    return { errors: errors.length > 0 ? errors : null };
  }
};