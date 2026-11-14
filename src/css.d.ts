// tsc не понимает css-импорты; для сборщика (vite) они резолвятся сами
declare module '*.css'

declare module 'swiper/css'

declare module '*.module.css' {
	const classes: Record<string, string>
	export default classes
}
