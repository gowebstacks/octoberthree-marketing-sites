import { HTMLAttributes } from 'react';

/**
 * Icon component that uses SVG sprites
 *
 * Uses ui-icon-sprite.svg for UI icons and brand-icon-sprite.svg for brand icons
 * Note: Icons use currentColor for color inheritance from CSS
 */

interface IconProps extends HTMLAttributes<SVGElement> {
  icon: string;
  size?: number;
  className?: string;
  strokeWidth?: number;
  spriteType?: 'brand' | 'ui';
  filled?: boolean
}

const Icon = ({ icon, size = 24, className, strokeWidth = 1, spriteType,filled = false, ...props }: IconProps) => {
  if (!icon) return null;

  // Handle both spriteType and automatic detection
  const allSpriteFiles: string[] = [];

  // If spriteType is provided, use it to determine the sprite file
  if(filled){
     allSpriteFiles.push('/heading-ui-icon-sprite.svg');
  }
  else if (spriteType === 'brand') {
    allSpriteFiles.push('/brand-icon-sprite.svg');
  } else if (spriteType === 'ui') {
    allSpriteFiles.push('/ui-icon-sprite.svg');
  }

  // Auto-detect brand icons by their prefix if no spriteType is provided
  if (allSpriteFiles.length === 0) {
    if(filled){
      
      allSpriteFiles.push('/heading-ui-icon-sprite.svg');
    }
    else if (icon.startsWith('brand-') ||
        icon.startsWith('dark-theme-') ||
        icon.startsWith('light-theme-') ||
        icon.startsWith('special-theme-')) {
      allSpriteFiles.push('/brand-icon-sprite.svg');
    } else {
      // Default to ui-icon-sprite.svg for regular UI icons
      allSpriteFiles.push('/ui-icon-sprite.svg');
    }
  }

  // For brand icons, we don't want to show a stroke
  // Simple check for brand icons based on naming convention
  const isBrandIcon = spriteType === 'brand' ||
                     icon.startsWith('brand-') ||
                     allSpriteFiles.some(file => file.includes('brand-icon'));
  const shouldDisableStroke = isBrandIcon || filled;
const shouldUseFill =  isBrandIcon || filled;
  return (
    <svg
    shapeRendering="auto"
      width={size}
      height={size}
      // viewBox="0 0 24 24"
      className={className}
      fill={shouldUseFill ? 'currentColor' : 'none'}
      stroke={shouldDisableStroke ? 'none' : 'currentColor'}
      strokeWidth={shouldDisableStroke ? 0 : strokeWidth}
      {...props}
    >
      {/* Try to find the icon in each sprite file */}
      {allSpriteFiles.map((file, index) => (
        <use key={`${file}-${index}`} href={`${file}#${icon}`} />
      ))}
    </svg>
  );
};

export default Icon;
