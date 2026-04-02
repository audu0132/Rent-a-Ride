const SkeletonLoader = () => {
  return (
    <div className="grid grid-cols-1 gap-4 bg-slate-100/50 p-4 md:grid-cols-3">
      {Array.from({ length: 3 }).map((_, index) => (
        <div key={index} className="animate-pulse rounded-2xl border border-slate-200 bg-white/90 p-4">
          <div className="h-4 w-1/2 rounded bg-slate-200" />
          <div className="mt-4 h-10 rounded-lg bg-slate-200" />
          <div className="mt-2 h-10 rounded-lg bg-slate-200" />
          <div className="mt-2 h-10 rounded-lg bg-slate-200" />
        </div>
      ))}
    </div>
  );
};

export default SkeletonLoader;
