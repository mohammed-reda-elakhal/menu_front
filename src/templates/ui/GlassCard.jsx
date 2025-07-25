const GlassCard = ({ children, className = '' }) => (
    <div
      className={`
        relative overflow-hidden
        bg-glass dark:bg-glass-dark
        backdrop-blur-lg
        border border-glass-border
        rounded-2xl
        shadow-glass
        transition-all duration-400
        hover:shadow-card-hover dark:hover:shadow-card-hover-dark
        group
        ${className}
      `}
    >
      <div className="absolute inset-0 bg-gradient-to-br from-primary/5 to-secondary2/5 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
      <div className="relative p-5 z-10">{children}</div>
    </div>
  );