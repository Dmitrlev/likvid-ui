import { memo } from 'react'
import s from './liquidButton.module.css'

export const ButtonLoader = memo(() => (
	<span role='status' aria-label='Loading' className={s.loader} />
))

ButtonLoader.displayName = 'ButtonLoader'
