"use client";

import { useRef, useState, useTransition } from "react";
import { useFormStatus } from "react-dom";
import { Upload, FileText, Image as ImageIcon, Download, Trash2, X, Eye } from "lucide-react";
import { uploadLeadFile, deleteLeadFile } from "@/app/admin/actions";
import { fmtSize } from "@/lib/crm-format";

type LeadFile = {
  id: string;
  name: string;
  contentType: string | null;
  size: number | null;
};

const isImage = (t: string | null) => !!t && t.startsWith("image/");
const isPdf = (t: string | null) => t === "application/pdf";
const canPreview = (t: string | null) => isImage(t) || isPdf(t);
const fileHref = (id: string, dl = false) => `/admin/files/${id}${dl ? "?dl=1" : ""}`;

function UploadButton() {
  const { pending } = useFormStatus();
  return (
    <button
      type="submit"
      disabled={pending}
      className="crm-btn crm-btn-primary"
    >
      <Upload className="size-3.5" strokeWidth={1.75} />
      {pending ? "Uploading…" : "Upload"}
    </button>
  );
}

export function Files({ leadId, files, editable = true }: { leadId: string; files: LeadFile[]; editable?: boolean }) {
  const formRef = useRef<HTMLFormElement>(null);
  const [preview, setPreview] = useState<LeadFile | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [, startTransition] = useTransition();

  return (
    <div>
      {editable && (
        <>
          <form
            ref={formRef}
            action={async (fd) => {
              setError(null);
              try {
                await uploadLeadFile(leadId, fd);
                formRef.current?.reset();
              } catch {
                setError("Upload failed. Check the file (max 10MB) and try again.");
              }
            }}
            className="flex items-center gap-2"
          >
            <input
              type="file"
              name="file"
              required
              className="block w-full text-[13px] text-[var(--crm-ink-soft)] file:mr-3 file:rounded-md file:border-0 file:bg-[var(--crm-surface-2)] file:px-3 file:py-1.5 file:text-[12.5px] file:font-medium file:text-[var(--crm-ink)] hover:file:bg-[var(--crm-line)]"
            />
            <UploadButton />
          </form>
          <p className="mt-1.5 text-[11.5px] text-[var(--crm-ink-mute)]">Any file type, up to 10MB.</p>
          {error && <p className="mt-1.5 text-[12px] text-[var(--crm-wine)]">{error}</p>}
        </>
      )}

      {files.length === 0 && !editable && (
        <p className="text-[13px] text-[var(--crm-ink-mute)]">No files yet.</p>
      )}

      {files.length > 0 && (
        <ul className={`${editable ? "mt-4" : ""} divide-y divide-[var(--crm-line)] overflow-hidden rounded-lg border border-[var(--crm-line)]`}>
          {files.map((f) => (
            <li key={f.id} className="flex items-center gap-3 bg-[var(--crm-surface)] px-3.5 py-2.5">
              <span className="text-[var(--crm-ink-mute)]">
                {isImage(f.contentType) ? (
                  <ImageIcon className="size-4" strokeWidth={1.6} />
                ) : (
                  <FileText className="size-4" strokeWidth={1.6} />
                )}
              </span>
              <div className="min-w-0 flex-1">
                <p className="truncate text-[13px] font-medium text-[var(--crm-ink)]">{f.name}</p>
                {f.size != null && <p className="text-[11.5px] text-[var(--crm-ink-mute)]">{fmtSize(f.size)}</p>}
              </div>
              <div className="flex shrink-0 items-center gap-1">
                {canPreview(f.contentType) && (
                  <button
                    type="button"
                    onClick={() => setPreview(f)}
                    title="Preview"
                    className="rounded-md p-1.5 text-[var(--crm-ink-soft)] transition-colors hover:bg-[var(--crm-surface-2)] hover:text-[var(--crm-ink)]"
                  >
                    <Eye className="size-4" strokeWidth={1.7} />
                  </button>
                )}
                <a
                  href={fileHref(f.id, true)}
                  title="Download"
                  className="rounded-md p-1.5 text-[var(--crm-ink-soft)] transition-colors hover:bg-[var(--crm-surface-2)] hover:text-[var(--crm-ink)]"
                >
                  <Download className="size-4" strokeWidth={1.7} />
                </a>
                {editable && (
                  <button
                    type="button"
                    onClick={() => {
                      if (confirm(`Delete ${f.name}?`))
                        startTransition(() => deleteLeadFile(f.id, leadId));
                    }}
                    title="Delete"
                    className="rounded-md p-1.5 text-[var(--crm-ink-soft)] transition-colors hover:bg-[var(--crm-wine-tint)] hover:text-[var(--crm-wine)]"
                  >
                    <Trash2 className="size-4" strokeWidth={1.7} />
                  </button>
                )}
              </div>
            </li>
          ))}
        </ul>
      )}

      {preview && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-[rgba(20,18,14,0.55)] p-4 backdrop-blur-sm" onClick={() => setPreview(null)}>
          <div className="relative flex max-h-[90vh] w-full max-w-3xl flex-col overflow-hidden rounded-xl bg-[var(--crm-surface)]" onClick={(e) => e.stopPropagation()}>
            <div className="flex items-center justify-between border-b border-[var(--crm-line)] px-4 py-2.5">
              <span className="truncate text-[13px] font-medium text-[var(--crm-ink)]">{preview.name}</span>
              <button type="button" onClick={() => setPreview(null)} className="rounded-md p-1 text-[var(--crm-ink-soft)] hover:text-[var(--crm-ink)]">
                <X className="size-4" />
              </button>
            </div>
            <div className="min-h-0 flex-1 overflow-auto bg-[var(--crm-surface-2)]">
              {isImage(preview.contentType) ? (
                // eslint-disable-next-line @next/next/no-img-element
                <img src={fileHref(preview.id)} alt={preview.name} className="mx-auto block max-h-[80vh] w-auto" />
              ) : (
                <iframe src={fileHref(preview.id)} title={preview.name} className="h-[80vh] w-full" />
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
