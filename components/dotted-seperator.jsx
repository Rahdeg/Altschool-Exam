import { cn } from "@/lib/utils";

export const DottedSeparator = ({
  className,
  color = "#d4d4d8",
  height = "2px",
  dotSize = "2px",
  gapSize = "6px",
  direction = "horizontal",
}) => {
  const isHorinzontal = direction === "horizontal";

  return (
    <div
      className={cn(
        isHorinzontal
          ? "w-full flex items-center"
          : "h-full flex flex-col items-center",
        className
      )}
    >
      <div
        className={isHorinzontal ? "flex-grow" : "flex-grow-0"}
        style={{
          width: isHorinzontal ? "100%" : height,
          height: isHorinzontal ? height : "100%",
          backgroundImage: `radial-gradient(circle, ${color} 25%, transparent 25%)`,
          backgroundSize: isHorinzontal
            ? `${parseInt(dotSize) + parseInt(gapSize)}px ${height}`
            : `${height} ${parseInt(dotSize) + parseInt(gapSize)}px`,
          backgroundRepeat: isHorinzontal ? "repeat-x" : "repeat-y",
          backgroundPosition: "center",
        }}
      ></div>
    </div>
  );
};
