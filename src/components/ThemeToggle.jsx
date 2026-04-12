import { useTheme } from '../utils/theme'

export default function ThemeToggle() {
  const { isDark, toggleTheme } = useTheme()

  return (
    <button
      type="button"
      onClick={toggleTheme}
      className="inline-flex h-9 w-9 items-center justify-center rounded-md border border-medical-blue-200 bg-white/90 text-medical-blue-700 transition-all duration-200 hover:border-neon-cyan-400 hover:text-neon-cyan-600 hover:shadow-glow-neon focus:outline-none focus:ring-2 focus:ring-medical-blue-500 focus:ring-offset-2 dark:border-neon-cyan-400/50 dark:bg-dark-surface dark:text-neon-cyan-300"
      aria-label={isDark ? 'Helles Design aktivieren' : 'Dunkles Design aktivieren'}
      title={isDark ? 'Zu hellem Design wechseln' : 'Zu dunklem Design wechseln'}
    >
      {isDark ? (
        <svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true">
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M12 3v2m0 14v2m9-9h-2M5 12H3m15.364 6.364-1.414-1.414M7.05 7.05 5.636 5.636m12.728 0L16.95 7.05M7.05 16.95l-1.414 1.414M12 8a4 4 0 100 8 4 4 0 000-8z"
          />
        </svg>
      ) : (
        <svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true">
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M20.354 15.354A9 9 0 118.646 3.646a7 7 0 0011.708 11.708z"
          />
        </svg>
      )}
      <span className="sr-only">Theme wechseln</span>
    </button>
  )
}
