'use client'

import { memo, ReactNode, useCallback, useEffect, useMemo, useRef, useState } from 'react'
import Link from 'next/link'
import cn from 'classnames'
import classNames from 'classnames'
import type { Swiper as SwiperType } from 'swiper'
import { Swiper, SwiperSlide } from 'swiper/react'
import s from './liquidRadio.module.css'

import 'swiper/css'

export interface I_liquidRadioItem<T extends string = string> {
	value: T
	label: string
	href: string
}

interface I_liquidRadioProps<T extends string = string> {
	items: readonly I_liquidRadioItem<T>[]
	value: T
	onChange: (value: T) => void
	ariaLabel?: string
	className?: string
}

export const LiquidRadio = memo(<T extends string>({
	items,
	value,
	onChange,
	ariaLabel = 'Switch',
	className
}: I_liquidRadioProps<T>) => {

	const activeIndex = useMemo(
		() => Math.max(0, items.findIndex(item => item.value === value)),
		[items, value]
	)

	const slidesCount = items.length * 2 - 1
	const slidesCountMap = Array.from({ length: slidesCount })
	const slidesActive = items.length - 1
	const itemsLength = items.length

	const swiperRef = useRef<SwiperType | null>(null)
	const shadowRef = useRef<HTMLDivElement | null>(null)
	const indexActiveRef = useRef<number | null>(null)

	const [isTouching, setIsTouching] = useState(false)

	const handleChangeByActiveSlide = useCallback(() => {
		const idx = indexActiveRef.current
		if (idx == null || idx < 0) return

		const item = items[idx]
		if (!item) return

		onChange(item.value)
	}, [items, onChange])

	const onNavigate = (clickIndex: number) => {
		const activeSlideIndex = swiperRef.current?.activeIndex ?? 0
		const desiredSlideIndex = itemsLength - clickIndex + activeSlideIndex

		swiperRef.current?.slideTo(desiredSlideIndex, 300)
	}

	const handleTouchStart = () => {
		setIsTouching(true)
	}

	const handleTouchEnd = () => {
		setIsTouching(false)
		handleChangeByActiveSlide()
	}

	const onProgress = useCallback((swiper: SwiperType, prog: number) => {
		if (!shadowRef.current) return

		const slidesLength = swiper.slides.length
		const perView = Number(swiper.params.slidesPerView) || 1
		const maxIndex = Math.max(0, slidesLength - perView)
		const exactIndex = prog * maxIndex
		const hoverIndex = Math.round(exactIndex)

		indexActiveRef.current = itemsLength - 1 - hoverIndex
		shadowRef.current.style.left = `${100 - prog * 100}%`
	}, [itemsLength])

	useEffect(() => {
		const swiper = swiperRef.current
		if (!swiper) return
		if (activeIndex < 0) return

		const nextSlide = itemsLength - 1 - activeIndex
		swiper.slideTo(nextSlide, 200)
		indexActiveRef.current = activeIndex
	}, [activeIndex, itemsLength])

	return (
		<div
			aria-label={ariaLabel}
			role='radiogroup'
			className={cn(s.wrapper, isTouching && s.wrapperPress, className)}
			style={{ gridTemplateColumns: `repeat(${itemsLength}, 1fr)` }}
			onPointerDown={handleTouchStart}
			onPointerUp={handleTouchEnd}
			onPointerCancel={handleTouchEnd}
		>
			<div className={cn(s.shadowWrapper, isTouching && s.shadowWrapperPress)}>
				<div className={s.shadow} ref={shadowRef} />
			</div>

			<Swiper
				className={cn(s.swiper, isTouching && s.swiperPress)}
				slidesPerView={itemsLength}
				onSwiper={sw => {
					swiperRef.current = sw
				}}
				speed={300}
				resistanceRatio={0}
				initialSlide={itemsLength - 1 - Math.max(activeIndex, 0)}
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

			{items.map((item, index) => (
				<Link
					key={item.value}
					href={item.href}
					prefetch={true}
					role='radio'
					aria-checked={!isTouching && index === activeIndex}
					className={classNames(s.item, { [s.itemActive]: !isTouching && index === activeIndex })}
				>
					<p className={s.title}>{item.label}</p>
				</Link>
			))}
		</div>
	)
}) as <T extends string>(props: I_liquidRadioProps<T>) => ReactNode
