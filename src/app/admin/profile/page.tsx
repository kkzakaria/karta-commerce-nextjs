'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { UserIcon, LockClosedIcon } from '@heroicons/react/24/outline';

interface AdminProfile {
  id: string;
  username: string;
  email: string;
}

interface PasswordFormData {
  currentPassword: string;
  newPassword: string;
  confirmPassword: string;
}

export default function AdminProfilePage() {
  const [profile, setProfile] = useState<AdminProfile | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  const [passwordForm, setPasswordForm] = useState<PasswordFormData>({
    currentPassword: '',
    newPassword: '',
    confirmPassword: ''
  });
  const [passwordLoading, setPasswordLoading] = useState(false);
  const [passwordError, setPasswordError] = useState('');
  const [passwordSuccess, setPasswordSuccess] = useState('');

  const router = useRouter();

  useEffect(() => {
    fetchProfile();
  }, []);

  const fetchProfile = async () => {
    try {
      const token = localStorage.getItem('admin-token');
      if (!token) {
        router.push('/admin-login');
        return;
      }

      const response = await fetch('/api/admin/profile', {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });

      if (!response.ok) {
        if (response.status === 401) {
          router.push('/admin-login');
          return;
        }
        throw new Error('Failed to fetch profile');
      }

      const data = await response.json();
      setProfile(data.admin);
    } catch (error) {
      console.error('Error fetching profile:', error);
      setError('Erreur lors du chargement du profil');
    } finally {
      setLoading(false);
    }
  };

  const handlePasswordChange = async (e: React.FormEvent) => {
    e.preventDefault();
    setPasswordLoading(true);
    setPasswordError('');
    setPasswordSuccess('');

    try {
      const token = localStorage.getItem('admin-token');
      if (!token) {
        router.push('/admin-login');
        return;
      }

      const response = await fetch('/api/admin/profile/password', {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify(passwordForm)
      });

      const data = await response.json();

      if (!response.ok) {
        if (data.details) {
          // Handle validation errors
          const firstError = data.details[0];
          setPasswordError(firstError.message);
        } else {
          setPasswordError(data.error || 'Erreur lors du changement de mot de passe');
        }
        return;
      }

      setPasswordSuccess('Mot de passe mis à jour avec succès ! Vous allez être déconnecté.');
      setPasswordForm({
        currentPassword: '',
        newPassword: '',
        confirmPassword: ''
      });

      // Disconnect user after 2 seconds for security
      setTimeout(() => {
        localStorage.removeItem('admin-token');
        router.push('/admin-login');
      }, 2000);

    } catch (error) {
      console.error('Error changing password:', error);
      setPasswordError('Une erreur est survenue');
    } finally {
      setPasswordLoading(false);
    }
  };

  const validatePassword = (password: string) => {
    const minLength = password.length >= 8;
    const hasUpper = /[A-Z]/.test(password);
    const hasLower = /[a-z]/.test(password);
    const hasNumber = /\d/.test(password);

    return {
      minLength,
      hasUpper,
      hasLower,
      hasNumber,
      isValid: minLength && hasUpper && hasLower && hasNumber
    };
  };

  const passwordValidation = validatePassword(passwordForm.newPassword);

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="text-lg">Chargement...</div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="bg-red-50 border border-red-200 rounded-md p-4">
        <div className="text-red-800">{error}</div>
      </div>
    );
  }

  if (!profile) {
    return (
      <div className="text-center py-8">
        <div className="text-gray-500">Profil non trouvé</div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-gray-900">Profil Administrateur</h1>
        <p className="text-gray-600">Gérez vos informations personnelles et sécurité</p>
      </div>

      {/* Profile Information */}
      <div className="bg-white shadow rounded-lg">
        <div className="px-6 py-4 border-b border-gray-200">
          <h2 className="text-lg font-medium flex items-center space-x-2">
            <UserIcon className="h-5 w-5 text-gray-400" />
            <span>Informations Personnelles</span>
          </h2>
        </div>
        <div className="px-6 py-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700">
                Nom d&apos;utilisateur
              </label>
              <div className="mt-1 text-sm text-gray-900 bg-gray-50 px-3 py-2 rounded-md">
                {profile.username}
              </div>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700">
                Email
              </label>
              <div className="mt-1 text-sm text-gray-900 bg-gray-50 px-3 py-2 rounded-md">
                {profile.email}
              </div>
            </div>
          </div>
          <p className="mt-4 text-xs text-gray-500">
            Les informations personnelles ne peuvent pas être modifiées. Contactez un super-administrateur si nécessaire.
          </p>
        </div>
      </div>

      {/* Password Change */}
      <div className="bg-white shadow rounded-lg">
        <div className="px-6 py-4 border-b border-gray-200">
          <h2 className="text-lg font-medium flex items-center space-x-2">
            <LockClosedIcon className="h-5 w-5 text-gray-400" />
            <span>Changement de Mot de Passe</span>
          </h2>
        </div>
        <div className="px-6 py-4">
          <form onSubmit={handlePasswordChange} className="space-y-4">
            {passwordError && (
              <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded">
                {passwordError}
              </div>
            )}

            {passwordSuccess && (
              <div className="bg-green-50 border border-green-200 text-green-700 px-4 py-3 rounded">
                {passwordSuccess}
              </div>
            )}

            <div>
              <label htmlFor="currentPassword" className="block text-sm font-medium text-gray-700">
                Mot de passe actuel *
              </label>
              <input
                type="password"
                id="currentPassword"
                required
                value={passwordForm.currentPassword}
                onChange={(e) => setPasswordForm({ ...passwordForm, currentPassword: e.target.value })}
                className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 px-3 py-2 border"
                disabled={passwordLoading}
              />
            </div>

            <div>
              <label htmlFor="newPassword" className="block text-sm font-medium text-gray-700">
                Nouveau mot de passe *
              </label>
              <input
                type="password"
                id="newPassword"
                required
                value={passwordForm.newPassword}
                onChange={(e) => setPasswordForm({ ...passwordForm, newPassword: e.target.value })}
                className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 px-3 py-2 border"
                disabled={passwordLoading}
              />

              {passwordForm.newPassword && (
                <div className="mt-2 text-xs space-y-1">
                  <div className={`flex items-center space-x-2 ${passwordValidation.minLength ? 'text-green-600' : 'text-red-600'}`}>
                    <span>{passwordValidation.minLength ? '✓' : '✗'}</span>
                    <span>Au moins 8 caractères</span>
                  </div>
                  <div className={`flex items-center space-x-2 ${passwordValidation.hasUpper ? 'text-green-600' : 'text-red-600'}`}>
                    <span>{passwordValidation.hasUpper ? '✓' : '✗'}</span>
                    <span>Une lettre majuscule</span>
                  </div>
                  <div className={`flex items-center space-x-2 ${passwordValidation.hasLower ? 'text-green-600' : 'text-red-600'}`}>
                    <span>{passwordValidation.hasLower ? '✓' : '✗'}</span>
                    <span>Une lettre minuscule</span>
                  </div>
                  <div className={`flex items-center space-x-2 ${passwordValidation.hasNumber ? 'text-green-600' : 'text-red-600'}`}>
                    <span>{passwordValidation.hasNumber ? '✓' : '✗'}</span>
                    <span>Un chiffre</span>
                  </div>
                </div>
              )}
            </div>

            <div>
              <label htmlFor="confirmPassword" className="block text-sm font-medium text-gray-700">
                Confirmer le nouveau mot de passe *
              </label>
              <input
                type="password"
                id="confirmPassword"
                required
                value={passwordForm.confirmPassword}
                onChange={(e) => setPasswordForm({ ...passwordForm, confirmPassword: e.target.value })}
                className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 px-3 py-2 border"
                disabled={passwordLoading}
              />

              {passwordForm.confirmPassword && passwordForm.newPassword !== passwordForm.confirmPassword && (
                <div className="mt-1 text-xs text-red-600">
                  Les mots de passe ne correspondent pas
                </div>
              )}
            </div>

            <div className="pt-4">
              <button
                type="submit"
                disabled={passwordLoading || !passwordValidation.isValid || passwordForm.newPassword !== passwordForm.confirmPassword}
                className="bg-blue-600 text-white py-2 px-4 rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {passwordLoading ? 'Changement...' : 'Changer le mot de passe'}
              </button>
            </div>
          </form>

          <div className="mt-6 p-4 bg-amber-50 rounded-lg">
            <h3 className="font-semibold text-amber-900 mb-2">🔒 Sécurité</h3>
            <ul className="text-sm text-amber-700 space-y-1">
              <li>• Après changement, vous serez automatiquement déconnecté</li>
              <li>• Utilisez un mot de passe unique et sécurisé</li>
              <li>• Ne partagez jamais vos identifiants</li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
}