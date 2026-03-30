"use client"

import Link from "next/link"
import { useAuthSession } from "@/modules/auth"
import { ROUTES } from "@/shared/constants/routes"

interface HomeAuthLinkProps {
  children: React.ReactNode
  className?: string
}

export function HomeAuthLink({ children, className }: HomeAuthLinkProps) {
  const { user } = useAuthSession()
  const href = user ? ROUTES.WORKSPACES.INDEX : ROUTES.AUTH.LOGIN

  return (
    <Link href={href} className={className}>
      {children}
    </Link>
  )
}
