import { neon } from "@neondatabase/serverless";

const sql = neon(process.env.DATABASE_URL as string);

export interface Document {
  id: string;
  title: string;
  content?: string;
  createdAt: Date;
  updatedAt: Date;
}

export async function getAllDocs(): Promise<Document[]> {
  const docs = await sql`SELECT * FROM docs`;
  return docs as Document[];
}

export async function getDocById(id: string): Promise<Document | null> {
  const [doc] = await sql`SELECT * FROM docs WHERE id = ${id}`;
  return (doc as Document) || null;
}

export async function createDoc(
  title: string,
  content?: string
): Promise<Document> {
  const [doc] = await sql`
    INSERT INTO docs (title, content)
    VALUES (${title}, ${content || ""})
    RETURNING *
  `;

  return doc as Document;
}

export async function updateDoc(
  id: string,
  title?: string,
  content?: string
): Promise<Document | null> {
  const now = new Date();

  // Use separate queries based on what needs to be updated
  let doc;

  if (title !== undefined && content !== undefined) {
    [doc] = await sql`
      UPDATE docs 
      SET title = ${title}, content = ${content}, updatedAt = ${now}
      WHERE id = ${id}
      RETURNING *
    `;
  } else if (title !== undefined) {
    [doc] = await sql`
      UPDATE docs 
      SET title = ${title}, updatedAt = ${now}
      WHERE id = ${id}
      RETURNING *
    `;
  } else if (content !== undefined) {
    [doc] = await sql`
      UPDATE docs 
      SET content = ${content}, updatedAt = ${now}
      WHERE id = ${id}
      RETURNING *
    `;
  } else {
    return null;
  }

  return (doc as Document) || null;
}

export async function deleteDoc(id: string): Promise<boolean> {
  const result = await sql`DELETE FROM docs WHERE id = ${id}`;
  return result.length > 0;
}
