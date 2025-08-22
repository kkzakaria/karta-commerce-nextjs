import { redirect } from 'next/navigation';
import { routing } from '@/i18n/routing';

// This page only renders when the user is on the root path
export default function RootPage() {
  redirect(`/${routing.defaultLocale}`);
}