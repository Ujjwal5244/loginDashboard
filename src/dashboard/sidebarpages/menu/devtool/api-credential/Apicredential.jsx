import React, { useState, useEffect, useCallback } from "react";
import "./Apicredential.css";
import { MdDownloadForOffline } from "react-icons/md";
import axios from "axios";
import { toast } from "react-toastify";
import {
  baseUrl,
  decryptText,
  encryptText,
} from "../../../../../encryptDecrypt";
import { jsPDF } from "jspdf";

const Apicredential = () => {
  const token = localStorage.getItem("userToken");
  const [showForm, setShowForm] = useState(false);
  const [credentials, setCredentials] = useState([]);
  const [newDescription, setNewDescription] = useState("");
  const [loading, setLoading] = useState(false);

  // Fetch API Credentials
  const fetchCredentials = useCallback(async () => {
    setLoading(true);
    try {
      const res = await axios.get(`${baseUrl}/api/user-credentials/`, {
        headers: { authorization: token },
      });

      const decrypted = await decryptText(res.data.body);
      const parsed = JSON.parse(decrypted);

      const formattedCredentials = parsed.data.map((item, index) => ({
        id: index + 1,
        description: item.description || "N/A",
        createdAt: new Date(item.createdAt).toISOString().split("T")[0],
        apiKey: item.apiKey || "N/A",
        iv: item.iv || "N/A",
        encryptionKey: item.encKey || "N/A",
      }));

      setCredentials(formattedCredentials);
    } catch (err) {
      console.error(err);
      toast.error("Failed to fetch API credentials");
    } finally {
      setLoading(false);
    }
  }, [token]);

  useEffect(() => {
    fetchCredentials();
  }, [fetchCredentials]);

  // Save new credential
  const handleSaveCredential = async () => {
    if (newDescription.trim() === "") return;

    const payload = { description: newDescription };
    const encryptedPayload = await encryptText(payload);

    try {
      const res = await axios.post(
        `${baseUrl}/api/user-credentials/`,
        { body: encryptedPayload },
        { headers: { authorization: token } }
      );

      const encryptedBody = res?.data?.body;
      if (typeof encryptedBody !== "string") {
        throw new Error("Invalid or missing encrypted data in response");
      }

      const decrypted = await decryptText(encryptedBody);
      const parsed = JSON.parse(decrypted);

      if (parsed.success) {
        toast.success("Credential saved");
        fetchCredentials();
        setNewDescription("");
        setShowForm(false);
      } else {
        toast.error(parsed.message || "Failed to save credential");
      }
    } catch (err) {
      console.error(err);
      toast.error("Error saving credential");
    }
  };

  // Generate & download PDF
  const handleDownload = () => {
    if (credentials.length === 0) {
      toast.info("No credentials to download yet");
      return;
    }

    const doc = new jsPDF({ unit: "pt" });
    doc.setFontSize(18);
    doc.text("API Credentials", 40, 40);

    let y = 70;
    const keyX = 60;
    const valueX = 180;
    const maxWidth = 360;

    credentials.forEach((c, index) => {
      doc.setFontSize(14);
      doc.setFont(undefined, "bold");
      doc.text(`Credential ${index + 1}`, 40, y);
      y += 10;

      const entries = [
        ["Description", c.description],
        ["API Key", c.apiKey],
        ["IV", c.iv],
        ["Encryption Key", c.encryptionKey],
      ];

      doc.setFontSize(12);
      doc.setFont(undefined, "normal");

      entries.forEach(([key, value], rowIdx) => {
        // Wrap text to fit in maxWidth
        const lines = doc.splitTextToSize(value, maxWidth);
        const rowHeight = lines.length * 14 + 6;
        const isGray = rowIdx % 2 === 0;

        // Background fill for striped effect
        if (isGray) {
          doc.setFillColor(240); // Light gray
          doc.rect(40, y - 2, 520, rowHeight, "F");
        }

        // Print key
        doc.text(`${key}:`, keyX, y + 12);

        // Print wrapped value
        doc.text(lines, valueX, y + 12);

        y += rowHeight;

        // Page break if needed
        if (y > 750) {
          doc.addPage();
          y = 40;
        }
      });

      y += 20; // Space between credentials
    });

    const blobUrl = doc.output("bloburl");
    window.open(blobUrl, "_blank");

    doc.save("API_Credentials.pdf");
  };

  return (
    <section className="apicredential">
      <div className="top-apicredential-container">
        <div className="top-apicredential-header">
          <h1 className="apicredential-title">API Credential</h1>
          <p className="apicredential-para">
            Securely manage your API keys and credentials.
          </p>
        </div>

        <div className="top-apicredential-button">
          <button
            className="apicredential-button"
            onClick={() => setShowForm(!showForm)}
          >
            + New Credential
          </button>
          <button
            className="apicredential-download-button"
            onClick={handleDownload}
          >
            <MdDownloadForOffline /> Download PDF
          </button>
        </div>
      </div>

      {/* Form Section */}
      {showForm && (
        <div className="apicredential-form">
          <input
            type="text"
            placeholder="Enter Description"
            value={newDescription}
            onChange={(e) => setNewDescription(e.target.value)}
          />
          <div className="apicredential-form-buttons">
            <button
              className="apicredential-save-btn"
              onClick={handleSaveCredential}
            >
              Save Credential
            </button>
            <button
              className="apicredential-cancel-btn"
              onClick={() => {
                setShowForm(false);
                setNewDescription("");
              }}
            >
              Cancel
            </button>
          </div>
        </div>
      )}

      {/* Table Section */}
      <div className="apicredential-table">
        <table className="apicredential-table-content">
          <thead>
            <tr>
              <th>SR.NO</th>
              <th>Description</th>
              <th>Created At</th>
              <th>API Key</th>
              <th>IV</th>
              <th>Encryption Key</th>
            </tr>
          </thead>
          <tbody>
            {credentials.map((cred) => (
              <tr key={cred.apiKey}>
                <td>{cred.id}</td>
                <td>{cred.description}</td>
                <td>{cred.createdAt}</td>
                <td>{cred.apiKey}</td>
                <td>{cred.iv}</td>
                <td>{cred.encryptionKey}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Card Layout for Mobile */}
      <div className="apicredential-card-wrapper">
        <div className="apicredential-card-container">
          {credentials.map((cred) => (
            <div key={cred.apiKey} className="apicredential-card">
              <h3>{cred.description}</h3>
              <p>
                <strong>SR.NO:</strong> {cred.id}
              </p>
              <p>
                <strong>Created At:</strong> {cred.createdAt}
              </p>
              <p>
                <strong>API Key:</strong> {cred.apiKey}
              </p>
              <p>
                <strong>IV:</strong> {cred.iv}
              </p>
              <p>
                <strong>Encryption Key:</strong> {cred.encryptionKey}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default Apicredential;
