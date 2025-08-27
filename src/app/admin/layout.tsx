'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { NextIntlClientProvider } from 'next-intl';
import AdminHeader from '@/components/AdminHeader';
import AdminSidebar from '@/components/AdminSidebar';

// Import messages directly for admin
const messages = {
  fr: {
    Admin: {
      title: "Administration",
      logout: "Déconnexion",
      navigation: {
        menu: "Menu",
        dashboard: "Tableau de bord",
        products: "Produits",
        addProduct: "Ajouter un produit",
        analytics: "Analyses"
      },
      role: {
        administrator: "Administrateur"
      },
      dashboard: {
        title: "Tableau de Bord",
        subtitle: "Vue d'ensemble de votre administration",
        loading: "Chargement...",
        stats: {
          products: "Produits",
          views: "Vues",
          contacts: "Contacts",
          orders: "Commandes"
        },
        recentActivity: {
          title: "Activité Récente",
          noActivity: "Aucune activité récente"
        }
      }
    }
  }
};

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const [isAuthenticated, setIsAuthenticated] = useState<boolean | null>(null);
  const router = useRouter();

  useEffect(() => {
    const token = localStorage.getItem('admin-token');
    if (!token) {
      setIsAuthenticated(false);
      router.push('/admin-login');
    } else {
      setIsAuthenticated(true);
    }
  }, [router]);

  if (isAuthenticated === null) {
    return (
      <div className="min-h-screen bg-gray-100 flex items-center justify-center">
        <div className="text-gray-600">Chargement...</div>
      </div>
    );
  }

  if (!isAuthenticated) {
    return null;
  }

  return (
    <NextIntlClientProvider messages={messages.fr} locale="fr">
      <div className="min-h-screen bg-gray-100">
        <AdminHeader />
        <div className="flex">
          <AdminSidebar />
          <main className="flex-1 p-6">
            {children}
          </main>
        </div>
      </div>
    </NextIntlClientProvider>
  );
}