"use server";

import { createDoc as createDocInDb } from "../lib/db";
import { redirect } from "next/navigation";

export async function createDoc(formData: FormData) {
  const title = formData.get("title") as string;

  if (!title) {
    throw new Error("Title is required");
  }

  const doc = await createDocInDb(title);
  redirect(`/doc/${doc.id}`);
}
