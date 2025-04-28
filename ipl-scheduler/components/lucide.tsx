// Custom Lucide icon for Stadium
import type { LucideIcon } from "lucide-react"

export const Stadium: LucideIcon = (props) => {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      {...props}
    >
      <path d="M3 7v10c0 1.1.9 2 2 2h14c1.1 0 2-.9 2-2V7c0-1.1-.9-2-2-2H5c-1.1 0-2 .9-2 2z" />
      <path d="M6 9v6" />
      <path d="M18 9v6" />
      <path d="M4 22h16" />
      <path d="M4 2h16" />
    </svg>
  )
}
