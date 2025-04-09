import { Loader2 } from "lucide-react"

export function Loader({ size = "medium", className = "" }) {
  const sizeClass =
    {
      small: "w-4 h-4",
      medium: "w-8 h-8",
      large: "w-12 h-12",
    }[size] || "w-8 h-8"

  return <Loader2 className={`animate-spin text-[#003265] ${sizeClass} ${className}`} />
}

