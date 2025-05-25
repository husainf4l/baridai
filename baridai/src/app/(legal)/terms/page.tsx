"use client";

import Link from "next/link";
import Navbar from "@/components/layout/navbar";
import Footer from "@/components/layout/footer";

export default function TermsOfService() {
  return (
    <div className="min-h-screen font-[family-name:var(--font-geist-sans)] bg-white dark:bg-gray-900 text-[#1D1D1F] dark:text-white">
      <Navbar showToggle={false} transparent={false} />

      {/* Terms of Service Content */}
      <main className="py-16">
        <div className="container mx-auto px-6 max-w-4xl">
          <div className="mb-12 text-center">
            <h1 className="text-4xl font-bold mb-4">Terms of Service</h1>
            <p className="text-gray-600 dark:text-gray-300">
              Last Updated: May 25, 2025
            </p>
          </div>

          <div className="prose prose-lg dark:prose-invert max-w-none">
            <h2>1. Acceptance of Terms</h2>
            <p>
              By accessing or using Barid AI (a product of ROXATE LTD, UK
              Registered Company No. 16232608), you agree to be bound by these
              Terms of Service and our Privacy Policy. If you do not agree, do
              not use our services.
            </p>

            <h2>2. Service Overview</h2>
            <p>
              Barid AI provides AI-powered automation for Instagram direct
              messages and related analytics. Our services allow you to connect
              your Instagram Business Account, configure AI responses, and
              manage engagement. We comply with Meta Platform Terms and
              Instagram Platform Policies.
            </p>

            <h2>3. Eligibility</h2>
            <ul>
              <li>You must be at least 18 years old.</li>
              <li>
                You must provide accurate and complete registration information.
              </li>
              <li>
                You are responsible for maintaining the security of your
                account.
              </li>
              <li>
                You must have the legal right to connect any Instagram account
                you use with Barid AI.
              </li>
            </ul>

            <h2>4. Account and User Responsibilities</h2>
            <ul>
              <li>Keep your login credentials confidential and secure.</li>
              <li>
                Notify us immediately of any unauthorized use of your account.
              </li>
              <li>
                Comply with all applicable laws and third-party terms (including
                Meta/Instagram policies).
              </li>
              <li>
                Do not use Barid AI for unlawful, harmful, or abusive purposes.
              </li>
              <li>
                Do not use Barid AI to send spam or unsolicited communications.
              </li>
              <li>
                Do not attempt to circumvent security or access restrictions.
              </li>
              <li>
                Do not use Barid AI to generate or distribute content that is
                deceptive, discriminatory, or violates third-party rights.
              </li>
            </ul>

            <h2>5. Instagram Platform Compliance</h2>
            <ul>
              <li>
                Only connect Instagram Business Accounts you own or are
                authorized to manage.
              </li>
              <li>
                Do not use Barid AI in ways that violate Meta or Instagram’s
                terms or policies.
              </li>
              <li>
                Barid AI is not endorsed by or affiliated with Meta or
                Instagram.
              </li>
              <li>
                We may lose access to Instagram APIs if Meta/Instagram changes
                their terms or policies.
              </li>
            </ul>

            <h2>6. Subscriptions, Payments, and Trials</h2>
            <ul>
              <li>
                Subscription fees and billing terms are presented at signup and
                may change with notice.
              </li>
              <li>
                Subscriptions renew automatically unless canceled before the
                renewal date.
              </li>
              <li>Fees are non-refundable except as required by law.</li>
              <li>
                Free trials may be offered and will convert to paid
                subscriptions unless canceled before the trial ends.
              </li>
              <li>You are responsible for all applicable taxes and fees.</li>
            </ul>

            <h2>7. Intellectual Property</h2>
            <ul>
              <li>
                Barid AI and its content are owned by or licensed to ROXATE LTD
                and protected by law.
              </li>
              <li>
                You retain ownership of your content but grant us a license to
                use it for providing and improving our services.
              </li>
              <li>
                If you provide feedback, you grant us a perpetual, royalty-free
                license to use it without restriction.
              </li>
            </ul>

            <h2>8. Termination</h2>
            <ul>
              <li>
                We may suspend or terminate your account for any reason,
                including violation of these terms.
              </li>
              <li>
                You may terminate your account at any time by contacting support
                or using your account settings.
              </li>
              <li>
                Upon termination, your right to use Barid AI ceases immediately,
                and we may delete your data as permitted by law.
              </li>
            </ul>

            <h2>9. Disclaimers</h2>
            <p>
              Barid AI is provided “as is” and “as available.” We make no
              warranties, express or implied, regarding the service, including
              fitness for a particular purpose, accuracy, or non-infringement.
              We do not guarantee any specific results from using Barid AI.
            </p>

            <h2>10. Limitation of Liability</h2>
            <p>
              To the maximum extent permitted by law, ROXATE LTD and its
              affiliates will not be liable for any indirect, incidental,
              special, consequential, or punitive damages, or for any loss of
              profits, data, or goodwill, arising from your use of Barid AI. Our
              total liability will not exceed the greater of $100 or the amount
              you paid for the service in the past 12 months.
            </p>

            <h2>11. Indemnification</h2>
            <p>
              You agree to indemnify and hold harmless ROXATE LTD and its
              affiliates from any claims, damages, or expenses arising from your
              use of Barid AI, your content, or your violation of these terms or
              any third-party rights.
            </p>

            <h2>12. Modifications to Terms</h2>
            <p>
              We may update these terms at any time. Changes will be posted on
              our website and are effective upon posting. Continued use of Barid
              AI after changes means you accept the new terms.
            </p>

            <h2>13. Governing Law</h2>
            <p>
              These terms are governed by the laws of the United Kingdom. Any
              disputes will be resolved in the courts of the United Kingdom,
              unless otherwise required by applicable law.
            </p>

            <h2>14. Contact</h2>
            <p>
              For questions or concerns, contact us at legal@roxate.com.
              <br />
              Address: ROXATE LTD, 71-75 Shelton Street, Covent Garden, London,
              United Kingdom, WC2H 9JQ
            </p>
          </div>

          <div className="mt-12 pt-8 border-t border-gray-200 dark:border-gray-700 text-center">
            <p className="text-gray-600 dark:text-gray-400 text-sm">
              By using our Services, you acknowledge that you have read,
              understood, and agree to these Terms of Service and our{" "}
              <Link
                href="/privacy"
                className="text-blue-500 hover:text-blue-600 transition"
              >
                Privacy Policy
              </Link>
              .
            </p>
          </div>
        </div>
      </main>

      {/* Using the reusable Footer component */}
      <Footer highlightedLink="terms" />
    </div>
  );
}
