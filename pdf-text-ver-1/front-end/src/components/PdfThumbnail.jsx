import { useEffect, useRef } from "react";
import * as pdfjsLib from "pdfjs-dist";
import pdfjsWorker from "pdfjs-dist/build/pdf.worker?worker"; // <- for Vite support

pdfjsLib.GlobalWorkerOptions.workerPort = new pdfjsWorker();

export default function PdfThumbnail({ file }) {
  const canvasRef = useRef();

  useEffect(() => {
    const renderFirstPage = async () => {
      const reader = new FileReader();

      reader.onload = async () => {
        const typedArray = new Uint8Array(reader.result);
        const pdf = await pdfjsLib.getDocument({ data: typedArray }).promise;
        const page = await pdf.getPage(1);
        const viewport = page.getViewport({ scale: 0.5 });

        const canvas = canvasRef.current;
        const context = canvas.getContext("2d");

        canvas.height = viewport.height;
        canvas.width = viewport.width;

        await page.render({ canvasContext: context, viewport }).promise;
      };

      reader.readAsArrayBuffer(file);
    };

    renderFirstPage();
  }, [file]);

  return <canvas ref={canvasRef} style={{ width: "100%", height: "auto" }} />;
}
