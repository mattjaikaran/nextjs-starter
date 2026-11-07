import {
  useState,
  useCallback,
  type ReactNode,
  type SyntheticEvent,
  type CSSProperties,
  type ImgHTMLAttributes,
} from "react"
import { cn } from "@/lib/utils"

type ImageLayout = "responsive" | "fill" | "fixed" | "intrinsic"
type ImagePlaceholder = "skeleton" | "blur" | "none"
type ImageRounded = false | "sm" | "md" | "lg" | "full"
type LoadStatus = "loading" | "loaded" | "error"

interface LoadState {
  src: string
  status: LoadStatus
  useFallback: boolean
}

interface ImageProps extends Omit<ImgHTMLAttributes<HTMLImageElement>, "placeholder"> {
  src: string
  alt: string
  layout?: ImageLayout
  aspectRatio?: string
  objectFit?: "cover" | "contain" | "fill" | "none" | "scale-down"
  objectPosition?: string
  placeholder?: ImagePlaceholder
  blurDataURL?: string
  priority?: boolean
  fallbackSrc?: string
  fallback?: ReactNode
  rounded?: ImageRounded
  wrapperClassName?: string
}

const roundedMap: Record<Exclude<ImageRounded, false>, string> = {
  sm: "rounded-sm",
  md: "rounded-md",
  lg: "rounded-lg",
  full: "rounded-full",
}

function Image({
  src,
  alt,
  layout = "responsive",
  aspectRatio,
  objectFit = "cover",
  objectPosition = "center",
  placeholder = "none",
  blurDataURL,
  priority = false,
  fallbackSrc,
  fallback,
  rounded = false,
  wrapperClassName,
  className,
  width,
  height,
  style,
  onLoad,
  onError,
  ...props
}: ImageProps) {
  const [loadState, setLoadState] = useState<LoadState>(() => ({
    src,
    status: "loading",
    useFallback: false,
  }))

  // State is tied to the src it was recorded for: a new src renders as a
  // fresh load without writing state during render.
  const isCurrent = loadState.src === src
  const status = isCurrent ? loadState.status : "loading"
  const useFallback = isCurrent ? loadState.useFallback : false

  const currentSrc = useFallback && fallbackSrc ? fallbackSrc : src

  const imgCallbackRef = useCallback(
    (img: HTMLImageElement | null) => {
      if (!img?.complete) return
      setLoadState((prev) =>
        prev.src === src && prev.status === "loading"
          ? { ...prev, status: "loaded" }
          : prev,
      )
    },
    [src],
  )

  function handleLoad(e: SyntheticEvent<HTMLImageElement>) {
    setLoadState({ src, status: "loaded", useFallback })
    onLoad?.(e)
  }

  function handleError(e: SyntheticEvent<HTMLImageElement>) {
    if (fallbackSrc && !useFallback) {
      setLoadState({ src, status: "loading", useFallback: true })
    } else {
      setLoadState({ src, status: "error", useFallback })
    }
    onError?.(e)
  }

  const isLoading = status === "loading"
  const isError = status === "error"
  const roundedClass = rounded ? roundedMap[rounded] : ""

  if (isError && fallback) {
    return <>{fallback}</>
  }

  const wrapperStyle: CSSProperties = {}
  const imgStyle: CSSProperties = { objectFit, objectPosition, ...style }

  if (layout === "fill") {
    wrapperStyle.position = "absolute"
    wrapperStyle.inset = 0
    imgStyle.width = "100%"
    imgStyle.height = "100%"
  } else if (layout === "fixed") {
    wrapperStyle.display = "inline-block"
    wrapperStyle.position = "relative"
    if (width) wrapperStyle.width = width
    if (height) wrapperStyle.height = height
    imgStyle.width = width
    imgStyle.height = height
  } else if (layout === "intrinsic") {
    wrapperStyle.display = "inline-block"
    wrapperStyle.position = "relative"
    wrapperStyle.maxWidth = "100%"
    if (width) imgStyle.width = width
    if (height) imgStyle.height = height
  } else {
    wrapperStyle.position = "relative"
    wrapperStyle.width = "100%"
    if (aspectRatio) {
      wrapperStyle.aspectRatio = aspectRatio
    } else if (width && height) {
      wrapperStyle.aspectRatio = `${width}/${height}`
    }
    imgStyle.width = "100%"
    imgStyle.height = "100%"
  }

  const showSkeleton = isLoading && placeholder === "skeleton"
  const showBlur = isLoading && placeholder === "blur" && Boolean(blurDataURL)

  return (
    <span
      className={cn("block overflow-hidden", roundedClass, wrapperClassName)}
      style={wrapperStyle}
    >
      {showSkeleton && (
        <span
          className={cn("absolute inset-0 animate-pulse bg-muted", roundedClass)}
        />
      )}
      {showBlur && (
        // The wrapper needs the raw element: next/image cannot do these layout modes.
        // eslint-disable-next-line @next/next/no-img-element
        <img
          src={blurDataURL}
          aria-hidden
          alt=""
          className={cn("absolute inset-0 h-full w-full scale-110 blur-xl", roundedClass)}
          style={{ objectFit }}
        />
      )}
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img
        ref={imgCallbackRef}
        src={currentSrc}
        alt={alt}
        width={width}
        height={height}
        loading={priority ? undefined : "lazy"}
        decoding={priority ? undefined : "async"}
        onLoad={handleLoad}
        onError={handleError}
        className={cn(
          "transition-opacity duration-300",
          isLoading ? "opacity-0" : "opacity-100",
          roundedClass,
          className,
        )}
        style={imgStyle}
        {...props}
      />
    </span>
  )
}

interface AvatarImageProps extends Omit<ImageProps, "layout" | "rounded" | "objectFit"> {
  size?: number
}

function AvatarImage({ size = 40, width, height, alt, ...props }: AvatarImageProps) {
  return (
    <Image
      alt={alt}
      layout="fixed"
      rounded="full"
      objectFit="cover"
      width={width ?? size}
      height={height ?? size}
      {...props}
    />
  )
}

function HeroImage({
  alt,
  ...props
}: Omit<ImageProps, "layout" | "aspectRatio" | "priority" | "objectFit">) {
  return (
    <Image
      alt={alt}
      layout="responsive"
      aspectRatio="16/9"
      priority
      objectFit="cover"
      {...props}
    />
  )
}

function ThumbnailImage({
  alt,
  ...props
}: Omit<ImageProps, "layout" | "aspectRatio" | "rounded" | "objectFit">) {
  return (
    <Image
      alt={alt}
      layout="responsive"
      aspectRatio="16/9"
      rounded="md"
      objectFit="cover"
      {...props}
    />
  )
}

export { Image, AvatarImage, HeroImage, ThumbnailImage }
export type { ImageProps, AvatarImageProps }
