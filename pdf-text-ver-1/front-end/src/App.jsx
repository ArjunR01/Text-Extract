import FileUploader from "./components/FileUploader";
import "bootstrap/dist/css/bootstrap.min.css";
import "./App.css";

const App = () => {
  return (
    <div className="container d-flex justify-content-center align-items-center min-vh-100">
      <div className="w-100" style={{ maxWidth: "600px" }}>
        <FileUploader />
      </div>
    </div>
  );
};

export default App;
