export default function RootLoading() {
  return (
    <div className="flex min-h-screen items-center justify-center bg-white dark:bg-zinc-950 font-sans">
      <div className="flex flex-col items-center gap-6">
        {/* Spinner – sharp square, red/zinc */}
        <div className="flex items-center justify-center border-4 border-red-600 bg-red-600 dark:border-red-500 dark:bg-red-500 animate-pulse px-6 py-4">
          <span className="text-xl font-bold text-white dark:text-zinc-950">
            Karki Catering Service
          </span>
        </div>
        <p className="text-sm font-medium text-zinc-600 dark:text-zinc-400">
          Loading...........
        </p>
      </div>
    </div>
  );
}