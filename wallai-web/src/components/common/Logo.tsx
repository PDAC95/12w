/**
 * Logo Component - Wallai Brand Logo
 * Uses real logo images from public/logo/
 */

interface LogoProps {
  /**
   * Logo variant:
   * - icon: Just the logo symbol (logo.png)
   * - horizontal: Logo + "Wallai" text horizontal (logo-horizontal.png)
   * - vertical: Logo + "Wallai" text vertical (logo-vertical.png)
   */
  variant?: 'icon' | 'horizontal' | 'vertical';

  /**
   * Size in pixels (controls height)
   */
  size?: number;

  /**
   * Optional CSS class names
   */
  className?: string;

  /**
   * Alt text for accessibility
   */
  alt?: string;

  /**
   * Primary color (not used with image-based logos, kept for API compatibility)
   */
  primaryColor?: string;

  /**
   * Secondary color (not used with image-based logos, kept for API compatibility)
   */
  secondaryColor?: string;
}

export function Logo({
  variant = 'icon',
  size = 48,
  className = '',
  alt = 'Wallai',
}: LogoProps) {
  // Determine which logo image to use based on variant
  const logoSrc = variant === 'horizontal'
    ? '/logo/logo-horizontal.png'
    : variant === 'vertical'
    ? '/logo/logo-vertical.png'
    : '/logo/logo.png';

  // Calculate width based on variant (horizontal logos are wider)
  const aspectRatio = variant === 'horizontal' ? 3 : variant === 'vertical' ? 1 : 1;
  const width = size * aspectRatio;

  return (
    <img
      src={logoSrc}
      alt={alt}
      width={width}
      height={size}
      className={`${className} object-contain`}
      style={{ height: size, width: width }}
    />
  );
}
