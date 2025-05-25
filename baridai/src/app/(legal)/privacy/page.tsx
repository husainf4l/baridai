"use client";

import Link from "next/link";
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
              Welcome to Barid AI. We respect your privacy and are committed to
              protecting your personal data. This Privacy Policy explains how we
              collect, use, disclose, and safeguard your information when you
              use our service.
            </p>
            <p>
              Barid AI is a product of ROXATE LTD (UK Registered Company No.
              16232608). We provide AI-powered Instagram direct message
              automation services. We comply with Meta Platform Terms and
              Instagram Platform Terms and Policies for applications that access
              Instagram data. This policy applies to information we collect
              through our website and the Barid AI application.
            </p>

            <h2>Information We Collect</h2>

            <h3>Personal Data</h3>
            <p>We may collect the following types of personal data:</p>
            <ul>
              <li>
                <strong>Account Information:</strong> When you register for an
                account, we collect your name, email address, username, and
                password.
              </li>
              <li>
                <strong>Instagram Business Account Data:</strong> When you
                connect your Instagram Business Account, we receive access to
                specific data through Meta's APIs, including basic profile
                information, content, and direct messages as permitted by Meta.
              </li>
              <li>
                <strong>Payment Information:</strong> If you purchase a
                subscription, we collect payment details, billing information,
                and transaction history.
              </li>
              <li>
                <strong>Usage Data:</strong> We collect information about how
                you interact with our service, including log data, device
                information, IP address, browser type, and operating system.
              </li>
              <li>
                <strong>User-Generated Content:</strong> Information you provide
                when using our services, such as AI response configurations,
                brand voice settings, and custom message templates.
              </li>
            </ul>

            <h3>Instagram Account and Content Data</h3>
            <p>
              When you connect your Instagram account to Barid AI, we request
              permission to access certain data through Meta's APIs according to
              the permissions you grant. This may include:
            </p>
            <ul>
              <li>Profile data (username, business information)</li>
              <li>Direct messages (content, sender information, timestamps)</li>
              <li>
                Engagement metrics related to your Instagram business account
              </li>
              <li>Content information necessary for AI response generation</li>
            </ul>
            <p>
              We only request permissions that are necessary for providing our
              core services. You can review and revoke these permissions at any
              time through your Instagram account settings.
            </p>

            <h2>How We Use Your Information</h2>
            <p>We use the information we collect for the following purposes:</p>
            <ul>
              <li>
                <strong>Providing and Maintaining the Service:</strong> To
                deliver the functionality of Barid AI, including managing your
                account, processing payments, and enabling AI responses to
                Instagram direct messages.
              </li>
              <li>
                <strong>Improving and Personalizing:</strong> To understand how
                users interact with our service, improve features, and develop
                new products.
              </li>
              <li>
                <strong>Communications:</strong> To respond to your requests,
                provide customer support, send service updates, and marketing
                communications (when permitted).
              </li>
              <li>
                <strong>Security and Compliance:</strong> To detect and prevent
                fraud, protect our systems, and comply with legal obligations.
              </li>
              <li>
                <strong>AI Training:</strong> To train our AI systems to better
                understand and respond to direct messages in your brand voice,
                but only with your explicit consent.
              </li>
            </ul>

            <h2>Data Sharing and Disclosure</h2>
            <p>We may share your information with:</p>
            <ul>
              <li>
                <strong>Service Providers:</strong> Third-party vendors who
                perform services on our behalf, such as payment processing, data
                analysis, and customer service.
              </li>
              <li>
                <strong>Meta Companies:</strong> As required by Meta Platform
                Terms for applications that integrate with Instagram.
              </li>
              <li>
                <strong>Legal Requirements:</strong> When required by law,
                subpoena, or other legal processes.
              </li>
              <li>
                <strong>Business Transfers:</strong> In connection with a
                merger, acquisition, or sale of assets.
              </li>
              <li>
                <strong>With Your Consent:</strong> In other cases with your
                explicit consent.
              </li>
            </ul>
            <p>
              We do not sell your personal information or Instagram data to
              third parties.
            </p>

            <h2>Data Security</h2>
            <p>
              We implement appropriate technical and organizational measures to
              protect your personal data against unauthorized or unlawful
              processing, accidental loss, destruction, or damage. These
              measures include encryption, access controls, regular security
              assessments, and staff training.
            </p>
            <p>
              However, no method of transmission over the Internet or electronic
              storage is 100% secure. While we strive to use commercially
              acceptable means to protect your personal information, we cannot
              guarantee its absolute security.
            </p>

            <h2>Data Retention</h2>
            <p>
              We retain your personal data only for as long as necessary to
              fulfill the purposes for which we collected it, including for the
              purposes of satisfying any legal, regulatory, tax, accounting, or
              reporting requirements.
            </p>
            <p>
              If you delete your account, we will delete or anonymize your
              personal data within 30 days, except where we need to retain
              certain information for legitimate business or legal purposes.
            </p>

            <h2>Your Rights and Choices</h2>
            <p>
              Depending on your location, you may have rights regarding your
              personal data, including:
            </p>
            <ul>
              <li>Access your personal data</li>
              <li>Correct inaccurate data</li>
              <li>Delete your data</li>
              <li>Object to or restrict processing</li>
              <li>Data portability</li>
              <li>Withdraw consent</li>
            </ul>
            <p>
              You can exercise these rights by contacting us at
              privacy@roxate.com. We will respond to all legitimate requests
              within the timeframe required by applicable laws.
            </p>

            <h2>Instagram Platform Compliance</h2>
            <p>
              Barid AI complies with Meta Platform Terms and Instagram Platform
              Policies. We:
            </p>
            <ul>
              <li>
                Only request permissions that are necessary for our service
              </li>
              <li>Do not store Instagram user passwords</li>
              <li>Do not transfer Instagram data to data brokers</li>
              <li>
                Provide a clear method for users to disconnect their Instagram
                account from Barid AI
              </li>
              <li>
                Delete Instagram data upon request or when no longer needed
              </li>
              <li>
                Maintain appropriate security measures to protect Instagram data
              </li>
            </ul>

            <h2>Children's Privacy</h2>
            <p>
              Our services are not intended for individuals under the age of 18,
              and we do not knowingly collect personal data from children. If
              you believe we have collected personal data from anyone under 18,
              please contact us immediately.
            </p>

            <h2>International Data Transfers</h2>
            <p>
              Your information may be transferred to and processed in countries
              other than your country of residence. These countries may have
              data protection laws that differ from your country's laws.
            </p>
            <p>
              When we transfer data internationally, we use appropriate
              safeguards such as Standard Contractual Clauses to ensure your
              data is protected.
            </p>

            <h2>Changes to This Privacy Policy</h2>
            <p>
              We may update this Privacy Policy from time to time to reflect
              changes in our practices or for other operational, legal, or
              regulatory reasons. The updated version will be effective as of
              the date stated at the top of this Privacy Policy.
            </p>
            <p>
              We will notify you of any material changes by posting the new
              Privacy Policy on this page and, where appropriate, sending you a
              notification or obtaining consent as required by applicable laws.
            </p>

            <h2>Contact Us</h2>
            <p>
              If you have any questions about this Privacy Policy or our data
              practices, please contact us at:
            </p>
            <p>
              Email: privacy@roxate.com
              <br />
              Phone: +447822015226
              <br />
              Address: ROXATE LTD, 71-75 Shelton Street, Covent Garden, London,
              United Kingdom, WC2H 9JQ
            </p>
            <p>
              For inquiries related to data protection, you can contact our Data
              Protection Officer at privacy@roxate.com.
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
