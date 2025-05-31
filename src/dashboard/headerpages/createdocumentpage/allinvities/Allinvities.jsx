import React from 'react';
import { FaHome, FaCopy, FaFilePdf } from 'react-icons/fa';
import { FiExternalLink } from 'react-icons/fi';

const Allinvities = () => {
  return (
    <div className="flex gap-6">

      {/* Right content - smaller version of original */}
      <section className="flex-1 p-6 bg-white rounded-2xl shadow-lg text-sm text-gray-700 border border-gray-100">
        {/* Back link */}
        <div className="flex items-center gap-2 text-[#3470b2] font-semibold mb-4 group">
          <FaHome className="transition-transform group-hover:-translate-x-1" />
          <span className="group-hover:underline cursor-pointer">Back to Home</span>
        </div>

        {/* Status badge */}
        <div className="absolute top-6 right-6">
          <span className="px-3 py-1 bg-blue-100 text-[#3470b2] rounded-full text-xs font-semibold">
            Pending
          </span>
        </div>

        {/* Document title */}
        <div className="flex items-center gap-3 mb-6">
          <div className="p-2 bg-blue-50 rounded-lg text-[#3470b2]">
            <FaFilePdf size={20} />
          </div>
          <div>
            <h2 className="text-xl font-bold text-[#3470b2]">frontend.pdf</h2>
            <p className="text-gray-500 text-xs mt-1">Created on 15 May 2023</p>
          </div>
        </div>

        {/* Metadata grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
          {/* Doc ID */}
          <div className="p-3 bg-gray-50 rounded-lg border border-gray-200">
            <p className="text-gray-500 text-xs font-medium mb-1">Doc ID</p>
            <div className="flex items-center justify-between">
              <span className="font-mono text-black text-xs truncate">683af35e501ec84d69e8b2c0</span>
              <button className="text-gray-500 hover:text-[#3470b2] transition-colors">
                <FaCopy size={14} />
              </button>
            </div>
          </div>

          {/* Reference No. */}
          <div className="p-3 bg-gray-50 rounded-lg border border-gray-200">
            <p className="text-gray-500 text-xs font-medium mb-1">Reference No.</p>
            <div className="flex items-center justify-between">
              <span className="text-black text-xs truncate">uytyugtuy</span>
              <button className="text-gray-500 hover:text-[#3470b2] transition-colors">
                <FaCopy size={14} />
              </button>
            </div>
          </div>

          {/* Completion */}
          <div className="p-3 bg-gray-50 rounded-lg border border-gray-200">
            <p className="text-gray-500 text-xs font-medium mb-1">Completion</p>
            <div className="flex items-center gap-1 mb-1">
              <span className="text-black text-xs font-bold">0</span>
              <span className="text-gray-400 text-xs">/</span>
              <span className="text-gray-600 text-xs">4</span>
            </div>
            <div className="w-full h-1.5 bg-gray-200 rounded-full overflow-hidden">
              <div 
                className="h-full bg-gradient-to-r from-blue-400 to-[#3470b2] rounded-full" 
                style={{ width: '0%' }}
              ></div>
            </div>
          </div>
        </div>

        {/* Action buttons */}
        <div className="flex flex-wrap gap-2 mt-4">
          <button className="px-4 py-2 bg-[#3470b2] text-white rounded-lg text-sm font-medium hover:bg-blue-600 transition-colors flex items-center gap-1">
            <FiExternalLink size={14} /> View Document
          </button>
          <button className="px-4 py-2 border border-[#3470b2] text-[#3470b2] rounded-lg text-sm font-medium hover:bg-blue-50 transition-colors">
            Share
          </button>
          <button className="px-4 py-2 text-gray-600 rounded-lg text-sm font-medium hover:bg-gray-100 transition-colors">
            More Options
          </button>
        </div>
      </section>
      {/* Left sidebar - 400px width */}
      <div className="w-[400px] p-6 bg-white rounded-2xl shadow-lg border border-gray-100">
        <h3 className="text-lg font-semibold text-[#3470b2] mb-4">Document Details</h3>
        <div className="space-y-4">
          <div>
            <p className="text-gray-500 text-sm">Document Type</p>
            <p className="text-gray-800">PDF File</p>
          </div>
          <div>
            <p className="text-gray-500 text-sm">Uploaded By</p>
            <p className="text-gray-800">John Doe</p>
          </div>
          <div>
            <p className="text-gray-500 text-sm">Last Updated</p>
            <p className="text-gray-800">May 20, 2023</p>
          </div>
          <div>
            <p className="text-gray-500 text-sm">Expiration Date</p>
            <p className="text-gray-800">June 15, 2023</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Allinvities;