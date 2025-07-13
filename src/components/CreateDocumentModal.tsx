import { createDoc } from "@/actions/create-doc";
import { Plus, FileText, Sparkles } from "lucide-react";

export default function CreateDocumentModal() {
  return (
    <>
      <input
        type="checkbox"
        id="create-document-modal"
        className="modal-toggle"
      />

      <div className="modal modal-bottom sm:modal-middle">
        <form
          className="modal-box max-w-md border-0 shadow-2xl bg-base-100"
          action={createDoc}
        >
          {/* Header */}
          <div className="text-center mb-8">
            <div className="w-16 h-16 mx-auto mb-4 bg-gradient-to-br from-primary/20 to-primary/10 rounded-2xl flex items-center justify-center">
              <FileText className="w-8 h-8 text-primary" />
            </div>
            <h3 className="font-bold text-2xl text-base-content mb-2">
              Create new document
            </h3>
            <p className="text-base-content/60">
              Start writing something amazing
            </p>
          </div>

          {/* Form */}
          <div className="space-y-6">
            <div className="form-control">
              <label className="label flex justify-between">
                <span className="label-text font-medium text-base-content/80">
                  Document title
                </span>
                <span className="label-text-alt text-base-content/40">
                  <Sparkles className="w-3 h-3 inline mr-1" />
                  Required
                </span>
              </label>
              <br />
              <input
                type="text"
                name="title"
                placeholder="My awesome document..."
                className="input input-bordered input-lg w-full focus:border-primary focus:outline-none transition-colors bg-base-100 border-base-300"
                autoFocus
                required
              />
            </div>
          </div>

          {/* Actions */}
          <div className="modal-action mt-8 gap-3">
            <label
              htmlFor="create-document-modal"
              className="btn btn-ghost btn-lg flex-1 hover:bg-base-200"
            >
              Cancel
            </label>
            <button
              className="btn btn-primary btn-lg flex-1 gap-2 shadow-lg hover:shadow-xl transition-all duration-200"
              type="submit"
            >
              <Plus className="w-5 h-5" />
              Create Document
            </button>
          </div>
        </form>

        <label
          className="modal-backdrop bg-black/50 backdrop-blur-sm"
          htmlFor="create-document-modal"
        >
          Close
        </label>
      </div>
    </>
  );
}
