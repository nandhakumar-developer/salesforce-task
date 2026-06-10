import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { AuthProvider } from "./context/AuthContext";
import Home     from "./pages/Home";
import Callback from "./pages/Callback";
import Rules    from "./pages/Rules";

export default function App() {
  return (
    <AuthProvider>
      <BrowserRouter>
        <Routes>
          <Route path="/"         element={<Home />} />
          <Route path="/callback" element={<Callback />} />
          <Route path="/rules"    element={<Rules />} />
          <Route path="*"         element={<Navigate to="/" replace />} />
        </Routes>
      </BrowserRouter>
    </AuthProvider>
  );
}