import { supabase } from "@/integrations/supabase/client";

export const emailService = {

  async subscribeToNewsletter(name: string, email: string) {
    const { error } = await supabase
      .from("email_subscribers")
      .insert([{ name, email }]);

    return { error };
  }
};