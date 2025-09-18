'use client';

interface ConfirmModalProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => void;
  title: string;
  message: string;
  confirmText?: string;
  cancelText?: string;
  dangerous?: boolean;
  loading?: boolean;
}

export default function ConfirmModal({
  isOpen,
  onClose,
  onConfirm,
  title,
  message,
  confirmText = 'Confirmer',
  cancelText = 'Annuler',
  dangerous = false,
  loading = false
}: ConfirmModalProps) {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-gray-600 bg-opacity-50 overflow-y-auto h-full w-full z-50">
      <div className="relative top-20 mx-auto p-5 border w-96 shadow-lg rounded-md bg-white">
        <div className="mt-3">
          <div className="flex items-center mb-4">
            <div className={`mx-auto flex-shrink-0 flex items-center justify-center h-12 w-12 rounded-full ${
              dangerous ? 'bg-red-100' : 'bg-blue-100'
            }`}>
              <span className="text-2xl">
                {dangerous ? '⚠️' : 'ℹ️'}
              </span>
            </div>
          </div>

          <div className="text-center">
            <h3 className="text-lg leading-6 font-medium text-gray-900 mb-2">
              {title}
            </h3>
            <div className="mt-2 px-7 py-3">
              <p className="text-sm text-gray-500">
                {message}
              </p>
            </div>
          </div>

          <div className="flex items-center justify-center space-x-3 mt-6">
            <button
              onClick={onConfirm}
              disabled={loading}
              className={`px-4 py-2 text-base font-medium rounded-md w-auto min-w-[100px] shadow-sm focus:outline-none focus:ring-2 focus:ring-offset-2 disabled:opacity-50 ${
                dangerous
                  ? 'bg-red-600 text-white hover:bg-red-700 focus:ring-red-500'
                  : 'bg-blue-600 text-white hover:bg-blue-700 focus:ring-blue-500'
              }`}
            >
              {loading ? '⏳ Traitement...' : confirmText}
            </button>
            <button
              onClick={onClose}
              disabled={loading}
              className="px-4 py-2 bg-gray-300 text-gray-700 text-base font-medium rounded-md w-auto min-w-[100px] shadow-sm hover:bg-gray-400 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gray-300 disabled:opacity-50"
            >
              {cancelText}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}