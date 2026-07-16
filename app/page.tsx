export default function Home() {
    return (
      <div className="flex flex-col items-center justify-center h-screen gap-4 bg-white dark:bg-zinc-900 transition-colors">
        <div className="h-12 w-12 border-4 border-zinc-200 dark:border-zinc-800 border-t-red-600 dark:border-t-red-500 animate-spin" />
        <p className="text-sm text-zinc-600 dark:text-zinc-400 font-medium">
          Please wait, things are loading...
        </p>
      </div>
    )

}