import Svg, { Circle, Path, Polygon } from 'react-native-svg';
import { palette } from '@/theme/tokens';

export type IconName =
  | 'home'
  | 'vote'
  | 'trophy'
  | 'history'
  | 'user'
  | 'sparkles'
  | 'play'
  | 'pause'
  | 'search'
  | 'plus'
  | 'share'
  | 'lock'
  | 'spotify'
  | 'check'
  | 'arrow-right'
  | 'external';

type IconProps = {
  name: IconName;
  size?: number;
  color?: string;
  filled?: boolean;
};

const STROKE = 2;

export function Icon({ name, size = 24, color = palette.white, filled = false }: IconProps) {
  const common = {
    stroke: color,
    strokeWidth: STROKE,
    strokeLinecap: 'round' as const,
    strokeLinejoin: 'round' as const,
    fill: 'none',
  };

  return (
    <Svg width={size} height={size} viewBox="0 0 24 24">
      {renderPaths(name, color, filled, common)}
    </Svg>
  );
}

function renderPaths(
  name: IconName,
  color: string,
  filled: boolean,
  common: {
    stroke: string;
    strokeWidth: number;
    strokeLinecap: 'round';
    strokeLinejoin: 'round';
    fill: string;
  },
) {
  switch (name) {
    case 'home':
      return <Path {...common} d="M3 10.5 12 3l9 7.5M5 9.5V21h14V9.5" />;
    case 'vote':
    case 'check':
      return <Path {...common} d="M20 6 9 17l-5-5" />;
    case 'trophy':
      return (
        <Path
          {...common}
          d="M6 4h12v3a6 6 0 0 1-12 0V4ZM6 5H3v2a3 3 0 0 0 3 3M18 5h3v2a3 3 0 0 1-3 3M9 17h6M10 21h4M12 17v-2"
        />
      );
    case 'history':
      return <Path {...common} d="M3 12a9 9 0 1 0 3-6.7L3 8M3 4v4h4M12 8v4l3 2" />;
    case 'user':
      return <Path {...common} d="M4 21a8 8 0 0 1 16 0M12 11a4 4 0 1 0 0-8 4 4 0 0 0 0 8Z" />;
    case 'sparkles':
      return (
        <Path
          {...common}
          d="M12 3l1.8 4.7L18.5 9.5l-4.7 1.8L12 16l-1.8-4.7L5.5 9.5l4.7-1.8L12 3ZM19 14l.8 2 2 .8-2 .8-.8 2-.8-2-2-.8 2-.8.8-2Z"
        />
      );
    case 'play':
      return <Polygon points="6,4 20,12 6,20" fill={color} stroke={color} strokeWidth={1} />;
    case 'pause':
      return <Path {...common} d="M8 5v14M16 5v14" />;
    case 'search':
      return <Path {...common} d="M11 4a7 7 0 1 0 0 14 7 7 0 0 0 0-14ZM20 20l-4-4" />;
    case 'plus':
      return <Path {...common} d="M12 5v14M5 12h14" />;
    case 'share':
      return (
        <Path
          {...common}
          d="M8 12a3 3 0 1 0 0-.01M18 6a3 3 0 1 0 0-.01M18 18a3 3 0 1 0 0-.01M10.5 10.5l5-3M10.5 13.5l5 3"
        />
      );
    case 'lock':
      return <Path {...common} d="M6 11h12v9H6v-9ZM9 11V8a3 3 0 0 1 6 0v3" />;
    case 'external':
      return <Path {...common} d="M14 4h6v6M20 4l-9 9M19 14v5H5V5h5" />;
    case 'arrow-right':
      return <Path {...common} d="M5 12h14M13 6l6 6-6 6" />;
    case 'spotify':
      return (
        <>
          <Circle cx={12} cy={12} r={9} fill={color} />
          <Path
            d="M7.5 10.2c2.8-.7 6-.5 8.6 1M8 13c2.2-.5 4.6-.3 6.6.9M8.4 15.6c1.7-.4 3.4-.2 4.9.7"
            stroke={palette?.black ?? '#070707'}
            strokeWidth={1.4}
            strokeLinecap="round"
            fill="none"
          />
        </>
      );
    default:
      return null;
  }
}
