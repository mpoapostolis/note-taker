import { FileText, Trash2 } from "lucide-react";
import Link from "next/link";
import CreateDocumentModal from "../components/CreateDocumentModal";
import { getAllDocs, type Document } from "../lib/db";
import { deleteDoc } from "../actions/delete-doc";
import { formatDistanceToNow } from "date-fns";

export default async function Home() {
  const docs = await getAllDocs();

  return (
    <div className="min-h-screen bg-base-200">
      {/* Header */}
      <div className="navbar bg-base-100 border-b border-base-300">
        <div className="navbar-start">
          <h1 className="text-xl font-bold text-base-content">Notes</h1>
        </div>

        <div className="navbar-end">
          <CreateDocumentModal />
        </div>
      </div>

      {/* Main Content */}
      <div className="container mx-auto px-4 py-8 max-w-4xl">
        {/* Header Section */}
        <div className="mb-8">
          <div className="flex items-center justify-between mb-6">
            <div>
              <h2 className="text-3xl font-bold text-base-content">
                Your Documents
              </h2>
              <p className="text-base-content/60 mt-1">
                {docs?.length || 0}{" "}
                {docs?.length === 1 ? "document" : "documents"}
              </p>
            </div>
          </div>
        </div>

        {/* Documents Grid */}
        {docs?.length === 0 ? (
          <div className="text-center py-16">
            <div className="w-24 h-24 mx-auto mb-4 bg-base-300 rounded-full flex items-center justify-center">
              <FileText className="w-12 h-12 text-base-content/40" />
            </div>
            <h3 className="text-xl font-semibold text-base-content mb-2">
              No documents yet
            </h3>
            <p className="text-base-content/60 mb-6">
              Create your first document to get started
            </p>
            <CreateDocumentModal />
          </div>
        ) : (
          <div className="grid gap-4">
            {docs?.map((doc: Document) => (
              <div
                key={doc.id}
                className="card bg-base-100 shadow-sm hover:shadow-md transition-shadow"
              >
                <div className="card-body p-6">
                  <div className="flex items-start justify-between">
                    <Link href={`/doc/${doc.id}`} className="flex-1 min-w-0">
                      <div className="flex items-center gap-3 mb-2">
                        <FileText className="w-5 h-5 text-primary flex-shrink-0" />
                        <h3 className="font-semibold text-base-content truncate">
                          {doc.title}
                        </h3>
                      </div>
                      <p className="text-sm text-base-content/60">
                        {doc.content
                          ? `${doc.content
                              ?.replace(/<[^>]*>?/g, "")
                              .substring(0, 100)}...`
                          : "No content"}
                      </p>
                      <div className="flex items-center gap-4 mt-3">
                        <div className="badge badge-ghost badge-sm">
                          Document
                        </div>
                        {doc.createdAt && (
                          <span className="text-xs text-base-content/50">
                            Created{" "}
                            {formatDistanceToNow(new Date(doc.createdAt))}
                          </span>
                        )}
                        {doc.updatedAt && (
                          <span className="text-xs text-base-content/50">
                            Updated{" "}
                            {formatDistanceToNow(new Date(doc.updatedAt))}
                          </span>
                        )}
                      </div>
                    </Link>

                    <div className="dropdown dropdown-end">
                      <label
                        tabIndex={0}
                        className="btn btn-ghost btn-sm btn-circle"
                      >
                        <Trash2 className="w-4 h-4" />
                      </label>
                      <div className="dropdown-content card compact w-64 shadow bg-base-100 border border-base-300">
                        <div className="card-body">
                          <h4 className="font-semibold">Delete document?</h4>
                          <p className="text-sm text-base-content/60">
                            This action cannot be undone.
                          </p>
                          <div className="card-actions justify-end mt-4">
                            <label className="btn btn-ghost btn-sm">
                              Cancel
                            </label>
                            <form action={deleteDoc}>
                              <input type="hidden" name="id" value={doc.id} />
                              <button
                                type="submit"
                                className="btn btn-error btn-sm"
                              >
                                Delete
                              </button>
                            </form>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
