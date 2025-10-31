
export const colors = {
  border: 'hsl(var(--border))',
  input: 'hsl(var(--input))',
  ring: 'hsl(var(--ring))',
  background: 'hsl(var(--background))',
  foreground: 'hsl(var(--foreground))',
  primary: {
    DEFAULT: 'hsl(var(--primary))',
    foreground: 'hsl(var(--primary-foreground))'
  },
  secondary: {
    DEFAULT: 'hsl(var(--secondary))',
    foreground: 'hsl(var(--secondary-foreground))'
  },
  destructive: {
    DEFAULT: 'hsl(var(--destructive))',
    foreground: 'hsl(var(--destructive-foreground))'
  },
  muted: {
    DEFAULT: 'hsl(var(--muted))',
    foreground: 'hsl(var(--muted-foreground))'
  },
  accent: {
    DEFAULT: 'hsl(var(--accent))',
    foreground: 'hsl(var(--accent-foreground))'
  },
  popover: {
    DEFAULT: 'hsl(var(--popover))',
    foreground: 'hsl(var(--popover-foreground))'
  },
  card: {
    DEFAULT: 'hsl(var(--card))',
    foreground: 'hsl(var(--card-foreground))'
  },
  sidebar: {
    DEFAULT: 'hsl(var(--sidebar-background))',
    foreground: 'hsl(var(--sidebar-foreground))',
    primary: 'hsl(var(--sidebar-primary))',
    'primary-foreground': 'hsl(var(--sidebar-primary-foreground))',
    accent: 'hsl(var(--sidebar-accent))',
    'accent-foreground': 'hsl(var(--sidebar-accent-foreground))',
    border: 'hsl(var(--sidebar-border))',
    ring: 'hsl(var(--sidebar-ring))'
  },
  // Palette Istituzionale Mia Romagna - Convertita in HSL per corretto funzionamento
  brand: {
    blue: {
      DEFAULT: 'hsl(var(--brand-blue))',
      foreground: 'hsl(var(--brand-blue-foreground))',
      50: 'hsl(214, 100%, 97%)',
      100: 'hsl(214, 100%, 94%)',
      200: 'hsl(207, 100%, 87%)',
      300: 'hsl(205, 100%, 74%)',
      400: 'hsl(204, 100%, 60%)',
      500: 'hsl(205, 93%, 49%)',
      600: 'hsl(210, 100%, 40%)',
      700: 'hsl(210, 100%, 32%)',
      800: 'hsl(210, 96%, 31%)',
      900: 'hsl(222, 47%, 11%)', // Blu scuro principale
      950: 'hsl(220, 44%, 8%)'
    },
    yellow: {
      DEFAULT: 'hsl(var(--brand-yellow))',
      foreground: 'hsl(var(--brand-yellow-foreground))',
      50: 'hsl(48, 100%, 96%)',
      100: 'hsl(48, 96%, 89%)',
      200: 'hsl(48, 97%, 77%)',
      300: 'hsl(46, 97%, 65%)',
      400: 'hsl(43, 96%, 56%)', // Giallo/Arancione principale
      500: 'hsl(38, 92%, 50%)',
      600: 'hsl(32, 95%, 44%)',
      700: 'hsl(26, 90%, 37%)',
      800: 'hsl(23, 83%, 32%)',
      900: 'hsl(21, 77%, 27%)'
    },
    gradient: {
      primary: 'hsl(var(--brand-gradient-primary))',
      soft: 'hsl(var(--brand-gradient-soft))'
    }
  },
  // Palette oro per La Mappa dell'Esploratore - Convertita in HSL
  gold: {
    DEFAULT: 'hsl(var(--gold))',
    foreground: 'hsl(var(--gold-foreground))',
    50: 'hsl(54, 91%, 95%)',
    100: 'hsl(55, 97%, 88%)',
    200: 'hsl(52, 98%, 77%)',
    300: 'hsl(54, 96%, 64%)',
    400: 'hsl(43, 64%, 51%)', // Oro/bronzo metallico principale
    500: 'hsl(48, 89%, 50%)',
    600: 'hsl(43, 94%, 41%)',
    700: 'hsl(41, 88%, 33%)',
    800: 'hsl(36, 86%, 28%)',
    900: 'hsl(31, 80%, 25%)',
    950: 'hsl(27, 79%, 15%)'
  }
};
