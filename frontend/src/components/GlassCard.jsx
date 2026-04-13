const GlassCard = ({ children, className = '', ...props }) => {
  return (
    <div
      className={`glass-card rounded-[1rem] ${className}`}
      {...props}
    >
      {children}
    </div>
  );
};

export default GlassCard;
