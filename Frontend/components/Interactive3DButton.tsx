import React, { useRef, useState, useCallback } from 'react';

interface Interactive3DButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'emerald' | 'rose' | 'amber' | 'slate';
  glowEffect?: boolean;
  tiltOnHover?: boolean;
  children: React.ReactNode;
}

export const Interactive3DButton: React.FC<Interactive3DButtonProps> = ({
  variant = 'primary',
  glowEffect = true,
  tiltOnHover = true,
  className = '',
  children,
  disabled,
  onClick,
  ...props
}) => {
  const btnRef = useRef<HTMLButtonElement>(null);
  const [tiltStyle, setTiltStyle] = useState<string>('perspective(600px) rotateX(0deg) rotateY(0deg)');

  const handleMouseMove = useCallback(
    (e: React.MouseEvent<HTMLButtonElement>) => {
      if (disabled || !tiltOnHover || !btnRef.current) return;
      const rect = btnRef.current.getBoundingClientRect();
      const x = e.clientX - rect.left;
      const y = e.clientY - rect.top;

      const centerX = rect.width / 2;
      const centerY = rect.height / 2;

      const rotateX = ((y - centerY) / centerY) * -5;
      const rotateY = ((x - centerX) / centerX) * 5;

      setTiltStyle(`perspective(600px) rotateX(${rotateX.toFixed(1)}deg) rotateY(${rotateY.toFixed(1)}deg)`);
    },
    [disabled, tiltOnHover]
  );

  const handleMouseLeave = useCallback(() => {
    setTiltStyle('perspective(600px) rotateX(0deg) rotateY(0deg)');
  }, []);

  const variantClass = {
    primary: 'btn-3d-primary text-white',
    emerald: 'btn-3d-emerald text-white',
    rose: 'btn-3d-rose text-white',
    amber: 'btn-3d-amber text-white',
    slate: 'btn-3d-slate text-slate-200',
  }[variant];

  return (
    <button
      ref={btnRef}
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
      onClick={disabled ? undefined : onClick}
      disabled={disabled}
      style={{
        transform: disabled ? 'none' : undefined,
      }}
      className={`btn-3d btn-shine ${variantClass} ${
        disabled ? 'opacity-50 cursor-not-allowed transform-none shadow-none' : 'cursor-pointer'
      } ${className}`}
      {...props}
    >
      <span style={{ display: 'inline-flex', alignItems: 'center', gap: '0.5rem', transform: tiltStyle, transition: 'transform 0.1s ease' }}>
        {children}
      </span>
    </button>
  );
};
