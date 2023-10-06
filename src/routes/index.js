import { Routes, Route } from "react-router-dom";
import App from "../App";
import ComponentsDetail from "../components/details";

function RoutesIndex() {
  return (
    <Routes>
      <Route path="/" element={<App />} />

      <Route path="/components/details/:id" element={<ComponentsDetail />} />
    </Routes>
  );
}

export default RoutesIndex;
