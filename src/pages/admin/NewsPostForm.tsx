import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Upload, X, Plus, GripVertical, Link } from "lucide-react";
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

interface Section {
  id: string;
  subtitle: string;
  description: string;
  images: string[];
  video: string;
  videoType: "upload" | "url";
}

interface NewsPostFormProps {
  editingPost?: any;
  onSuccess: () => void;
  onCancel: () => void;
}

const NewsPostForm = ({ editingPost, onSuccess, onCancel }: NewsPostFormProps) => {
  const [title, setTitle] = useState("");
  const [sections, setSections] = useState<Section[]>([]);
  const [metaTitle, setMetaTitle] = useState("");
  const [metaDescription, setMetaDescription] = useState("");
  const [uploading, setUploading] = useState(false);

  const { toast } = useToast();

  const sensors = useSensors(useSensor(PointerSensor, { activationConstraint: { distance: 5 } }));

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
          setSections(parsedSections);
        } catch (e) {
          console.error("Failed to parse sections", e);
          setSections([]);
        }
      } else {
        setSections([]);
      }
    }
  }, [editingPost]);

  const addSection = () => {
    setSections([
      ...sections,
      {
        id: Date.now().toString(),
        subtitle: "",
        description: "",
        images: [],
        video: "",
        videoType: "upload",
      },
    ]);
  };

  const removeSection = (id: string) => {
    setSections(sections.filter((sec) => sec.id !== id));
  };

  const updateSection = (id: string, updated: Partial<Section>) => {
    setSections(sections.map((sec) => (sec.id === id ? { ...sec, ...updated } : sec)));
  };

  const handleImageUpload = async (file: File, sectionId: string) => {
    if (!file.type.startsWith("image/"))
      return toast({ title: "Invalid file", description: "Select an image", variant: "destructive" });
    if (file.size > 5 * 1024 * 1024)
      return toast({ title: "File too large", description: "Max 5MB", variant: "destructive" });

    setUploading(true);
    const { url, error } = await newsPostService.uploadFile(file, "post-images");
    if (error) {
      toast({ title: "Upload Error", description: error.message, variant: "destructive" });
    } else if (url) {
      const sec = sections.find((s) => s.id === sectionId)!;
      updateSection(sectionId, { images: [...sec.images, url] });
    }
    setUploading(false);
  };

  const addImageUrl = (imageUrl: string, sectionId: string) => {
    if (!imageUrl.trim()) return;
    try {
      new URL(imageUrl);
    } catch {
      toast({ title: "Invalid URL", description: "Please enter a valid image URL", variant: "destructive" });
      return;
    }
    const sec = sections.find((s) => s.id === sectionId)!;
    updateSection(sectionId, { images: [...sec.images, imageUrl] });
  };

  const handleVideoUpload = async (file: File, sectionId: string) => {
    if (!file.type.startsWith("video/"))
      return toast({ title: "Invalid file", description: "Select a video", variant: "destructive" });
    if (file.size > 50 * 1024 * 1024)
      return toast({ title: "File too large", description: "Max 50MB", variant: "destructive" });

    setUploading(true);
    const { url, error } = await newsPostService.uploadFile(file, "post-videos");
    if (error) {
      toast({ title: "Upload Error", description: error.message, variant: "destructive" });
    } else if (url) {
      updateSection(sectionId, { video: url, videoType: "upload" });
    }
    setUploading(false);
  };

  const addVideoUrl = (url: string, sectionId: string) => {
    if (!url.trim()) return;
    try {
      new URL(url);
    } catch {
      toast({ title: "Invalid URL", description: "Please enter a valid video URL", variant: "destructive" });
      return;
    }
    updateSection(sectionId, { video: url, videoType: "url" });
  };

  const onDragEndSections = (event: any) => {
    const { active, over } = event;
    if (active.id !== over?.id) {
      const oldIndex = sections.findIndex((s) => s.id === active.id);
      const newIndex = sections.findIndex((s) => s.id === over.id);
      setSections(arrayMove(sections, oldIndex, newIndex));
    }
  };

  const onDragEndImages = (event: any, sectionId: string) => {
    const { active, over } = event;
    if (!over || active.id === over.id) return;

    const sec = sections.find((s) => s.id === sectionId)!;
    const oldIndex = sec.images.findIndex((img) => img === active.id);
    const newIndex = sec.images.findIndex((img) => img === over.id);
    const newImages = arrayMove(sec.images, oldIndex, newIndex);

    updateSection(sectionId, { images: newImages });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim())
      return toast({ title: "Title required", variant: "destructive" });

    const filteredSections = sections.map((sec) => ({
      ...sec,
      subtitle: sec.subtitle?.trim() || "",
      description: sec.description?.trim() || "",
      images: sec.images || [],
      video: sec.video || "",
      videoType: sec.videoType || "upload",
    }));

    const postData: NewsPostCreate | NewsPostUpdate = {
      title,
      sections: filteredSections.length > 0 ? filteredSections : null,
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

  return (
    <div className="bg-card rounded-2xl p-8 shadow-xl border border-border/50">
      <h2 className="text-3xl font-bold mb-6">{editingPost ? "Edit News Post" : "Create News Post"}</h2>

      <form onSubmit={handleSubmit} className="space-y-6">
        <Input
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          className="h-12"
          placeholder="Post Title"
          required
        />

        <Input
          value={metaTitle}
          onChange={(e) => setMetaTitle(e.target.value)}
          maxLength={60}
          className="h-12"
          placeholder="Meta Title (SEO)"
        />
        <Textarea
          value={metaDescription}
          onChange={(e) => setMetaDescription(e.target.value)}
          maxLength={160}
          rows={3}
          placeholder="Meta Description (SEO)"
        />

        {/* Sections */}
        <div>
          <div className="flex justify-between mb-2">
            <h3 className="font-semibold text-lg">Sections</h3>
            <Button type="button" size="sm" variant="outline" onClick={addSection}>
              <Plus className="w-4 h-4 mr-1" />
              Add Section
            </Button>
          </div>

          <DndContext sensors={sensors} collisionDetection={closestCenter} onDragEnd={onDragEndSections}>
            <SortableContext items={sections.map((s) => s.id)} strategy={verticalListSortingStrategy}>
              {sections.map((sec) => (
                <SortableItem key={sec.id} id={sec.id}>
                  <div className="border border-border rounded-lg p-4 space-y-3 bg-muted/10 relative">
                    <div className="absolute top-2 right-2">
                      <Button type="button" size="icon" variant="ghost" onClick={() => removeSection(sec.id)}>
                        <X className="w-4 h-4" />
                      </Button>
                    </div>

                    <div className="flex items-center gap-2 mb-2 cursor-grab">
                      <GripVertical className="w-5 h-5 text-muted-foreground" />
                      <span className="text-muted-foreground font-medium">Drag to reorder section</span>
                    </div>

                    <Input
                      value={sec.subtitle}
                      onChange={(e) => updateSection(sec.id, { subtitle: e.target.value })}
                      placeholder="Section subtitle"
                      className="h-10"
                    />
                    <Textarea
                      value={sec.description}
                      onChange={(e) => updateSection(sec.id, { description: e.target.value })}
                      rows={4}
                      placeholder="Section description"
                    />

                    {/* Images */}
                    <div className="space-y-2">
                      <div className="flex items-center gap-2">
                        <span className="text-sm font-medium">Images</span>
                        <div className="flex gap-2">
                          <label className="flex items-center justify-center w-8 h-8 border rounded-md cursor-pointer hover:bg-muted">
                            <Upload className="w-4 h-4" />
                            <input
                              type="file"
                              accept="image/*"
                              className="hidden"
                              onChange={(e) => e.target.files?.[0] && handleImageUpload(e.target.files[0], sec.id)}
                            />
                          </label>

                          <div className="flex items-center">
                            <Input
                              type="text"
                              placeholder="Image URL"
                              className="h-8 text-sm w-40"
                              onKeyDown={(e) => {
                                if (e.key === "Enter") {
                                  e.preventDefault();
                                  const target = e.target as HTMLInputElement;
                                  addImageUrl(target.value, sec.id);
                                  target.value = "";
                                }
                              }}
                            />
                            <Button
                              type="button"
                              size="icon"
                              variant="ghost"
                              className="h-8 w-8"
                              onClick={(e) => {
                                const input = (e.target as HTMLElement).previousElementSibling as HTMLInputElement;
                                if (input) {
                                  addImageUrl(input.value, sec.id);
                                  input.value = "";
                                }
                              }}
                            >
                              <Link className="w-4 h-4" />
                            </Button>
                          </div>
                        </div>
                      </div>

                      <DndContext
                        sensors={sensors}
                        collisionDetection={closestCenter}
                        onDragEnd={(e) => onDragEndImages(e, sec.id)}
                      >
                        <SortableContext items={sec.images} strategy={verticalListSortingStrategy}>
                          <div className="flex flex-wrap gap-2">
                            {sec.images.map((img) => (
                              <SortableItem key={img} id={img}>
                                <div className="relative">
                                  <img src={img} className="w-24 h-24 object-cover rounded-md border" />
                                  <Button
                                    type="button"
                                    size="icon"
                                    variant="ghost"
                                    className="absolute top-0 right-0"
                                    onClick={() =>
                                      updateSection(sec.id, {
                                        images: sec.images.filter((i) => i !== img),
                                      })
                                    }
                                  >
                                    <X className="w-3 h-3" />
                                  </Button>
                                </div>
                              </SortableItem>
                            ))}
                          </div>
                        </SortableContext>
                      </DndContext>
                    </div>

                    {/* Video */}
                    <div className="space-y-2">
                      <div className="flex items-center gap-2">
                        <span className="text-sm font-medium">Video</span>
                        <div className="flex gap-2">
                          <label className="flex items-center justify-center w-8 h-8 border rounded-md cursor-pointer hover:bg-muted">
                            <Upload className="w-4 h-4" />
                            <input
                              type="file"
                              accept="video/*"
                              className="hidden"
                              onChange={(e) =>
                                e.target.files?.[0] && handleVideoUpload(e.target.files[0], sec.id)
                              }
                            />
                          </label>

                          <div className="flex items-center">
                            <Input
                              type="text"
                              placeholder="Video URL (YouTube, etc.)"
                              className="h-8 text-sm w-40"
                              onKeyDown={(e) => {
                                if (e.key === "Enter") {
                                  e.preventDefault();
                                  const target = e.target as HTMLInputElement;
                                  addVideoUrl(target.value, sec.id);
                                  target.value = "";
                                }
                              }}
                            />
                            <Button
                              type="button"
                              size="icon"
                              variant="ghost"
                              className="h-8 w-8"
                              onClick={(e) => {
                                const input = (e.target as HTMLElement).previousElementSibling as HTMLInputElement;
                                if (input) {
                                  addVideoUrl(input.value, sec.id);
                                  input.value = "";
                                }
                              }}
                            >
                              <Link className="w-4 h-4" />
                            </Button>
                          </div>
                        </div>
                      </div>

                      {sec.video ? (
                        <div className="flex items-center gap-2">
                          {sec.videoType === "upload" ? (
                            <video
                              src={sec.video}
                              controls
                              className="w-64 h-36 object-cover rounded-md"
                            />
                          ) : (
                            <div className="w-64 h-36 bg-muted rounded-md flex items-center justify-center">
                              <span className="text-sm text-muted-foreground">
                                External Video: {sec.video}
                              </span>
                            </div>
                          )}
                          <Button
                            type="button"
                            size="icon"
                            variant="ghost"
                            onClick={() => updateSection(sec.id, { video: "", videoType: "upload" })}
                          >
                            <X className="w-4 h-4" />
                          </Button>
                        </div>
                      ) : null}
                    </div>
                  </div>
                </SortableItem>
              ))}
            </SortableContext>
          </DndContext>
        </div>

        <div className="flex gap-4 pt-4">
          <Button type="submit" className="bg-gradient-to-r from-primary to-secondary hover:opacity-90">
            Save Post
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
