import React, { useState } from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import './App.css';
import Login from './login/Login';
import Signup from './signup/Signup';
import Maindashboard from './dashboard/Maindashboard';
import Home from './dashboard/sidebarpages/menu/home/Home';
import Analytics from './dashboard/sidebarpages/menu/analytics/Analytics';
import Rolemanagement from './dashboard/sidebarpages/menu/users/rolemanagement/Rolemanagement';
import Myteam from './dashboard/sidebarpages/menu/users/myteam/Myteam';
import Ipwhitelist from './dashboard/sidebarpages/menu/devtool/ipwhitelist/Ipwhitelist';
import Webhooks from './dashboard/sidebarpages/menu/devtool/webhooks/Webhooks';
import Logs from './dashboard/sidebarpages/menu/devtool/logs/Logs';
import Allverification from './dashboard/sidebarpages/menu/kycstudio/allverification/Allverification';
import Kyctemplate from './dashboard/sidebarpages/menu/kycstudio/kyctemplates/Kyctemplate';
import Transactionhistory from './dashboard/sidebarpages/wallettransaction/transactionhistory/Transactionhistory';
import SignAgreement from './dashboard/sidebarpages/document/documentfile/SignAgreement';
import Yourkyc from './dashboard/sidebarpages/document/yourkyc/Yourkyc';
import Draf from './dashboard/sidebarpages/document/drafts/Draf';
import Completed from './dashboard/sidebarpages/document/completed/Completed';
import Setting from './dashboard/sidebarpages/setting/Setting';
import Myprofile from './dashboard/headerpages/myprofile/Myprofile';
import Kycstatus from './dashboard/headerpages/kycstatus/Kycstatus';

function App() {
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [darkMode, setDarkMode] = useState(false);

  const toggleSidebar = () => {
    setSidebarOpen(!sidebarOpen);
  };

  const toggleDarkMode = () => {
    setDarkMode((prevMode) => !prevMode);
    document.body.classList.toggle('dark-mode', !darkMode);
  };

  return (
    <Router>
      <div className={`app ${darkMode ? 'dark-mode' : ''}`}>
        <Routes>
          <Route path="/" element={<Login />} />
          <Route path="/signup" element={<Signup />} />
          
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
            <Route path="role-management" element={<Rolemanagement />} />
            <Route path="my-team" element={<Myteam />} />
            <Route path="ip-whitelist" element={<Ipwhitelist />} />
            <Route path="webhooks" element={<Webhooks />} />
            <Route path="logs" element={<Logs />} />
            <Route path="allverification" element={<Allverification />} />
            <Route path="kyctemplates" element={<Kyctemplate />} />
            <Route path="transactionhistory" element={<Transactionhistory />} />
            <Route path="signed-agreement" element={<SignAgreement />} />
            <Route path="yourkyc" element={<Yourkyc /> } />
            <Route path="drafts" element={<Draf /> } />
            <Route path="completed" element={<Completed /> } />
            <Route path="setting" element={<Setting /> } />

            <Route path="myprofile" element={<Myprofile />} />
            <Route path="kycstatus" element={<Kycstatus /> } />
          </Route>
        </Routes>
      </div>
    </Router>
  );
}

export default App;