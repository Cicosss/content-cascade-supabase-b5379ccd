
export const STATUS_CONFIG = {
  pending: { variant: 'outline' as const, label: 'In Attesa' },
  approved: { variant: 'default' as const, label: 'Approvata' },
  rejected: { variant: 'destructive' as const, label: 'Rifiutata' },
  edited: { variant: 'secondary' as const, label: 'Modificata' }
};
