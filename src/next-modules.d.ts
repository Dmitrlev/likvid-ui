// tsc does not pull in next: we declare the types ourselves; next never appears at runtime or in the emitted d.ts.
// A consumer with next resolves the imports itself; in non-next projects use an alias/shim for 'next/link' and 'next/navigation'.
declare module 'next/link' {
	import type { AnchorHTMLAttributes, ReactNode } from 'react'

	export interface I_linkProps extends AnchorHTMLAttributes<HTMLAnchorElement> {
		href: string
		prefetch?: boolean
		children?: ReactNode
	}

	const Link: (props: I_linkProps) => ReactNode
	export default Link
}

declare module 'next/navigation' {
	export function usePathname(): string
	export function useRouter(): { push: (href: string) => void }
}
