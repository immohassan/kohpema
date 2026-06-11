"use client";

import { useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import {
  createProduct,
  updateProduct,
  deleteProduct,
  type ProductPayload,
} from "@/lib/actions/products";

type OptionRow = { name: string; values: string };
type VariantRow = {
  title: string;
  options: Record<string, string>;
  price: string;
  sku: string;
  stock: string;
};

type Props = {
  categories: { id: string; name: string }[];
  product?: {
    id: string;
    name: string;
    slug: string;
    description: string;
    price: number;
    comparePrice: number | null;
    sku: string | null;
    stock: number;
    published: boolean;
    featured: boolean;
    categoryId: string | null;
    specs: string[];
    images: { url: string; alt: string | null }[];
    options: { name: string; values: string[] }[];
    variants: {
      title: string;
      options: Record<string, string>;
      price: number | null;
      sku: string | null;
      stock: number;
    }[];
  };
};

export default function ProductForm({ categories, product }: Props) {
  const router = useRouter();
  const [pending, startTransition] = useTransition();
  const [error, setError] = useState<string | null>(null);
  const [saved, setSaved] = useState(false);

  const [name, setName] = useState(product?.name ?? "");
  const [slug, setSlug] = useState(product?.slug ?? "");
  const [description, setDescription] = useState(product?.description ?? "");
  const [price, setPrice] = useState(product ? String(product.price) : "");
  const [comparePrice, setComparePrice] = useState(
    product?.comparePrice != null ? String(product.comparePrice) : ""
  );
  const [sku, setSku] = useState(product?.sku ?? "");
  const [stock, setStock] = useState(product ? String(product.stock) : "0");
  const [published, setPublished] = useState(product?.published ?? true);
  const [featured, setFeatured] = useState(product?.featured ?? false);
  const [categoryId, setCategoryId] = useState(product?.categoryId ?? "");
  const [specs, setSpecs] = useState<string[]>(product?.specs ?? []);
  const [specInput, setSpecInput] = useState("");
  const [images, setImages] = useState<{ url: string; alt: string | null }[]>(
    product?.images ?? []
  );
  const [uploading, setUploading] = useState(false);
  const [options, setOptions] = useState<OptionRow[]>(
    product?.options.map((o) => ({ name: o.name, values: o.values.join(", ") })) ?? []
  );
  const [variants, setVariants] = useState<VariantRow[]>(
    product?.variants.map((v) => ({
      title: v.title,
      options: v.options,
      price: v.price != null ? String(v.price) : "",
      sku: v.sku ?? "",
      stock: String(v.stock),
    })) ?? []
  );

  function parsedOptions(): { name: string; values: string[] }[] {
    return options
      .map((o) => ({
        name: o.name.trim(),
        values: o.values
          .split(",")
          .map((v) => v.trim())
          .filter(Boolean),
      }))
      .filter((o) => o.name && o.values.length > 0);
  }

  function generateVariants() {
    const opts = parsedOptions();
    if (opts.length === 0) {
      setVariants([]);
      return;
    }
    let combos: Record<string, string>[] = [{}];
    for (const opt of opts) {
      combos = combos.flatMap((c) =>
        opt.values.map((v) => ({ ...c, [opt.name]: v }))
      );
    }
    setVariants((prev) =>
      combos.map((combo) => {
        const title = Object.values(combo).join(" / ");
        const existing = prev.find((v) => v.title === title);
        return (
          existing ?? { title, options: combo, price: "", sku: "", stock: "0" }
        );
      })
    );
  }

  async function handleUpload(files: FileList | null) {
    if (!files || files.length === 0) return;
    setUploading(true);
    setError(null);
    try {
      for (const file of Array.from(files)) {
        const fd = new FormData();
        fd.append("file", file);
        const res = await fetch("/api/upload", { method: "POST", body: fd });
        const data = await res.json();
        if (!res.ok) throw new Error(data.error ?? "Upload failed");
        setImages((prev) => [...prev, { url: data.url, alt: null }]);
      }
    } catch (e) {
      setError(e instanceof Error ? e.message : "Upload failed");
    } finally {
      setUploading(false);
    }
  }

  function payload(): ProductPayload {
    return {
      name,
      slug,
      description,
      price: parseFloat(price),
      comparePrice: comparePrice ? parseFloat(comparePrice) : null,
      sku: sku || null,
      stock: parseInt(stock) || 0,
      published,
      featured,
      categoryId: categoryId || null,
      specs,
      images,
      options: parsedOptions(),
      variants: variants.map((v) => ({
        title: v.title,
        options: v.options,
        price: v.price ? parseFloat(v.price) : null,
        sku: v.sku || null,
        stock: parseInt(v.stock) || 0,
      })),
    };
  }

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError(null);
    setSaved(false);
    startTransition(async () => {
      const result = product
        ? await updateProduct(product.id, payload())
        : await createProduct(payload());
      if (result?.error) setError(result.error);
      else if (product) {
        setSaved(true);
        router.refresh();
      }
    });
  }

  function handleDelete() {
    if (!product) return;
    if (!confirm(`Delete "${product.name}"? This cannot be undone.`)) return;
    startTransition(async () => {
      await deleteProduct(product.id);
    });
  }

  return (
    <form onSubmit={handleSubmit} className="grid lg:grid-cols-3 gap-6 items-start">
      {/* Main column */}
      <div className="lg:col-span-2 space-y-6">
        <section className="bg-white border border-neutral-200 p-6 space-y-4">
          <div>
            <label className="label">Name *</label>
            <input
              className="input"
              value={name}
              onChange={(e) => setName(e.target.value)}
              required
            />
          </div>
          <div>
            <label className="label">Slug (URL)</label>
            <input
              className="input"
              value={slug}
              onChange={(e) => setSlug(e.target.value)}
              placeholder="auto-generated from name"
            />
          </div>
          <div>
            <label className="label">Description</label>
            <textarea
              className="input min-h-32"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
            />
          </div>
        </section>

        {/* Images */}
        <section className="bg-white border border-neutral-200 p-6">
          <h3 className="font-heading font-semibold uppercase tracking-widest text-sm mb-4">
            Images
          </h3>
          <div className="grid grid-cols-3 sm:grid-cols-5 gap-3 mb-4">
            {images.map((img, i) => (
              <div key={img.url + i} className="relative group aspect-square border border-neutral-200">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img src={img.url} alt="" className="w-full h-full object-cover" />
                <button
                  type="button"
                  onClick={() => setImages(images.filter((_, j) => j !== i))}
                  className="absolute top-1 right-1 bg-black/70 text-white w-6 h-6 text-xs opacity-0 group-hover:opacity-100"
                >
                  ✕
                </button>
                {i > 0 && (
                  <button
                    type="button"
                    title="Move left"
                    onClick={() => {
                      const next = [...images];
                      [next[i - 1], next[i]] = [next[i], next[i - 1]];
                      setImages(next);
                    }}
                    className="absolute bottom-1 left-1 bg-black/70 text-white w-6 h-6 text-xs opacity-0 group-hover:opacity-100"
                  >
                    ←
                  </button>
                )}
              </div>
            ))}
          </div>
          <label className="btn-outline !py-2 cursor-pointer">
            {uploading ? "Uploading..." : "Upload Images"}
            <input
              type="file"
              accept="image/*"
              multiple
              hidden
              onChange={(e) => handleUpload(e.target.files)}
            />
          </label>
        </section>

        {/* Specs */}
        <section className="bg-white border border-neutral-200 p-6">
          <h3 className="font-heading font-semibold uppercase tracking-widest text-sm mb-1">
            Spec Badges
          </h3>
          <p className="text-xs text-neutral-500 mb-4">
            Short highlights shown on product cards, e.g. “450 LUMENS”, “IPX7”.
          </p>
          <div className="flex flex-wrap gap-2 mb-3">
            {specs.map((s, i) => (
              <span
                key={s + i}
                className="border border-neutral-300 px-3 py-1 text-xs uppercase tracking-wider inline-flex items-center gap-2"
              >
                {s}
                <button
                  type="button"
                  onClick={() => setSpecs(specs.filter((_, j) => j !== i))}
                  className="text-neutral-400 hover:text-red-600"
                >
                  ✕
                </button>
              </span>
            ))}
          </div>
          <div className="flex gap-2">
            <input
              className="input"
              value={specInput}
              onChange={(e) => setSpecInput(e.target.value)}
              placeholder="e.g. 450 LUMENS"
              onKeyDown={(e) => {
                if (e.key === "Enter") {
                  e.preventDefault();
                  if (specInput.trim()) {
                    setSpecs([...specs, specInput.trim().toUpperCase()]);
                    setSpecInput("");
                  }
                }
              }}
            />
            <button
              type="button"
              className="btn-primary !py-2"
              onClick={() => {
                if (specInput.trim()) {
                  setSpecs([...specs, specInput.trim().toUpperCase()]);
                  setSpecInput("");
                }
              }}
            >
              Add
            </button>
          </div>
        </section>

        {/* Options + variants */}
        <section className="bg-white border border-neutral-200 p-6">
          <h3 className="font-heading font-semibold uppercase tracking-widest text-sm mb-1">
            Options & Variants
          </h3>
          <p className="text-xs text-neutral-500 mb-4">
            Define options (e.g. Size, Color) and their comma-separated values,
            then generate variants.
          </p>
          {options.map((opt, i) => (
            <div key={i} className="flex gap-2 mb-2">
              <input
                className="input !w-40"
                placeholder="Option name"
                value={opt.name}
                onChange={(e) =>
                  setOptions(
                    options.map((o, j) => (j === i ? { ...o, name: e.target.value } : o))
                  )
                }
              />
              <input
                className="input"
                placeholder="Values, comma separated (e.g. S, M, L)"
                value={opt.values}
                onChange={(e) =>
                  setOptions(
                    options.map((o, j) => (j === i ? { ...o, values: e.target.value } : o))
                  )
                }
              />
              <button
                type="button"
                className="text-neutral-400 hover:text-red-600 px-2"
                onClick={() => setOptions(options.filter((_, j) => j !== i))}
              >
                ✕
              </button>
            </div>
          ))}
          <div className="flex gap-2 mt-3">
            <button
              type="button"
              className="btn-outline !py-2"
              onClick={() => setOptions([...options, { name: "", values: "" }])}
            >
              + Add Option
            </button>
            <button
              type="button"
              className="btn-primary !py-2"
              onClick={generateVariants}
            >
              Generate Variants
            </button>
          </div>

          {variants.length > 0 && (
            <div className="mt-6 overflow-x-auto">
              <table className="w-full text-sm min-w-125">
                <thead>
                  <tr className="text-left text-xs uppercase tracking-wider text-neutral-500 border-b border-neutral-200">
                    <th className="py-2 pr-3">Variant</th>
                    <th className="py-2 pr-3">Price override</th>
                    <th className="py-2 pr-3">SKU</th>
                    <th className="py-2 pr-3">Stock</th>
                    <th></th>
                  </tr>
                </thead>
                <tbody>
                  {variants.map((v, i) => (
                    <tr key={v.title} className="border-b border-neutral-100">
                      <td className="py-2 pr-3 font-semibold">{v.title}</td>
                      <td className="py-2 pr-3">
                        <input
                          className="input !w-28"
                          placeholder="base price"
                          value={v.price}
                          onChange={(e) =>
                            setVariants(
                              variants.map((x, j) =>
                                j === i ? { ...x, price: e.target.value } : x
                              )
                            )
                          }
                        />
                      </td>
                      <td className="py-2 pr-3">
                        <input
                          className="input !w-32"
                          value={v.sku}
                          onChange={(e) =>
                            setVariants(
                              variants.map((x, j) =>
                                j === i ? { ...x, sku: e.target.value } : x
                              )
                            )
                          }
                        />
                      </td>
                      <td className="py-2 pr-3">
                        <input
                          className="input !w-20"
                          type="number"
                          value={v.stock}
                          onChange={(e) =>
                            setVariants(
                              variants.map((x, j) =>
                                j === i ? { ...x, stock: e.target.value } : x
                              )
                            )
                          }
                        />
                      </td>
                      <td className="py-2">
                        <button
                          type="button"
                          className="text-neutral-400 hover:text-red-600 px-2"
                          onClick={() => setVariants(variants.filter((_, j) => j !== i))}
                        >
                          ✕
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </section>
      </div>

      {/* Side column */}
      <div className="space-y-6">
        <section className="bg-white border border-neutral-200 p-6 space-y-4">
          <div>
            <label className="label">Price *</label>
            <input
              className="input"
              type="number"
              step="0.01"
              min="0"
              value={price}
              onChange={(e) => setPrice(e.target.value)}
              required
            />
          </div>
          <div>
            <label className="label">Compare-at Price</label>
            <input
              className="input"
              type="number"
              step="0.01"
              min="0"
              value={comparePrice}
              onChange={(e) => setComparePrice(e.target.value)}
            />
          </div>
          <div>
            <label className="label">SKU</label>
            <input
              className="input"
              value={sku}
              onChange={(e) => setSku(e.target.value)}
            />
          </div>
          <div>
            <label className="label">Stock (if no variants)</label>
            <input
              className="input"
              type="number"
              value={stock}
              onChange={(e) => setStock(e.target.value)}
            />
          </div>
          <div>
            <label className="label">Category</label>
            <select
              className="input"
              value={categoryId}
              onChange={(e) => setCategoryId(e.target.value)}
            >
              <option value="">— None —</option>
              {categories.map((c) => (
                <option key={c.id} value={c.id}>
                  {c.name}
                </option>
              ))}
            </select>
          </div>
          <label className="flex items-center gap-2 text-sm">
            <input
              type="checkbox"
              checked={published}
              onChange={(e) => setPublished(e.target.checked)}
            />
            Published
          </label>
          <label className="flex items-center gap-2 text-sm">
            <input
              type="checkbox"
              checked={featured}
              onChange={(e) => setFeatured(e.target.checked)}
            />
            Featured (shown on homepage)
          </label>
        </section>

        {error && <div className="text-red-600 text-sm">{error}</div>}
        {saved && <div className="text-green-700 text-sm">Saved ✓</div>}

        <div className="space-y-3">
          <button type="submit" disabled={pending || uploading} className="btn-accent w-full">
            {pending ? "Saving..." : product ? "Save Changes" : "Create Product"}
          </button>
          {product && (
            <button
              type="button"
              onClick={handleDelete}
              disabled={pending}
              className="w-full border-2 border-red-600 text-red-600 uppercase tracking-widest text-sm font-semibold px-8 py-3 hover:bg-red-600 hover:text-white transition-colors"
            >
              Delete Product
            </button>
          )}
        </div>
      </div>
    </form>
  );
}
