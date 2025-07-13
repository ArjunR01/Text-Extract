export default function PageInterval({
  startPage,
  setStartPage,
  endPage,
  setEndPage,
}) {
  return (
    <>
      <div className="mb-3">
        <label htmlFor="startPage" className="form-label">
          Start Page
        </label>
        <input
          type="number"
          className="form-control"
          id="startPage"
          value={startPage}
          onChange={(e) => setStartPage(e.target.value)}
          min={1}
        />
      </div>

      <div className="mb-3">
        <label htmlFor="endPage" className="form-label">
          End Page
        </label>
        <input
          type="number"
          className="form-control"
          id="endPage"
          value={endPage}
          onChange={(e) => setEndPage(e.target.value)}
          min={startPage}
        />
      </div>
    </>
  );
}
