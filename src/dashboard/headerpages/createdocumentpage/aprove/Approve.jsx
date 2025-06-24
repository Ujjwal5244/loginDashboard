import React, { useEffect, useState, useRef } from "react";
import { useNavigate, useParams, useLocation } from "react-router-dom";
import { FaUsers } from "react-icons/fa";
import { TiDelete } from "react-icons/ti";
import axios from "axios";
import { baseUrl, decryptText } from "../../../../encryptDecrypt";
import { toast } from "react-toastify";
import { Document, Page, pdfjs } from "react-pdf";
import Draggable from "react-draggable";
import { encryptText } from "../../../../encryptDecrypt";

// Standard react-pdf setup
import "react-pdf/dist/esm/Page/AnnotationLayer.css";
import "react-pdf/dist/esm/Page/TextLayer.css";
pdfjs.GlobalWorkerOptions.workerSrc = `//unpkg.com/pdfjs-dist@${pdfjs.version}/build/pdf.worker.min.mjs`;

const getColorForInvitee = (inviteeId, invitees) => {
  const colors = [
    "#007BFF",
    "#28A745",
    "#DC3545",
    "#FFC107",
    "#17A2B8",
    "#6610F2",
    "#fd7e14",
    "#20c997",
  ];
  if (!invitees || invitees.length === 0) return "#6c757d";
  const index = invitees.findIndex((inv) => inv.id === inviteeId);
  if (index === -1) return "#6c757d";
  return colors[index % colors.length];
};

const Approve = () => {
  const token = localStorage.getItem("userToken");
  const { documentId } = useParams();
  const navigate = useNavigate();
  const {search} = useLocation();
  const isInSequence = new URLSearchParams(search).get("isInSequence");
  // --- State Management ---
  const [pdfUrl, setPdfUrl] = useState(null);
  const [numPages, setNumPages] = useState(null);
  const [documentDetails, setDocumentDetails] = useState(null);
  const [invitees, setInvitees] = useState([]);
  const [signatures, setSignatures] = useState([]);
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [loading, setLoading] = useState(true);
  const hasPopulatedFields = useRef(false);
  const pageRefs = useRef({});
  const [info, setInfo] = useState(null);
  const [pdfWidth, setPdfWidth] = useState(700); // Initial width

  useEffect(() => {
    // Update PDF width based on window size
    const updatePdfWidth = () => {
      const width = Math.min(window.innerWidth - 40, 700); // Max 700px, but responsive to screen
      setPdfWidth(width);
    };

    updatePdfWidth();
    window.addEventListener('resize', updatePdfWidth);
    
    console.log(`Document signing sequence is fixed: ${isInSequence}`);

    fetch("https://ipwho.is/")
      .then((res) => res.json())
      .then((data) => {
        setInfo(data);
      })
      .catch((err) => console.error("Error fetching IP/location:", err));

    return () => {
      window.removeEventListener('resize', updatePdfWidth);
      if (pdfUrl) {
        URL.revokeObjectURL(pdfUrl);
      }
    };
  }, [isInSequence, pdfUrl]);

  // --- Effects ---
  useEffect(() => {
    if (documentId) {
      fetchDocumentAndInvitees();
    }
  }, [documentId]);

  useEffect(() => {
    if (numPages > 0 && invitees.length > 0 && !hasPopulatedFields.current) {
      const initialSignatures = [];
      invitees.forEach((invitee, inviteeIndex) => {
        const initialX = 10;
        const initialY = 10 + inviteeIndex * 12;
        for (let pageNum = 1; pageNum <= numPages; pageNum++) {
          initialSignatures.push({
            id: `sig-${pageNum}-${invitee.id}`,
            inviteeId: invitee.id,
            inviteeName: invitee.name,
            pageNumber: pageNum,
            x: initialX,
            y: initialY,
          });
        }
      });
      setSignatures(initialSignatures);
      hasPopulatedFields.current = true;
    }
  }, [numPages, invitees]);

  // --- Data Fetching ---
  const fetchDocumentAndInvitees = async () => {
    setLoading(true);
    hasPopulatedFields.current = false;
    try {
      await Promise.all([fetchDocumentDetails(), fetchInvitees()]);
    } catch (error) {
      console.error("Error during initial data fetch:", error);
      toast.error("An error occurred while loading document data.");
    } finally {
      setLoading(false);
    }
  };

  const fetchDocumentDetails = async () => {
    try {
      const metaResponse = await axios.get(
        `${baseUrl}/api/document/getdocument/${documentId}`,
        { headers: { authorization: token } }
      );
      const decrypted = await decryptText(metaResponse.data.body);
      const data = JSON.parse(decrypted);
      const document = data.document;
      setDocumentDetails(document);

      if (document?.documentUrl) {
        const pdfResponse = await axios.get(document.documentUrl, {
          responseType: "blob",
        });
        const file = new Blob([pdfResponse.data], { type: "application/pdf" });
        const fileURL = URL.createObjectURL(file);
        setPdfUrl(fileURL);
      } else {
        toast.error("Document URL not found.");
      }
    } catch (error) {
      console.error("Error fetching document:", error);
      toast.error("Failed to load document details or file.");
      throw error;
    }
  };

  const fetchInvitees = async () => {
    try {
      const response = await axios.get(
        `${baseUrl}/api/document/getInvitees/${documentId}`,
        { headers: { authorization: token } }
      );
      const decrypted = await decryptText(response.data.body);
      const data = JSON.parse(decrypted);

      if (Array.isArray(data?.invitees)) {
        setInvitees(data.invitees);
      } else {
        toast.error("Could not find an invitee list for this document.");
        setInvitees([]);
      }
    } catch (error) {
      console.error("Error fetching invitees:", error);
      toast.error("Failed to load invitees.");
      setInvitees([]);
      throw error;
    }
  };

  // --- Event Handlers ---
  const handleDragStop = (signatureId, data, pageNum) => {
    const pageElement = pageRefs.current[pageNum];
    if (!pageElement) return;

    const draggedSignature = signatures.find((s) => s.id === signatureId);
    if (!draggedSignature) return;
    const targetInviteeId = draggedSignature.inviteeId;

    const pageRect = pageElement.getBoundingClientRect();
    const newX = (data.x / pageRect.width) * 100;
    const newY = (data.y / pageRect.height) * 100;

    setSignatures((prevSignatures) =>
      prevSignatures.map((sig) =>
        sig.inviteeId === targetInviteeId ? { ...sig, x: newX, y: newY } : sig
      )
    );
  };

  const handleRemoveSignature = (idToRemove) => {
    setSignatures((prev) => prev.filter((sig) => sig.id !== idToRemove));
    toast.info("Signature field removed for this page.");
  };

  const handleSendToSign = async () => {
    if (isInSequence) {
        toast.info("Sequential signing order is active.");
    }
    if (signatures.length === 0) {
        toast.warn("There are no signature fields. Please add invitees first.");
        return;
    }

    try {
        const uniqueInviteePositions = invitees
        .map((invitee) => {
            const signatureData = signatures.find(
            (sig) => sig.inviteeId === invitee.id
            );
            if (!signatureData) {
            console.warn(
                `No signature position found for invitee ${invitee.id}. Skipping.`
            );
            return null;
            }

            return {
            id: invitee.id,
            coordinates: {
                x: signatureData.x,
                y: signatureData.y,
            },
            };
        })
        .filter(Boolean);

        if (uniqueInviteePositions.length === 0) {
        toast.error(
            "Could not find signature positions for any invitees. Please ensure fields are placed."
        );
        return;
        }

        const payload = {
        ip: info?.ip || "Unknown",
        location: {
            latitude: String(info?.latitude || "Unknown"),
            longitude: String(info?.longitude || "Unknown"),
        },
        inviteePositions: uniqueInviteePositions,
        };

        const encryptedPayloadString = await encryptText(payload);

        await axios.post(
        `${baseUrl}/api/document/invitees/updateCoordinates/${documentId}?isInSequence=${isInSequence}`,
        { body: encryptedPayloadString },
        {
            headers: {
            authorization: token,
            "Content-Type": "application/json",
            },
        }
        );

        toast.success("Document sent for signatures successfully!");
        navigate(`/maindashboard/allinvities?documentId=${documentId}`);

    } catch (error) {
        console.error("Error sending signatures:", error);
        let errorMessage = "Failed to send signatures. Please try again.";
        if (error.response?.data?.body) {
        try {
            const decryptedError = await decryptText(error.response.data.body);
            const errorJson = JSON.parse(decryptedError);
            if (errorJson.message) {
            errorMessage = errorJson.message;
            }
        } catch (e) {
            console.error("Could not decrypt or parse error response", e);
        }
        }
        toast.error(errorMessage);
    }
  };

  const handleViewInvitees = () => setIsSidebarOpen(true);
  const handleCloseSidebar = () => setIsSidebarOpen(false);

  return (
    <>
      {/* Sidebar for viewing invitees */}
      {isSidebarOpen && (
        <>
          <div
            className="fixed inset-0 bg-black/20 backdrop-blur-sm z-40"
            onClick={handleCloseSidebar}
          ></div>
          <div className="fixed top-0 right-0 h-full w-full sm:w-[300px] bg-white shadow-2xl z-[2000] p-0 transform transition-all duration-300 ease-in-out translate-x-0 overflow-hidden">
            <div className="sticky top-0 z-10 bg-white/80 backdrop-blur-md p-5 border-b border-gray-100">
              <div className="flex justify-between items-center">
                <div className="flex items-center space-x-3">
                  <div className="p-2 rounded-lg bg-blue-100 text-blue-600">
                    <FaUsers className="text-xl" />
                  </div>
                  <div>
                    <h2 className="text-lg font-bold text-gray-900">Signers</h2>
                    <p className="text-xs text-gray-500">
                      {invitees.length}{" "}
                      {invitees.length === 1 ? "participant" : "participants"}
                    </p>
                  </div>
                </div>
                <button
                  onClick={handleCloseSidebar}
                  className="p-1 rounded-full hover:bg-gray-100 transition-colors"
                  aria-label="Close sidebar"
                >
                  <svg
                    className="w-5 h-5 text-gray-500"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M6 18L18 6M6 6l12 12"
                    />
                  </svg>
                </button>
              </div>
            </div>

            <div className="h-[calc(100%-120px)] overflow-y-auto p-5">
              <ul className="space-y-3">
                {invitees.map((invitee) => {
                  const bgColor = getColorForInvitee(invitee.id, invitees);
                  const textColor =
                    bgColor === "#FFC107" || bgColor === "#20c997"
                      ? "text-gray-800"
                      : "text-white";

                  return (
                    <li
                      key={invitee.id}
                      className="group flex items-center p-3 rounded-xl hover:bg-gray-50 transition-all duration-200 border border-gray-100 hover:border-gray-200"
                    >
                      <div
                        className={`relative flex-shrink-0 h-11 w-11 rounded-xl flex items-center justify-center font-bold ${textColor} shadow-md`}
                        style={{ backgroundColor: bgColor }}
                      >
                        {invitee.name.charAt(0).toUpperCase()}
                        <span className="absolute bottom-0 right-0 w-3 h-3 bg-green-400 rounded-full border-2 border-white"></span>
                      </div>
                      <div className="ml-4 flex-1 min-w-0">
                        <p className="font-medium text-gray-900 truncate">
                          {invitee.name}
                        </p>
                        <p className="text-xs text-gray-500 truncate">
                          {invitee.email}
                        </p>
                      </div>
                      <div className="ml-2 opacity-0 group-hover:opacity-100 transition-opacity">
                        <svg
                          className="w-5 h-5 text-gray-400"
                          fill="none"
                          stroke="currentColor"
                          viewBox="0 0 24 24"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M9 5l7 7-7 7"
                          />
                        </svg>
                      </div>
                    </li>
                  );
                })}
              </ul>
            </div>

            <div className="absolute bottom-0 left-0 right-0 p-5 bg-gradient-to-t from-white via-white to-white/80 border-t border-gray-100">
              <button
                onClick={handleCloseSidebar}
                className="w-full py-3 bg-blue-600 hover:bg-blue-700 text-white font-medium rounded-xl transition-all duration-200 shadow hover:shadow-md flex items-center justify-center space-x-2"
              >
                <span>Done</span>
                <svg
                  className="w-4 h-4"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M5 13l4 4L19 7"
                  />
                </svg>
              </button>
            </div>
          </div>
        </>
      )}

      {/* Main Content Area */}
      <div className="font-sans py-4 px-2 sm:px-4">
        <div className="max-w-6xl mx-auto">
          <div className="flex flex-col items-center p-4 bg-gray-50 rounded-xl shadow-lg border border-gray-200">
            <div className="w-full text-center mb-4">
              <h1 className="md:text-xl xs:text-[16px] font-bold text-gray-800">
                Prepare Document for Signing
              </h1>
              <p className="md:text-sm xs:text-[10px] text-gray-600">
                {invitees.length > 0
                  ? "Drag a signature field to apply its position to all pages for that signer."
                  : "Loading invitees..."}
              </p>
            </div>

            <div
              className="overflow-y-auto w-full bg-gray-200 p-2 sm:p-4 rounded-lg"
              style={{ maxHeight: "60vh" }}
            >
              {loading ? (
                <div className="flex justify-center items-center h-[400px]">
                  <p className="text-lg font-semibold">
                    Loading document, please wait...
                  </p>
                </div>
              ) : pdfUrl ? (
                <Document
                  file={pdfUrl}
                  onLoadSuccess={({ numPages }) => setNumPages(numPages)}
                  className="flex flex-col items-center"
                >
                  {Array.from(new Array(numPages), (_, index) => {
                    const pageNum = index + 1;
                    return (
                      <div
                        key={`page_container_${pageNum}`}
                        ref={(el) => (pageRefs.current[pageNum] = el)}
                        className="pdf-page-container relative shadow-lg mb-8 mx-auto"
                        style={{ width: '100%', maxWidth: `${pdfWidth}px` }}
                      >
                        {signatures
                          .filter((sig) => sig.pageNumber === pageNum)
                          .map((sig) => {
                            const pageElement = pageRefs.current[pageNum];
                            const position = { x: 0, y: 0 };
                            if (pageElement) {
                              position.x =
                                (sig.x / 100) * pageElement.clientWidth;
                              position.y =
                                (sig.y / 100) * pageElement.clientHeight;
                            }

                            return (
                              <Draggable
                                key={sig.id}
                                bounds="parent"
                                position={position}
                                onStop={(e, data) =>
                                  handleDragStop(sig.id, data, pageNum)
                                }
                              >
                                <div
                                  className="absolute z-[1000] mt-4 flex flex-col justify-center items-center p-1 bg-white bg-opacity-90 backdrop-blur-sm rounded-md shadow-lg cursor-move"
                                  style={{
                                    width: `${Math.min(pdfWidth * 0.25, 160)}px`, // Responsive width (25% of pdf width or max 160px)
                                    height: `${Math.min(pdfWidth * 0.08, 50)}px`, // Responsive height (8% of pdf width or max 50px)
                                    border: `2px dashed ${getColorForInvitee(sig.inviteeId, invitees)}`,
                                  }}
                                >
                                  <button
                                    onClick={() =>
                                      handleRemoveSignature(sig.id)
                                    }
                                    className="absolute -top-3 -right-3 text-red-500 hover:text-red-700 bg-white p-[2px] rounded-full z-10"
                                    title="Remove field from this page"
                                  >
                                    <TiDelete size={Math.min(pdfWidth * 0.04, 26)} /> 
                                  </button>
                                  <p
                                    className="text-sm font-bold truncate w-full text-center px-1"
                                    style={{
                                      color: getColorForInvitee(
                                        sig.inviteeId,
                                        invitees
                                      ),
                                    }}
                                    title={sig.inviteeName}
                                  >
                                    {sig.inviteeName}
                                  </p>
                                  <p className="text-[8px] text-gray-500">
                                    Signature Field
                                  </p>
                                </div>
                              </Draggable>
                            );
                          })}
                        <Page 
                          pageNumber={pageNum} 
                          width={pdfWidth}
                          className="border border-gray-300"
                        />
                      </div>
                    );
                  })}
                </Document>
              ) : (
                <div className="flex justify-center items-center h-[70vh]">
                  <p className="text-xl text-red-500 font-semibold">
                    Document could not be loaded.
                  </p>
                </div>
              )}
            </div>

            {!loading && (
              <div className="mt-6 w-full flex flex-col sm:flex-row justify-center items-center gap-4 p-4 bg-white rounded-lg shadow-inner">
                <button
                  onClick={handleViewInvitees}
                  className="w-full sm:w-auto px-6 py-3 bg-white border border-gray-300 text-gray-700 md:text-[15px] xs:text-[12px] font-semibold rounded-lg hover:bg-gray-100 transition-colors flex items-center justify-center gap-2"
                >
                  <FaUsers /> View Invitees
                </button>
                <button
                  onClick={handleSendToSign}
                  disabled={signatures.length === 0}
                  className="w-full sm:w-auto px-8 py-3 bg-[#3470b2] text-white md:text-[15px] xs:text-[12px] font-bold rounded-lg transition-colors disabled:bg-gray-400 disabled:cursor-not-allowed"
                >
                  Send for Signature ({signatures.length} fields)
                </button>
              </div>
            )}
          </div>
        </div>
      </div>
    </>
  );
};

export default Approve;