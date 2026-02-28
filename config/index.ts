export interface AppConfig {
  api: {
    baseUrl: string;
    timeout: number;
    retries: number;
    version: string;
  };
  auth: {
    tokenKey: string;
    refreshTokenKey: string;
    tokenExpiry: number;
    enableMagicLink: boolean;
  };
  features: {
    enableTodos: boolean;
    enableNotifications: boolean;
    enableAnalytics: boolean;
    enableDarkMode: boolean;
  };
  env: {
    isDevelopment: boolean;
    isProduction: boolean;
    isTest: boolean;
    mode: 'standalone' | 'django-spa';
  };
  django?: {
    csrfTokenName: string;
    staticUrl: string;
    mediaUrl: string;
    apiPrefix: string;
  };
}

const getEnvVar = (key: string, defaultValue: string = ''): string => {
  return process.env[key] || defaultValue;
};

const getEnvBool = (key: string, defaultValue: boolean = false): boolean => {
  const value = getEnvVar(key);
  return value === 'true' || value === '1' || defaultValue;
};

const isDjangoSPAMode = getEnvVar('NEXT_PUBLIC_MODE') === 'django-spa';

export const config: AppConfig = {
  api: {
    baseUrl: getEnvVar(
      'NEXT_PUBLIC_API_BASE_URL',
      isDjangoSPAMode ? '/api/v1' : 'http://localhost:8000/api/v1'
    ),
    timeout: parseInt(getEnvVar('NEXT_PUBLIC_API_TIMEOUT', '10000')),
    retries: parseInt(getEnvVar('NEXT_PUBLIC_API_RETRIES', '3')),
    version: getEnvVar('NEXT_PUBLIC_API_VERSION', 'v1'),
  },
  auth: {
    tokenKey: getEnvVar('NEXT_PUBLIC_AUTH_TOKEN_KEY', 'access_token'),
    refreshTokenKey: getEnvVar('NEXT_PUBLIC_AUTH_REFRESH_TOKEN_KEY', 'refresh_token'),
    tokenExpiry: parseInt(getEnvVar('NEXT_PUBLIC_AUTH_TOKEN_EXPIRY', '3600')),
    enableMagicLink: getEnvBool('NEXT_PUBLIC_ENABLE_MAGIC_LINK', true),
  },
  features: {
    enableTodos: getEnvBool('NEXT_PUBLIC_ENABLE_TODOS', true),
    enableNotifications: getEnvBool('NEXT_PUBLIC_ENABLE_NOTIFICATIONS', true),
    enableAnalytics: getEnvBool('NEXT_PUBLIC_ENABLE_ANALYTICS', false),
    enableDarkMode: getEnvBool('NEXT_PUBLIC_ENABLE_DARK_MODE', true),
  },
  env: {
    isDevelopment: process.env.NODE_ENV === 'development',
    isProduction: process.env.NODE_ENV === 'production',
    isTest: process.env.NODE_ENV === 'test',
    mode: isDjangoSPAMode ? 'django-spa' : 'standalone',
  },
  ...(isDjangoSPAMode && {
    django: {
      csrfTokenName: getEnvVar('NEXT_PUBLIC_DJANGO_CSRF_TOKEN_NAME', 'csrftoken'),
      staticUrl: getEnvVar('NEXT_PUBLIC_DJANGO_STATIC_URL', '/static/'),
      mediaUrl: getEnvVar('NEXT_PUBLIC_DJANGO_MEDIA_URL', '/media/'),
      apiPrefix: getEnvVar('NEXT_PUBLIC_DJANGO_API_PREFIX', '/api/v1'),
    },
  }),
};

export const apiConfig = config.api;
export const authConfig = config.auth;
export const featureConfig = config.features;
export const envConfig = config.env;
export const djangoConfig = config.django;

export const isDevelopment = () => config.env.isDevelopment;
export const isProduction = () => config.env.isProduction;
export const isTest = () => config.env.isTest;
export const isDjangoSPA = () => config.env.mode === 'django-spa';
export const isStandalone = () => config.env.mode === 'standalone';

export const isFeatureEnabled = (
  feature: keyof typeof config.features
): boolean => {
  return config.features[feature];
};
