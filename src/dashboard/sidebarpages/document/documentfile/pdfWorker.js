import { GlobalWorkerOptions } from "pdfjs-dist/build/pdf";
import PdfWorker from "pdfjs-dist/build/pdf.worker?worker";

GlobalWorkerOptions.workerPort = new PdfWorker(); // ✅ use workerPort instead of workerSrc
