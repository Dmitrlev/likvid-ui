import {
	createElement,
	forwardRef,
	memo,
	type ComponentPropsWithoutRef,
	type ElementRef,
	type ReactNode
} from 'react'
import { cx } from '../../utils/cx.js'
import s from './liquidContainer.module.css'

type T_shape = 'widget' | 'pill'

interface I_shapeProps {
	shape?: T_shape
	classNameShadow?: string
}

interface I_variant {
	defaultShape: T_shape
	extraClass?: string
	defaultProps?: Record<string, string>
}

type T_variant =
	| 'div'
	| 'section'
	| 'li'
	| 'ul'
	| 'ol'
	| 'figure'
	| 'form'
	| 'fieldset'
	| 'label'
	| 'button'
	| 'a'
	| 'span'

const VARIANTS: Record<T_variant, I_variant> = {
	div: { defaultShape: 'widget' },
	section: { defaultShape: 'widget' },
	li: { defaultShape: 'widget' },
	ul: { defaultShape: 'widget' },
	ol: { defaultShape: 'widget' },
	figure: { defaultShape: 'widget' },
	form: { defaultShape: 'widget' },
	fieldset: { defaultShape: 'widget' },
	label: { defaultShape: 'pill' },
	button: { defaultShape: 'pill', extraClass: s.wrapperButton, defaultProps: { type: 'button' } },
	a: { defaultShape: 'pill' },
	span: { defaultShape: 'pill' }
}

const SHAPE_CLASS: Record<T_shape, string | undefined> = {
	widget: undefined,
	pill: s.wrapperPill
}

function createVariant<V extends T_variant>(variant: V) {
	const { defaultShape, extraClass, defaultProps } = VARIANTS[variant]

	const Component = forwardRef<
		ElementRef<V>,
		ComponentPropsWithoutRef<V> & I_shapeProps & { children: ReactNode }
	>(({ children, className, classNameShadow, shape = defaultShape, ...rest }, ref) => (
		createElement(
			variant,
			{
				...defaultProps,
				...rest,
				ref,
				className: cx(s.wrapper, SHAPE_CLASS[shape], extraClass, className)
			},
			createElement('div', { className: cx(s.shadow, classNameShadow), 'aria-hidden': true }),
			children
		)
	))

	Component.displayName = `LiquidContainer.${variant}`
	return memo(Component)
}

export const LiquidContainer = {
	div: createVariant('div'),
	section: createVariant('section'),
	li: createVariant('li'),
	ul: createVariant('ul'),
	ol: createVariant('ol'),
	figure: createVariant('figure'),
	form: createVariant('form'),
	fieldset: createVariant('fieldset'),
	label: createVariant('label'),
	button: createVariant('button'),
	a: createVariant('a'),
	span: createVariant('span')
}
