import React, { useEffect, useState, useRef } from "react";
import { getDocument } from "pdfjs-dist";

const PdfViewerAllPages = ({ pdfUrl }) => {
  const [numPages, setNumPages] = useState(0);
  const canvasRefs = useRef([]);

  useEffect(() => {
    const renderAllPages = async () => {
      const loadingTask = getDocument(pdfUrl);
      const pdf = await loadingTask.promise;

      setNumPages(pdf.numPages);

      for (let pageNum = 1; pageNum <= pdf.numPages; pageNum++) {
        const page = await pdf.getPage(pageNum);
        const viewport = page.getViewport({ scale: 1.5 });

        const canvas = canvasRefs.current[pageNum - 1];
        if (!canvas) continue;

        const context = canvas.getContext("2d");
        canvas.height = viewport.height;
        canvas.width = viewport.width;

        await page.render({
          canvasContext: context,
          viewport,
        }).promise;
      }
    };

    if (pdfUrl) {
      renderAllPages();
    }
  }, [pdfUrl]);

  // Prepare canvas elements for each page
  return (
    <div className="pdf-viewer">
      {Array.from(new Array(numPages), (_, index) => (
        <canvas
          key={`page_${index + 1}`}
          ref={(el) => (canvasRefs.current[index] = el)}
          style={{ marginBottom: "20px", border: "1px solid #ccc" }}
        />
      ))}
    </div>
  );
};

export default PdfViewerAllPages;
