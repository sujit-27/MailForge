export const SidebarIcon = ({ type }) => {
  const base = "w-4 h-4 relative flex items-center justify-center";
  switch (type) {
    case "grid":
      return (
        <div className="grid grid-cols-2 gap-0.5">
          {[...Array(4)].map((_, i) => (
            <div key={i} className="w-1.5 h-1.5 border border-current rounded-sm" />
          ))}
        </div>
      );
    case "send":
      return <div className="w-3.5 h-3.5 border-t-2 border-r-2 border-current rotate-45" />;
    case "logs":
      return (
        <div className="flex flex-col gap-1">
          <div className="w-4 h-0.5 bg-current rounded" />
          <div className="w-3 h-0.5 bg-current rounded opacity-70" />
          <div className="w-4 h-0.5 bg-current rounded" />
        </div>
      );
    case "layout":
      return <div className="w-4 h-4 border-2 border-current" />;
    case "chart":
      return (
        <div className="flex items-end gap-0.5">
          <div className="w-1 h-2 bg-current" />
          <div className="w-1 h-3 bg-current" />
          <div className="w-1 h-1 bg-current" />
          <div className="w-1 h-4 bg-current" />
        </div>
      );
    case "key":
      return <div className="w-4 h-4 border-2 border-current rounded-full" />;
    case "user":
      return (
        <div className="flex flex-col items-center">
          <div className="w-2 h-2 border-2 border-current rounded-full" />
          <div className="w-4 h-2 border-x-2 border-t-2 border-current rounded-t-full" />
        </div>
      );
    default:
      return <div className="w-1 h-1 bg-current rounded-full" />;
  }
};
