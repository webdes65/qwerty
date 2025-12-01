export default function InfoCard({ icon: Icon, label, value }) {
  return (
    <div className="flex items-center gap-4 p-4 bg-gray-200 dark:bg-dark-100 rounded-lg hover:shadow-md transition-shadow duration-200">
      <div className="flex-shrink-0 w-10 h-10 bg-white dark:bg-dark-100 rounded-full flex items-center justify-center">
        <Icon className="w-5 h-5 text-blue-600 dark:text-blue-400" />
      </div>
      <div className="flex-1 min-w-0 flex flex-row flex-wrap gap-1 items-center">
        <p className="text-sm text-dark-100 dark:text-white !text-wrap">
          {label}
        </p>
        <p className="text-base font-semibold text-dark-100 dark:text-white break-words !text-wrap">
          {value || "---"}
        </p>
      </div>
    </div>
  );
}
