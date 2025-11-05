declare module 'react-simple-maps' {
  import * as React from 'react';

  export interface Geography {
    rsmKey: string;
    properties: {
      [key: string]: string | number | undefined;
    };
  }

  export interface GeographiesRenderProps {
    geographies: Geography[];
  }

  export interface ComposableMapProps {
    projectionConfig?: {
      scale?: number;
      center?: [number, number];
    };
    style?: React.CSSProperties;
    children?: React.ReactNode;
  }

  export interface GeographyProps {
    geography: Geography;
    fill?: string;
    stroke?: string;
    strokeWidth?: number;
    style?: {
      default?: React.CSSProperties;
      hover?: React.CSSProperties;
      pressed?: React.CSSProperties;
    };
    onMouseEnter?: (event: React.MouseEvent<SVGPathElement>) => void;
    onMouseLeave?: () => void;
    key?: string;
  }

  export interface GeographiesProps {
    geography: string;
    children: (props: GeographiesRenderProps) => React.ReactNode;
  }

  export interface ZoomableGroupProps {
    zoom?: number;
    center?: [number, number];
    onMoveStart?: (position: { x: number; y: number }) => void;
    onMoveEnd?: (position: { x: number; y: number }) => void;
    onZoomStart?: (zoom: number) => void;
    onZoomEnd?: (zoom: number) => void;
    style?: React.CSSProperties;
    children?: React.ReactNode;
  }

  export const ComposableMap: React.FC<ComposableMapProps>;
  export const Geographies: React.FC<GeographiesProps>;
  export const Geography: React.FC<GeographyProps>;
  export const Marker: React.FC<any>;
  export const ZoomableGroup: React.FC<ZoomableGroupProps>;
}

