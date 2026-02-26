import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";

import App from "./App"; // Home (tool)
import PrivacyPage from "./PrivacyPage";
import TermsPage from "./TermsPage";
import ContactPage from "./ContactPage";

// Pages folder
import Analyzer from "./pages/Analyzer";
import Cleaner from "./pages/Cleaner";
import FAQ from "./pages/FAQ";
import NotFound from "./pages/NotFound";

// Add these new pages (create the files if you don't already have them)
import About from "./pages/About";
import Tutorial from "./pages/Tutorial";
import Examples from "./pages/Examples";

export default function Root() {
  return (
    <Router>
      <Routes>
        {/* Main pages */}
        <Route path="/" element={<App />} />
        <Route path="/analyzer" element={<Analyzer />} />
        <Route path="/cleaner" element={<Cleaner />} />
        <Route path="/faq" element={<FAQ />} />
        <Route path="/about" element={<About />} />
        <Route path="/tutorial" element={<Tutorial />} />
        <Route path="/examples" element={<Examples />} />

        {/* Legal pages */}
        <Route path="/privacy" element={<PrivacyPage />} />
        <Route path="/terms" element={<TermsPage />} />
        <Route path="/contact" element={<ContactPage />} />

        {/* 404 */}
        <Route path="*" element={<NotFound />} />
      </Routes>
    </Router>
  );
}
