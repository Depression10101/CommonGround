import { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router';
import { ArrowLeft, CreditCard, MapPin, User as UserIcon, Package } from 'lucide-react';
import { Button } from '../components/ui/button';
import { Input } from '../components/ui/input';
import { Label } from '../components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../components/ui/select';
import { useAuth } from '../context/AuthContext';
import { toast } from 'sonner';
import { meetupLocations } from '../data/meetupLocations';
import { SiteLogo } from '../components/SiteLogo';

export function TransactionPage() {
  const navigate = useNavigate();
  const location = useLocation();
  const { user } = useAuth();

  const { sellerName, sellerEmail, listingTitle, conversationId } = location.state || {};
  
  const [agreedPrice, setAgreedPrice] = useState('');
  const [paymentMethod, setPaymentMethod] = useState('');
  const [paymentHandle, setPaymentHandle] = useState('');
  const [meetupLocation, setMeetupLocation] = useState('');
  const [isProcessing, setIsProcessing] = useState(false);

  useEffect(() => {
    // Redirect if not authenticated or no state
    if (!user || !sellerName) {
      navigate('/');
      return;
    }

    // Prevent admin and banned users from purchasing
    if (user.email === 'admin@email.com') {
      toast.error('Admin accounts cannot purchase items');
      navigate('/');
      return;
    }

    if (user.bannedFromPurchasing) {
      toast.error('Your account is restricted from purchasing');
      navigate('/');
      return;
    }
  }, [user, sellerName, navigate]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!agreedPrice || !paymentMethod || !meetupLocation) {
      toast.error('Please fill in all required fields');
      return;
    }

    const price = parseFloat(agreedPrice);
    if (isNaN(price) || price <= 0) {
      toast.error('Please enter a valid price');
      return;
    }

    setIsProcessing(true);

    // Simulate processing
    setTimeout(() => {
      const transaction = {
        id: Date.now().toString(),
        userId: user!.id,
        buyerEmail: user!.email,
        buyerName: user!.name,
        sellerEmail,
        sellerName,
        listingTitle,
        agreedPrice: price,
        paymentMethod,
        paymentHandle: paymentHandle || null,
        meetupLocation: meetupLocations.find(loc => loc.id === meetupLocation),
        timestamp: new Date().toISOString(),
        status: 'pending_meetup', // Waiting for both parties to confirm meetup
        buyerConfirmed: false,
        sellerConfirmed: false,
      };

      const transactionsJson = localStorage.getItem('transactions');
      const transactions = transactionsJson ? JSON.parse(transactionsJson) : [];
      transactions.push(transaction);
      localStorage.setItem('transactions', JSON.stringify(transactions));

      setIsProcessing(false);
      toast.success('Transaction initiated!');
      
      // Navigate to the confirmation page
      navigate('/transaction-confirm', {
        state: {
          transactionId: transaction.id,
          ...transaction,
        }
      });
    }, 1000);
  };

  const getPaymentMethodLabel = (method: string) => {
    switch(method) {
      case 'cash': return 'Cash';
      case 'venmo': return 'Venmo';
      case 'cashapp': return 'Cash App';
      case 'zelle': return 'Zelle';
      case 'paypal': return 'PayPal';
      default: return '';
    }
  };

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
      <div className="max-w-2xl mx-auto px-6 py-12 relative z-1">
        <button
          onClick={() => navigate(-1)}
          className="flex items-center space-x-2 text-gray-700 hover:text-red-600 mb-6 transition-colors"
        >
          <ArrowLeft className="w-5 h-5" />
          <span>Back</span>
        </button>

        <div className="bg-white rounded-lg shadow-lg p-8">
          <div className="mb-6">
            <h2 className="text-3xl font-bold text-gray-900 mb-2">Setup Transaction</h2>
            <p className="text-gray-600">
              Purchasing <strong>{listingTitle}</strong> from <strong>{sellerName}</strong>
            </p>
          </div>

          {/* Transaction Summary */}
          <div className="bg-gray-50 rounded-lg p-6 mb-8">
            <h3 className="font-semibold text-gray-900 mb-4 flex items-center gap-2">
              <Package className="w-5 h-5 text-red-600" />
              Transaction Details
            </h3>
            <div className="space-y-2">
              <div className="flex justify-between text-sm">
                <span className="text-gray-600">Item:</span>
                <span className="font-medium text-gray-900">{listingTitle}</span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-gray-600">Seller:</span>
                <span className="font-medium text-gray-900">{sellerName}</span>
              </div>
            </div>
          </div>

          {/* Transaction Form */}
          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Agreed Price */}
            <div className="space-y-2">
              <Label htmlFor="agreedPrice">Agreed Price ($) *</Label>
              <Input
                id="agreedPrice"
                type="number"
                placeholder="Enter the price you agreed on"
                min="0"
                step="0.01"
                value={agreedPrice}
                onChange={(e) => setAgreedPrice(e.target.value)}
                required
                className="[&::-webkit-inner-spin-button]:appearance-none [&::-webkit-outer-spin-button]:appearance-none"
              />
              <p className="text-xs text-gray-500">Enter the final price agreed upon with the seller</p>
            </div>

            {/* Payment Method */}
            <div className="space-y-2">
              <Label htmlFor="paymentMethod">Payment Method *</Label>
              <Select value={paymentMethod} onValueChange={setPaymentMethod} required>
                <SelectTrigger id="paymentMethod">
                  <SelectValue placeholder="Select payment method" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="cash">Cash</SelectItem>
                  <SelectItem value="venmo">Venmo</SelectItem>
                  <SelectItem value="cashapp">Cash App</SelectItem>
                  <SelectItem value="zelle">Zelle</SelectItem>
                  <SelectItem value="paypal">PayPal</SelectItem>
                </SelectContent>
              </Select>
            </div>

            {/* Payment Handle (Optional) */}
            {paymentMethod && paymentMethod !== 'cash' && (
              <div className="space-y-2">
                <Label htmlFor="paymentHandle">
                  Your {getPaymentMethodLabel(paymentMethod)} Handle (Optional)
                </Label>
                <Input
                  id="paymentHandle"
                  type="text"
                  placeholder={`@your${paymentMethod}handle`}
                  value={paymentHandle}
                  onChange={(e) => setPaymentHandle(e.target.value)}
                />
                <p className="text-xs text-gray-500">
                  Providing your handle helps the seller send payment requests
                </p>
              </div>
            )}

            {/* Meetup Location */}
            <div className="space-y-2">
              <Label htmlFor="meetupLocation" className="flex items-center gap-2">
                <MapPin className="w-4 h-4 text-red-600" />
                Common Ground Meetup Location *
              </Label>
              <Select value={meetupLocation} onValueChange={setMeetupLocation} required>
                <SelectTrigger id="meetupLocation">
                  <SelectValue placeholder="Select a safe meetup location" />
                </SelectTrigger>
                <SelectContent>
                  {meetupLocations.map((location) => (
                    <SelectItem key={location.id} value={location.id}>
                      {location.name} - {location.type}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              {meetupLocation && (
                <p className="text-xs text-gray-600 mt-2">
                  {meetupLocations.find(loc => loc.id === meetupLocation)?.address}
                </p>
              )}
              <p className="text-xs text-gray-500">
                Choose from our vetted safe meetup locations in Houston
              </p>

              {/* Map - Always visible */}
              <div className="mt-3 rounded-lg overflow-hidden border border-gray-200">
                <iframe
                  width="100%"
                  height="200"
                  style={{ border: 0 }}
                  loading="lazy"
                  allowFullScreen
                  src={`https://www.google.com/maps/embed/v1/place?key=AIzaSyBFw0Qbyq9zTFTd-tUY6dZWTgaQzuU17R8&q=Houston,TX&zoom=11`}
                ></iframe>
              </div>
            </div>

            <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
              <p className="text-sm text-blue-900">
                <strong>Next Steps:</strong> After submitting, both you and the seller will need to confirm the meetup and exchange at the chosen location. Once both parties confirm, you can leave reviews for each other.
              </p>
            </div>

            <div className="flex gap-4 pt-4">
              <Button
                type="button"
                variant="outline"
                onClick={() => navigate(-1)}
                className="flex-1"
                disabled={isProcessing}
              >
                Cancel
              </Button>
              <Button
                type="submit"
                className="flex-1 bg-red-600 hover:bg-red-700"
                disabled={isProcessing}
              >
                {isProcessing ? 'Setting up...' : 'Setup Transaction'}
              </Button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}
