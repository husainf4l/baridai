"use client";

import Navbar from "@/components/layout/navbar";
import Footer from "@/components/layout/footer";
import { Mail } from "lucide-react";

export default function DataDeletion() {
  return (
    <div className="min-h-screen font-[family-name:var(--font-geist-sans)] bg-white dark:bg-gray-900 text-[#1D1D1F] dark:text-white">
      <Navbar showToggle={false} transparent={false} />

      {/* Data Deletion Content */}
      <main className="py-16">
        <div className="container mx-auto px-6 max-w-4xl">
          <div className="mb-12 text-center">
            <h1 className="text-4xl font-bold mb-4">Data Deletion Instructions</h1>
            <p className="text-gray-600 dark:text-gray-300">
              Request to delete your personal data from Barid AI
            </p>
          </div>

          <div className="max-w-2xl mx-auto">
            <div className="bg-gray-50 dark:bg-gray-800 rounded-2xl p-8 text-center">
              <div className="w-16 h-16 bg-blue-100 dark:bg-blue-900 rounded-full flex items-center justify-center mx-auto mb-6">
                <Mail className="w-8 h-8 text-blue-600 dark:text-blue-400" />
              </div>
              
              <h2 className="text-2xl font-semibold mb-4">Request Data Deletion</h2>
              
              <p className="text-gray-600 dark:text-gray-300 mb-6 leading-relaxed">
                To request deletion of your data, please email us with your Instagram handle or ID. 
                We will process your request in accordance with applicable data protection laws.
              </p>
              
              <div className="bg-white dark:bg-gray-700 rounded-lg p-4 mb-6">
                <p className="text-sm text-gray-500 dark:text-gray-400 mb-2">Send your request to:</p>
                <a 
                  href="mailto:al-hussein@papayatrading.com"
                  className="text-blue-600 dark:text-blue-400 hover:underline font-medium text-lg"
                >
                  al-hussein@papayatrading.com
                </a>
              </div>
              
              <div className="text-left">
                <h3 className="font-semibold mb-3">Please include in your email:</h3>
                <ul className="text-gray-600 dark:text-gray-300 space-y-2">
                  <li className="flex items-start">
                    <span className="w-2 h-2 bg-blue-500 rounded-full mt-2 mr-3 flex-shrink-0"></span>
                    Your Instagram handle or ID
                  </li>
                  <li className="flex items-start">
                    <span className="w-2 h-2 bg-blue-500 rounded-full mt-2 mr-3 flex-shrink-0"></span>
                    The email address associated with your Barid AI account
                  </li>
                  <li className="flex items-start">
                    <span className="w-2 h-2 bg-blue-500 rounded-full mt-2 mr-3 flex-shrink-0"></span>
                    Confirmation that you want all your data deleted
                  </li>
                </ul>
              </div>
              
              <div className="mt-8 p-4 bg-blue-50 dark:bg-blue-900/30 rounded-lg">
                <p className="text-sm text-blue-700 dark:text-blue-300">
                  <strong>Note:</strong> Data deletion is permanent and cannot be undone. 
                  Please ensure you have downloaded any data you wish to keep before requesting deletion.
                </p>
              </div>
            </div>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
}
