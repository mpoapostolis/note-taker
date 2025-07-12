import { createDoc } from "@/actions/create-doc";
import { Plus } from "lucide-react";

export default function CreateDocumentModal() {
  return (
    <>
      <label htmlFor="create-document-modal" className="btn btn-primary gap-2">
        <Plus className="w-4 h-4" />
        <span className="hidden sm:inline">New Document</span>
      </label>

      <input
        type="checkbox"
        id="create-document-modal"
        className="modal-toggle"
      />

      <div className="modal modal-bottom sm:modal-middle">
        <form className="modal-box" action={createDoc}>
          <h3 className="font-bold text-lg mb-4 text-base-content">
            Create new document
          </h3>

          <div className="form-control w-full">
            <label className="label">
              <span className="label-text">Document title</span>
            </label>
            <input
              type="text"
              name="title"
              placeholder="Enter document title..."
              className="input input-bordered w-full"
              autoFocus
              required
            />
          </div>

          <div className="modal-action">
            <label htmlFor="create-document-modal" className="btn btn-ghost">
              Cancel
            </label>
            <button className="btn btn-primary" type="submit">
              Create Document
            </button>
          </div>
        </form>
        <label className="modal-backdrop" htmlFor="create-document-modal">
          Close
        </label>
      </div>
    </>
  );
}
