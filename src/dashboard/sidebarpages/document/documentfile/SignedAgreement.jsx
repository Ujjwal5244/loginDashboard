import React, { useEffect, useState } from "react";
import { baseUrl } from "../../../../encryptDecrypt";

const SignedAgreement = () => {
  const token = localStorage.getItem("userToken"); // or wherever you're storing it
  const [pdfUrl, setPdfUrl] = useState("");
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const fetchPdf = async () => {
      setLoading(true);

      try {
        const response = await fetch(`${baseUrl}/api/user/signed-pdf`, {
          headers: {
            authorization: token,
            "Content-Type": "application/json",
          },
        });

        const data = await response.json();
        console.log(data)
        if (data.pdfUrl) {
          setPdfUrl(data.pdfUrl);
        } else {
          throw new Error("No PDF URL found in response");
        }
      } catch (error) {
        console.error("Error fetching PDF:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchPdf(); // Don't forget to call the function
  }, []);

  return (
    <div className="Signed-Agreement">
      <div className="pdf-preview">
        {!loading && pdfUrl ? (
          <iframe
            src={pdfUrl}
            title="Sign Agreement"
            width="100%"
            height="600px"
          />
        ) : (
          <p>{loading ? "Loading PDF preview..." : "No PDF available."}</p>
        )}
      </div>
    </div>
  );
};

export default SignedAgreement;
