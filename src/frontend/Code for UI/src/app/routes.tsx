import { createBrowserRouter } from 'react-router';
import { HomePage } from './pages/HomePage';
import { ListingDetailPage } from './pages/ListingDetailPage';
import { AuthPage } from './pages/AuthPage';
import { CreateListingPage } from './pages/CreateListingPage';
import { EditListingPage } from './pages/EditListingPage';
import { ProfilePage } from './pages/ProfilePage';
import { EditProfilePage } from './pages/EditProfilePage';
import { TransactionPage } from './pages/TransactionPage';
import { TransactionConfirmPage } from './pages/TransactionConfirmPage';
import { PendingTransactionsPage } from './pages/PendingTransactionsPage';
import { HelpPage } from './pages/HelpPage';
import { AdminPage } from './pages/AdminPage';

export const router = createBrowserRouter([
  {
    path: '/',
    Component: HomePage,
  },
  {
    path: '/listing/:id',
    Component: ListingDetailPage,
  },
  {
    path: '/auth',
    Component: AuthPage,
  },
  {
    path: '/create-listing',
    Component: CreateListingPage,
  },
  {
    path: '/edit-listing/:id',
    Component: EditListingPage,
  },
  {
    path: '/profile/:email',
    Component: ProfilePage,
  },
  {
    path: '/edit-profile',
    Component: EditProfilePage,
  },
  {
    path: '/transaction',
    Component: TransactionPage,
  },
  {
    path: '/transaction-confirm',
    Component: TransactionConfirmPage,
  },
  {
    path: '/pending-transactions',
    Component: PendingTransactionsPage,
  },
  {
    path: '/help',
    Component: HelpPage,
  },
  {
    path: '/admin',
    Component: AdminPage,
  },
]);