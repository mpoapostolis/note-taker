"use server";

import { deleteDoc as deleteDocFromDb } from "../lib/db";
import { redirect } from "next/navigation";

export async function deleteDoc(formData: FormData) {
  const id = formData.get("id") as string;

  if (!id) {
    throw new Error("Document ID is required");
  }

  await deleteDocFromDb(id);
  redirect("/");
}
