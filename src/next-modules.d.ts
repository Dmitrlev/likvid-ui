// tsc не тянет next: типы даём сами, в рантайме и в d.ts next не фигурирует.
// Потребитель с next резолвит импорты сам; в не-next проектах — алиас/шим на 'next/link' и 'next/navigation'.
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
