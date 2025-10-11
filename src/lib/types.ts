export interface Post {
  id: string;
  title: string;
  description: string;
  image_url: string;
  additional_images?: string[];
  video_url?: string;
  affiliate_link: string;
  category: string;
  tags: string[];
  price?: number;
  stock_status?: 'in_stock' | 'limited' | 'out_of_stock';
  affiliate_platform?: string;
  is_featured?: boolean;
  meta_title?: string;
  meta_description?: string;
  created_at?: string;
  updated_at?: string;
}