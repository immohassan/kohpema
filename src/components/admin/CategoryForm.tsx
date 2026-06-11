"use client";

import { useActionState, useState } from "react";
import { createCategory, updateCategory } from "@/lib/actions/categories";

type Props = {
  category?: {
    id: string;
    name: string;
    slug: string;
    description: string | null;
    image: string | null;
    published: boolean;
    sortOrder: number;
  };
};

export default function CategoryForm({ category }: Props) {
  const action = category ? updateCategory.bind(null, category.id) : createCategory;
  const [state, formAction, pending] = useActionState(action, {});
  const [image, setImage] = useState(category?.image ?? "");
  const [uploading, setUploading] = useState(false);
  const [uploadError, setUploadError] = useState<string | null>(null);

  async function handleUpload(files: FileList | null) {
    if (!files?.[0]) return;
    setUploading(true);
    setUploadError(null);
    try {
      const fd = new FormData();
      fd.append("file", files[0]);
      const res = await fetch("/api/upload", { method: "POST", body: fd });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error ?? "Upload failed");
      setImage(data.url);
    } catch (e) {
      setUploadError(e instanceof Error ? e.message : "Upload failed");
    } finally {
      setUploading(false);
    }
  }

  return (
    <form action={formAction} className="bg-white border border-neutral-200 p-6 space-y-4 max-w-xl">
      <div>
        <label className="label">Name *</label>
        <input name="name" className="input" defaultValue={category?.name} required />
      </div>
      <div>
        <label className="label">Slug (URL)</label>
        <input
          name="slug"
          className="input"
          defaultValue={category?.slug}
          placeholder="auto-generated from name"
        />
      </div>
      <div>
        <label className="label">Description</label>
        <textarea
          name="description"
          className="input min-h-24"
          defaultValue={category?.description ?? ""}
        />
      </div>
      <div>
        <label className="label">Image</label>
        <input type="hidden" name="image" value={image} />
        {image && (
          <div className="w-40 aspect-[4/3] border border-neutral-200 mb-2 overflow-hidden">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src={image} alt="" className="w-full h-full object-cover" />
          </div>
        )}
        <div className="flex gap-2 items-center">
          <label className="btn-outline !py-2 cursor-pointer">
            {uploading ? "Uploading..." : image ? "Replace Image" : "Upload Image"}
            <input
              type="file"
              accept="image/*"
              hidden
              onChange={(e) => handleUpload(e.target.files)}
            />
          </label>
          {image && (
            <button
              type="button"
              className="text-sm text-neutral-500 hover:text-red-600"
              onClick={() => setImage("")}
            >
              Remove
            </button>
          )}
        </div>
        {uploadError && <div className="text-red-600 text-sm mt-1">{uploadError}</div>}
      </div>
      <div>
        <label className="label">Sort Order</label>
        <input
          name="sortOrder"
          type="number"
          className="input !w-28"
          defaultValue={category?.sortOrder ?? 0}
        />
      </div>
      <label className="flex items-center gap-2 text-sm">
        <input
          type="checkbox"
          name="published"
          defaultChecked={category?.published ?? true}
        />
        Published
      </label>
      {state?.error && <div className="text-red-600 text-sm">{state.error}</div>}
      <button type="submit" disabled={pending || uploading} className="btn-accent">
        {pending ? "Saving..." : category ? "Save Changes" : "Create Category"}
      </button>
    </form>
  );
}
