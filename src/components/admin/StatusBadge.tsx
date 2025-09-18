'use client';

interface StatusBadgeProps {
  status: 'active' | 'inactive' | 'suspended';
  onClick?: () => void;
  clickable?: boolean;
  loading?: boolean;
}

export default function StatusBadge({
  status,
  onClick,
  clickable = false,
  loading = false
}: StatusBadgeProps) {
  const getStatusConfig = (status: string) => {
    switch (status) {
      case 'active':
        return {
          label: 'Actif',
          className: 'bg-green-100 text-green-800',
          tooltip: clickable ? 'Cliquer pour désactiver' : ''
        };
      case 'inactive':
        return {
          label: 'Inactif',
          className: 'bg-gray-100 text-gray-800',
          tooltip: clickable ? 'Cliquer pour activer' : ''
        };
      case 'suspended':
        return {
          label: 'Suspendu',
          className: 'bg-red-100 text-red-800',
          tooltip: clickable ? 'Cliquer pour activer' : ''
        };
      default:
        return {
          label: 'Inconnu',
          className: 'bg-gray-100 text-gray-800',
          tooltip: ''
        };
    }
  };

  const config = getStatusConfig(status);
  const Component = clickable ? 'button' : 'span';

  return (
    <Component
      onClick={clickable && !loading ? onClick : undefined}
      className={`px-2 py-1 inline-flex text-xs leading-5 font-semibold rounded-full ${config.className} ${
        clickable ? 'transition-colors hover:opacity-80 cursor-pointer' : ''
      } ${loading ? 'opacity-50 cursor-wait' : ''}`}
      title={config.tooltip}
      disabled={loading}
    >
      {loading ? '⏳' : config.label}
    </Component>
  );
}