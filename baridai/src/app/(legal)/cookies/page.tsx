"use client";

import Link from "next/link";
import Navbar from "@/components/layout/navbar";
import Footer from "@/components/layout/footer";

export default function CookiePolicy() {
  return (
    <div className="min-h-screen font-[family-name:var(--font-geist-sans)] bg-white dark:bg-gray-900 text-[#1D1D1F] dark:text-white">
      <Navbar showToggle={false} transparent={false} />

      {/* Cookie Policy Content */}
      <main className="py-16">
        <div className="container mx-auto px-6 max-w-4xl">
          <div className="mb-12 text-center">
            <h1 className="text-4xl font-bold mb-4">Cookie Policy</h1>
            <p className="text-gray-600 dark:text-gray-300">
              Last Updated: May 25, 2025
            </p>
          </div>

          <div className="prose prose-lg dark:prose-invert max-w-none">
            <h2>Introduction</h2>
            <p>
              This Cookie Policy explains how Barid AI ("we", "us", "our"), a
              product of ROXATE LTD (UK Registered Company No. 16232608), uses
              cookies and similar technologies when you visit our website
              (baridai.com) and use our services. This policy should be read
              alongside our{" "}
              <Link
                href="/privacy"
                className="text-blue-500 hover:text-blue-600"
              >
                Privacy Policy
              </Link>{" "}
              and{" "}
              <Link href="/terms" className="text-blue-500 hover:text-blue-600">
                Terms of Service
              </Link>
              .
            </p>

            <h2>What Are Cookies?</h2>
            <p>
              Cookies are small text files placed on your device by websites you
              visit. They are widely used to make websites work, improve
              efficiency, and provide information to site owners. Cookies can be
              session-based (deleted when you close your browser) or persistent
              (remain until they expire or are deleted).
            </p>

            <h2>Types of Cookies We Use</h2>
            <ul>
              <li>
                <strong>Essential Cookies:</strong> Necessary for the website to
                function, such as authentication and security. You cannot opt
                out of these cookies.
              </li>
              <li>
                <strong>Performance/Analytics Cookies:</strong> Help us
                understand how visitors interact with our website, so we can
                improve user experience. For example, we use Google Analytics to
                collect anonymous usage data.
              </li>
              <li>
                <strong>Functionality Cookies:</strong> Enable enhanced features
                and personalization, such as remembering your preferences.
              </li>
              <li>
                <strong>Advertising/Targeting Cookies:</strong> Used to deliver
                relevant ads and track the effectiveness of our marketing
                campaigns. These may be set by us or third-party providers.
              </li>
              <li>
                <strong>Social Media Cookies:</strong> Enable sharing and
                integration with social media platforms, such as Instagram and
                Facebook.
              </li>
            </ul>

            <h2>Third-Party Cookies</h2>
            <p>
              We may allow third-party service providers to set cookies on your
              device for analytics, advertising, and social media integration.
              These providers include, but are not limited to:
            </p>
            <ul>
              <li>Google Analytics</li>
              <li>Meta/Facebook Pixel</li>
              <li>LinkedIn Insights</li>
              <li>Payment processors</li>
              <li>Customer support platforms</li>
            </ul>
            <p>
              These third parties may use cookies, web beacons, and similar
              technologies to collect or receive information from our website
              and elsewhere on the internet to provide measurement services and
              target ads. Their use of your data is governed by their own
              privacy and cookie policies.
            </p>

            <h2>Meta/Instagram Platform Cookies</h2>
            <p>
              As our service integrates with Instagram and other Meta platforms,
              you may encounter cookies related to Meta services. These cookies
              are subject to Meta's own cookie policies and are not controlled
              by Barid AI. They help facilitate proper functioning of the
              Instagram integration and authentication processes.
            </p>

            <h2>Managing Cookies</h2>
            <p>
              You can control and manage cookies in your browser settings. Most
              browsers allow you to refuse or delete cookies. However, disabling
              essential cookies may affect the functionality of our website.
            </p>
            <ul>
              <li>
                <a
                  href="https://support.google.com/chrome/answer/95647"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-blue-500 hover:text-blue-600"
                >
                  Google Chrome
                </a>
              </li>
              <li>
                <a
                  href="https://support.mozilla.org/en-US/kb/cookies-information-websites-store-on-your-computer"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-blue-500 hover:text-blue-600"
                >
                  Mozilla Firefox
                </a>
              </li>
              <li>
                <a
                  href="https://support.microsoft.com/en-us/microsoft-edge/delete-cookies-in-microsoft-edge-63947406-40ac-c3b8-57b9-2a946a29ae09"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-blue-500 hover:text-blue-600"
                >
                  Microsoft Edge
                </a>
              </li>
              <li>
                <a
                  href="https://support.apple.com/guide/safari/manage-cookies-and-website-data-sfri11471/mac"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-blue-500 hover:text-blue-600"
                >
                  Safari
                </a>
              </li>
            </ul>
            <p>
              You may also opt out of certain third-party cookies for
              advertising purposes via:
            </p>
            <ul>
              <li>
                <a
                  href="http://optout.aboutads.info/"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-blue-500 hover:text-blue-600"
                >
                  Digital Advertising Alliance
                </a>
              </li>
              <li>
                <a
                  href="http://optout.networkadvertising.org/"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-blue-500 hover:text-blue-600"
                >
                  Network Advertising Initiative
                </a>
              </li>
              <li>
                <a
                  href="http://www.youronlinechoices.com/"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-blue-500 hover:text-blue-600"
                >
                  European Interactive Digital Advertising Alliance
                </a>{" "}
                (for users in the EU)
              </li>
            </ul>

            <h2>Do Not Track</h2>
            <p>
              Some browsers offer a "Do Not Track" feature. Our website does not
              currently respond to Do Not Track signals, but you can manage
              tracking through your browser settings and cookie preferences.
            </p>

            <h2>Updates to This Cookie Policy</h2>
            <p>
              We may update this Cookie Policy from time to time to reflect
              changes in technology, regulation, or our business practices. Any
              changes will become effective when we post the revised policy on
              our website. We encourage you to periodically review this page for
              the latest information on our cookie practices.
            </p>

            <h2>Contact Us</h2>
            <p>
              If you have any questions about our use of cookies or this Cookie
              Policy, please contact us at:
              <br />
              Email: privacy@roxate.com
              <br />
              Address: ROXATE LTD, 71-75 Shelton Street, Covent Garden, London,
              United Kingdom, WC2H 9JQ
            </p>
          </div>

          <div className="mt-12 pt-8 border-t border-gray-200 dark:border-gray-700 text-center">
            <p className="text-gray-600 dark:text-gray-400 text-sm">
              This Cookie Policy should be read in conjunction with our{" "}
              <Link
                href="/privacy"
                className="text-blue-500 hover:text-blue-600 transition"
              >
                Privacy Policy
              </Link>{" "}
              and{" "}
              <Link
                href="/terms"
                className="text-blue-500 hover:text-blue-600 transition"
              >
                Terms of Service
              </Link>
              .
            </p>
          </div>
        </div>
      </main>

      {/* Using the reusable Footer component */}
      <Footer highlightedLink="cookies" />
    </div>
  );
}
