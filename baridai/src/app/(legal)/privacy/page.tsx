"use client";

import Navbar from "@/components/layout/navbar";
import Footer from "@/components/layout/footer";

export default function PrivacyPolicy() {
  return (
    <div className="min-h-screen font-[family-name:var(--font-geist-sans)] bg-white dark:bg-gray-900 text-[#1D1D1F] dark:text-white">
      <Navbar showToggle={false} transparent={false} />

      {/* Privacy Policy Content */}
      <main className="py-16">
        <div className="container mx-auto px-6 max-w-4xl">
          <div className="mb-12 text-center">
            <h1 className="text-4xl font-bold mb-4">Privacy Policy</h1>
            <p className="text-gray-600 dark:text-gray-300">
              Last Updated: May 25, 2025
            </p>
          </div>

          <div className="prose prose-lg dark:prose-invert max-w-none">
            <h2>Introduction</h2>
            <p>
              This Privacy Policy describes how Barid AI (a product of ROXATE
              LTD, UK Registered Company No. 16232608) collects, uses, shares,
              and protects your information when you use our website, platform,
              and services. We are committed to transparency and to safeguarding
              your privacy in compliance with Meta Platform Terms and Instagram
              Platform Policies.
            </p>

            <h2>Information We Collect</h2>
            <ul>
              <li>
                <strong>Account Data:</strong> When you register, we collect
                your name, email, username, and password.
              </li>
              <li>
                <strong>Instagram Data:</strong> If you connect your Instagram
                Business Account, we access data via Meta’s APIs, such as
                profile info, content, engagement metrics, and direct messages,
                only as permitted and necessary for our features.
              </li>
              <li>
                <strong>Usage Data:</strong> We collect information about your
                interactions with Barid AI, including device info, IP address,
                browser type, and usage logs.
              </li>
              <li>
                <strong>Payment Data:</strong> If you purchase a subscription,
                we process payment and billing information via secure
                third-party providers.
              </li>
              <li>
                <strong>Support and Communications:</strong> If you contact us,
                we may keep records of your correspondence.
              </li>
            </ul>

            <h2>How We Use Your Information</h2>
            <ul>
              <li>
                To provide, maintain, and improve Barid AI’s services and
                features.
              </li>
              <li>
                To personalize your experience and deliver relevant content.
              </li>
              <li>To process payments and manage subscriptions.</li>
              <li>
                To communicate with you about updates, support, and marketing
                (with your consent).
              </li>
              <li>
                To comply with legal obligations and protect our rights and
                users.
              </li>
              <li>
                To train and improve our AI models, only with your explicit
                consent.
              </li>
            </ul>

            <h2>How We Share Information</h2>
            <ul>
              <li>
                <strong>Service Providers:</strong> We may share data with
                trusted vendors who help us operate Barid AI (e.g., payment
                processors, analytics, hosting).
              </li>
              <li>
                <strong>Meta/Instagram:</strong> As required by Meta Platform
                Terms for applications that integrate with Instagram.
              </li>
              <li>
                <strong>Legal Compliance:</strong> We may disclose information
                if required by law or to protect our rights and users.
              </li>
              <li>
                <strong>Business Transfers:</strong> If Barid AI is acquired or
                merged, your data may be transferred as part of that
                transaction.
              </li>
              <li>
                <strong>With Your Consent:</strong> We may share information for
                other purposes with your explicit consent.
              </li>
            </ul>

            <h2>Data Security</h2>
            <p>
              We use industry-standard security measures to protect your data,
              including encryption, access controls, and regular security
              assessments. However, no system is 100% secure. We encourage you
              to use strong passwords and protect your account.
            </p>

            <h2>Your Rights</h2>
            <ul>
              <li>Access, update, or delete your personal data.</li>
              <li>Withdraw consent or object to certain processing.</li>
              <li>
                Contact us at privacy@roxate.com for any privacy-related
                requests.
              </li>
            </ul>

            <h2>International Transfers</h2>
            <p>
              Your data may be processed outside your country. We use safeguards
              such as Standard Contractual Clauses to ensure your data is
              protected according to applicable law.
            </p>

            <h2>Children’s Privacy</h2>
            <p>
              Barid AI is not intended for children under 18. We do not
              knowingly collect data from minors. If you believe we have
              collected data from a child, please contact us immediately.
            </p>

            <h2>Meta/Instagram Platform Compliance</h2>
            <ul>
              <li>We only request permissions necessary for our service.</li>
              <li>We do not store Instagram user passwords.</li>
              <li>We do not transfer Instagram data to data brokers.</li>
              <li>
                We provide a clear method for users to disconnect their
                Instagram account from Barid AI.
              </li>
              <li>
                We delete Instagram data upon request or when no longer needed.
              </li>
              <li>
                We maintain appropriate security measures to protect Instagram
                data.
              </li>
            </ul>

            <h2>Changes to This Policy</h2>
            <p>
              We may update this policy. We will notify you of significant
              changes and post the new policy on our website. The updated
              version will be effective as of the date stated at the top of this
              Privacy Policy.
            </p>

            <h2>Contact</h2>
            <p>
              For questions or concerns, contact us at privacy@roxate.com.
              <br />
              Address: ROXATE LTD, 71-75 Shelton Street, Covent Garden, London,
              United Kingdom, WC2H 9JQ
            </p>
          </div>

          <div className="mt-12 pt-8 border-t border-gray-200 dark:border-gray-700 text-center">
            <p className="text-gray-600 dark:text-gray-400 text-sm">
              For additional information on how Meta or Instagram handle your
              data, please refer to the{" "}
              <a
                href="https://www.facebook.com/privacy/policy/"
                target="_blank"
                rel="noopener noreferrer"
                className="text-blue-500 hover:text-blue-600 transition"
              >
                Meta Privacy Policy
              </a>
              .
            </p>
          </div>
        </div>
      </main>

      <Footer highlightedLink="privacy" />
    </div>
  );
}
