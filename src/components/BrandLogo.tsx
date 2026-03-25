type BrandLogoProps = {
  size?: "sm" | "md";
  className?: string;
};

const BrandLogo = ({ size = "sm", className = "" }: BrandLogoProps) => {
  return (
    <span className={`brand-logo brand-logo--${size} ${className}`.trim()} aria-label="LaIs Fitness">
      <span className="brand-logo__top" aria-hidden="true">
        <span>LaIs</span>
      </span>
      <span className="brand-logo__fitness">Fitness</span>
    </span>
  );
};

export default BrandLogo;
