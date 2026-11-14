// tsc does not understand css imports; the bundler (vite) resolves them on its own
declare module '*.css'

declare module 'swiper/css'

declare module '*.module.css' {
	const classes: Record<string, string>
	export default classes
}
