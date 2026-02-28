'use client';

export {
  useApiDelete,
  useApiDeleteById,
  useApiGet,
  useApiInfinite,
  useApiPatch,
  useApiPost,
  useApiPut,
  useApiQuery,
  useInvalidate,
  useOptimisticAdd,
  useOptimisticMutation,
  useOptimisticRemove,
  useOptimisticUpdate,
  usePrefetch,
} from './api';

export {
  useAuthStatus,
  useInfiniteTodos,
  useOverdueTodos,
  useProfile,
  useSearchTodos,
  useSessionCheck,
  useTodo,
  useTodos,
  useTodosByPriority,
  useTodosByStatus,
  useTodosDueToday,
  useTodoStats,
} from './queries';

export {
  useChangePassword,
  useCreateTodo,
  useDeleteTodo,
  useLogin,
  useLogout,
  useMagicLink,
  useRegister,
  useRequestPasswordReset,
  useResetPassword,
  useToggleTodo,
  useUpdateProfile,
  useUpdateTodo,
  useVerifyMagicLink,
} from './mutations';

export {
  useBreakpoint,
  useDebounce,
  useDebouncedCallback,
  useDebounceWithLoading,
  useIsDesktop,
  useIsLargeDesktop,
  useIsMobile,
  useIsTablet,
  useLocalStorage,
  useMediaQuery,
  usePrefersDarkMode,
  usePrefersReducedMotion,
  useSessionStorage,
} from './utils';

export {
  useApiConfig,
  useAppConfig,
  useAuth,
  useAuthConfig,
  useDjangoConfig,
  useEnvConfig,
  useFeatureEnabled,
  useIsDjangoSPA,
  useIsStandalone,
  useSetTheme,
  useTheme,
  useTodos as useTodosStore,
  useToggleTheme,
  useUI,
} from '@/lib/store';
