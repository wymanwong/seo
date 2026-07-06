interface ProgressBarProps {
  progress: number;
}

export function ProgressBar({ progress }: ProgressBarProps) {
  return (
    <div className="sticky top-0 z-20 bg-white">
      <div className="h-2 bg-[#E5E5E7]">
        <div
          className="h-full bg-[#5855ff] transition-all duration-500 ease-out"
          style={{ width: `${progress}%` }}
        />
      </div>
    </div>
  );
}
