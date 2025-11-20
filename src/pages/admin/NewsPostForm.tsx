import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Upload, X, Plus, GripVertical, Type, Image, Link, MousePointerClick, AlignLeft, AlignCenter, AlignRight, Palette } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { newsPostService, type NewsPostCreate, type NewsPostUpdate } from "@/services/newsPostService";
import {
  DndContext,
  closestCenter,
  PointerSensor,
  useSensor,
  useSensors,
} from "@dnd-kit/core";
import {
  arrayMove,
  SortableContext,
  verticalListSortingStrategy,
} from "@dnd-kit/sortable";
import SortableItem from "@/components/SortableItem";

type ContentBlockType = "paragraph" | "image" | "video" | "button" | "heading";

interface ContentBlock {
  id: string;
  type: ContentBlockType;
  content: any;
  alignment?: "left" | "center" | "right";
  styling?: {
    fontFamily?: string;
    fontSize?: string;
    color?: string;
  };
}

interface NewsPostFormProps {
  editingPost?: any;
  onSuccess: () => void;
  onCancel: () => void;
}

const NewsPostForm = ({ editingPost, onSuccess, onCancel }: NewsPostFormProps) => {
  const [title, setTitle] = useState("");
  const [contentBlocks, setContentBlocks] = useState<ContentBlock[]>([]);
  const [metaTitle, setMetaTitle] = useState("");
  const [metaDescription, setMetaDescription] = useState("");
  const [uploading, setUploading] = useState(false);

  const { toast } = useToast();

  const sensors = useSensors(useSensor(PointerSensor, { activationConstraint: { distance: 5 } }));

  // Convert Sections to ContentBlocks for editing
  const convertSectionsToBlocks = (sections: any[]): ContentBlock[] => {
    const blocks: ContentBlock[] = [];
    
    sections.forEach((section, sectionIndex) => {
      // Add heading if subtitle exists
      if (section.subtitle) {
        blocks.push({
          id: `${section.id || `section-${sectionIndex}`}-heading`,
          type: "heading",
          content: { text: section.subtitle, level: section.headingLevel || "h2" },
          alignment: section.headingAlignment || "left",
          styling: section.headingStyling || {},
        });
      }
      
      // Add paragraph if description exists
      // Split by double newlines to preserve paragraph breaks
      if (section.description) {
        const paragraphs = section.description.split(/\n\n+/).filter((p: string) => p.trim());
        paragraphs.forEach((paragraph: string, paraIndex: number) => {
          const paraStyles = Array.isArray(section.paragraphStyling) 
            ? section.paragraphStyling[paraIndex] || {}
            : section.paragraphStyling || {};
          const paraAlignments = Array.isArray(section.paragraphAlignments)
            ? section.paragraphAlignments[paraIndex] || "left"
            : section.paragraphAlignments || "left";
          
          blocks.push({
            id: `${section.id || `section-${sectionIndex}`}-description-${paraIndex}`,
            type: "paragraph",
            content: { text: paragraph.trim() },
            alignment: paraAlignments,
            styling: paraStyles,
          });
        });
      }
      
      // Add images
      if (section.images && Array.isArray(section.images)) {
        section.images.forEach((imageUrl: string, index: number) => {
          if (imageUrl && typeof imageUrl === 'string') {
            const imageData = Array.isArray(section.imageData) ? section.imageData[index] : {};
            blocks.push({
              id: `${section.id || `section-${sectionIndex}`}-image-${index}`,
              type: "image",
              content: { 
                url: imageUrl, 
                alt: imageData.alt || "", 
                caption: imageData.caption || "" 
              },
              alignment: imageData.alignment || "left",
            });
          }
        });
      }
      
      // Add video
      if (section.video && section.video.trim()) {
        blocks.push({
          id: `${section.id || `section-${sectionIndex}`}-video`,
          type: "video",
          content: { url: section.video, type: section.videoType || "url" },
          alignment: section.videoAlignment || "left",
        });
      }
      
      // Add buttons
      if (section.buttons && Array.isArray(section.buttons)) {
        section.buttons.forEach((button: any, buttonIndex: number) => {
          if (button && button.text && button.url) {
            blocks.push({
              id: `${section.id || `section-${sectionIndex}`}-button-${buttonIndex}`,
              type: "button",
              content: {
                text: button.text,
                url: button.url,
                style: button.style || "primary",
              },
              alignment: button.alignment || "left",
            });
          }
        });
      }
    });
    
    return blocks;
  };

  useEffect(() => {
    if (editingPost) {
      setTitle(editingPost.title);
      setMetaTitle(editingPost.meta_title || "");
      setMetaDescription(editingPost.meta_description || "");
      if (editingPost.sections) {
        try {
          const parsedSections = Array.isArray(editingPost.sections)
            ? editingPost.sections
            : typeof editingPost.sections === "string"
            ? JSON.parse(editingPost.sections)
            : [];
          
          // Convert sections to content blocks for editing
          if (parsedSections.length > 0) {
            const blocks = convertSectionsToBlocks(parsedSections);
            setContentBlocks(blocks);
          } else {
            setContentBlocks([]);
          }
        } catch (e) {
          console.error("Failed to parse sections", e);
          setContentBlocks([]);
        }
      } else {
        setContentBlocks([]);
      }
    } else {
      // Reset form when not editing
      setTitle("");
      setMetaTitle("");
      setMetaDescription("");
      setContentBlocks([]);
    }
  }, [editingPost]);

  const addBlock = (type: ContentBlockType) => {
    const newBlock: ContentBlock = {
      id: Date.now().toString(),
      type,
      content: getDefaultContent(type),
      alignment: "left",
      styling: type === "heading" || type === "paragraph" ? {} : undefined,
    };
    setContentBlocks([...contentBlocks, newBlock]);
  };

  const getDefaultContent = (type: ContentBlockType) => {
    switch (type) {
      case "paragraph":
        return { text: "" };
      case "heading":
        return { text: "", level: "h2" };
      case "image":
        return { url: "", alt: "", caption: "" };
      case "video":
        return { url: "", type: "upload" };
      case "button":
        return { text: "", url: "", style: "primary" };
      default:
        return {};
    }
  };

  const updateBlockAlignment = (id: string, alignment: "left" | "center" | "right") => {
    setContentBlocks(contentBlocks.map((block) => 
      block.id === id ? { ...block, alignment } : block
    ));
  };

  const updateBlockStyling = (id: string, styling: { fontFamily?: string; fontSize?: string; color?: string }) => {
    setContentBlocks(contentBlocks.map((block) => 
      block.id === id ? { ...block, styling: { ...block.styling, ...styling } } : block
    ));
  };

  const removeBlock = (id: string) => {
    setContentBlocks(contentBlocks.filter((block) => block.id !== id));
  };

  const updateBlock = (id: string, content: any) => {
    setContentBlocks(contentBlocks.map((block) => (block.id === id ? { ...block, content } : block)));
  };

  const handleImageUpload = async (file: File, blockId: string) => {
    if (!file.type.startsWith("image/"))
      return toast({ title: "Invalid file", description: "Select an image", variant: "destructive" });
    if (file.size > 5 * 1024 * 1024)
      return toast({ title: "File too large", description: "Max 5MB", variant: "destructive" });

    setUploading(true);
    const { url, error } = await newsPostService.uploadFile(file, "post-images");
    if (error) {
      toast({ title: "Upload Error", description: error.message, variant: "destructive" });
    } else if (url) {
      const block = contentBlocks.find((b) => b.id === blockId);
      if (block) {
        updateBlock(blockId, { ...block.content, url });
      }
    }
    setUploading(false);
  };

  const handleVideoUpload = async (file: File, blockId: string) => {
    if (!file.type.startsWith("video/"))
      return toast({ title: "Invalid file", description: "Select a video", variant: "destructive" });
    if (file.size > 50 * 1024 * 1024)
      return toast({ title: "File too large", description: "Max 50MB", variant: "destructive" });

    setUploading(true);
    const { url, error } = await newsPostService.uploadFile(file, "post-videos");
    if (error) {
      toast({ title: "Upload Error", description: error.message, variant: "destructive" });
    } else if (url) {
      const block = contentBlocks.find((b) => b.id === blockId);
      if (block) {
        updateBlock(blockId, { ...block.content, url, type: "upload" });
      }
    }
    setUploading(false);
  };

  const onDragEnd = (event: any) => {
    const { active, over } = event;
    if (active.id !== over?.id) {
      const oldIndex = contentBlocks.findIndex((b) => b.id === active.id);
      const newIndex = contentBlocks.findIndex((b) => b.id === over.id);
      setContentBlocks(arrayMove(contentBlocks, oldIndex, newIndex));
    }
  };

  // Convert ContentBlocks to Sections format
  const convertBlocksToSections = (blocks: ContentBlock[]) => {
    const sections: Array<{
      id: string;
      subtitle: string;
      description: string;
      images: string[];
      video: string;
      videoType: "upload" | "url";
      buttons?: Array<{
        text: string;
        url: string;
        style: "primary" | "secondary" | "outline" | "link";
        alignment?: "left" | "center" | "right";
      }>;
      // Styling and alignment metadata
      headingLevel?: string;
      headingAlignment?: "left" | "center" | "right";
      headingStyling?: { fontFamily?: string; fontSize?: string; color?: string };
      paragraphAlignments?: ("left" | "center" | "right")[];
      paragraphStyling?: Array<{ fontFamily?: string; fontSize?: string; color?: string }>;
      imageData?: Array<{ alt?: string; caption?: string; alignment?: "left" | "center" | "right" }>;
      videoAlignment?: "left" | "center" | "right";
    }> = [];

    let currentSection: {
      id: string;
      subtitle: string;
      description: string;
      images: string[];
      video: string;
      videoType: "upload" | "url";
      buttons?: Array<{
        text: string;
        url: string;
        style: "primary" | "secondary" | "outline" | "link";
        alignment?: "left" | "center" | "right";
      }>;
      headingLevel?: string;
      headingAlignment?: "left" | "center" | "right";
      headingStyling?: { fontFamily?: string; fontSize?: string; color?: string };
      paragraphAlignments?: ("left" | "center" | "right")[];
      paragraphStyling?: Array<{ fontFamily?: string; fontSize?: string; color?: string }>;
      imageData?: Array<{ alt?: string; caption?: string; alignment?: "left" | "center" | "right" }>;
      videoAlignment?: "left" | "center" | "right";
    } | null = null;

    blocks.forEach((block) => {
      if (block.type === "heading") {
        // Start a new section with heading as subtitle
        if (currentSection && (currentSection.description || currentSection.images.length > 0 || currentSection.video || (currentSection.buttons && currentSection.buttons.length > 0))) {
          sections.push(currentSection);
        }
        currentSection = {
          id: block.id,
          subtitle: block.content.text || "",
          description: "",
          images: [],
          video: "",
          videoType: "url",
          buttons: [],
          headingLevel: block.content.level || "h2",
          headingAlignment: block.alignment || "left",
          headingStyling: block.styling || {},
        };
      } else if (block.type === "paragraph") {
        // Add paragraph to description
        if (!currentSection) {
          currentSection = {
            id: block.id,
            subtitle: "",
            description: "",
            images: [],
            video: "",
            videoType: "url",
            buttons: [],
            paragraphAlignments: [],
            paragraphStyling: [],
          };
        }
        if (currentSection.description) {
          currentSection.description += "\n\n" + (block.content.text || "");
        } else {
          currentSection.description = block.content.text || "";
        }
        // Store paragraph alignment and styling
        if (!currentSection.paragraphAlignments) currentSection.paragraphAlignments = [];
        if (!currentSection.paragraphStyling) currentSection.paragraphStyling = [];
        currentSection.paragraphAlignments.push(block.alignment || "left");
        currentSection.paragraphStyling.push(block.styling || {});
      } else if (block.type === "image") {
        // Add image to images array
        if (!currentSection) {
          currentSection = {
            id: block.id,
            subtitle: "",
            description: "",
            images: [],
            video: "",
            videoType: "url",
            buttons: [],
            imageData: [],
          };
        }
        if (block.content.url) {
          currentSection.images.push(block.content.url);
          if (!currentSection.imageData) currentSection.imageData = [];
          currentSection.imageData.push({
            alt: block.content.alt || "",
            caption: block.content.caption || "",
            alignment: block.alignment || "left",
          });
        }
      } else if (block.type === "video") {
        // Add video
        if (!currentSection) {
          currentSection = {
            id: block.id,
            subtitle: "",
            description: "",
            images: [],
            video: "",
            videoType: "url",
            buttons: [],
          };
        }
        currentSection.video = block.content.url || "";
        currentSection.videoType = block.content.type === "upload" ? "upload" : "url";
        currentSection.videoAlignment = block.alignment || "left";
      } else if (block.type === "button") {
        // Add button to current section
        if (!currentSection) {
          currentSection = {
            id: block.id,
            subtitle: "",
            description: "",
            images: [],
            video: "",
            videoType: "url",
            buttons: [],
          };
        }
        if (!currentSection.buttons) {
          currentSection.buttons = [];
        }
        if (block.content.text && block.content.url) {
          currentSection.buttons.push({
            text: block.content.text,
            url: block.content.url,
            style: block.content.style || "primary",
            alignment: block.alignment || "left",
          });
        }
      }
    });

    // Add the last section if it exists
    if (currentSection && (currentSection.subtitle || currentSection.description || currentSection.images.length > 0 || currentSection.video || (currentSection.buttons && currentSection.buttons.length > 0))) {
      sections.push(currentSection);
    }

    return sections.length > 0 ? sections : null;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim())
      return toast({ title: "Title required", variant: "destructive" });

    // Convert ContentBlocks to Sections format
    const sections = convertBlocksToSections(contentBlocks);

    const postData: NewsPostCreate | NewsPostUpdate = {
      title,
      sections: sections,
      meta_title: metaTitle || undefined,
      meta_description: metaDescription || undefined,
    };

    try {
      const { error } = editingPost
        ? await newsPostService.updateNewsPost(editingPost.id, postData)
        : await newsPostService.createNewsPost(postData as NewsPostCreate);

      if (error) throw error;
      toast({ title: "Success", description: "Post saved successfully" });
      onSuccess();
    } catch (error: any) {
      toast({ title: "Error", description: error.message, variant: "destructive" });
    }
  };

  // Helper component for alignment controls
  const AlignmentControls = ({ block }: { block: ContentBlock }) => (
    <div className="flex items-center gap-1 p-1 bg-muted rounded-md">
      <Button
        type="button"
        size="sm"
        variant={block.alignment === "left" ? "default" : "ghost"}
        onClick={() => updateBlockAlignment(block.id, "left")}
        className="h-8 w-8 p-0"
      >
        <AlignLeft className="w-4 h-4" />
      </Button>
      <Button
        type="button"
        size="sm"
        variant={block.alignment === "center" ? "default" : "ghost"}
        onClick={() => updateBlockAlignment(block.id, "center")}
        className="h-8 w-8 p-0"
      >
        <AlignCenter className="w-4 h-4" />
      </Button>
      <Button
        type="button"
        size="sm"
        variant={block.alignment === "right" ? "default" : "ghost"}
        onClick={() => updateBlockAlignment(block.id, "right")}
        className="h-8 w-8 p-0"
      >
        <AlignRight className="w-4 h-4" />
      </Button>
    </div>
  );

  // Helper component for styling controls (for headings and paragraphs)
  const StylingControls = ({ block }: { block: ContentBlock }) => (
    <div className="space-y-2 p-3 bg-muted/50 rounded-md border">
      <div className="flex items-center gap-2 text-xs font-medium text-muted-foreground">
        <Palette className="w-3 h-3" />
        Styling Options
      </div>
      <div className="grid grid-cols-3 gap-2">
        <div>
          <label className="text-xs text-muted-foreground mb-1 block">Font Family</label>
          <select
            value={block.styling?.fontFamily || "inherit"}
            onChange={(e) => updateBlockStyling(block.id, { fontFamily: e.target.value })}
            className="h-8 w-full text-xs px-2 rounded-md border border-input bg-background"
          >
            <option value="inherit">Default</option>
            <option value="Arial, sans-serif">Arial</option>
            <option value="Georgia, serif">Georgia</option>
            <option value="'Times New Roman', serif">Times New Roman</option>
            <option value="'Courier New', monospace">Courier New</option>
            <option value="Verdana, sans-serif">Verdana</option>
            <option value="'Trebuchet MS', sans-serif">Trebuchet MS</option>
          </select>
        </div>
        <div>
          <label className="text-xs text-muted-foreground mb-1 block">Font Size</label>
          <select
            value={block.styling?.fontSize || "inherit"}
            onChange={(e) => updateBlockStyling(block.id, { fontSize: e.target.value })}
            className="h-8 w-full text-xs px-2 rounded-md border border-input bg-background"
          >
            <option value="inherit">Default</option>
            <option value="12px">12px</option>
            <option value="14px">14px</option>
            <option value="16px">16px</option>
            <option value="18px">18px</option>
            <option value="20px">20px</option>
            <option value="24px">24px</option>
            <option value="28px">28px</option>
            <option value="32px">32px</option>
            <option value="36px">36px</option>
            <option value="48px">48px</option>
          </select>
        </div>
        <div>
          <label className="text-xs text-muted-foreground mb-1 block">Color</label>
          <div className="flex gap-1">
            <input
              type="color"
              value={block.styling?.color || "#ffffff"}
              onChange={(e) => updateBlockStyling(block.id, { color: e.target.value })}
              className="h-8 w-12 rounded-md border border-input cursor-pointer"
            />
            <Input
              type="text"
              value={block.styling?.color || "#ffffff"}
              onChange={(e) => updateBlockStyling(block.id, { color: e.target.value })}
              placeholder="#ffffff"
              className="h-8 text-xs flex-1"
            />
          </div>
        </div>
      </div>
    </div>
  );

  const renderBlock = (block: ContentBlock) => {
    switch (block.type) {
      case "paragraph":
        return (
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2 text-sm font-medium text-muted-foreground">
                <Type className="w-4 h-4" />
                Paragraph
              </div>
              <AlignmentControls block={block} />
            </div>
            <Textarea
              value={block.content.text || ""}
              onChange={(e) => updateBlock(block.id, { ...block.content, text: e.target.value })}
              rows={4}
              placeholder="Enter paragraph text..."
              className="font-mono text-sm"
            />
            <StylingControls block={block} />
          </div>
        );

      case "heading":
        return (
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2 text-sm font-medium text-muted-foreground">
                <Type className="w-4 h-4" />
                Heading
              </div>
              <AlignmentControls block={block} />
            </div>
            <div className="flex gap-2">
              <select
                value={block.content.level || "h2"}
                onChange={(e) => updateBlock(block.id, { ...block.content, level: e.target.value })}
                className="h-10 px-3 rounded-md border border-input bg-background"
              >
                <option value="h1">H1</option>
                <option value="h2">H2</option>
                <option value="h3">H3</option>
                <option value="h4">H4</option>
              </select>
              <Input
                value={block.content.text || ""}
                onChange={(e) => updateBlock(block.id, { ...block.content, text: e.target.value })}
                placeholder="Heading text..."
                className="flex-1"
              />
            </div>
            <StylingControls block={block} />
          </div>
        );

      case "image":
        return (
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2 text-sm font-medium text-muted-foreground">
                <Image className="w-4 h-4" />
                Image
              </div>
              <AlignmentControls block={block} />
            </div>
            <div className="flex gap-2">
              <label className="flex items-center justify-center w-10 h-10 border-2 border-dashed rounded-md cursor-pointer hover:bg-muted">
                <Upload className="w-4 h-4" />
                <input
                  type="file"
                  accept="image/*"
                  className="hidden"
                  onChange={(e) => e.target.files?.[0] && handleImageUpload(e.target.files[0], block.id)}
                />
              </label>
              <Input
                value={block.content.url || ""}
                onChange={(e) => updateBlock(block.id, { ...block.content, url: e.target.value })}
                placeholder="Or paste image URL..."
                className="flex-1"
              />
            </div>
            <Input
              value={block.content.alt || ""}
              onChange={(e) => updateBlock(block.id, { ...block.content, alt: e.target.value })}
              placeholder="Alt text (for accessibility)"
              className="text-sm"
            />
            <Input
              value={block.content.caption || ""}
              onChange={(e) => updateBlock(block.id, { ...block.content, caption: e.target.value })}
              placeholder="Caption (optional)"
              className="text-sm"
            />
            {block.content.url && (
              <img
                src={block.content.url}
                alt={block.content.alt}
                className="w-full max-w-md h-48 object-cover rounded-md border"
              />
            )}
          </div>
        );

      case "video":
        return (
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2 text-sm font-medium text-muted-foreground">
                <Upload className="w-4 h-4" />
                Video
              </div>
              <AlignmentControls block={block} />
            </div>
            <div className="flex gap-2">
              <label className="flex items-center justify-center w-10 h-10 border-2 border-dashed rounded-md cursor-pointer hover:bg-muted">
                <Upload className="w-4 h-4" />
                <input
                  type="file"
                  accept="video/*"
                  className="hidden"
                  onChange={(e) => e.target.files?.[0] && handleVideoUpload(e.target.files[0], block.id)}
                />
              </label>
              <Input
                value={block.content.url || ""}
                onChange={(e) => updateBlock(block.id, { ...block.content, url: e.target.value, type: "url" })}
                placeholder="Or paste video URL (YouTube, Vimeo, etc.)..."
                className="flex-1"
              />
            </div>
            {block.content.url && (
              <div className="w-full max-w-md">
                {block.content.type === "upload" ? (
                  <video src={block.content.url} controls className="w-full rounded-md border" />
                ) : (
                  <div className="aspect-video bg-muted rounded-md flex items-center justify-center border">
                    <span className="text-sm text-muted-foreground">External Video: {block.content.url}</span>
                  </div>
                )}
              </div>
            )}
          </div>
        );

      case "button":
        return (
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2 text-sm font-medium text-muted-foreground">
                <MousePointerClick className="w-4 h-4" />
                Button / Link
              </div>
              <AlignmentControls block={block} />
            </div>
            <Input
              value={block.content.text || ""}
              onChange={(e) => updateBlock(block.id, { ...block.content, text: e.target.value })}
              placeholder="Button text..."
            />
            <Input
              value={block.content.url || ""}
              onChange={(e) => updateBlock(block.id, { ...block.content, url: e.target.value })}
              placeholder="Link URL..."
            />
            <div className="flex gap-2">
              <select
                value={block.content.style || "primary"}
                onChange={(e) => updateBlock(block.id, { ...block.content, style: e.target.value })}
                className="h-10 px-3 rounded-md border border-input bg-background"
              >
                <option value="primary">Primary Button</option>
                <option value="secondary">Secondary Button</option>
                <option value="outline">Outline Button</option>
                <option value="link">Text Link</option>
              </select>
            </div>
            {block.content.text && (
              <div className="pt-2">
                <Button
                  type="button"
                  variant={block.content.style === "outline" ? "outline" : block.content.style === "link" ? "link" : "default"}
                  className={block.content.style === "secondary" ? "bg-secondary" : ""}
                >
                  {block.content.text}
                </Button>
              </div>
            )}
          </div>
        );

      default:
        return null;
    }
  };

  return (
    <div className="bg-card rounded-2xl p-8 shadow-xl border border-border/50">
      <h2 className="text-3xl font-bold mb-6">{editingPost ? "Edit News Post" : "Create News Post"}</h2>

      <form className="space-y-6" onSubmit={handleSubmit}>
        <Input
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          className="h-12 text-lg font-semibold"
          placeholder="Post Title"
          required
        />

        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="text-sm text-muted-foreground mb-1 block">Meta Title (SEO)</label>
            <Input
              value={metaTitle}
              onChange={(e) => setMetaTitle(e.target.value)}
              maxLength={60}
              placeholder="Meta title..."
            />
            <span className="text-xs text-muted-foreground">{metaTitle.length}/60</span>
          </div>
          <div>
            <label className="text-sm text-muted-foreground mb-1 block">Meta Description (SEO)</label>
            <Textarea
              value={metaDescription}
              onChange={(e) => setMetaDescription(e.target.value)}
              maxLength={160}
              rows={2}
              placeholder="Meta description..."
            />
            <span className="text-xs text-muted-foreground">{metaDescription.length}/160</span>
          </div>
        </div>

        {/* Content Blocks */}
        <div className="space-y-4">
          <div className="flex justify-between items-center">
            <h3 className="font-semibold text-lg">Content Blocks</h3>
            <div className="flex gap-2 flex-wrap">
              <Button type="button" size="sm" variant="outline" onClick={() => addBlock("heading")}>
                <Type className="w-4 h-4 mr-1" />
                Heading
              </Button>
              <Button type="button" size="sm" variant="outline" onClick={() => addBlock("paragraph")}>
                <Type className="w-4 h-4 mr-1" />
                Paragraph
              </Button>
              <Button type="button" size="sm" variant="outline" onClick={() => addBlock("image")}>
                <Image className="w-4 h-4 mr-1" />
                Image
              </Button>
              <Button type="button" size="sm" variant="outline" onClick={() => addBlock("video")}>
                <Upload className="w-4 h-4 mr-1" />
                Video
              </Button>
              <Button type="button" size="sm" variant="outline" onClick={() => addBlock("button")}>
                <MousePointerClick className="w-4 h-4 mr-1" />
                Button
              </Button>
            </div>
          </div>

          {contentBlocks.length === 0 && (
            <div className="border-2 border-dashed rounded-lg p-12 text-center text-muted-foreground">
              <p className="mb-4">No content blocks yet. Start building your article!</p>
              <p className="text-sm">Use the buttons above to add paragraphs, images, videos, and more.</p>
            </div>
          )}

          <DndContext sensors={sensors} collisionDetection={closestCenter} onDragEnd={onDragEnd}>
            <SortableContext items={contentBlocks.map((b) => b.id)} strategy={verticalListSortingStrategy}>
              <div className="space-y-3">
                {contentBlocks.map((block, index) => (
                  <SortableItem key={block.id} id={block.id}>
                    <div className="border border-border rounded-lg p-4 bg-muted/10 relative group hover:border-primary/50 transition-colors">
                      <div className="absolute top-2 right-2 flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                        <Button
                          type="button"
                          size="icon"
                          variant="ghost"
                          className="h-8 w-8"
                          onClick={() => removeBlock(block.id)}
                        >
                          <X className="w-4 h-4" />
                        </Button>
                      </div>

                      <div className="flex items-center gap-2 mb-3 cursor-grab active:cursor-grabbing">
                        <GripVertical className="w-5 h-5 text-muted-foreground" />
                        <span className="text-xs text-muted-foreground font-medium">
                          Block {index + 1} - Drag to reorder
                        </span>
                      </div>

                      {renderBlock(block)}
                    </div>
                  </SortableItem>
                ))}
              </div>
            </SortableContext>
          </DndContext>
        </div>

        <div className="flex gap-4 pt-4 border-t">
          <Button
            type="button"
            disabled={uploading}
            className="bg-gradient-to-r from-primary to-secondary hover:opacity-90"
            onClick={handleSubmit}
          >
            {uploading ? "Uploading..." : "Save Post"}
          </Button>
          <Button type="button" variant="outline" onClick={onCancel}>
            Cancel
          </Button>
        </div>
      </form>
    </div>
  );
};

export default NewsPostForm;