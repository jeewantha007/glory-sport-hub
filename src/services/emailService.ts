import { supabase } from "@/integrations/supabase/client";

export const emailService = {
  // Subscribe to newsletter
  async subscribeToNewsletter(name: string, email: string) {
    const { error } = await supabase
      .from("email_subscribers")
      .insert([{ name, email }]);

    return { error };
  }
};