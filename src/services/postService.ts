import { supabase } from "@/integrations/supabase/client";
import { Post } from "@/integrations/supabase/types";

/**
 * Generate a unique slug based on the post title.
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
      .from("posts")
      .select("id")
      .eq("slug", slug)
      .single();

    if (!data) break; // slug is unique
    slug = `${baseSlug}-${count++}`;
  }

  return slug;
};

export const postService = {
  // Fetch all posts
  async fetchPosts() {
    const { data, error } = await supabase
      .from("posts")
      .select("*")
      .order("created_at", { ascending: false });

    return { data, error };
  },

  // Create a new post with automatic slug
  async createPost(postData: Omit<Post, "id" | "slug">) {
    const slug = await generateUniqueSlug(postData.title);

    const { data, error } = await supabase
      .from("posts")
      .insert([{ ...postData, slug }])
      .select()
      .single();

    return { data, error };
  },

  // Update an existing post (regenerate slug if title changed)
  async updatePost(id: string, postData: Partial<Post>) {
    let updateData = { ...postData };

    if (postData.title) {
      // Regenerate slug if title changed
      const slug = await generateUniqueSlug(postData.title);
      updateData.slug = slug;
    }

    const { data, error } = await supabase
      .from("posts")
      .update(updateData)
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
    const deletePromises = ids.map((id) =>
      supabase.from("posts").delete().eq("id", id)
    );

    const results = await Promise.all(deletePromises);
    const errors = results.filter((result) => result.error);

    return { errors: errors.length > 0 ? errors : null };
  },
};
