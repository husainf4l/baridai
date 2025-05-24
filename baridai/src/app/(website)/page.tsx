"use client";
import Image from "next/image";
import { ModeToggle } from "@/components/ui/mode-toggle";

export default function Home() {
  return (
    <div className="min-h-screen font-[family-name:var(--font-geist-sans)] bg-white dark:bg-gray-900 text-[#1D1D1F] dark:text-white">
      {/* Header/Navigation - Apple Style */}
      <header className="sticky top-0 z-50 backdrop-blur-xl bg-white/80 dark:bg-gray-900/90 border-b border-gray-100 dark:border-gray-800">
        <div className="container mx-auto py-5 px-6 flex items-center justify-between">
          <div className="flex items-center">
            <span className="font-medium text-xl tracking-tight dark:text-white">
              barid ai
            </span>
          </div>
          <nav className="hidden md:flex space-x-8">
            <a
              href="#features"
              className="text-sm font-medium text-[#1D1D1F] dark:text-white hover:text-blue-500 transition"
            >
              Features
            </a>
            <a
              href="#plans"
              className="text-sm font-medium text-[#1D1D1F] dark:text-white hover:text-blue-500 transition"
            >
              Pricing
            </a>
            <a
              href="#how-it-works"
              className="text-sm font-medium text-[#1D1D1F] dark:text-white hover:text-blue-500 transition"
            >
              How It Works
            </a>
          </nav>
          <div className="flex items-center space-x-4">
            <div className="mr-2">
              <ModeToggle />
            </div>
            <a
              href="/login"
              className="text-sm font-medium text-[#1D1D1F] dark:text-white hover:text-blue-500 transition"
            >
              Login
            </a>
            <a
              href="/signup"
              className="bg-blue-500 text-white px-5 py-1.5 rounded-full text-sm font-medium hover:bg-blue-600 transition"
            >
              Get Started
            </a>
          </div>
        </div>
      </header>

      {/* Hero Section - Apple Style */}
      <main className="pt-16 pb-24">
        <div className="container mx-auto px-6">
          <div className="max-w-4xl mx-auto text-center mb-16">
            <h1 className="text-5xl md:text-6xl lg:text-7xl font-semibold tracking-tight mb-6 bg-clip-text text-transparent bg-gradient-to-r from-blue-600 to-purple-600">
              Transform Your Instagram Engagement
            </h1>
            <p className="text-xl text-[#86868B] dark:text-gray-300 max-w-3xl mx-auto mb-10 leading-relaxed">
              Barid AI revolutionizes how you connect with your audience.
              Intelligent, automated responses that feel personal and drive
              results.
            </p>
            <div className="flex flex-wrap justify-center gap-4">
              <a
                href="/signup"
                className="bg-blue-500 hover:bg-blue-600 transition px-8 py-3 rounded-full text-white text-sm font-medium"
              >
                Get Started
              </a>
              <a
                href="#how-it-works"
                className="bg-[#F5F5F7] dark:bg-gray-800 text-[#1D1D1F] dark:text-white hover:bg-[#E8E8ED] dark:hover:bg-gray-700 transition px-8 py-3 rounded-full text-sm font-medium"
              >
                Learn More
              </a>
            </div>
          </div>

          {/* Hero Images - Apple Style */}
          <div className="relative mx-auto max-w-6xl">
            <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
              <div className="aspect-[3/4] relative rounded-3xl overflow-hidden shadow-lg transform transition duration-700 hover:scale-[1.02] hover:shadow-2xl">
                <Image
                  src="/images/hero/1.webp"
                  alt="Social media influencer"
                  fill
                  className="object-cover"
                  style={{ objectPosition: "center" }}
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent opacity-80"></div>
                <div className="absolute bottom-6 left-6 right-6">
                  <p className="text-white font-medium text-lg leading-tight">
                    Increase engagement
                  </p>
                </div>
              </div>

              <div className="aspect-[3/4] relative rounded-3xl overflow-hidden shadow-lg transform transition duration-700 hover:scale-[1.02] hover:shadow-2xl">
                <Image
                  src="/images/hero/2.webp"
                  alt="Content creator"
                  fill
                  className="object-cover"
                  style={{ objectPosition: "center" }}
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent opacity-80"></div>
                <div className="absolute bottom-6 left-6 right-6">
                  <p className="text-white font-medium text-lg leading-tight">
                    Grow your audience
                  </p>
                </div>
              </div>

              <div className="aspect-[3/4] relative rounded-3xl overflow-hidden shadow-lg transform transition duration-700 hover:scale-[1.02] hover:shadow-2xl">
                <Image
                  src="/images/hero/3.webp"
                  alt="Social media marketing"
                  fill
                  className="object-cover"
                  style={{ objectPosition: "center" }}
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent opacity-80"></div>
                <div className="absolute bottom-6 left-6 right-6">
                  <p className="text-white font-medium text-lg leading-tight">
                    Build relationships
                  </p>
                </div>
              </div>

              <div className="aspect-[3/4] relative rounded-3xl overflow-hidden shadow-lg transform transition duration-700 hover:scale-[1.02] hover:shadow-2xl">
                <Image
                  src="/images/hero/4.webp"
                  alt="Social media analytics"
                  fill
                  className="object-cover"
                  style={{ objectPosition: "center" }}
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent opacity-80"></div>
                <div className="absolute bottom-6 left-6 right-6">
                  <p className="text-white font-medium text-lg leading-tight">
                    Drive conversions
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </main>

      {/* AI DM Management Section - Apple Style */}
      <section id="features" className="py-32 bg-[#F5F5F7] dark:bg-gray-900">
        <div className="container mx-auto px-6">
          <div className="max-w-6xl mx-auto">
            <div className="flex flex-col md:flex-row items-center gap-16">
              {/* Mock DM Interface with Apple-style aesthetics */}
              <div className="w-full md:w-1/2 relative">
                <div className="absolute inset-0 -z-10 bg-gradient-to-tr from-blue-500/30 via-purple-500/30 to-pink-400/30 blur-[100px] opacity-50 rounded-full"></div>
                <div className="bg-white dark:bg-gray-800 rounded-3xl overflow-hidden shadow-2xl border border-gray-100 dark:border-gray-700">
                  {/* DM Interface Header */}
                  <div className="bg-white dark:bg-gray-800 p-4 flex items-center justify-between border-b border-gray-100 dark:border-gray-700">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-full bg-gradient-to-r from-blue-400 to-blue-500 flex items-center justify-center">
                        <span className="font-bold text-white">J</span>
                      </div>
                      <div>
                        <p className="font-medium text-[#1D1D1F] dark:text-white">
                          @jewelry_brand
                        </p>
                        <p className="text-xs text-[#86868B] dark:text-gray-300">
                          Online now
                        </p>
                      </div>
                    </div>
                    <div className="flex gap-2">
                      <button className="w-8 h-8 rounded-full bg-[#F5F5F7] dark:bg-gray-700 flex items-center justify-center">
                        <svg
                          xmlns="http://www.w3.org/2000/svg"
                          className="w-4 h-4 text-[#1D1D1F] dark:text-white"
                          viewBox="0 0 20 20"
                          fill="currentColor"
                        >
                          <path d="M2 3a1 1 0 011-1h2.153a1 1 0 01.986.836l.74 4.435a1 1 0 01-.54 1.06l-1.548.773a11.037 11.037 0 006.105 6.105l.774-1.548a1 1 0 011.059-.54l4.435.74a1 1 0 01.836.986V17a1 1 0 01-1 1h-2C7.82 18 2 12.18 2 5V3z" />
                        </svg>
                      </button>
                      <button className="w-8 h-8 rounded-full bg-[#F5F5F7] dark:bg-gray-700 flex items-center justify-center">
                        <svg
                          xmlns="http://www.w3.org/2000/svg"
                          className="w-4 h-4 text-[#1D1D1F] dark:text-white"
                          viewBox="0 0 20 20"
                          fill="currentColor"
                        >
                          <path
                            fillRule="evenodd"
                            d="M4 3a2 2 0 00-2 2v10a2 2 0 002 2h12a2 2 0 002-2V5a2 2 0 00-2-2H4zm3 2h6v4H7V5zm8 8v2h1v-2h-1zm-2-8h1v2h-1V5zm-2 8h1v2h-1v-2zm-2 0h1v2H9v-2zm-2 0h1v2H7v-2zm8-6h1v4h-1V7zm-8 4h6v4H9v-4z"
                            clipRule="evenodd"
                          />
                        </svg>
                      </button>
                    </div>
                  </div>

                  {/* DM Chat Content */}
                  <div className="p-4 bg-white h-[340px] overflow-hidden">
                    <div className="flex justify-start mb-4">
                      <div className="bg-[#F5F5F7] rounded-2xl p-3 max-w-xs animate-fadeIn">
                        <p className="text-[#1D1D1F] text-sm">
                          Hi! I'm interested in your new summer collection. Do
                          you ship internationally?
                        </p>
                        <span className="text-xs text-[#86868B] mt-1 block">
                          10:42 AM
                        </span>
                      </div>
                    </div>

                    <div className="flex justify-end mb-4">
                      <div className="bg-blue-500 rounded-2xl p-3 max-w-xs animate-slideInRight">
                        <p className="text-white text-sm">
                          Yes, we ship to over 60 countries! Our summer
                          collection just launched today with free international
                          shipping on orders over $100.
                        </p>
                        <div className="flex justify-between items-center mt-1">
                          <span className="text-xs text-blue-100">
                            10:43 AM
                          </span>
                          <span className="text-[10px] bg-blue-600/70 text-blue-50 px-2 py-0.5 rounded-full">
                            AI
                          </span>
                        </div>
                      </div>
                    </div>

                    <div className="flex justify-start mb-4">
                      <div className="bg-[#F5F5F7] rounded-2xl p-3 max-w-xs animate-fadeIn delay-300">
                        <p className="text-[#1D1D1F] text-sm">
                          That's great! What's the estimated delivery time to
                          France? And do you have the new Ocean Breeze necklace
                          in stock?
                        </p>
                        <span className="text-xs text-[#86868B] mt-1 block">
                          10:45 AM
                        </span>
                      </div>
                    </div>

                    <div className="flex justify-end">
                      <div className="bg-blue-500 rounded-2xl p-3 max-w-xs animate-slideInRight delay-500">
                        <p className="text-white text-sm">
                          Delivery to France typically takes 5-7 business days.
                          And yes, the Ocean Breeze necklace is in stock in all
                          variations! Would you like me to reserve one for you?
                        </p>
                        <div className="flex justify-between items-center mt-1">
                          <span className="text-xs text-blue-100">
                            10:46 AM
                          </span>
                          <span className="text-[10px] bg-blue-600/70 text-blue-50 px-2 py-0.5 rounded-full">
                            AI
                          </span>
                        </div>
                      </div>
                    </div>

                    <div className="absolute bottom-4 left-0 right-0 flex justify-center">
                      <div className="flex items-center bg-white dark:bg-gray-700 rounded-full px-5 py-3 shadow-lg border border-gray-100 dark:border-gray-600">
                        <div className="flex gap-1 mr-2">
                          <div className="w-1.5 h-1.5 rounded-full bg-blue-500 animate-pulse"></div>
                          <div className="w-1.5 h-1.5 rounded-full bg-blue-500 animate-pulse delay-100"></div>
                          <div className="w-1.5 h-1.5 rounded-full bg-blue-500 animate-pulse delay-200"></div>
                        </div>
                        <span className="text-xs text-[#86868B] dark:text-gray-300">
                          Barid AI is responding...
                        </span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Feature Text - Apple Style */}
              <div className="w-full md:w-1/2">
                <h2 className="text-3xl md:text-4xl font-semibold tracking-tight mb-8 dark:text-white">
                  Intelligent DM Management <br />
                  <span className="bg-clip-text text-transparent bg-gradient-to-r from-blue-600 to-purple-600">
                    on Autopilot
                  </span>
                </h2>

                <div className="space-y-8">
                  <div>
                    <div className="flex items-center gap-3 mb-3">
                      <div className="w-10 h-10 rounded-full bg-blue-100 dark:bg-blue-900 flex items-center justify-center">
                        <svg
                          xmlns="http://www.w3.org/2000/svg"
                          className="w-5 h-5 text-blue-600 dark:text-blue-300"
                          fill="none"
                          viewBox="0 0 24 24"
                          stroke="currentColor"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M7 8h10M7 12h4m1 8l-4-4H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-3l-4 4z"
                          />
                        </svg>
                      </div>
                      <h3 className="text-xl font-medium">
                        24/7 Customer Support
                      </h3>
                    </div>
                    <p className="text-[#86868B] leading-relaxed pl-[52px]">
                      Never miss a potential customer. Our AI responds to
                      inquiries instantly, any time of day or night, with
                      accurate, personalized responses.
                    </p>
                  </div>

                  <div>
                    <div className="flex items-center gap-3 mb-3">
                      <div className="w-10 h-10 rounded-full bg-purple-100 flex items-center justify-center">
                        <svg
                          xmlns="http://www.w3.org/2000/svg"
                          className="w-5 h-5 text-purple-600"
                          fill="none"
                          viewBox="0 0 24 24"
                          stroke="currentColor"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-3 7h3m-3 4h3m-6-4h.01M9 16h.01"
                          />
                        </svg>
                      </div>
                      <h3 className="text-xl font-medium">
                        Smart Conversation Handling
                      </h3>
                    </div>
                    <p className="text-[#86868B] leading-relaxed pl-[52px]">
                      Our AI learns from your previous responses to maintain
                      your brand voice and provide consistent, accurate
                      information across all conversations.
                    </p>
                  </div>

                  <div>
                    <div className="flex items-center gap-3 mb-3">
                      <div className="w-10 h-10 rounded-full bg-pink-100 dark:bg-pink-900/50 flex items-center justify-center">
                        <svg
                          xmlns="http://www.w3.org/2000/svg"
                          className="w-5 h-5 text-pink-600 dark:text-pink-400"
                          fill="none"
                          viewBox="0 0 24 24"
                          stroke="currentColor"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6"
                          />
                        </svg>
                      </div>
                      <h3 className="text-xl font-medium dark:text-white">
                        Conversion Optimization
                      </h3>
                    </div>
                    <p className="text-[#86868B] dark:text-gray-300 leading-relaxed pl-[52px]">
                      Turn casual inquiries into sales with AI that understands
                      purchase intent and provides personalized product
                      recommendations.
                    </p>
                  </div>
                </div>

                <a
                  href="#how-it-works"
                  className="mt-10 inline-flex items-center text-blue-500 font-medium"
                >
                  <span>Learn how it works</span>
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="ml-2 w-5 h-5"
                    viewBox="0 0 20 20"
                    fill="currentColor"
                  >
                    <path
                      fillRule="evenodd"
                      d="M12.293 5.293a1 1 0 011.414 0l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414-1.414L14.586 11H3a1 1 0 110-2h11.586l-2.293-2.293a1 1 0 010-1.414z"
                      clipRule="evenodd"
                    />
                  </svg>
                </a>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Choose Your Plan Section */}
      <section
        id="plans"
        className="w-full max-w-4xl mx-auto flex flex-col items-center gap-8 mt-8"
      >
        <h2 className="text-3xl font-semibold text-center mb-2">
          Choose Your Plan
        </h2>
        <p className="text-center text-gray-600 dark:text-gray-300 max-w-2xl mb-4">
          Barid AI is a platform to manage Instagram, from scheduling posts to
          replying to direct messages with AI-powered automation.
        </p>
        <div className="flex flex-col sm:flex-row gap-8 w-full justify-center">
          {/* Free Plan */}
          <div className="flex-1 bg-white dark:bg-gray-900 rounded-xl shadow p-6 flex flex-col items-center border border-gray-200 dark:border-gray-800">
            <h3 className="text-xl font-bold mb-2">Free</h3>
            <p className="text-4xl font-extrabold mb-2">$0</p>
            <ul className="text-gray-600 dark:text-gray-300 mb-4 text-center">
              <li>✔️ Manage posts</li>
              <li>✔️ Basic DM management</li>
              <li>✔️ Limited AI replies</li>
            </ul>
            <a
              href="/signup"
              className="mt-auto bg-blue-600 text-white px-6 py-2 rounded-full font-semibold hover:bg-blue-700 transition"
            >
              Start Free
            </a>
          </div>
          {/* Smart AI Plan */}
          <div className="flex-1 bg-white dark:bg-gray-900 rounded-xl shadow p-6 flex flex-col items-center border-2 border-blue-600">
            <h3 className="text-xl font-bold mb-2">Smart AI</h3>
            <p className="text-4xl font-extrabold mb-2">$99</p>
            <ul className="text-gray-600 dark:text-gray-300 mb-4 text-center">
              <li>✔️ All Free features</li>
              <li>✔️ Unlimited AI-powered DM replies</li>
              <li>✔️ Advanced analytics</li>
              <li>✔️ Priority support</li>
            </ul>
            <a
              href="/signup?plan=premium"
              className="mt-auto bg-blue-600 text-white px-6 py-2 rounded-full font-semibold hover:bg-blue-700 transition"
            >
              Upgrade Now
            </a>
          </div>
        </div>
      </section>

      {/* How It Works Section - Apple Style */}
      <section id="how-it-works" className="py-32 bg-white dark:bg-gray-900">
        <div className="container mx-auto px-6">
          <div className="max-w-5xl mx-auto">
            <div className="text-center mb-16">
              <h2 className="text-4xl md:text-5xl font-semibold tracking-tight mb-6 dark:text-white">
                How Barid AI Works
              </h2>
              <div className="w-20 h-1 bg-blue-500 mx-auto rounded-full"></div>
            </div>

            <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
              {/* Step 1 */}
              <div className="rounded-3xl bg-[#F5F5F7] dark:bg-gray-800 p-8 transform transition-all duration-300 hover:scale-[1.03] hover:shadow-lg">
                <div className="w-12 h-12 rounded-full bg-blue-100 dark:bg-blue-900/50 flex items-center justify-center mb-6 text-blue-600 dark:text-blue-300 font-semibold text-xl">
                  1
                </div>
                <h3 className="text-xl font-medium mb-3 text-[#1D1D1F] dark:text-white">
                  Connect Your Instagram
                </h3>
                <p className="text-[#86868B] dark:text-gray-300">
                  Securely link your account in seconds using our official Meta
                  API integration.
                </p>
              </div>

              {/* Step 2 */}
              <div className="rounded-3xl bg-[#F5F5F7] dark:bg-gray-800 p-8 transform transition-all duration-300 hover:scale-[1.03] hover:shadow-lg">
                <div className="w-12 h-12 rounded-full bg-purple-100 dark:bg-purple-900/50 flex items-center justify-center mb-6 text-purple-600 dark:text-purple-400 font-semibold text-xl">
                  2
                </div>
                <h3 className="text-xl font-medium mb-3 text-[#1D1D1F] dark:text-white">
                  Train with Your Tone
                </h3>
                <p className="text-[#86868B] dark:text-gray-300">
                  Let Barid AI learn from past conversations and your brand
                  voice.
                </p>
              </div>

              {/* Step 3 */}
              <div className="rounded-3xl bg-[#F5F5F7] dark:bg-gray-800 p-8 transform transition-all duration-300 hover:scale-[1.03] hover:shadow-lg">
                <div className="w-12 h-12 rounded-full bg-pink-100 dark:bg-pink-900/50 flex items-center justify-center mb-6 text-pink-600 dark:text-pink-400 font-semibold text-xl">
                  3
                </div>
                <h3 className="text-xl font-medium mb-3 text-[#1D1D1F] dark:text-white">
                  Automate Smart Replies
                </h3>
                <p className="text-[#86868B] dark:text-gray-300">
                  AI handles inquiries instantly and intelligently — just like
                  you would.
                </p>
              </div>

              {/* Step 4 */}
              <div className="rounded-3xl bg-[#F5F5F7] dark:bg-gray-800 p-8 transform transition-all duration-300 hover:scale-[1.03] hover:shadow-lg">
                <div className="w-12 h-12 rounded-full bg-green-100 dark:bg-green-900/50 flex items-center justify-center mb-6 text-green-600 dark:text-green-400 font-semibold text-xl">
                  4
                </div>
                <h3 className="text-xl font-medium mb-3 text-[#1D1D1F] dark:text-white">
                  Analyze & Improve
                </h3>
                <p className="text-[#86868B] dark:text-gray-300">
                  Track engagement, optimize replies, and boost conversions with
                  detailed insights.
                </p>
              </div>
            </div>

            {/* Image or Visual */}
            <div className="mt-16 relative">
              <div className="absolute inset-0 -z-10 bg-gradient-to-r from-blue-500/20 via-purple-500/20 to-pink-400/20 blur-[120px] opacity-80"></div>
              <div className="bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm border border-gray-100 dark:border-gray-700 rounded-3xl p-8 shadow-xl">
                <div className="flex flex-col md:flex-row items-center gap-8">
                  <div className="w-full md:w-1/2">
                    <div className="aspect-[4/3] relative bg-gradient-to-br from-blue-50 to-purple-50 dark:from-blue-900/30 dark:to-purple-900/30 rounded-2xl overflow-hidden border border-gray-100 dark:border-gray-700">
                      <div className="absolute top-0 left-0 right-0 h-12 bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm border-b border-gray-100 dark:border-gray-700 flex items-center px-4">
                        <div className="flex gap-2">
                          <div className="w-3 h-3 rounded-full bg-red-400"></div>
                          <div className="w-3 h-3 rounded-full bg-yellow-400"></div>
                          <div className="w-3 h-3 rounded-full bg-green-400"></div>
                        </div>
                        <div className="mx-auto text-xs text-[#86868B] dark:text-gray-300">
                          Barid AI Dashboard
                        </div>
                      </div>
                      <div className="grid grid-cols-3 gap-3 p-16">
                        <div className="aspect-square rounded-xl bg-blue-100 animate-pulse"></div>
                        <div className="aspect-square rounded-xl bg-purple-100 animate-pulse delay-300"></div>
                        <div className="aspect-square rounded-xl bg-pink-100 animate-pulse delay-500"></div>
                        <div className="aspect-square rounded-xl bg-green-100 animate-pulse delay-700"></div>
                        <div className="aspect-square rounded-xl bg-yellow-100 animate-pulse delay-300"></div>
                        <div className="aspect-square rounded-xl bg-blue-100 animate-pulse delay-500"></div>
                      </div>
                    </div>
                  </div>

                  <div className="w-full md:w-1/2">
                    <h3 className="text-2xl font-semibold mb-4">
                      Seamless Experience
                    </h3>
                    <p className="text-[#86868B] mb-6">
                      From setup to automation, we've designed every step with
                      simplicity in mind. Get your Instagram DMs on autopilot in
                      minutes, not days.
                    </p>
                    <div className="flex flex-wrap gap-3">
                      <span className="px-4 py-2 rounded-full bg-blue-100 text-blue-600 text-xs font-medium">
                        Simple Setup
                      </span>
                      <span className="px-4 py-2 rounded-full bg-purple-100 text-purple-600 text-xs font-medium">
                        Intuitive Dashboard
                      </span>
                      <span className="px-4 py-2 rounded-full bg-pink-100 text-pink-600 text-xs font-medium">
                        Real-time Stats
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Final CTA Section - Apple Style */}
      <section className="py-24 bg-gradient-to-br from-blue-50 to-purple-50 dark:from-blue-900/20 dark:to-purple-900/20">
        <div className="container mx-auto px-6 max-w-4xl">
          <div className="text-center">
            <h2 className="text-4xl md:text-5xl font-semibold tracking-tight mb-6 dark:text-white">
              Ready to Engage Smarter?
            </h2>
            <p className="text-xl text-[#86868B] dark:text-gray-300 mb-10 max-w-3xl mx-auto">
              Let Barid AI handle your DMs while you focus on growing your
              brand.
            </p>
            <a
              href="/signup"
              className="inline-block bg-blue-500 text-white px-10 py-4 rounded-full font-medium text-lg hover:bg-blue-600 transition shadow-lg hover:shadow-blue-300/30 transform hover:-translate-y-1 duration-300"
            >
              Start for Free
            </a>
            <p className="mt-6 text-sm text-[#86868B] dark:text-gray-400">
              No credit card required. Cancel anytime.
            </p>
          </div>
        </div>
      </section>

      <footer className="container mx-auto py-8 px-4 flex flex-col md:flex-row justify-between items-center border-t border-gray-200 dark:border-gray-800 mt-16">
        <div className="flex items-center mb-4 md:mb-0">
          <div className="bg-[#F5F5F7] dark:bg-gray-800 p-1.5 rounded-md mr-2">
            <span className="font-bold text-sm text-blue-600 dark:text-blue-400">
              B
            </span>
          </div>
          <span className="text-sm text-[#86868B] dark:text-gray-400">
            © 2025 Barid AI. All rights reserved.
          </span>
        </div>
        <div className="flex space-x-6">
          <a
            href="#"
            className="text-sm text-[#86868B] dark:text-gray-400 hover:text-blue-500 transition"
          >
            Privacy
          </a>
          <a
            href="#"
            className="text-sm text-[#86868B] dark:text-gray-400 hover:text-blue-500 transition"
          >
            Terms
          </a>
          <a
            href="#"
            className="text-sm text-[#86868B] dark:text-gray-400 hover:text-blue-500 transition"
          >
            Contact
          </a>
        </div>
      </footer>
    </div>
  );
}
