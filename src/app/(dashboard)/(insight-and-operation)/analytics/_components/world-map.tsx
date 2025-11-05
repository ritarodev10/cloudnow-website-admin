"use client";

import { useState, useMemo, useRef, useCallback } from "react";
import WorldMap from "react-svg-worldmap";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useLocationMetrics } from "../_hooks/queries/use-location-metrics";
import { TimeRange } from "@/types/analytics";

interface WorldMapProps {
  timeRange: TimeRange;
}

export function WorldMapComponent({ timeRange }: WorldMapProps) {
  const [tooltipContent, setTooltipContent] = useState<{
    country: string;
    visitors: number;
    x: number;
    y: number;
  } | null>(null);

  const [zoom, setZoom] = useState(1);
  const mapContainerRef = useRef<HTMLDivElement>(null);

  const {
    data: locationData,
    isLoading,
    error,
  } = useLocationMetrics({
    range: timeRange,
    limit: 1000, // Fetch all countries
  });

  // Create a map of country codes to visitor counts
  const countryDataMap = useMemo(() => {
    if (!locationData?.countries) {
      return new Map<string, number>();
    }

    const map = new Map<string, number>();

    locationData.countries.forEach((item) => {
      if (!item.x) return;

      // Check if item.x is already a country code (2 letters)
      const isCode = item.x.length === 2 && /^[A-Z]{2}$/i.test(item.x);
      const code = isCode ? item.x.toUpperCase() : null;

      if (code) {
        // Store with uppercase code, sum if duplicate
        const existing = map.get(code);
        map.set(code, (existing || 0) + item.y);
      }
    });

    return map;
  }, [locationData]);

  // Calculate max visitors for color scaling
  const maxVisitors = useMemo(() => {
    if (!locationData?.countries || locationData.countries.length === 0)
      return 1;
    return Math.max(...locationData.countries.map((item) => item.y), 1);
  }, [locationData]);

  // Get color based on visitor count
  const getCountryColor = (visitors: number): string => {
    if (!visitors || visitors === 0) {
      return "#e5e7eb"; // Light gray for no data
    }

    // Scale from light blue to dark blue based on visitor count
    const intensity = Math.min(visitors / maxVisitors, 1);
    const r = Math.round(59 + (1 - intensity) * 100); // 59-159
    const g = Math.round(130 + (1 - intensity) * 100); // 130-230
    const b = 246; // Keep blue constant

    return `rgb(${r}, ${g}, ${b})`;
  };

  // Prepare data for react-svg-worldmap
  // Format: [{ country: "US", value: 123 }, ...]
  const mapData = useMemo(() => {
    return Array.from(countryDataMap.entries()).map(([code, visitors]) => ({
      country: code.toLowerCase(), // react-svg-worldmap uses lowercase codes
      value: visitors,
    }));
  }, [countryDataMap]);

  // Get country name from code
  const getCountryName = (code: string): string => {
    const upperCode = code.toUpperCase();

    // Common country code to name mapping
    const codeToName: Record<string, string> = {
      US: "United States",
      ID: "Indonesia",
      SG: "Singapore",
      CN: "China",
      GB: "United Kingdom",
      CA: "Canada",
      AU: "Australia",
      DE: "Germany",
      FR: "France",
      JP: "Japan",
      IN: "India",
      BR: "Brazil",
      MX: "Mexico",
      ES: "Spain",
      IT: "Italy",
      NL: "Netherlands",
      KR: "South Korea",
      SE: "Sweden",
      NO: "Norway",
      DK: "Denmark",
      FI: "Finland",
      PL: "Poland",
      RU: "Russia",
      TR: "Turkey",
      ZA: "South Africa",
      AR: "Argentina",
      CL: "Chile",
      NZ: "New Zealand",
      TH: "Thailand",
      PH: "Philippines",
      MY: "Malaysia",
      VN: "Vietnam",
      SA: "Saudi Arabia",
      AE: "United Arab Emirates",
      IL: "Israel",
      EG: "Egypt",
      NG: "Nigeria",
      KE: "Kenya",
      GH: "Ghana",
      PT: "Portugal",
      GR: "Greece",
      BE: "Belgium",
      CH: "Switzerland",
      AT: "Austria",
      IE: "Ireland",
      CZ: "Czech Republic",
      RO: "Romania",
      HU: "Hungary",
      UA: "Ukraine",
      CO: "Colombia",
      PE: "Peru",
      VE: "Venezuela",
      EC: "Ecuador",
    };

    return codeToName[upperCode] || upperCode;
  };

  if (error) {
    return (
      <Card className="h-full w-full flex flex-col">
        <CardContent className="flex-1">
          <div className="text-center text-red-600 text-sm py-4">
            Error loading map data: {error.message}
          </div>
        </CardContent>
      </Card>
    );
  }

  if (isLoading || !locationData) {
    return (
      <Card className="h-full w-full flex flex-col">
        <CardContent className="flex-1">
          <div className="text-center text-muted-foreground text-sm py-4">
            Loading map...
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="h-full w-full flex flex-col">
      <CardContent className="p-0 flex-1 flex flex-col">
        <div
          ref={mapContainerRef}
          onWheel={(e) => {
            e.preventDefault();
            e.stopPropagation();
            const delta = e.deltaY;
            const zoomFactor = delta > 0 ? 0.95 : 1.05;
            const newZoom = Math.max(0.5, Math.min(3, zoom * zoomFactor));
            setZoom(newZoom);
          }}
          onMouseEnter={() => {
            // Disable window scroll when hovering over map
            document.body.style.overflow = "hidden";
          }}
          onMouseLeave={() => {
            // Re-enable window scroll when leaving map
            document.body.style.overflow = "";
          }}
          className="relative w-full overflow-hidden flex-1"
          style={{
            maxWidth: "100%",
            cursor: "default",
          }}
        >
          <div
            className="w-full h-full flex items-center justify-center transition-transform duration-100 ease-out"
            style={{
              transform: `scale(${zoom})`,
              transformOrigin: "center center",
              height: "100%",
            }}
          >
            <div
              className="w-full h-full flex items-center justify-center"
              style={{ maxHeight: "100%" }}
            >
              <WorldMap
                color="#e5e7eb"
                value-suffix="visitors"
                size="responsive"
                data={mapData}
                frame={false}
                tooltipBgColor="#1f2937"
                tooltipTextColor="#ffffff"
                onClickFunction={(context) => {
                  const code = context.countryCode.toUpperCase();
                  const visitors = countryDataMap.get(code) || 0;
                  const countryName =
                    context.countryName || getCountryName(code);

                  // Show tooltip on click
                  if (context.event?.currentTarget) {
                    const target = context.event.currentTarget as SVGElement;
                    const rect = target.getBoundingClientRect();
                    const container = target.closest(
                      ".relative"
                    ) as HTMLElement | null;
                    if (container) {
                      const containerRect = container.getBoundingClientRect();
                      setTooltipContent({
                        country: countryName,
                        visitors,
                        x: rect.left - containerRect.left + rect.width / 2,
                        y: rect.top - containerRect.top - 10,
                      });
                    }
                  }
                }}
                styleFunction={(context) => {
                  const code = context.countryCode.toUpperCase();
                  const visitors = countryDataMap.get(code) || 0;
                  return {
                    fill: getCountryColor(visitors),
                    stroke: "#ffffff",
                    strokeWidth: 0.5,
                    cursor: "pointer",
                  };
                }}
                tooltipTextFunction={(context) => {
                  const code = context.countryCode.toUpperCase();
                  const visitors = countryDataMap.get(code) || 0;
                  const countryName =
                    context.countryName || getCountryName(code);
                  return `${countryName}: ${visitors} ${
                    visitors === 1 ? "visitor" : "visitors"
                  }`;
                }}
              />
            </div>
          </div>
          {/* Custom tooltip */}
          {tooltipContent && (
            <div
              className="absolute bg-gray-900 text-white text-xs px-3 py-2 rounded shadow-lg pointer-events-none z-50 whitespace-nowrap"
              style={{
                left: `${tooltipContent.x}px`,
                top: `${tooltipContent.y}px`,
                transform: "translate(-50%, -100%)",
                marginTop: "-8px",
              }}
            >
              <div className="font-semibold">{tooltipContent.country}</div>
              <div className="text-gray-300">
                {tooltipContent.visitors}{" "}
                {tooltipContent.visitors === 1 ? "visitor" : "visitors"}
              </div>
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
}
