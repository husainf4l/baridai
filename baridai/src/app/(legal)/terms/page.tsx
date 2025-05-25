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
            <h2>1. Agreement to Terms</h2>
            <p>
              These Terms of Service ("Terms") govern your access to and use of
              Barid AI's website, APIs, mobile applications, and other services
              (collectively, the "Services"). Barid AI is a product of ROXATE
              LTD (UK Registered Company No. 16232608). By using our Services,
              you agree to be bound by these Terms and our Privacy Policy. If
              you are using our Services on behalf of an organization, you
              represent and warrant that you have the authority to bind that
              organization to these Terms.
            </p>
            <p>
              IF YOU DO NOT AGREE WITH THESE TERMS, DO NOT ACCESS OR USE OUR
              SERVICES.
            </p>

            <h2>2. Service Description</h2>
            <p>
              Barid AI provides AI-powered automation for Instagram direct
              messages. Our Services allow users to connect their Instagram
              Business Accounts, configure AI response preferences, and automate
              interactions with their followers and customers. Features include:
            </p>
            <ul>
              <li>Instagram DM automation through AI-powered responses</li>
              <li>Custom AI training based on your brand voice</li>
              <li>Analytics and reporting on Instagram engagement</li>
              <li>Integration with Instagram Business Accounts</li>
            </ul>
            <p>
              Our Services are designed to comply with Meta Platform Terms and
              Instagram Platform Policies.
            </p>

            <h2>3. Eligibility and Registration</h2>
            <p>To use our Services, you must:</p>
            <ul>
              <li>Be at least 18 years old</li>
              <li>Create an account with accurate and complete information</li>
              <li>Maintain the security of your account credentials</li>
              <li>
                Notify us immediately of any unauthorized use of your account
              </li>
              <li>
                Own or have proper authorization to use the Instagram Business
                Account you connect to our Services
              </li>
            </ul>
            <p>
              You are responsible for all activities that occur under your
              account. We reserve the right to reclaim usernames that violate
              trademark rights or appear to impersonate others.
            </p>

            <h2>4. Instagram Platform Integration</h2>
            <p>
              Our Services integrate with Instagram through Meta's APIs and
              platform. By using our Services, you acknowledge and agree to the
              following:
            </p>
            <ul>
              <li>
                You must comply with all applicable Meta Platform Terms,
                Instagram Platform Policies, and Instagram Community Guidelines
              </li>
              <li>
                You must only connect Instagram Business Accounts that you own
                or have legal authority to manage
              </li>
              <li>
                You are responsible for ensuring that your use of our Services
                complies with Instagram's terms and policies
              </li>
              <li>
                Meta or Instagram may change their APIs, terms, or policies at
                any time, which may affect our Services
              </li>
              <li>
                You may not use our Services in ways that violate Meta's or
                Instagram's terms or policies
              </li>
            </ul>
            <p>
              Barid AI is not endorsed by, directly affiliated with, maintained,
              authorized, or sponsored by Meta, Instagram, or their affiliates.
              All Instagram and Meta logos, trademarks, and brand elements are
              property of their respective owners.
            </p>

            <h2>5. User Responsibilities</h2>
            <p>When using our Services, you agree to:</p>
            <ul>
              <li>
                Comply with all applicable laws, regulations, and third-party
                terms
              </li>
              <li>
                Not use our Services for any illegal, harmful, or offensive
                purposes
              </li>
              <li>Not attempt to breach or circumvent any security measures</li>
              <li>
                Not engage in any activity that interferes with or disrupts our
                Services
              </li>
              <li>
                Not use our Services to send spam or unsolicited communications
              </li>
              <li>
                Not use our AI to generate content that is deceptive,
                discriminatory, harmful, or in violation of third-party rights
              </li>
              <li>
                Ensure all content processed through our Services complies with
                applicable laws and regulations
              </li>
              <li>
                Maintain all necessary rights and permissions for content you
                provide to our Services
              </li>
            </ul>

            <h2>6. Prohibited Uses</h2>
            <p>You may not use our Services to:</p>
            <ul>
              <li>Violate any laws, regulations, or third-party rights</li>
              <li>
                Engage in deceptive practices, fraud, or misrepresentation
              </li>
              <li>Distribute malware, viruses, or other harmful code</li>
              <li>
                Harvest or collect user information without proper consent
              </li>
              <li>
                Scrape, extract, or mine data from Instagram beyond what's
                explicitly permitted
              </li>
              <li>
                Generate or distribute spam, unsolicited messages, or automated
                content that violates Meta's terms
              </li>
              <li>
                Create false or misleading product reviews or endorsements
              </li>
              <li>
                Generate content that infringes on intellectual property rights
              </li>
              <li>
                Use AI responses to impersonate others or create inauthentic
                engagement
              </li>
              <li>
                Bypass rate limits or restrictions imposed by Instagram or Meta
              </li>
            </ul>
            <p>
              Violation of these prohibitions may result in suspension or
              termination of your account.
            </p>

            <h2>7. Subscriptions and Payment</h2>
            <p>
              We offer various subscription plans for our Services. By
              subscribing to a paid plan, you agree to the following:
            </p>
            <ul>
              <li>
                You will be charged according to the pricing and billing terms
                presented at the time of subscription
              </li>
              <li>
                Subscriptions automatically renew unless canceled before the
                renewal date
              </li>
              <li>
                You authorize us to store your payment information and charge
                the applicable fees
              </li>
              <li>
                Fees are non-refundable except as required by law or as stated
                in these Terms
              </li>
              <li>
                We may change our pricing with reasonable notice, effective upon
                the next billing cycle
              </li>
              <li>You are responsible for all applicable taxes and fees</li>
            </ul>
            <p>
              You can cancel your subscription at any time through your account
              settings or by contacting support@roxate.com.
            </p>

            <h2>8. Free Trial</h2>
            <p>We may offer free trials of our Services. When we do:</p>
            <ul>
              <li>
                Trial periods last for the specified time or until you upgrade
                to a paid subscription
              </li>
              <li>
                To prevent misuse, we may require payment information even
                during the trial
              </li>
              <li>
                We will notify you before your trial ends and before charging
                begins
              </li>
              <li>
                You can cancel before the trial ends to avoid being charged
              </li>
            </ul>

            <h2>9. Intellectual Property Rights</h2>
            <h3>Our Intellectual Property</h3>
            <p>
              Our Services, including software, text, graphics, logos, icons,
              images, and audio, are owned by or licensed to Barid AI and are
              protected by copyright, trademark, and other intellectual property
              laws. Subject to your compliance with these Terms, we grant you a
              limited, non-exclusive, non-transferable license to access and use
              our Services.
            </p>

            <h3>Your Content</h3>
            <p>
              You retain ownership of the content you provide to our Services.
              By using our Services, you grant us a non-exclusive, worldwide,
              royalty-free license to use, reproduce, modify, and distribute
              your content solely for the purpose of providing and improving our
              Services.
            </p>

            <h3>Feedback</h3>
            <p>
              If you provide feedback, suggestions, or ideas about our Services,
              you grant us a perpetual, irrevocable, non-exclusive,
              transferable, royalty-free license to use your feedback without
              restriction.
            </p>

            <h2>10. Termination</h2>
            <p>
              We may suspend or terminate your access to our Services at any
              time, without prior notice, for any reason, including if we
              believe you have violated these Terms. Upon termination:
            </p>
            <ul>
              <li>
                Your right to access and use our Services will immediately cease
              </li>
              <li>We may delete your account and content</li>
              <li>Any unpaid fees will become immediately due</li>
              <li>
                Provisions of these Terms that should reasonably survive
                termination will continue to apply
              </li>
            </ul>
            <p>
              You may terminate these Terms by canceling your account and
              ceasing all use of our Services.
            </p>

            <h2>11. Disclaimers</h2>
            <p>
              OUR SERVICES ARE PROVIDED "AS IS" AND "AS AVAILABLE," WITHOUT
              WARRANTIES OF ANY KIND, EITHER EXPRESS OR IMPLIED, INCLUDING
              IMPLIED WARRANTIES OF MERCHANTABILITY, FITNESS FOR A PARTICULAR
              PURPOSE, NON-INFRINGEMENT, OR THAT OUR SERVICES WILL BE
              UNINTERRUPTED OR ERROR-FREE.
            </p>
            <p>
              WE DO NOT GUARANTEE THAT THE AI-GENERATED RESPONSES WILL BE
              ACCURATE, APPROPRIATE, OR MEET YOUR REQUIREMENTS. YOU ARE
              RESPONSIBLE FOR REVIEWING AND APPROVING ALL AUTOMATED
              COMMUNICATIONS WHEN NEEDED.
            </p>
            <p>
              WE DO NOT GUARANTEE THAT USE OF OUR SERVICES WILL RESULT IN ANY
              SPECIFIC OUTCOME, SUCH AS INCREASED ENGAGEMENT, FOLLOWERS, OR
              SALES.
            </p>

            <h2>12. Limitation of Liability</h2>
            <p>
              TO THE MAXIMUM EXTENT PERMITTED BY LAW, ROXATE LTD, ITS
              AFFILIATES, OFFICERS, DIRECTORS, EMPLOYEES, AGENTS, SUPPLIERS, AND
              LICENSORS WILL NOT BE LIABLE FOR ANY INDIRECT, INCIDENTAL,
              SPECIAL, CONSEQUENTIAL, OR PUNITIVE DAMAGES, INCLUDING DAMAGES FOR
              LOSS OF PROFITS, USE, DATA, GOODWILL, OR OTHER INTANGIBLE LOSSES,
              RESULTING FROM YOUR ACCESS TO OR USE OF OR INABILITY TO ACCESS OR
              USE THE SERVICES.
            </p>
            <p>
              IN NO EVENT WILL OUR AGGREGATE LIABILITY FOR ALL CLAIMS RELATED TO
              THE SERVICES EXCEED THE GREATER OF $100 OR THE AMOUNTS YOU HAVE
              PAID TO US FOR THE SERVICES IN THE PAST 12 MONTHS.
            </p>
            <p>
              THE LIMITATIONS OF LIABILITY IN THIS SECTION WILL APPLY EVEN IF WE
              HAVE BEEN ADVISED OF THE POSSIBILITY OF SUCH DAMAGES AND
              NOTWITHSTANDING THE FAILURE OF ESSENTIAL PURPOSE OF ANY LIMITED
              REMEDY.
            </p>

            <h2>13. Indemnification</h2>
            <p>
              You agree to indemnify, defend, and hold harmless ROXATE LTD and
              its officers, directors, employees, agents, and affiliates from
              and against any claims, disputes, demands, liabilities, damages,
              losses, and expenses, including reasonable legal and accounting
              fees, arising out of or in any way connected with:
            </p>
            <ul>
              <li>Your access to or use of our Services</li>
              <li>Your content or the data you provide through our Services</li>
              <li>Your violation of these Terms</li>
              <li>
                Your violation of any third-party rights, including Meta or
                Instagram's Terms
              </li>
              <li>Your violation of any laws or regulations</li>
            </ul>

            <h2>14. Modifications to the Terms</h2>
            <p>
              We may modify these Terms at any time by posting the revised terms
              on our website. The revised terms will become effective upon
              posting. Your continued use of our Services after the effective
              date constitutes your acceptance of the modified terms. If you do
              not agree to the modified terms, you should stop using our
              Services.
            </p>
            <p>
              We may provide notice of material changes to these Terms by email,
              through our Services, or by other means.
            </p>

            <h2>15. Governing Law and Dispute Resolution</h2>
            <p>
              These Terms are governed by the laws of the United Kingdom,
              without regard to its conflict of law provisions. Any dispute
              arising from these Terms or the Services shall be resolved in
              accordance with the laws of the United Kingdom.
            </p>
            <p>
              For users in the European Union, you may also have the right to
              engage in alternative dispute resolution through the EU Online
              Dispute Resolution platform, which can be accessed at
              http://ec.europa.eu/consumers/odr/.
            </p>

            <h2>16. General Provisions</h2>
            <p>
              <strong>Entire Agreement:</strong> These Terms, together with our
              Privacy Policy, constitute the entire agreement between you and
              ROXATE LTD regarding our Services.
            </p>
            <p>
              <strong>Severability:</strong> If any provision of these Terms is
              found to be unenforceable, that provision will be limited to the
              minimum extent necessary so that these Terms remain in effect.
            </p>
            <p>
              <strong>No Waiver:</strong> Our failure to enforce any right or
              provision of these Terms will not be considered a waiver of those
              rights.
            </p>
            <p>
              <strong>Assignment:</strong> You may not assign your rights under
              these Terms without our prior written consent. We may assign our
              rights under these Terms without restriction.
            </p>
            <p>
              <strong>Force Majeure:</strong> We will not be liable for any
              failure or delay in performance resulting from circumstances
              beyond our reasonable control.
            </p>

            <h2>17. Contact Information</h2>
            <p>
              If you have any questions about these Terms, please contact us at:
            </p>
            <p>
              Email: legal@roxate.com
              <br />
              Phone: +447822015226
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
