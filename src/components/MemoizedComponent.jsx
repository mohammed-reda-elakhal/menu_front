import { memo } from 'react'

export const MemoizedComponent = memo(function MemoizedComponent({ children }) {
  return children
})
