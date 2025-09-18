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
      },
      products: {
        title: "Gestion des Produits",
        subtitle: "Gérez votre catalogue de motos",
        addNew: "Ajouter un produit",
        edit: "Modifier",
        delete: "Supprimer",
        confirmDelete: "Êtes-vous sûr de vouloir supprimer ce produit ?",
        loading: "Chargement des produits...",
        notFound: "Produit non trouvé",
        backToList: "← Retour à la liste"
      },
      forms: {
        cancel: "Annuler",
        save: "Enregistrer",
        create: "Créer le produit",
        update: "Mettre à jour",
        creating: "Création...",
        updating: "Mise à jour...",
        loading: "Chargement...",
        error: "Une erreur est survenue",
        success: "Opération réussie"
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
  const [sidebarOpen, setSidebarOpen] = useState(false);
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
        <AdminHeader
          onMenuClick={() => setSidebarOpen(true)}
          sidebarOpen={sidebarOpen}
        />
        <div className="flex">
          <AdminSidebar
            isOpen={sidebarOpen}
            onClose={() => setSidebarOpen(false)}
          />
          <main className="flex-1 p-4 md:p-6 transition-all duration-300 md:ml-0">
            {children}
          </main>
        </div>

        {/* Mobile overlay */}
        {sidebarOpen && (
          <div
            className="fixed inset-0 bg-black bg-opacity-50 z-40 md:hidden"
            onClick={() => setSidebarOpen(false)}
          />
        )}
      </div>
    </NextIntlClientProvider>
  );
}