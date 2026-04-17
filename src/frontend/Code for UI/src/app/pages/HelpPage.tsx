import { useNavigate } from 'react-router';
import { ArrowLeft, Mail, MessageCircle, Shield, DollarSign } from 'lucide-react';
import { Button } from '../components/ui/button';
import { SiteLogo } from '../components/SiteLogo';

export function HelpPage() {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-red-50">
      {/* Background Pattern */}
      <div className="fixed inset-0 pointer-events-none opacity-5 z-0">
        <div className="absolute top-40 left-1/4 w-24 h-24 bg-black rounded-full"></div>
        <div className="absolute top-96 right-1/3 w-18 h-18 bg-black rounded-full"></div>
        <div className="absolute top-[600px] left-1/2 w-30 h-30 bg-black rounded-full"></div>
        <div className="absolute bottom-80 right-1/4 w-24 h-24 bg-black rounded-full"></div>
        <div className="absolute bottom-40 left-1/3 w-18 h-18 bg-black rounded-full"></div>
      </div>

      {/* Header */}
      <header className="bg-red-600 shadow-md sticky top-0 z-10 relative">
        <div className="max-w-[1600px] mx-auto px-6 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3 cursor-pointer" onClick={() => navigate('/')}>
              <SiteLogo />
              <h1 className="text-2xl font-bold text-white">Common Ground</h1>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <div className="max-w-4xl mx-auto px-6 py-8 relative z-1">
        <button
          onClick={() => navigate('/')}
          className="flex items-center space-x-2 text-gray-700 hover:text-red-600 mb-6 transition-colors"
        >
          <ArrowLeft className="w-5 h-5" />
          <span>Back to Home</span>
        </button>

        <div className="bg-white rounded-lg shadow-md p-8">
          <h1 className="text-4xl font-bold text-gray-900 mb-4">Help Center</h1>
          <p className="text-gray-600 mb-8">
            Welcome to Common Ground! Here's everything you need to know about buying and selling in the Houston area.
          </p>

          {/* Getting Started */}
          <section className="mb-8">
            <h2 className="text-2xl font-bold text-gray-900 mb-4">Getting Started</h2>
            <div className="space-y-4">
              <div className="border-l-4 border-red-600 pl-4">
                <h3 className="font-semibold text-gray-900 mb-2">Creating an Account</h3>
                <p className="text-gray-600">
                  Sign up with your email, name, phone number, and address. Your contact information is kept private and only shared when you choose to complete a transaction.
                </p>
              </div>
              <div className="border-l-4 border-red-600 pl-4">
                <h3 className="font-semibold text-gray-900 mb-2">Posting a Listing</h3>
                <p className="text-gray-600">
                  Once signed in, click the "Post Listing" button to create a new listing. Add photos, description, price, and condition details to attract buyers.
                </p>
              </div>
              <div className="border-l-4 border-red-600 pl-4">
                <h3 className="font-semibold text-gray-900 mb-2">Browsing Listings</h3>
                <p className="text-gray-600">
                  Use the filters on the left sidebar to narrow down listings by category, price range, condition, and location within the Houston area.
                </p>
              </div>
            </div>
          </section>

          {/* Buying & Selling */}
          <section className="mb-8">
            <h2 className="text-2xl font-bold text-gray-900 mb-4">Buying & Selling</h2>
            <div className="space-y-4">
              <div className="flex items-start gap-4">
                <MessageCircle className="w-6 h-6 text-red-600 mt-1 flex-shrink-0" />
                <div>
                  <h3 className="font-semibold text-gray-900 mb-2">Messaging Sellers</h3>
                  <p className="text-gray-600">
                    Click "Message Seller" on any listing to start a conversation. Discuss details, negotiate prices, and arrange meetups directly through our chat system.
                  </p>
                </div>
              </div>
              <div className="flex items-start gap-4">
                <DollarSign className="w-6 h-6 text-red-600 mt-1 flex-shrink-0" />
                <div>
                  <h3 className="font-semibold text-gray-900 mb-2">Confirming Purchases</h3>
                  <p className="text-gray-600">
                    Once you've agreed on terms, select your payment method and choose from vetted meetup locations in the Houston area. Both parties must confirm the transaction after meeting in person.
                  </p>
                </div>
              </div>
              <div className="flex items-start gap-4">
                <Shield className="w-6 h-6 text-red-600 mt-1 flex-shrink-0" />
                <div>
                  <h3 className="font-semibold text-gray-900 mb-2">Leaving Reviews</h3>
                  <p className="text-gray-600">
                    After completing a transaction, leave a star rating and review for the seller. This helps build trust in the Common Ground community.
                  </p>
                </div>
              </div>
            </div>
          </section>

          {/* Safety Tips */}
          <section className="mb-8">
            <h2 className="text-2xl font-bold text-gray-900 mb-4">Safety Tips</h2>
            <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-6">
              <ul className="space-y-3">
                <li className="flex items-start gap-3">
                  <span className="text-yellow-600 font-bold">•</span>
                  <span className="text-gray-700">Always meet in public, well-lit locations during daylight hours</span>
                </li>
                <li className="flex items-start gap-3">
                  <span className="text-yellow-600 font-bold">•</span>
                  <span className="text-gray-700">Bring a friend or family member when meeting someone new</span>
                </li>
                <li className="flex items-start gap-3">
                  <span className="text-yellow-600 font-bold">•</span>
                  <span className="text-gray-700">Inspect items thoroughly before completing the transaction</span>
                </li>
                <li className="flex items-start gap-3">
                  <span className="text-yellow-600 font-bold">•</span>
                  <span className="text-gray-700">Trust your instincts - if something feels off, walk away</span>
                </li>
                <li className="flex items-start gap-3">
                  <span className="text-yellow-600 font-bold">•</span>
                  <span className="text-gray-700">Report suspicious users or scams using the Report User button</span>
                </li>
              </ul>
            </div>
          </section>

          {/* Contact Support */}
          <section>
            <h2 className="text-2xl font-bold text-gray-900 mb-4">Need More Help?</h2>
            <div className="bg-red-50 rounded-lg p-6 flex items-start gap-4">
              <Mail className="w-6 h-6 text-red-600 mt-1 flex-shrink-0" />
              <div>
                <h3 className="font-semibold text-gray-900 mb-2">Contact Support</h3>
                <p className="text-gray-600 mb-4">
                  Our support team is here to help! Reach out to us at{' '}
                  <a href="mailto:support@commonground.com" className="text-red-600 hover:underline">
                    support@commonground.com
                  </a>
                </p>
                <Button
                  onClick={() => navigate('/')}
                  className="bg-red-600 hover:bg-red-700"
                >
                  Back to Listings
                </Button>
              </div>
            </div>
          </section>
        </div>
      </div>
    </div>
  );
}
