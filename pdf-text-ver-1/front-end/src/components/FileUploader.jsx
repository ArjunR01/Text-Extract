import { useState, useRef } from "react";
import "bootstrap/dist/css/bootstrap.min.css";
import { BookCard } from "./BookCard";
import PageInterval from "./PageInterval";
import axios from "axios";

// type UploadStatus = "idle" | "uploading" | "success" | "error";

export default function FileUploader() {
  const [file, setFile] = useState(null);
  const [status, setStatus] = useState("idle");
  const [uploadProgress, setUploadProgress] = useState(0);
  const [error, setError] = useState("");
  const fileInputRef = useRef(null);
  const [startPage, setStartPage] = useState("");
  const [endPage, setEndPage] = useState("");
  const [extractedText, setExtractedText] = useState("");

  function handlFileChange(e) {
    const file = e.target.files[0];

    if (file && file.type !== "application/pdf") {
      setError("Invalid file type. Please upload a PDF.");
      setFile(null);
      setTimeout(() => setError(""), 3000);
      if (fileInputRef.current) fileInputRef.current.value = "";
      return;
    }
    setFile(file);
  }

  function handleCardDelete() {
    if (file) {
      setFile(null);
      setStatus("idle");
      setEndPage("");
      setStartPage("");
      setExtractedText("");
      setError("");
    }
  }

  async function handleFileUpload() {
    if (!file) return;

    setStatus("uploading");
    setUploadProgress(0);

    const formData = new FormData();
    formData.append("file", file);

    try {
      await axios.post(
        "https://text-extract-z1do.onrender.com/upload",
        formData,
        {
          headers: {
            "Content-Type": "multipart/form-data",
          },
          onUploadProgress: (progressEvent) => {
            const progress = progressEvent.total
              ? (
                  Math.round(progressEvent.loaded * 100) / progressEvent.total
                ).toFixed(0)
              : 0;
            setUploadProgress(progress);
          },
        }
      );
      setStatus("success");
      setUploadProgress(100);
    } catch {
      setStatus("error");
      setUploadProgress(100);
    }
  }

  async function handleFetch() {
    if (!file || !startPage || !endPage) {
      setError("Please enter a valid page range.");
      return;
    }

    try {
      const response = await axios.post(
        "https://text-extract-z1do.onrender.com/read",
        {
          filename: file.name,
          start_page: parseInt(startPage),
          end_page: parseInt(endPage),
        }
      );

      if (response.data.text) {
        setExtractedText(response.data.text);
        setError("");
      } else {
        setError("No text found or invalid page range");
        setExtractedText("");
        setEndPage("");
        setStartPage("");
      }
    } catch (err) {
      setError("Failed to fetch text. Please try again later");
    }
  }

  return (
    <div>
      {!file && (
        <input type="file" onChange={handlFileChange} ref={fileInputRef} />
      )}
      {file && <BookCard file={file} handleCardDelete={handleCardDelete} />}
      {file && (status === "idle" || status === "error") && (
        <button onClick={handleFileUpload}>Upload</button>
      )}
      {file && status === "uploading" && (
        <div
          className="progress"
          role="progressbar"
          aria-label="Success example"
          aria-valuenow="25"
          aria-valuemin="0"
          aria-valuemax="100"
        >
          <div
            className="progress-bar text-bg-success"
            style={{ width: `${uploadProgress}%` }}
          >
            {uploadProgress}
          </div>
        </div>
      )}
      {status === "success" && status !== "error" && (
        <p className="text-success">File Upload Successfull</p>
      )}
      {status === "error" && <p>File Upload Failed. Please try again..</p>}
      {file && status === "success" && (
        <PageInterval
          startPage={startPage}
          setStartPage={setStartPage}
          endPage={endPage}
          setEndPage={setEndPage}
        />
      )}
      {error && <p className="text-danger">{error}</p>}
      {status === "success" && <button onClick={handleFetch}>Fetch</button>}
      {status === "success" && extractedText && (
        <div
          className="border rounded p-3 mt-3"
          style={{
            maxHeight: "300px",
            overflowY: "auto",
            backgroundColor: "#f8f9fa",
          }}
        >
          <pre style={{ whiteSpace: "pre-wrap" }}>{extractedText}</pre>
        </div>
      )}
    </div>
  );
}
