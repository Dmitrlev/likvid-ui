'use client'

import { memo, ReactNode, useCallback, useEffect, useMemo, useRef, useState } from 'react'
import Link from 'next/link'
import { usePathname, useRouter } from 'next/navigation'
import cn from 'classnames'
import classNames from 'classnames'
import type { Swiper as SwiperType } from 'swiper'
import { Swiper, SwiperSlide } from 'swiper/react'
import s from './navBarBase.module.css'

import 'swiper/css'

export interface I_mobileNavTab {
	title: string
	path: string
	icon: (color: string) => ReactNode
	isActive: (pathname: string) => boolean
	onPress?: () => void
}

interface I_props {
	tabs: I_mobileNavTab[]
}

export const NavBarBase = memo(({ tabs }: I_props) => {

	const router = useRouter()
	const pathname = usePathname()

	//

	const activeTabIndex = useMemo(() => tabs.findIndex(tab => tab.isActive(pathname)), [tabs, pathname])

	const slidesCount = tabs.length * 2 - 1
	const slidesCountMap = Array.from({ length: slidesCount })
	const slidesActive = tabs.length - 1
	const tabsLength = tabs.length

	const swiperRef = useRef<SwiperType | null>(null)
	const shadowRef = useRef<HTMLDivElement | null>(null)
	const indexActiveRef = useRef<number | null>(null)

	//

	const [isTouching, setIsTouching] = useState(false)

	const handleNavigateByActiveSlide = useCallback(() => {
		const swiper = swiperRef.current
		if (!swiper) return

		const idx = indexActiveRef.current
		if (idx == null || idx < 0) return

		const tab = tabs[idx]
		if (!tab?.path) return

		tab.onPress?.()
		router.push(tab.path)
	}, [tabs, router])

	const onNavigate = (clickIndex: number) => {
		const activeIndex = swiperRef.current?.activeIndex ?? 0
		const desiredSlideIndex = tabsLength - clickIndex + activeIndex

		swiperRef.current?.slideTo(desiredSlideIndex, 300)
	}

	const handleNavTouchStart = () => {
		setIsTouching(true)
	}

	const handleNavTouchEnd = () => {
		setIsTouching(false)
		handleNavigateByActiveSlide()
	}

	const onProgress = useCallback((swiper: SwiperType, prog: number) => {
		if (!shadowRef.current) return

		const slidesLength = swiper.slides.length
		const perView = Number(swiper.params.slidesPerView) || 1
		const maxIndex = Math.max(0, slidesLength - perView)
		const exactIndex = prog * maxIndex
		const hoverIndex = Math.round(exactIndex)

		indexActiveRef.current = tabsLength - 1 - hoverIndex
		shadowRef.current.style.left = `${100 - prog * 100}%`
	}, [tabsLength])

	useEffect(() => {
		const swiper = swiperRef.current
		if (!swiper) return
		if (activeTabIndex < 0) return

		const nextSlide = tabsLength - 1 - activeTabIndex
		swiper.slideTo(nextSlide, 200)
		indexActiveRef.current = activeTabIndex
	}, [activeTabIndex, tabsLength])

	return (
		<nav
			aria-label='Mobile Navigation'
			className={cn(s.wrapper, isTouching && s.wrapperPress)}
			style={{ gridTemplateColumns: `repeat(${tabsLength}, 1fr)` }}
			onPointerDown={handleNavTouchStart}
			onPointerUp={handleNavTouchEnd}
			onPointerCancel={handleNavTouchEnd}
		>
			<div className={cn(s.shadowWrapper, isTouching && s.shadowWrapperPress)}>
				<div className={s.shadow} ref={shadowRef} />
			</div>

			<Swiper
				className={cn(s.swiper, isTouching && s.swiperPress)}
				slidesPerView={tabsLength}
				onSwiper={sw => {
					swiperRef.current = sw
				}}
				speed={300}
				resistanceRatio={0}
				initialSlide={tabsLength - 1 - Math.max(activeTabIndex, 0)}
				onProgress={onProgress}
			>
				{slidesCountMap.map((_, index) => (
					<SwiperSlide key={index} className={s.slide} onPointerDown={() => onNavigate(index + 1)}>
						{slidesActive === index ? (
							<div className={cn(s.activeSlide, isTouching && s.activeSlidePress)} />
						) : null}
					</SwiperSlide>
				))}
			</Swiper>

			{tabs.map((item, index) => (
				<Link
					key={index}
					className={classNames(s.item, { [s.itemActive]: !isTouching && index === activeTabIndex })}
					href={item.path}
					prefetch={true}
					onClick={() => item.onPress?.()}
				>
					<div style={{ position: 'relative' }}>
						<span className={s.itemIcon}>
							{item?.icon((index === activeTabIndex && !isTouching) ? 'var(--likvid-color-main)' : '#6d4c4c' )}
						</span>
					</div>
					<p className={s.title}>{item.title}</p>
				</Link>
			))}
		</nav>
	)
})
