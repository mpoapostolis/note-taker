import { FileText, Trash2, Calendar, Clock, Plus } from "lucide-react";
import Link from "next/link";
import CreateDocumentModal from "../components/CreateDocumentModal";
import { getAllDocs, type Document } from "../lib/db";
import { deleteDoc } from "../actions/delete-doc";
import { formatDistanceToNow } from "date-fns";

export default async function Home() {
  const docs = await getAllDocs();
  return (
    <div className="min-h-screen bg-gradient-to-br from-base-200 to-base-300">
      {/* Header */}
      <div className="navbar bg-base-100/80 backdrop-blur-sm border-b border-base-300/50 sticky top-0 z-50">
        <div className="navbar-start">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 bg-primary rounded-lg flex items-center justify-center">
              <FileText className="w-5 h-5 text-primary-content" />
            </div>
            <h1 className="text-xl font-bold text-base-content">Notes</h1>
          </div>
        </div>

        <div className="navbar-end">
          <label
            htmlFor="create-document-modal"
            className="btn btn-primary gap-2 shadow-lg hover:shadow-xl transition-all duration-200 hover:scale-105"
          >
            <Plus className="w-5 h-5" />
            <span className="hidden sm:inline font-semibold">New Document</span>
          </label>
        </div>
      </div>
      <CreateDocumentModal />

      {/* Main Content */}
      <div className="container mx-auto px-6 py-12 max-w-6xl">
        {/* Header Section */}
        <div className="mb-12">
          <div className="flex items-center justify-between mb-8">
            <div>
              <h2 className="text-4xl font-bold text-base-content mb-2">
                Your Documents
              </h2>
              <p className="text-lg text-base-content/70">
                {docs?.length || 0}{" "}
                {docs?.length === 1 ? "document" : "documents"} in your
                collection
              </p>
            </div>
          </div>
        </div>

        {/* Documents Grid */}
        {docs?.length === 0 ? (
          <div className="text-center py-24">
            <div className="w-32 h-32 mx-auto mb-8 bg-gradient-to-br from-primary/20 to-primary/10 rounded-3xl flex items-center justify-center">
              <FileText className="w-16 h-16 text-primary" />
            </div>
            <h3 className="text-2xl font-bold text-base-content mb-3">
              No documents yet
            </h3>
            <p className="text-base-content/60 mb-8 text-lg max-w-md mx-auto">
              Create your first document to start writing and organizing your
              thoughts
            </p>
            <CreateDocumentModal />
          </div>
        ) : (
          <div className="grid gap-6 md:grid-cols-2 xl:grid-cols-3">
            {docs?.map((doc: Document) => (
              <div
                key={doc.id}
                className="group card bg-base-100 shadow-lg hover:shadow-2xl transition-all duration-300 border border-base-200 hover:border-primary/20 hover:-translate-y-1"
              >
                <div className="card-body p-8">
                  <div className="flex items-start justify-between mb-4">
                    <Link href={`/doc/${doc.id}`} className="flex-1 min-w-0">
                      <div className="flex items-center gap-4 mb-4">
                        <div className="w-12 h-12 bg-primary/10 rounded-xl flex items-center justify-center group-hover:bg-primary/20 transition-colors">
                          <FileText className="w-6 h-6 text-primary" />
                        </div>
                        <div className="flex-1 min-w-0">
                          <h3 className="font-bold text-xl text-base-content truncate group-hover:text-primary transition-colors">
                            {doc.title || "Untitled Document"}
                          </h3>
                        </div>
                      </div>

                      <p className="text-base-content/70 leading-relaxed mb-6 line-clamp-3">
                        {doc.content
                          ? doc.content
                              .replace(/<[^>]*>?/g, "")
                              .substring(0, 120)
                              .trim() + (doc.content.length > 120 ? "..." : "")
                          : "No content yet. Click to start writing..."}
                      </p>

                      <div className="space-y-3">
                        <div className="flex items-center gap-2">
                          <div className="badge badge-primary badge-outline gap-1">
                            <FileText className="w-3 h-3" />
                            Document
                          </div>
                        </div>

                        <div className="grid grid-cols-1 gap-2 text-sm">
                          {doc.createdAt && (
                            <div className="flex items-center gap-2 text-base-content/60">
                              <Calendar className="w-4 h-4" />
                              <span>
                                Created{" "}
                                {formatDistanceToNow(new Date(doc.createdAt), {
                                  addSuffix: true,
                                })}
                              </span>
                            </div>
                          )}
                          {doc.updatedAt && (
                            <div className="flex items-center gap-2 text-base-content/60">
                              <Clock className="w-4 h-4" />
                              <span>
                                Updated{" "}
                                {formatDistanceToNow(new Date(doc.updatedAt), {
                                  addSuffix: true,
                                })}
                              </span>
                            </div>
                          )}
                        </div>
                      </div>
                    </Link>

                    <div className="dropdown dropdown-end">
                      <label
                        tabIndex={0}
                        className="btn btn-ghost btn-sm btn-circle hover:btn-error transition-colors opacity-0 group-hover:opacity-100"
                        title="Delete document"
                      >
                        <Trash2 className="w-4 h-4" />
                      </label>
                      <div className="dropdown-content card compact w-80 shadow-2xl bg-base-100 border border-base-300 mt-2">
                        <div className="card-body">
                          <div className="flex items-center gap-3 mb-2">
                            <div className="w-10 h-10 bg-error/10 rounded-lg flex items-center justify-center">
                              <Trash2 className="w-5 h-5 text-error" />
                            </div>
                            <h4 className="font-bold text-lg">
                              Delete document?
                            </h4>
                          </div>
                          <p className="text-base-content/70 mb-4">
                            &quot;{doc.title || "Untitled Document"}&quot; will
                            be permanently deleted. This action cannot be
                            undone.
                          </p>
                          <div className="card-actions justify-end gap-2">
                            <label className="btn btn-ghost">Cancel</label>
                            <form action={deleteDoc}>
                              <input type="hidden" name="id" value={doc.id} />
                              <button
                                type="submit"
                                className="btn btn-error gap-2"
                              >
                                <Trash2 className="w-4 h-4" />
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
