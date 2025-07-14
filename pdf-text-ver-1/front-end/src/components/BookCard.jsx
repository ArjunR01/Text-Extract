import PdfThumbnail from "./PdfThumbnail";

export function BookCard({ file, handleCardDelete }) {
  if (!file) return null;
  const fileSize = (file.size / 1000000).toFixed(2);
  const fileType = file.type.split("/");

  return (
    <div className="card mb-3" style={{ maxWidth: "540px", marginTop: "15px" }}>
      <button
        type="button"
        className="btn-close position-absolute"
        style={{ top: "10px", right: "10px" }}
        aria-label="Close"
        onClick={handleCardDelete}
      ></button>
      <div className="row g-0">
        <div className="col-md-4">
          <PdfThumbnail file={file} />
        </div>
        <div className="col-md-8">
          <div className="card-body">
            <h5 className="card-title">{file.name}</h5>
            <p className="card-text">File Size : {fileSize}MB</p>
            <p className="card-text">File Type : {fileType[1]}</p>
          </div>
        </div>
      </div>
    </div>
  );
}
