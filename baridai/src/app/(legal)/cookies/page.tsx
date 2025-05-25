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
              Cookies are small text files that are stored on your browser or
              device when you visit a website. They allow websites to recognize
              your device and remember information about your visit, such as
              your preferences or login information. Cookies are widely used to
              make websites work more efficiently and provide valuable
              information to website owners.
            </p>

            <h2>Types of Cookies We Use</h2>
            <p>We use the following types of cookies on our website:</p>

            <h3>Essential Cookies</h3>
            <p>
              These cookies are necessary for the website to function properly.
              They enable basic functions like page navigation, secure areas
              access, and account authentication. The website cannot function
              properly without these cookies, and they can only be disabled by
              changing your browser preferences.
            </p>
            <ul>
              <li>
                <strong>Session Cookies:</strong> These temporary cookies are
                erased when you close your browser and do not collect
                information from your device.
              </li>
              <li>
                <strong>Authentication Cookies:</strong> These cookies help us
                identify registered users to provide access to secured content
                and features.
              </li>
            </ul>

            <h3>Analytical/Performance Cookies</h3>
            <p>
              These cookies allow us to recognize and count the number of
              visitors and see how visitors move around our website. This helps
              us improve website performance and ensure users can easily find
              what they're looking for.
            </p>
            <ul>
              <li>
                <strong>Google Analytics:</strong> We use Google Analytics to
                collect anonymous information about how visitors use our
                website. This helps us understand which parts of our site are
                most popular and identify areas for improvement.
              </li>
              <li>
                <strong>Performance Tracking:</strong> These cookies collect
                information about page load times, error messages, and other
                performance-related data.
              </li>
            </ul>

            <h3>Functionality Cookies</h3>
            <p>
              These cookies enable enhanced functionality and personalization,
              such as remembering your preferences and settings (like language
              or region), or providing features like live chats.
            </p>

            <h3>Targeting/Advertising Cookies</h3>
            <p>
              These cookies are used to deliver advertisements that are relevant
              to you and your interests. They are also used to limit the number
              of times you see an advertisement and measure the effectiveness of
              advertising campaigns.
            </p>
            <ul>
              <li>
                <strong>Social Media Cookies:</strong> Our site includes
                features from social media platforms (like "Share" or "Like"
                buttons) that may set cookies when you use these features.
              </li>
              <li>
                <strong>Marketing Cookies:</strong> These cookies track your
                online activity to help advertisers deliver more relevant
                advertising or limit the number of times you see an ad.
              </li>
            </ul>

            <h2>Third-Party Cookies</h2>
            <p>
              In addition to our own cookies, we may also use various
              third-party cookies to report usage statistics, deliver
              advertisements, and so on. These cookies may include:
            </p>
            <ul>
              <li>Google Analytics</li>
              <li>Facebook Pixel</li>
              <li>LinkedIn Insights</li>
              <li>Intercom or other customer service platforms</li>
              <li>Payment processors</li>
            </ul>
            <p>
              These third parties may use cookies, web beacons, and similar
              technologies to collect or receive information from our website
              and elsewhere on the internet to provide measurement services and
              target ads.
            </p>

            <h2>Meta Platform Cookies</h2>
            <p>
              As our service integrates with Instagram and other Meta platforms,
              you may encounter cookies related to Meta services when using
              Barid AI. These cookies are subject to Meta's own cookie policies
              and are not controlled by Barid AI. They help facilitate proper
              functioning of the Instagram integration and authentication
              processes.
            </p>

            <h2>Cookie Management</h2>
            <h3>Browser Settings</h3>
            <p>
              Most web browsers allow you to manage your cookie preferences. You
              can set your browser to refuse cookies or delete certain cookies.
              Generally, you can also manage similar technologies in the same
              way that you manage cookies using your browser's settings.
            </p>
            <p>
              You can find information on how to manage cookies in your browser
              here:
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

            <h3>Our Cookie Banner</h3>
            <p>
              When you first visit our website, you will be shown a cookie
              banner that allows you to accept or decline non-essential cookies.
              You can change your preferences at any time by clicking on "Cookie
              Preferences" in the website footer.
            </p>

            <h3>Opting Out of Specific Third-Party Cookies</h3>
            <p>
              For cookies that are used for advertising purposes, you can also
              opt out via:
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
              Some browsers have a "Do Not Track" feature that lets you tell
              websites that you do not want to have your online activities
              tracked. Currently, there is no standard for how online services
              should respond to "Do Not Track" signals, but we honor them when
              technically possible.
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
            </p>
            <p>
              Email: privacy@roxate.com
              <br />
              Phone: +447822015226
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
