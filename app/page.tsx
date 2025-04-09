"use client";
import { generatePDF } from "@/serverActions/generatePdf";
import { AllHTMLAttributes, useRef, useState } from "react";

function Button({
  type = "button",
  className = "",
  children,
  ...props
}: AllHTMLAttributes<HTMLButtonElement>) {
  return (
    <button
      type={type as never}
      className={`${className} px-6 py-3 bg-sky-700 text-white font-bold cursor-pointer rounded disabled:cursor-default disabled:opacity-60`}
      {...props}
    >
      {children}
    </button>
  );
}

function PdfDocument() {
  return (
    <div>
      <h1 className="text-lg font-bold">Hello my pdf</h1>
    </div>
  );
}

export default function HomePage() {
  const pdfRef = useRef<HTMLDivElement>(null);
  const [loading, setLoading] = useState<boolean>(false);

  async function onGenPdfClick() {
    if (!pdfRef.current) return;

    setLoading(true);

    try {
      const buffer = await generatePDF(pdfRef.current.innerHTML);

      if (buffer === null) return;

      const blob = new Blob([buffer]);
      const url = URL.createObjectURL(blob);

      const link = document.createElement("a");
      link.download = "gen.pdf";
      link.href = url;
      link.click();

      URL.revokeObjectURL(url);
    } catch (error) {
      console.log("ERROR: ", error);
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="w-screen h-screen flex items-center justify-center flex-col gap-3">
      <div ref={pdfRef} className="hidden">
        <PdfDocument />
      </div>

      <h1 className="text-4xl border-b pb-2">Version 1.2.0</h1>

      <Button disabled={loading} onClick={onGenPdfClick}>
        Get PDF
      </Button>
    </div>
  );
}
