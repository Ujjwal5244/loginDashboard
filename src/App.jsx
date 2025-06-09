import React, { useState } from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { GoogleOAuthProvider } from '@react-oauth/google'; // Add this import
import "./App.css";
import Login from "./login/Login";
import Signup from "./signup/Signup";
import Maindashboard from "./dashboard/Maindashboard";
import Home from "./dashboard/sidebarpages/menu/home/Home";
import Analytics from "./dashboard/sidebarpages/menu/analytics/Analytics";
import Rolemanagement from "./dashboard/sidebarpages/menu/users/rolemanagement/Rolemanagement";
import Myteam from "./dashboard/sidebarpages/menu/users/myteam/Myteam";
import Ipwhitelist from "./dashboard/sidebarpages/menu/devtool/ipwhitelist/Ipwhitelist";
import Webhooks from "./dashboard/sidebarpages/menu/devtool/webhooks/Webhooks";
import Logs from "./dashboard/sidebarpages/menu/devtool/logss/Logs";
import Yourkyc from "./dashboard/sidebarpages/document/yourkyc/Yourkyc";
import Completed from "./dashboard/sidebarpages/document/completed/Completed";
import Setting from "./dashboard/sidebarpages/setting/Setting";
import Myprofile from "./dashboard/headerpages/myprofile/Myprofile";
import Kycstatus from "./dashboard/headerpages/kycstatus/Kycstatus";
import Apicredential from "./dashboard/sidebarpages/menu/devtool/api-credential/Apicredential";
import Transactionhistory from "./dashboard/sidebarpages/wallettransaction/Transactionhistory";
import Email from "./dashboard/sidebarpages/document/email/emailnotification/Email";
import EmailDetail from "./dashboard/sidebarpages/document/email/emaildetail/Emaildetail";
import Emaildashboard from "./dashboard/sidebarpages/document/email/Emaildashboard";
import Verification from "./dashboard/headerpages/myprofile/Verification";
import Trash from "./dashboard/sidebarpages/document/email/trash/Trash";
import Sent from "./dashboard/sidebarpages/document/email/sent/Sent";
import Starred from "./dashboard/sidebarpages/document/email/starred/Starred";
import Drafts from "./dashboard/sidebarpages/document/email/drafts/Drafts";
import Compose from "./dashboard/sidebarpages/document/email/compose/Compose";
import MobileMenu from "./dashboard/sidebarpages/footer/mobilemenu/Mobilemenu";
import { GrToast } from "react-icons/gr";
import { ToastContainer } from "react-toastify";
import SignedAgreement from "./dashboard/sidebarpages/document/documentfile/SignedAgreement";
import PdfSign from "./dashboard/headerpages/myprofile/PdfSign";
import Agreement from "./dashboard/headerpages/myprofile/Agreement";
import KycStudio from "./dashboard/sidebarpages/menu/kycstudio/KycStudio";
import Createfile from "./dashboard/headerpages/createdocumentpage/Createfile";
import Requestfile from "./dashboard/headerpages/createdocumentpage/request/Requestfile";
import Approve from "./dashboard/headerpages/createdocumentpage/aprove/Approve";
import Allinvites from "./dashboard/headerpages/createdocumentpage/allinvities/Allinvities";
import Nifipaymentmain from "./nifipayment/Nifipaymentmain";

function App() {
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [darkMode, setDarkMode] = useState(false);

  const toggleSidebar = () => {
    setSidebarOpen(!sidebarOpen);
  };

  const toggleDarkMode = () => {
    setDarkMode((prevMode) => !prevMode);
    document.body.classList.toggle("dark-mode", !darkMode);
  };

  return (
    <GoogleOAuthProvider clientId="587797030071-kt1lgl2gs8b712ar1ju8otgsroa3dltp.apps.googleusercontent.com">
    <Router>
      <ToastContainer />
      <div className={`app ${darkMode ? "dark-mode" : ""}`}>
        <Routes>
          <Route path="/" element={<Login />} />
          <Route path="/signup" element={<Signup />} />
          <Route path="/Nifipayment" element={<Nifipaymentmain />} />
          <Route
            path="/Maindashboard"
            element={
              <Maindashboard
                sidebarOpen={sidebarOpen}
                toggleSidebar={toggleSidebar}
                darkMode={darkMode}
                toggleDarkMode={toggleDarkMode}
              />
            }
          >
            <Route index element={<Home />} />
            <Route path="home" element={<Home />} />
            <Route path="analytics" element={<Analytics />} />
            <Route
              path="role-management"
              element={<Rolemanagement darkMode={darkMode} />}
            />
            <Route path="my-team" element={<Myteam darkMode={darkMode} />} />
            <Route
              path="ip-whitelist"
              element={<Ipwhitelist darkMode={darkMode} />}
            />
            <Route path="webhooks" element={<Webhooks darkMode={darkMode} />} />
            <Route path="logs" element={<Logs darkMode={darkMode} />} />
            <Route
              path="api-credential"
              element={<Apicredential darkMode={darkMode} />}
            />
            <Route
              path="kycstudio"
              element={<KycStudio darkMode={darkMode} />}
            />

            <Route
              path="transactionhistory"
              element={<Transactionhistory darkMode={darkMode} />}
            />
            <Route path="signed-agreement" element={<SignedAgreement />} />
            <Route path="yourkyc" element={<Yourkyc />} />
            {/* ---------------------all email pagese routes--------------------------- */}
            <Route
              path="email"
              element={<Emaildashboard darkMode={darkMode} />}
            />

            {/* <Route
              path="Email"
              element={
                <Emaildashboard sidebarOpen={sidebarOpen} darkMode={darkMode} />
              }
            >
              <Route index element={<Email />} />
              <Route path=":id" element={<EmailDetail />} />
              <Route path="trash" element={<Trash />} />
              <Route path="sent" element={<Sent />} />
              <Route path="starred" element={<Starred />} />
              <Route path="drafts" element={<Drafts />} />
              <Route path="compose" element={<Compose />} />
            </Route> */}
            {/* ---------------------end email pagese routes--------------------------- */}
            <Route path="completed" element={<Completed />} />
            <Route path="setting" element={<Setting />} />

            <Route
              path="myprofile"
              element={<Myprofile darkMode={darkMode} />}
            />
            <Route
              path="verification"
              element={<Verification darkMode={darkMode} />}
            />
            <Route path="sign-agreement" element={<Agreement />} />
            <Route path="pdf-sign" element={<PdfSign darkMode={darkMode} />} />
            <Route path="kycstatus" element={<Kycstatus />} />
            <Route path="mobilemenu" element={<MobileMenu />} />
            {/* ---------------------create header pagese routes--------------------------- */}
            <Route path="createfile" element={<Createfile />} />
            <Route path="requestfile" element={<Requestfile />} />
            <Route path="approve" element={<Approve />} />
            <Route path="allinvities" element={<Allinvites />} />
          </Route>
        </Routes>
      </div>
    </Router>
    </GoogleOAuthProvider>
  );
}

export default App;
