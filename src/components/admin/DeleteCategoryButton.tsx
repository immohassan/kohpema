"use client";

import { useTransition } from "react";
import { deleteCategory } from "@/lib/actions/categories";

export default function DeleteCategoryButton({
  id,
  name,
}: {
  id: string;
  name: string;
}) {
  const [pending, startTransition] = useTransition();

  return (
    <button
      disabled={pending}
      onClick={() => {
        if (!confirm(`Delete category "${name}"? Products will be uncategorized.`))
          return;
        startTransition(() => deleteCategory(id));
      }}
      className="text-xs uppercase tracking-wider text-red-600 hover:underline disabled:opacity-50"
    >
      {pending ? "..." : "Delete"}
    </button>
  );
}
