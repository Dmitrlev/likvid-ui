import {
	createElement,
	forwardRef,
	memo,
	type ComponentPropsWithoutRef,
	type CSSProperties,
	type ForwardedRef,
	type MouseEventHandler,
	type ReactNode,
	type Ref
} from 'react'
import { cx } from '../../utils/cx.js'
import { ButtonLoader } from './ButtonLoader.js'
import s from './liquidButton.module.css'

type T_shape = 'pill' | 'widget'
type T_variant = 'glass' | 'accent' | 'accent-dark'

type T_tag = keyof JSX.IntrinsicElements

interface I_commonProps {
	children?: ReactNode
	title?: string | null
	callback?: () => void
	onClick?: MouseEventHandler<Element>
	isActive?: boolean
	disabled?: boolean
	isLoading?: boolean
	className?: string
	width?: '100%' | 'max-content'
	shape?: T_shape
	variant?: T_variant
	style?: CSSProperties
}

// href is required for 'a' only and forbidden for all other tags
type T_hrefProps<T_as extends T_tag> = T_as extends 'a' ? { href: string } : { href?: never }

type T_props<T_as extends T_tag = 'button'> = I_commonProps &
	T_hrefProps<T_as> &
	Omit<ComponentPropsWithoutRef<T_as>, keyof I_commonProps | 'as' | 'href' | 'ref'> & {
		as?: T_as
	}

type T_polymorphic = <T_as extends T_tag = 'button'>(
	props: T_props<T_as> & { ref?: Ref<HTMLElement> }
) => ReactNode

const SHAPE_CLASS: Record<T_shape, string> = {
	pill: s.shapePill,
	widget: s.shapeWidget
}

const VARIANT_CLASS: Record<T_variant, string | undefined> = {
	glass: undefined,
	accent: s.variantAccent,
	'accent-dark': s.variantAccentDark
}

const BaseButton = memo(
	forwardRef<HTMLElement, T_props<'button'> | T_props<'a'>>(function LiquidButton(props, ref) {
		const {
			as = 'button',
			children,
			className,
			callback,
			disabled = false,
			isActive = false,
			isLoading = false,
			shape = 'pill',
			style,
			title,
			variant = 'glass',
			width,
			onClick,
			...rest
		} = props

		const isDisabled = disabled || isLoading
		const isLink = as === 'a'

		const handlePress: MouseEventHandler<Element> = (event) => {
			if (isDisabled) {
				if (isLink) event.preventDefault()
				return
			}
			callback?.()
			onClick?.(event)
		}

		return createElement(
			as,
			{
				...rest,
				ref,
				disabled: as === 'button' ? isDisabled : undefined,
				'aria-disabled': isDisabled && !isLink ? true : undefined,
				onClick: handlePress,
				style: width ? { ...style, width } : style,
				className: cx(
					s.wrapper,
					SHAPE_CLASS[shape],
					VARIANT_CLASS[variant],
					isActive && s.wrapperActive,
					isDisabled && s.disabled,
					className
				)
			},
			isLoading ? (
				<span className={s.loading}>
					<ButtonLoader />
				</span>
			) : (
				title ? <p>{title}</p> : children
			)
		)
	})
)

BaseButton.displayName = 'LiquidButton'

const LinkButton = memo(
	forwardRef<HTMLElement, T_props<'a'>>(function LiquidButtonLink(props, ref) {
		return <BaseButton {...props} as='a' ref={ref} />
	})
)

LinkButton.displayName = 'LiquidButton.a'

export const LiquidButton = Object.assign(BaseButton as unknown as T_polymorphic, {
	a: LinkButton
})
