import React, { useState } from 'react';
import { CreditCard, Key, Plus, Check, Shield } from 'lucide-react';

// Reusable ToggleSwitch component
const ToggleSwitch = ({ enabled, setEnabled }) => {
  return (
    <button
      onClick={() => setEnabled(!enabled)}
      className={`relative inline-flex h-6 w-11 flex-shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-none focus:ring-2 focus:ring-offset-2 ${enabled ? 'bg-[#3470b2]' : 'bg-gray-300'}`}
      role="switch"
      aria-checked={enabled}
    >
      <span aria-hidden="true" className={`pointer-events-none inline-block h-5 w-5 transform rounded-full bg-white shadow ring-0 transition duration-200 ease-in-out ${enabled ? 'translate-x-5' : 'translate-x-0'}`} />
    </button>
  );
};

// Security Field Component
const SecurityField = ({ id, index, onRemove, canBeRemoved }) => {
  const [isRequired, setIsRequired] = useState(true);
  return (
    <div className="space-y-4 rounded-lg border border-gray-200 bg-white p-4 shadow-sm">
      <div className="flex items-center justify-between">
        <h3 className="font-semibold text-[15px] text-gray-700">Security Field {index + 1}</h3>
        {canBeRemoved && (
          <button onClick={() => onRemove(id)} className="text-[10px] font-medium text-red-500 hover:text-red-700">
            Remove Field
          </button>
        )}
      </div>
      <div className="space-y-1">
        <label htmlFor={`field-label-${id}`} className="block text-[12px] font-medium text-gray-700">Field Label <span className='text-red-500'>*</span></label>
        <input type="text" id={`field-label-${id}`} placeholder="e.g. What is your mother's name" className="block w-full rounded-md border-gray-300 shadow-sm focus:border-[#3470b2] focus:ring-[#3470b2] sm:text-sm"/>
      </div>
      <div className="space-y-1">
        <label htmlFor={`field-type-${id}`} className="block text-[12px] font-medium text-gray-700">Field Type <span className='text-red-500'>*</span></label>
        <select id={`field-type-${id}`} className="block w-full rounded-md border-gray-300 shadow-sm focus:border-[#3470b2] focus:ring-[#3470b2] sm:text-sm">
          <option>Text</option>
          <option>Number</option>
          <option>Date</option>
        </select>
      </div>
      <div className="flex items-center justify-between">
        <span className="text-sm font-medium text-gray-700">Required Field</span>
        <ToggleSwitch enabled={isRequired} setEnabled={setIsRequired} />
      </div>
    </div>
  );
};

// Aadhaar Section Component
const AadhaarSection = () => {
  const [enableAadhaar, setEnableAadhaar] = useState(false);
  const [maskAadhaar, setMaskAadhaar] = useState(true);

  return (
    <div className="space-y-6">
      <div className="rounded-lg border border-gray-200 bg-white p-6 shadow-sm">
        <h3 className="mb-4 text-lg font-semibold text-gray-800">Aadhaar Verification</h3>
        <div className="flex items-center justify-between">
          <div>
            <p className="text-sm font-medium text-gray-700">Enable Aadhaar Verification</p>
            <p className="text-xs text-gray-500">Require invitee to provide Aadhaar details</p>
          </div>
          <ToggleSwitch enabled={enableAadhaar} setEnabled={setEnableAadhaar} />
        </div>

        {enableAadhaar && (
          <div className="mt-6 space-y-4">
            <div className="space-y-1">
              <label className="block text-sm font-medium text-gray-700">Aadhaar Number</label>
              <input type="text" placeholder="Enter 12-digit Aadhaar number" className="block w-full rounded-md border-gray-300 shadow-sm focus:border-[#3470b2] focus:ring-[#3470b2] sm:text-sm" maxLength="12" />
            </div>
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-700">Mask Aadhaar Number</p>
                <p className="text-xs text-gray-500">Display only last 4 digits for security</p>
              </div>
              <ToggleSwitch enabled={maskAadhaar} setEnabled={setMaskAadhaar} />
            </div>
            <div className="space-y-1">
              <label className="block text-sm font-medium text-gray-700">Verification Method</label>
              <select className="block w-full rounded-md border-gray-300 shadow-sm focus:border-[#3470b2] focus:ring-[#3470b2] sm:text-sm">
                <option>OTP Verification</option>
                <option>Biometric Verification</option>
                <option>e-KYC Verification</option>
              </select>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

// Advanced Section Component
const AdvancedSection = () => {
  const [enableExpiry, setEnableExpiry] = useState(false);
  const [enableIPRestriction, setEnableIPRestriction] = useState(false);

  return (
    <div className="space-y-6">
      <div className="rounded-lg border border-gray-200 bg-white p-6 shadow-sm">
        <h3 className="mb-4 text-lg font-semibold text-gray-800">Advanced Settings</h3>
        <div className="space-y-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-700">Enable Session Expiry</p>
              <p className="text-xs text-gray-500">Automatically log out after inactivity</p>
            </div>
            <ToggleSwitch enabled={enableExpiry} setEnabled={setEnableExpiry} />
          </div>

          {enableExpiry && (
            <div className="space-y-1">
              <label className="block text-sm font-medium text-gray-700">Expiry Time (minutes)</label>
              <input type="number" min="1" defaultValue="30" className="block w-full rounded-md border-gray-300 shadow-sm focus:border-[#3470b2] focus:ring-[#3470b2] sm:text-sm" />
            </div>
          )}

          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-700">IP Address Restriction</p>
              <p className="text-xs text-gray-500">Limit access to specific IP addresses</p>
            </div>
            <ToggleSwitch enabled={enableIPRestriction} setEnabled={setEnableIPRestriction} />
          </div>

          {enableIPRestriction && (
            <div className="space-y-2">
              <label className="block text-sm font-medium text-gray-700">Allowed IP Addresses</label>
              <div className="flex items-center space-x-2">
                <input type="text" placeholder="e.g., 192.168.1.1" className="block flex-1 rounded-md border-gray-300 shadow-sm focus:border-[#3470b2] focus:ring-[#3470b2] sm:text-sm" />
                <button className="rounded-md bg-[#3470b2] px-3 py-1.5 text-sm font-medium text-white shadow-sm hover:bg-[#3470b2]">Add</button>
              </div>
              <div className="mt-2 rounded-md border border-gray-200 p-2">
                <p className="text-xs text-gray-500">No IP addresses added yet</p>
              </div>
            </div>
          )}

          <div className="space-y-1">
            <label className="block text-sm font-medium text-gray-700">Authentication Level</label>
            <select className="block w-full rounded-md border-gray-300 shadow-sm focus:border-[#3470b2] focus:ring-[#3470b2] sm:text-sm">
              <option>Standard (Password only)</option>
              <option>Two-Factor Authentication</option>
              <option>Biometric + Password</option>
            </select>
          </div>
        </div>
      </div>
    </div>
  );
};

const SidebarRequestfile = ({ onClose }) => {
  const [activeTab, setActiveTab] = useState('security');
  const [fields, setFields] = useState([{ id: 1 }]);

  const addField = () => {
    const newField = { id: Date.now() };
    setFields([...fields, newField]);
  };
  
  const removeField = (idToRemove) => {
    if (fields.length <= 1) {
      return; 
    }
    setFields(fields.filter((field) => field.id !== idToRemove));
  };

  const renderTabContent = () => {
    switch (activeTab) {
      case 'security':
        return (
          <>
            <p className="text-[12px] text-center text-red-600">
              Security and fields invitee must complete before signing.
            </p>
            <div className="space-y-5">
              {fields.map((field, index) => (
                <SecurityField 
                  key={field.id} 
                  id={field.id} 
                  index={index} 
                  onRemove={removeField} 
                  canBeRemoved={fields.length > 1}
                />
              ))}
            </div>
            <button 
              onClick={addField} 
              className="flex w-full items-center justify-center gap-2 rounded-md border-2 border-dashed border-gray-300 bg-white py-2.5 text-sm font-semibold text-gray-700 shadow-sm hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-[#3470b2] focus:ring-offset-2"
            >
              <Plus size={16} /> Add Another Security Field
            </button>
          </>
        );
      case 'aadhaar':
        return <AadhaarSection />;
      case 'advanced':
        return <AdvancedSection />;
      default:
        return null;
    }
  };

  return (
    <div className="flex h-full w-full flex-col bg-white">
      {/* Tabs */}
      <nav className="flex border-b border-gray-200 bg-white flex-shrink-0">
        <button
          onClick={() => setActiveTab('security')}
          className={`flex flex-1 items-center justify-center gap-2 border-b-2 px-4 py-3 text-sm font-medium ${activeTab === 'security' ? 'border-[#3470b2] text-[#3470b2]' : 'border-transparent text-gray-500 hover:text-gray-700'}`}
        >
          <Shield size={16} /> Security
        </button>
        <button
          onClick={() => setActiveTab('aadhaar')}
          className={`flex flex-1 items-center justify-center gap-2 border-b-2 px-4 py-3 text-sm font-medium ${activeTab === 'aadhaar' ? 'border-[#3470b2] text-[#3470b2]' : 'border-transparent text-gray-500 hover:text-gray-700'}`}
        >
          <CreditCard size={16} /> Aadhaar
        </button>
        <button
          onClick={() => setActiveTab('advanced')}
          className={`flex flex-1 items-center justify-center gap-2 border-b-2 px-4 py-3 text-sm font-medium ${activeTab === 'advanced' ? 'border-[#3470b2] text-[#3470b2]' : 'border-transparent text-gray-500 hover:text-gray-700'}`}
        >
          <Key size={16} /> Advanced
        </button>
      </nav>
      
      {/* Main Content (Scrollable Area) */}
      <main className="flex-1 overflow-y-auto p-6">
        <div className="space-y-6">
          {renderTabContent()}
        </div>
      </main>
      
      {/* Footer */}
      <footer className="border-t border-gray-200 bg-white px-6 py-4 flex-shrink-0">
        <div className="flex justify-end space-x-3">
          <button 
            onClick={onClose}
            className="rounded-md border border-gray-300 px-4 py-2 text-sm font-medium text-gray-700 shadow-sm hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-[#3470b2] focus:ring-offset-2"
          >
            Cancel
          </button>
          <button 
            className="flex items-center justify-center gap-2 rounded-md bg-[#3470b2] px-4 py-2 text-sm font-medium text-white shadow-sm hover:bg-[#2c5fa5] focus:outline-none focus:ring-2 focus:ring-[#3470b2] focus:ring-offset-2"
          >
            <Check size={16} /> Save Settings
          </button>
        </div>
      </footer>
    </div>
  );
};

export default SidebarRequestfile;