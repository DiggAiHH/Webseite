import useInView from '../utils/useInView'

export default function RevealOnScroll({
  children,
  className = '',
  as: Tag = 'div',
  threshold,
  rootMargin,
  once = true,
  delayMs = 0,
  style,
}) {
  const { ref, inView } = useInView({ threshold, rootMargin, once })

  return (
    <Tag
      ref={ref}
      className={`${inView ? 'reveal-visible' : 'reveal-start'} ${className}`.trim()}
      style={{
        ...style,
        transitionDelay: `${delayMs}ms`,
      }}
    >
      {children}
    </Tag>
  )
}
