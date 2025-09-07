import React, { useRef } from "react";

export function UploadButton({
  onUploaded,
  folder = "products",
}: {
  onUploaded: (url: string) => void;
  folder?: string;
}) {
  const inputRef = useRef<HTMLInputElement>(null);
  return (
    <span style={{ display: "inline-block" }}>
      <input
        ref={inputRef}
        type="file"
        accept="image/*"
        style={{ display: "none" }}
        onChange={async (e) => {
          const file = e.target.files?.[0];
          if (!file) return;
          const fd = new FormData();
          fd.set("file", file);
          fd.set("folder", folder);
          const res = await fetch("/api/admin/upload", {
            method: "POST",
            body: fd,
          });
          const data = await res.json();
          if (data?.url) onUploaded(data.url);
          else alert(data?.error || "Upload failed");
        }}
      />
      <button
        type="button"
        style={{
          marginLeft: 8,
          height: 42,
          padding: "0 12px",
          borderRadius: 10,
          border: "1px solid #e5e7eb",
        }}
        onClick={() => inputRef.current?.click()}
      >
        Upload
      </button>
    </span>
  );
}
