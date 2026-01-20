import { useState, useRef, useEffect } from "react";
import { cn } from "@/lib/utils";

interface OptimizedImageProps extends React.ImgHTMLAttributes<HTMLImageElement> {
  src: string;
  alt: string;
  className?: string;
  containerClassName?: string;
  priority?: boolean;
  placeholder?: "blur" | "empty";
}

/**
 * OptimizedImage component with lazy loading, blur placeholder, and error handling
 */
const OptimizedImage = ({
  src,
  alt,
  className,
  containerClassName,
  priority = false,
  placeholder = "blur",
  ...props
}: OptimizedImageProps) => {
  const [isLoaded, setIsLoaded] = useState(false);
  const [hasError, setHasError] = useState(false);
  const [isInView, setIsInView] = useState(priority);
  const imgRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (priority) {
      setIsInView(true);
      return;
    }

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsInView(true);
          observer.disconnect();
        }
      },
      {
        rootMargin: "200px", // Start loading 200px before image enters viewport
        threshold: 0,
      }
    );

    if (imgRef.current) {
      observer.observe(imgRef.current);
    }

    return () => observer.disconnect();
  }, [priority]);

  const handleLoad = () => {
    setIsLoaded(true);
  };

  const handleError = () => {
    setHasError(true);
    setIsLoaded(true);
  };

  return (
    <div
      ref={imgRef}
      className={cn(
        "relative overflow-hidden bg-muted",
        containerClassName
      )}
    >
      {/* Blur placeholder */}
      {placeholder === "blur" && !isLoaded && (
        <div
          className={cn(
            "absolute inset-0 animate-pulse bg-gradient-to-r from-muted via-muted-foreground/10 to-muted",
            className
          )}
        />
      )}

      {/* Error fallback */}
      {hasError && (
        <div
          className={cn(
            "absolute inset-0 flex items-center justify-center bg-muted text-muted-foreground text-sm",
            className
          )}
        >
          <span>Không thể tải ảnh</span>
        </div>
      )}

      {/* Actual image */}
      {isInView && !hasError && (
        <img
          src={src}
          alt={alt}
          loading={priority ? "eager" : "lazy"}
          decoding="async"
          fetchPriority={priority ? "high" : "auto"}
          onLoad={handleLoad}
          onError={handleError}
          className={cn(
            "transition-opacity duration-300",
            isLoaded ? "opacity-100" : "opacity-0",
            className
          )}
          {...props}
        />
      )}
    </div>
  );
};

export default OptimizedImage;
