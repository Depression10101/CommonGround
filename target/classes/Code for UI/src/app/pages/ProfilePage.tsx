import { useState, useEffect, useMemo } from 'react';
import { useParams, useNavigate } from 'react-router';
import { ArrowLeft, Star, MapPin, Calendar, Mail, Phone, Flag, User as UserIcon, Trash2, Package } from 'lucide-react';
import { Button } from '../components/ui/button';
import { Input } from '../components/ui/input';
import { useAuth } from '../context/AuthContext';
import { SiteLogo } from '../components/SiteLogo';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '../components/ui/dialog';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from '../components/ui/alert-dialog';
import { Label } from '../components/ui/label';
import { Textarea } from '../components/ui/textarea';
import { Listing } from '../types';
import { listings as defaultListings } from '../data/listings';
import { toast } from 'sonner';

interface UserProfile {
  id: string;
  name: string;
  email: string;
  joinDate: string;
  rating: number;
  totalReviews: number;
  bio?: string;
  location?: string;
  phoneNumber?: string;
}

interface Review {
  id: string;
  reviewerName: string;
  rating: number;
  comment: string;
  date: string;
  listingTitle?: string;
}

export function ProfilePage() {
  const { email } = useParams<{ email: string }>();
  const navigate = useNavigate();
  const { user: currentUser } = useAuth();
  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [reviews, setReviews] = useState<Review[]>([]);
  const [isReportDialogOpen, setIsReportDialogOpen] = useState(false);
  const [reportReason, setReportReason] = useState('');
  const [reportDescription, setReportDescription] = useState('');
  const [reportSubmitted, setReportSubmitted] = useState(false);
  const [deleteReviewId, setDeleteReviewId] = useState<string | null>(null);
  const [userListings, setUserListings] = useState<Listing[]>([]);
  const [myReviews, setMyReviews] = useState<Review[]>([]);

  useEffect(() => {
    // Get user profile from localStorage
    const usersJson = localStorage.getItem('users');
    const users = usersJson ? JSON.parse(usersJson) : [];

    const foundUser = users.find((u: any) => u.email === email);

    if (foundUser) {
      const { password, ...userProfile } = foundUser;
      setProfile(userProfile);
    }
  }, [email]);

  useEffect(() => {
    // Get user reviews from localStorage
    const reviewsJson = localStorage.getItem('reviews');
    const allReviews = reviewsJson ? JSON.parse(reviewsJson) : [];

    const userReviews = allReviews.filter((r: any) => r.reviewedUserEmail === email);
    setReviews(userReviews);

    // Get reviews written by current user (if viewing own profile)
    if (currentUser?.email === email) {
      const reviewsByUser = allReviews.filter((r: any) => r.reviewerName === currentUser.name);
      setMyReviews(reviewsByUser);
    }
  }, [email, currentUser]);

  useEffect(() => {
    // Get user's listings
    if (email) {
      const userListingsJson = localStorage.getItem('userListings');
      const allUserListings: Listing[] = userListingsJson ? JSON.parse(userListingsJson) : [];
      const filtered = allUserListings.filter(l => l.listerEmail === email);
      setUserListings(filtered);
    }
  }, [email]);

  const handleSubmitReport = () => {
    if (!currentUser || !profile) return;

    const report = {
      id: Date.now().toString(),
      reporterEmail: currentUser.email,
      reportedUserEmail: profile.email,
      reason: reportReason,
      description: reportDescription,
      timestamp: new Date().toISOString(),
    };

    // Save report to localStorage
    const reportsJson = localStorage.getItem('reports');
    const reports = reportsJson ? JSON.parse(reportsJson) : [];
    reports.push(report);
    localStorage.setItem('reports', JSON.stringify(reports));

    setReportSubmitted(true);
    setTimeout(() => {
      setIsReportDialogOpen(false);
      setReportSubmitted(false);
      setReportReason('');
      setReportDescription('');
    }, 2000);
  };

  const handleDeleteReview = () => {
    if (!deleteReviewId) return;

    const reviewsJson = localStorage.getItem('reviews');
    if (!reviewsJson) return;

    const allReviews = JSON.parse(reviewsJson);
    const updatedReviews = allReviews.filter((r: any) => r.id !== deleteReviewId);
    localStorage.setItem('reviews', JSON.stringify(updatedReviews));

    // Update the reviewed user's rating
    const deletedReview = allReviews.find((r: any) => r.id === deleteReviewId);
    if (deletedReview) {
      const usersJson = localStorage.getItem('users');
      const users = usersJson ? JSON.parse(usersJson) : [];

      const remainingReviewsForUser = updatedReviews.filter(
        (r: any) => r.reviewedUserEmail === deletedReview.reviewedUserEmail
      );

      const totalReviews = remainingReviewsForUser.length;
      const newRating = totalReviews > 0
        ? remainingReviewsForUser.reduce((sum: number, r: any) => sum + r.rating, 0) / totalReviews
        : 5.0;

      const updatedUsers = users.map((u: any) => {
        if (u.email === deletedReview.reviewedUserEmail) {
          return {
            ...u,
            rating: newRating,
            totalReviews,
          };
        }
        return u;
      });

      localStorage.setItem('users', JSON.stringify(updatedUsers));
    }

    // Refresh reviews
    const userReviews = updatedReviews.filter((r: any) => r.reviewedUserEmail === email);
    setReviews(userReviews);

    if (currentUser?.email === email) {
      const reviewsByUser = updatedReviews.filter((r: any) => r.reviewerName === currentUser.name);
      setMyReviews(reviewsByUser);
    }

    toast.success('Review deleted successfully');
    setDeleteReviewId(null);
  };

  const renderStars = (rating: number) => {
    return (
      <div className="flex items-center gap-1">
        {[1, 2, 3, 4, 5].map((star) => (
          <Star
            key={star}
            className={`w-5 h-5 ${
              star <= Math.floor(rating)
                ? 'fill-yellow-400 text-yellow-400'
                : star - 0.5 <= rating
                ? 'fill-yellow-400 text-yellow-400 opacity-50'
                : 'text-gray-300'
            }`}
          />
        ))}
        <span className="ml-2 text-lg font-semibold text-gray-900">{rating.toFixed(1)}</span>
        <span className="text-sm text-gray-500 ml-1">
          ({profile?.totalReviews || 0} {profile?.totalReviews === 1 ? 'review' : 'reviews'})
        </span>
      </div>
    );
  };

  if (!profile) {
    return (
      <div className="min-h-screen bg-red-50 flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-gray-900 mb-4">User not found</h2>
          <Button onClick={() => navigate('/')} className="bg-red-600 hover:bg-red-700">
            Back to Listings
          </Button>
        </div>
      </div>
    );
  }

  const isOwnProfile = currentUser?.email === profile.email;

  return (
    <div className="min-h-screen bg-red-50">
      {/* Background Pattern */}
      <div className="fixed inset-0 pointer-events-none opacity-5 z-0">
        <div className="absolute top-20 left-1/4 w-24 h-24 bg-black rounded-full"></div>
        <div className="absolute top-40 right-1/3 w-18 h-18 bg-black rounded-full"></div>
        <div className="absolute top-60 left-1/2 w-30 h-30 bg-black rounded-full"></div>
        <div className="absolute top-96 right-1/4 w-24 h-24 bg-black rounded-full"></div>
        <div className="absolute bottom-60 left-1/3 w-18 h-18 bg-black rounded-full"></div>
        <div className="absolute bottom-40 right-1/2 w-24 h-24 bg-black rounded-full"></div>
        <div className="absolute top-1/3 left-2/3 w-18 h-18 bg-black rounded-full"></div>
        <div className="absolute bottom-1/3 right-2/3 w-30 h-30 bg-black rounded-full"></div>
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
      <div className="max-w-[1000px] mx-auto px-6 py-8 relative z-1">
        <button
          onClick={() => navigate(-1)}
          className="flex items-center space-x-2 text-gray-700 hover:text-red-600 mb-6 transition-colors"
        >
          <ArrowLeft className="w-5 h-5" />
          <span>Back</span>
        </button>

        <div className="bg-white rounded-lg shadow-md overflow-hidden">
          {/* Profile Header */}
          <div className="bg-gradient-to-r from-red-600 to-red-700 h-32"></div>
          
          <div className="px-8 pb-8">
            {/* Avatar and Basic Info */}
            <div className="flex items-start gap-6 -mt-16 mb-6">
              <div className="w-32 h-32 bg-white rounded-full flex items-center justify-center border-4 border-white shadow-lg">
                <UserIcon className="w-16 h-16 text-red-600" />
              </div>
              <div className="mt-16 flex-1">
                <div className="flex items-start justify-between">
                  <div>
                    <h1 className="text-3xl font-bold text-gray-900 mb-2">{profile.name}</h1>
                    {renderStars(profile.rating || 5.0)}
                  </div>
                  {!isOwnProfile && currentUser && (
                    <Button
                      onClick={() => setIsReportDialogOpen(true)}
                      variant="outline"
                      className="border-red-600 text-red-600 hover:bg-red-50"
                    >
                      <Flag className="w-4 h-4 mr-2" />
                      Report User
                    </Button>
                  )}
                </div>
              </div>
            </div>

            {/* Profile Information */}
            <div className="grid md:grid-cols-2 gap-6 mb-6">
              <div className="space-y-4">
                <div className="flex items-center gap-3 text-gray-600">
                  <Calendar className="w-5 h-5 text-red-600" />
                  <div>
                    <p className="text-sm text-gray-500">Member Since</p>
                    <p className="font-medium">{profile.joinDate}</p>
                  </div>
                </div>

                {profile.location && (
                  <div className="flex items-center gap-3 text-gray-600">
                    <MapPin className="w-5 h-5 text-red-600" />
                    <div>
                      <p className="text-sm text-gray-500">Location</p>
                      <p className="font-medium">{profile.location}</p>
                    </div>
                  </div>
                )}
              </div>

              <div className="space-y-4">
                <div className="flex items-center gap-3 text-gray-600">
                  <Mail className="w-5 h-5 text-red-600" />
                  <div>
                    <p className="text-sm text-gray-500">Email</p>
                    <p className="font-medium">{profile.email}</p>
                  </div>
                </div>
              </div>
            </div>

            {/* Bio Section */}
            {profile.bio && (
              <div className="border-t pt-6">
                <h3 className="font-semibold text-gray-900 mb-2">About</h3>
                <p className="text-gray-600 leading-relaxed">{profile.bio}</p>
              </div>
            )}

            {/* User's Listings (only show for own profile) */}
            {isOwnProfile && userListings.length > 0 && (
              <div className="border-t pt-6">
                <h3 className="font-semibold text-gray-900 mb-4">My Listings</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {userListings.map((listing) => (
                    <div
                      key={listing.id}
                      className="bg-gray-50 rounded-lg p-4 flex items-center gap-4 hover:bg-gray-100 transition-colors"
                    >
                      <div
                        className="w-20 h-20 bg-gray-200 rounded-lg overflow-hidden flex-shrink-0 cursor-pointer"
                        onClick={() => navigate(`/listing/${listing.id}`)}
                      >
                        <img
                          src={listing.image}
                          alt={listing.title}
                          className="w-full h-full object-cover"
                        />
                      </div>
                      <div className="flex-1 min-w-0">
                        <h4
                          className="font-medium text-gray-900 truncate cursor-pointer hover:text-red-600"
                          onClick={() => navigate(`/listing/${listing.id}`)}
                        >
                          {listing.title}
                        </h4>
                        <p className="text-lg font-bold text-red-600">${listing.price}</p>
                        <p className="text-sm text-gray-500">{listing.condition}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Reviews Received */}
            {reviews.length > 0 && (
              <div className="border-t pt-6">
                <h3 className="font-semibold text-gray-900 mb-4">Reviews Received</h3>
                <div className="space-y-4">
                  {reviews.map((review) => (
                    <div key={review.id} className="bg-gray-100 p-4 rounded-md">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center">
                          <UserIcon className="w-5 h-5 text-gray-500" />
                          <span className="ml-2 font-medium text-gray-900">{review.reviewerName}</span>
                        </div>
                        <div className="flex items-center">
                          {[1, 2, 3, 4, 5].map((star) => (
                            <Star
                              key={star}
                              className={`w-5 h-5 ${
                                star <= Math.floor(review.rating)
                                  ? 'fill-yellow-400 text-yellow-400'
                                  : star - 0.5 <= review.rating
                                  ? 'fill-yellow-400 text-yellow-400 opacity-50'
                                  : 'text-gray-300'
                              }`}
                            />
                          ))}
                        </div>
                      </div>
                      <p className="mt-2 text-gray-600 leading-relaxed">{review.comment}</p>
                      <p className="mt-1 text-sm text-gray-500">Date: {review.date}</p>
                      {review.listingTitle && (
                        <p className="mt-1 text-sm text-gray-500">Listing: {review.listingTitle}</p>
                      )}
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Reviews Given (only show for own profile) */}
            {isOwnProfile && myReviews.length > 0 && (
              <div className="border-t pt-6">
                <h3 className="font-semibold text-gray-900 mb-4">Reviews I've Written</h3>
                <div className="space-y-4">
                  {myReviews.map((review) => (
                    <div key={review.id} className="bg-blue-50 p-4 rounded-md">
                      <div className="flex items-center justify-between mb-2">
                        <div className="flex items-center gap-2">
                          <Package className="w-5 h-5 text-blue-600" />
                          {review.listingTitle && (
                            <span className="font-medium text-gray-900">{review.listingTitle}</span>
                          )}
                        </div>
                        <div className="flex items-center gap-2">
                          <div className="flex items-center">
                            {[1, 2, 3, 4, 5].map((star) => (
                              <Star
                                key={star}
                                className={`w-4 h-4 ${
                                  star <= Math.floor(review.rating)
                                    ? 'fill-yellow-400 text-yellow-400'
                                    : 'text-gray-300'
                                }`}
                              />
                            ))}
                          </div>
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => setDeleteReviewId(review.id)}
                            className="text-red-600 hover:text-red-700 hover:bg-red-100"
                          >
                            <Trash2 className="w-4 h-4" />
                          </Button>
                        </div>
                      </div>
                      <p className="text-gray-600 leading-relaxed">{review.comment}</p>
                      <p className="mt-1 text-sm text-gray-500">Date: {review.date}</p>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Report Dialog */}
      <Dialog open={isReportDialogOpen} onOpenChange={setIsReportDialogOpen}>
        <DialogContent className="sm:max-w-[500px]">
          <DialogHeader>
            <DialogTitle>Report User</DialogTitle>
            <DialogDescription>
              Please provide details about why you're reporting this user. This will be sent to our admin team for review.
            </DialogDescription>
          </DialogHeader>

          {reportSubmitted ? (
            <div className="py-8 text-center">
              <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <svg className="w-8 h-8 text-green-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                </svg>
              </div>
              <p className="text-lg font-semibold text-gray-900">Report Submitted</p>
              <p className="text-sm text-gray-500 mt-2">Thank you for helping keep Common Ground safe.</p>
            </div>
          ) : (
            <div className="space-y-4 py-4">
              <div className="space-y-2">
                <Label htmlFor="reason">Reason for Report</Label>
                <select
                  id="reason"
                  value={reportReason}
                  onChange={(e) => setReportReason(e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-red-500"
                >
                  <option value="">Select a reason</option>
                  <option value="spam">Spam or Scam</option>
                  <option value="inappropriate">Inappropriate Content</option>
                  <option value="harassment">Harassment</option>
                  <option value="fraud">Suspected Fraud</option>
                  <option value="other">Other</option>
                </select>
              </div>

              <div className="space-y-2">
                <Label htmlFor="description">Additional Details</Label>
                <Textarea
                  id="description"
                  placeholder="Please provide any additional information about this report..."
                  value={reportDescription}
                  onChange={(e) => setReportDescription(e.target.value)}
                  rows={4}
                />
              </div>
            </div>
          )}

          {!reportSubmitted && (
            <DialogFooter>
              <Button variant="outline" onClick={() => setIsReportDialogOpen(false)}>
                Cancel
              </Button>
              <Button
                onClick={handleSubmitReport}
                disabled={!reportReason || !reportDescription}
                className="bg-red-600 hover:bg-red-700"
              >
                Submit Report
              </Button>
            </DialogFooter>
          )}
        </DialogContent>
      </Dialog>

      {/* Delete Review Confirmation */}
      <AlertDialog open={!!deleteReviewId} onOpenChange={() => setDeleteReviewId(null)}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Delete Review</AlertDialogTitle>
            <AlertDialogDescription>
              Are you sure you want to delete this review? This will update the seller's rating and cannot be undone.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction
              onClick={handleDeleteReview}
              className="bg-red-600 hover:bg-red-700"
            >
              Delete
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}