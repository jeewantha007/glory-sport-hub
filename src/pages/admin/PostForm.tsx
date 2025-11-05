import { useState, useEffect, useRef } from "react";
import { Edit, Eye, Image, FolderOpen, Link2, Tag, DollarSign, Video, ExternalLink, Plus, X, Star, TrendingUp, Upload, Loader2, Bold, Italic, Underline, List, ListOrdered, AlignLeft, AlignCenter, AlignRight, Type } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import { postService } from "@/services";
import { Post } from "@/integrations/supabase/types";

interface PostFormProps {
  editingPost: Post | null;
  uniqueCategories: string[];
  onSuccess: () => void;
  onCancel: () => void;
}

const PostForm = ({ editingPost, uniqueCategories, onSuccess, onCancel }: PostFormProps) => {
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [imageUrl, setImageUrl] = useState("");
  const [additionalImages, setAdditionalImages] = useState<string[]>([]);
  const [videoUrl, setVideoUrl] = useState("");
  const [affiliateLink, setAffiliateLink] = useState("");
  const [category, setCategory] = useState("");
  const [tags, setTags] = useState("");
  const [price, setPrice] = useState("");
  const [stockStatus, setStockStatus] = useState("in_stock");
  const [affiliatePlatform, setAffiliatePlatform] = useState("");
  const [isFeatured, setIsFeatured] = useState(false);
  const [metaTitle, setMetaTitle] = useState("");
  const [metaDescription, setMetaDescription] = useState("");
  const [uploadingImage, setUploadingImage] = useState(false);
  const [uploadingVideo, setUploadingVideo] = useState(false);
  const [uploadingAdditional, setUploadingAdditional] = useState<number | null>(null);
  const [showPreview, setShowPreview] = useState(false);
  
  const editorRef = useRef<HTMLDivElement>(null);
  const { toast } = useToast();

  useEffect(() => {
    if (editingPost) {
      setTitle(editingPost.title);
      setDescription(editingPost.description);
      setImageUrl(editingPost.image_url);
      setAdditionalImages(editingPost.additional_images || []);
      setVideoUrl(editingPost.video_url || "");
      setAffiliateLink(editingPost.affiliate_link);
      setCategory(editingPost.category || "");
      setTags(editingPost.tags?.join(", ") || "");
      setPrice(editingPost.price?.toString() || "");
      setStockStatus(editingPost.stock_status || "in_stock");
      setAffiliatePlatform(editingPost.affiliate_platform || "");
      setIsFeatured(editingPost.is_featured || false);
      setMetaTitle(editingPost.meta_title || "");
      setMetaDescription(editingPost.meta_description || "");
      
      if (editorRef.current) {
        editorRef.current.innerHTML = editingPost.description;
      }
    }
  }, [editingPost]);

  const applyFormat = (command: string, value?: string) => {
    document.execCommand(command, false, value);
    editorRef.current?.focus();
  };

  const handleEditorChange = () => {
    if (editorRef.current) {
      setDescription(editorRef.current.innerHTML);
    }
  };

  const addAdditionalImage = () => {
    setAdditionalImages([...additionalImages, ""]);
  };

  const updateAdditionalImage = (index: number, value: string) => {
    const updated = [...additionalImages];
    updated[index] = value;
    setAdditionalImages(updated);
  };

  const removeAdditionalImage = (index: number) => {
    setAdditionalImages(additionalImages.filter((_, i) => i !== index));
  };

  const uploadFile = async (file: File, bucket: string): Promise<string | null> => {
    try {
      const fileExt = file.name.split('.').pop();
      const fileName = `${Math.random().toString(36).substring(2)}-${Date.now()}.${fileExt}`;
      const filePath = `${fileName}`;

      const { error: uploadError, data } = await supabase.storage
        .from(bucket)
        .upload(filePath, file, {
          cacheControl: '3600',
          upsert: false
        });

      if (uploadError) {
        throw uploadError;
      }

      const { data: { publicUrl } } = supabase.storage
        .from(bucket)
        .getPublicUrl(filePath);

      return publicUrl;
    } catch (error: any) {
      toast({
        title: "Upload Error",
        description: error.message,
        variant: "destructive",
      });
      return null;
    }
  };

  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (!file.type.startsWith('image/')) {
      toast({
        title: "Invalid File",
        description: "Please select an image file",
        variant: "destructive",
      });
      return;
    }

    if (file.size > 5 * 1024 * 1024) {
      toast({
        title: "File Too Large",
        description: "Image must be less than 5MB",
        variant: "destructive",
      });
      return;
    }

    setUploadingImage(true);
    const url = await uploadFile(file, 'post-images');
    if (url) {
      setImageUrl(url);
      toast({
        title: "Success",
        description: "Image uploaded successfully",
      });
    }
    setUploadingImage(false);
  };

  const handleAdditionalImageUpload = async (e: React.ChangeEvent<HTMLInputElement>, index: number) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (!file.type.startsWith('image/')) {
      toast({
        title: "Invalid File",
        description: "Please select an image file",
        variant: "destructive",
      });
      return;
    }

    if (file.size > 5 * 1024 * 1024) {
      toast({
        title: "File Too Large",
        description: "Image must be less than 5MB",
        variant: "destructive",
      });
      return;
    }

    setUploadingAdditional(index);
    const url = await uploadFile(file, 'post-images');
    if (url) {
      updateAdditionalImage(index, url);
      toast({
        title: "Success",
        description: "Image uploaded successfully",
      });
    }
    setUploadingAdditional(null);
  };

  const handleVideoUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (!file.type.startsWith('video/')) {
      toast({
        title: "Invalid File",
        description: "Please select a video file",
        variant: "destructive",
      });
      return;
    }

    if (file.size > 50 * 1024 * 1024) {
      toast({
        title: "File Too Large",
        description: "Video must be less than 50MB",
        variant: "destructive",
      });
      return;
    }

    setUploadingVideo(true);
    const url = await uploadFile(file, 'post-videos');
    if (url) {
      setVideoUrl(url);
      toast({
        title: "Success",
        description: "Video uploaded successfully",
      });
    }
    setUploadingVideo(false);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    const postData: Omit<Post, "id" | "slug"> = {
      title,
      description,
      image_url: imageUrl,
      additional_images: additionalImages.filter(img => img.trim()),
      video_url: videoUrl || null,
      affiliate_link: affiliateLink,
      category,
      tags: tags.split(",").map(tag => tag.trim()).filter(Boolean),
      price: price ? parseFloat(price) : null,
      stock_status: stockStatus as 'in_stock' | 'limited' | 'out_of_stock',
      affiliate_platform: affiliatePlatform || null,
      is_featured: isFeatured,
      meta_title: metaTitle || null,
      meta_description: metaDescription || null,
    };

    try {
      if (editingPost) {
        const { error } = await postService.updatePost(editingPost.id, postData);

        if (error) throw error;
        
        toast({
          title: "Success!",
          description: "Post updated successfully.",
        });
      } else {
        const { error } = await postService.createPost(postData);

        if (error) throw error;
        
        toast({
          title: "Success!",
          description: "Post created successfully.",
        });
      }

      onSuccess();
    } catch (error: any) {
      toast({
        title: "Error",
        description: error.message,
        variant: "destructive",
      });
    }
  };

  return (
    <div className="bg-card rounded-2xl p-4 sm:p-6 lg:p-8 shadow-xl mb-8 border border-border/50">
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between mb-6 gap-4">
        <h2 className="text-2xl sm:text-3xl font-bold">
          {editingPost ? "Edit Post" : "Create New Post"}
        </h2>
        <Button variant="ghost" size="sm" onClick={onCancel}>
          Cancel
        </Button>
      </div>
      
      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Basic Info */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 sm:gap-6">
          <div className="space-y-2">
            <label className="flex items-center gap-2 text-sm font-semibold">
              <Edit className="w-4 h-4" />
              Title *
            </label>
            <Input
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              required
              className="h-12"
              placeholder="Enter product title..."
            />
          </div>

          <div className="space-y-2">
            <label className="flex items-center gap-2 text-sm font-semibold">
              <FolderOpen className="w-4 h-4" />
              Category
            </label>
            <Input
              value={category}
              onChange={(e) => setCategory(e.target.value)}
              list="categories"
              className="h-12"
              placeholder="Basketball, Soccer, Running..."
            />
            <datalist id="categories">
              {uniqueCategories.map(cat => (
                <option key={cat} value={cat} />
              ))}
            </datalist>
          </div>
        </div>

        {/* Rich Text Editor for Description */}
        <div className="space-y-2">
          <div className="flex items-center justify-between">
            <label className="flex items-center gap-2 text-sm font-semibold">
              <Eye className="w-4 h-4" />
              Description *
            </label>
            <Button
              type="button"
              size="sm"
              variant="outline"
              onClick={() => setShowPreview(!showPreview)}
            >
              {showPreview ? "Edit" : "Preview"}
            </Button>
          </div>

          {!showPreview ? (
            <div className="border border-border rounded-lg overflow-hidden bg-background">
              {/* Toolbar */}
              <div className="flex flex-wrap gap-1 p-2 border-b border-border bg-muted/50">
                {/* Text Formatting */}
                <Button
                  type="button"
                  size="sm"
                  variant="ghost"
                  onClick={() => applyFormat('bold')}
                  title="Bold"
                  className="h-8 w-8 p-0"
                >
                  <Bold className="w-4 h-4" />
                </Button>
                <Button
                  type="button"
                  size="sm"
                  variant="ghost"
                  onClick={() => applyFormat('italic')}
                  title="Italic"
                  className="h-8 w-8 p-0"
                >
                  <Italic className="w-4 h-4" />
                </Button>
                <Button
                  type="button"
                  size="sm"
                  variant="ghost"
                  onClick={() => applyFormat('underline')}
                  title="Underline"
                  className="h-8 w-8 p-0"
                >
                  <Underline className="w-4 h-4" />
                </Button>

                <div className="w-px h-8 bg-border mx-1" />

                {/* Alignment */}
                <Button
                  type="button"
                  size="sm"
                  variant="ghost"
                  onClick={() => applyFormat('justifyLeft')}
                  title="Align Left"
                  className="h-8 w-8 p-0"
                >
                  <AlignLeft className="w-4 h-4" />
                </Button>
                <Button
                  type="button"
                  size="sm"
                  variant="ghost"
                  onClick={() => applyFormat('justifyCenter')}
                  title="Align Center"
                  className="h-8 w-8 p-0"
                >
                  <AlignCenter className="w-4 h-4" />
                </Button>
                <Button
                  type="button"
                  size="sm"
                  variant="ghost"
                  onClick={() => applyFormat('justifyRight')}
                  title="Align Right"
                  className="h-8 w-8 p-0"
                >
                  <AlignRight className="w-4 h-4" />
                </Button>

                <div className="w-px h-8 bg-border mx-1" />

                {/* Lists */}
                <Button
                  type="button"
                  size="sm"
                  variant="ghost"
                  onClick={() => applyFormat('insertUnorderedList')}
                  title="Bullet List"
                  className="h-8 w-8 p-0"
                >
                  <List className="w-4 h-4" />
                </Button>
                <Button
                  type="button"
                  size="sm"
                  variant="ghost"
                  onClick={() => applyFormat('insertOrderedList')}
                  title="Numbered List"
                  className="h-8 w-8 p-0"
                >
                  <ListOrdered className="w-4 h-4" />
                </Button>

                <div className="w-px h-8 bg-border mx-1" />

                {/* Font Size */}
                <select
                  onChange={(e) => applyFormat('fontSize', e.target.value)}
                  className="h-8 px-2 text-xs border border-border rounded bg-background"
                  defaultValue="3"
                >
                  <option value="1">Small</option>
                  <option value="3">Normal</option>
                  <option value="5">Large</option>
                  <option value="7">XLarge</option>
                </select>

                {/* Text Color */}
                <div className="relative">
                  <input
                    type="color"
                    onChange={(e) => applyFormat('foreColor', e.target.value)}
                    className="h-8 w-12 cursor-pointer border border-border rounded"
                    title="Text Color"
                  />
                </div>

                {/* Heading */}
                <select
                  onChange={(e) => {
                    applyFormat('formatBlock', e.target.value);
                    e.target.value = 'p';
                  }}
                  className="h-8 px-2 text-xs border border-border rounded bg-background"
                  defaultValue="p"
                >
                  <option value="p">Paragraph</option>
                  <option value="h1">Heading 1</option>
                  <option value="h2">Heading 2</option>
                  <option value="h3">Heading 3</option>
                </select>
              </div>

              {/* Editor */}
              <div
                ref={editorRef}
                contentEditable
                onInput={handleEditorChange}
                className="min-h-[300px] p-4 focus:outline-none prose prose-sm max-w-none"
                style={{ 
                  lineHeight: '1.6',
                  fontSize: '15px'
                }}
              />
            </div>
          ) : (
            <div className="border border-border rounded-lg p-4 min-h-[300px] bg-muted/20">
              <div 
                className="prose prose-sm max-w-none"
                dangerouslySetInnerHTML={{ __html: description }}
              />
            </div>
          )}
          
          <p className="text-xs text-muted-foreground">
            Use the toolbar to format your text. Add headings, colors, lists, and more to make your description engaging.
          </p>
        </div>

        {/* Media Section */}
        <div className="space-y-4 p-3 sm:p-4 border border-border/50 rounded-lg bg-muted/20">
          <h3 className="font-semibold text-base sm:text-lg flex items-center gap-2">
            <Image className="w-5 h-5" />
            Media
          </h3>
          
          {/* Primary Image */}
          <div className="space-y-3">
            <label className="text-sm font-semibold">Primary Image *</label>
            
            <Input
              value={imageUrl}
              onChange={(e) => setImageUrl(e.target.value)}
              className="h-12"
              placeholder="Paste image URL here"
            />

            <div className="flex items-center gap-3">
              <div className="flex-1 border-t border-border"></div>
              <span className="text-xs text-muted-foreground font-medium">OR</span>
              <div className="flex-1 border-t border-border"></div>
            </div>

            <div className="relative">
              <label className="flex items-center justify-center w-full h-14 px-4 border-2 border-dashed border-primary/30 rounded-lg cursor-pointer hover:border-primary hover:bg-primary/5 transition-all bg-card">
                <div className="flex items-center gap-2 text-primary">
                  {uploadingImage ? (
                    <>
                      <Loader2 className="w-5 h-5 animate-spin" />
                      <span className="text-sm font-medium">Uploading...</span>
                    </>
                  ) : (
                    <>
                      <Upload className="w-5 h-5" />
                      <span className="text-sm font-medium">Click to Upload Image</span>
                    </>
                  )}
                </div>
                <input
                  type="file"
                  accept="image/jpeg,image/png,image/webp,image/jpg"
                  onChange={handleImageUpload}
                  disabled={uploadingImage}
                  className="hidden"
                />
              </label>
              <p className="text-xs text-muted-foreground mt-2 text-center">
                JPG, PNG or WEBP (max 5MB)
              </p>
            </div>

            {imageUrl && (
              <div className="mt-3 rounded-lg overflow-hidden border-2 border-border/50 bg-muted/30">
                <img 
                  src={imageUrl} 
                  alt="Preview" 
                  className="w-full h-48 sm:h-64 object-cover"
                  onError={(e) => {
                    e.currentTarget.src = 'https://via.placeholder.com/400x300?text=Invalid+Image';
                  }}
                />
              </div>
            )}
          </div>

          {/* Additional Images */}
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <label className="text-sm font-semibold">Additional Images</label>
              <Button type="button" size="sm" variant="outline" onClick={addAdditionalImage}>
                <Plus className="w-4 h-4 mr-1" />
                Add
              </Button>
            </div>
            {additionalImages.map((img, index) => (
              <div key={index} className="space-y-2 p-3 border border-border rounded-lg bg-muted/30">
                <div className="flex gap-2">
                  <Input
                    value={img}
                    onChange={(e) => updateAdditionalImage(index, e.target.value)}
                    placeholder="https://example.com/image.jpg"
                    className="h-10"
                  />
                  <Button 
                    type="button" 
                    size="sm" 
                    variant="ghost"
                    onClick={() => removeAdditionalImage(index)}
                  >
                    <X className="w-4 h-4" />
                  </Button>
                </div>
                
                <div className="flex items-center gap-2">
                  <label className="flex items-center justify-center flex-1 h-10 px-4 border-2 border-dashed border-border rounded-md cursor-pointer hover:border-primary transition-colors bg-background">
                    <Upload className="w-3 h-3 mr-2" />
                    <span className="text-xs">
                      {uploadingAdditional === index ? "Uploading..." : "Upload"}
                    </span>
                    <input
                      type="file"
                      accept="image/*"
                      onChange={(e) => handleAdditionalImageUpload(e, index)}
                      disabled={uploadingAdditional === index}
                      className="hidden"
                    />
                  </label>
                  {uploadingAdditional === index && (
                    <Loader2 className="w-4 h-4 animate-spin text-primary" />
                  )}
                </div>
              </div>
            ))}
          </div>

          {/* Video URL */}
          <div className="space-y-2">
            <label className="flex items-center gap-2 text-sm font-semibold">
              <Video className="w-4 h-4" />
              Video
            </label>
            
            <Input
              value={videoUrl}
              onChange={(e) => setVideoUrl(e.target.value)}
              className="h-12"
              placeholder="https://youtube.com/watch?v=..."
            />

            <div className="flex items-center gap-2">
              <div className="flex-1">
                <label className="flex items-center justify-center w-full h-12 px-4 border-2 border-dashed border-border rounded-md cursor-pointer hover:border-primary transition-colors bg-muted/50">
                  <Upload className="w-4 h-4 mr-2" />
                  <span className="text-sm">
                    {uploadingVideo ? "Uploading..." : "Upload Video"}
                  </span>
                  <input
                    type="file"
                    accept="video/*"
                    onChange={handleVideoUpload}
                    disabled={uploadingVideo}
                    className="hidden"
                  />
                </label>
              </div>
              {uploadingVideo && <Loader2 className="w-5 h-5 animate-spin text-primary" />}
            </div>
            
            <p className="text-xs text-muted-foreground">
              Upload a video (max 50MB) or paste a YouTube/Vimeo URL above
            </p>
          </div>
        </div>

        {/* Product Details */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
          <div className="space-y-2">
            <label className="flex items-center gap-2 text-sm font-semibold">
              <DollarSign className="w-4 h-4" />
              Price (USD)
            </label>
            <Input
              type="number"
              step="0.01"
              value={price}
              onChange={(e) => setPrice(e.target.value)}
              className="h-12"
              placeholder="99.99"
            />
          </div>

          <div className="space-y-2">
            <label className="text-sm font-semibold">Stock Status</label>
            <select
              value={stockStatus}
              onChange={(e) => setStockStatus(e.target.value)}
              className="w-full h-12 px-3 rounded-md border border-input bg-background"
            >
              <option value="in_stock">In Stock</option>
              <option value="limited">Limited Stock</option>
              <option value="out_of_stock">Out of Stock</option>
            </select>
          </div>

          <div className="space-y-2">
            <label className="flex items-center gap-2 text-sm font-semibold">
              <ExternalLink className="w-4 h-4" />
              Affiliate Platform
            </label>
            <Input
              value={affiliatePlatform}
              onChange={(e) => setAffiliatePlatform(e.target.value)}
              className="h-12"
              placeholder="Amazon, Fanatics..."
            />
          </div>
        </div>

        {/* Affiliate Link */}
        <div className="space-y-2">
          <label className="flex items-center gap-2 text-sm font-semibold">
            <Link2 className="w-4 h-4" />
            Affiliate Link *
          </label>
          <Input
            value={affiliateLink}
            onChange={(e) => setAffiliateLink(e.target.value)}
            required
            className="h-12"
            placeholder="https://affiliate.link/product"
          />
        </div>

        {/* Tags */}
        <div className="space-y-2">
          <label className="flex items-center gap-2 text-sm font-semibold">
            <Tag className="w-4 h-4" />
            Tags (comma separated)
          </label>
          <Input
            value={tags}
            onChange={(e) => setTags(e.target.value)}
            className="h-12"
            placeholder="gear, shoes, training, premium"
          />
          {tags && (
            <div className="flex flex-wrap gap-2 mt-2">
              {tags.split(",").map((tag, i) => tag.trim() && (
                <span key={i} className="px-3 py-1 bg-primary/10 text-primary rounded-full text-sm">
                  {tag.trim()}
                </span>
              ))}
            </div>
          )}
        </div>

        {/* Featured Toggle */}
        <div className="flex items-center gap-3 p-4 bg-yellow-500/10 border border-yellow-500/20 rounded-lg">
          <input
            type="checkbox"
            id="featured"
            checked={isFeatured}
            onChange={(e) => setIsFeatured(e.target.checked)}
            className="w-5 h-5 rounded border-gray-300"
          />
          <label htmlFor="featured" className="flex items-center gap-2 font-semibold cursor-pointer">
            <Star className="w-5 h-5 text-yellow-500" />
            Mark as Featured Post
          </label>
        </div>

        {/* SEO Section */}
        <div className="space-y-4 p-3 sm:p-4 border border-border/50 rounded-lg bg-muted/20">
          <h3 className="font-semibold text-base sm:text-lg flex items-center gap-2">
            <TrendingUp className="w-5 h-5" />
            SEO Settings
          </h3>
          
          <div className="space-y-2">
            <label className="text-sm font-semibold">Meta Title</label>
            <Input
              value={metaTitle}
              onChange={(e) => setMetaTitle(e.target.value)}
              className="h-12"
              placeholder="SEO optimized title (50-60 characters)"
              maxLength={60}
            />
            <p className="text-xs text-muted-foreground">{metaTitle.length}/60 characters</p>
          </div>

          <div className="space-y-2">
            <label className="text-sm font-semibold">Meta Description</label>
            <Textarea
              value={metaDescription}
              onChange={(e) => setMetaDescription(e.target.value)}
              rows={3}
              className="resize-none"
              placeholder="SEO optimized description (150-160 characters)"
              maxLength={160}
            />
            <p className="text-xs text-muted-foreground">{metaDescription.length}/160 characters</p>
          </div>
        </div>

        {/* Submit Buttons */}
        <div className="flex flex-col sm:flex-row gap-4 pt-4">
          <Button 
            type="submit" 
            size="lg"
            className="bg-gradient-to-r from-primary to-secondary hover:opacity-90 w-full sm:w-auto"
          >
            {editingPost ? "Update Post" : "Create Post"}
          </Button>
          <Button type="button" variant="outline" size="lg" onClick={onCancel} className="w-full sm:w-auto">
            Cancel
          </Button>
        </div>
      </form>
    </div>
  );
};

export default PostForm;