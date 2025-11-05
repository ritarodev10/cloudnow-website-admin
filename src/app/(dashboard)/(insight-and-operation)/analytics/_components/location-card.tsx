"use client";

import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { LocationMetrics, LocationMetric } from "@/types/analytics";
import { useLocationMetrics } from "../_hooks/queries/use-location-metrics";
import { TimeRange } from "@/types/analytics";

// Country code to flag emoji mapping
const countryFlags: Record<string, string> = {
  AD: "🇦🇩",
  AE: "🇦🇪",
  AF: "🇦🇫",
  AG: "🇦🇬",
  AI: "🇦🇮",
  AL: "🇦🇱",
  AM: "🇦🇲",
  AO: "🇦🇴",
  AQ: "🇦🇶",
  AR: "🇦🇷",
  AS: "🇦🇸",
  AT: "🇦🇹",
  AU: "🇦🇺",
  AW: "🇦🇼",
  AX: "🇦🇽",
  AZ: "🇦🇿",
  BA: "🇧🇦",
  BB: "🇧🇧",
  BD: "🇧🇩",
  BE: "🇧🇪",
  BF: "🇧🇫",
  BG: "🇧🇬",
  BH: "🇧🇭",
  BI: "🇧🇮",
  BJ: "🇧🇯",
  BL: "🇧🇱",
  BM: "🇧🇲",
  BN: "🇧🇳",
  BO: "🇧🇴",
  BQ: "🇧🇶",
  BR: "🇧🇷",
  BS: "🇧🇸",
  BT: "🇧🇹",
  BV: "🇧🇻",
  BW: "🇧🇼",
  BY: "🇧🇾",
  BZ: "🇧🇿",
  CA: "🇨🇦",
  CC: "🇨🇨",
  CD: "🇨🇩",
  CF: "🇨🇫",
  CG: "🇨🇬",
  CH: "🇨🇭",
  CI: "🇨🇮",
  CK: "🇨🇰",
  CL: "🇨🇱",
  CM: "🇨🇲",
  CN: "🇨🇳",
  CO: "🇨🇴",
  CR: "🇨🇷",
  CU: "🇨🇺",
  CV: "🇨🇻",
  CW: "🇨🇼",
  CX: "🇨🇽",
  CY: "🇨🇾",
  CZ: "🇨🇿",
  DE: "🇩🇪",
  DJ: "🇩🇯",
  DK: "🇩🇰",
  DM: "🇩🇲",
  DO: "🇩🇴",
  DZ: "🇩🇿",
  EC: "🇪🇨",
  EE: "🇪🇪",
  EG: "🇪🇬",
  EH: "🇪🇭",
  ER: "🇪🇷",
  ES: "🇪🇸",
  ET: "🇪🇹",
  FI: "🇫🇮",
  FJ: "🇫🇯",
  FK: "🇫🇰",
  FM: "🇫🇲",
  FO: "🇫🇴",
  FR: "🇫🇷",
  GA: "🇬🇦",
  GB: "🇬🇧",
  GD: "🇬🇩",
  GE: "🇬🇪",
  GF: "🇬🇫",
  GG: "🇬🇬",
  GH: "🇬🇭",
  GI: "🇬🇮",
  GL: "🇬🇱",
  GM: "🇬🇲",
  GN: "🇬🇳",
  GP: "🇬🇵",
  GQ: "🇬🇶",
  GR: "🇬🇷",
  GS: "🇬🇸",
  GT: "🇬🇹",
  GU: "🇬🇺",
  GW: "🇬🇼",
  GY: "🇬🇾",
  HK: "🇭🇰",
  HM: "🇭🇲",
  HN: "🇭🇳",
  HR: "🇭🇷",
  HT: "🇭🇹",
  HU: "🇭🇺",
  ID: "🇮🇩",
  IE: "🇮🇪",
  IL: "🇮🇱",
  IM: "🇮🇲",
  IN: "🇮🇳",
  IO: "🇮🇴",
  IQ: "🇮🇶",
  IR: "🇮🇷",
  IS: "🇮🇸",
  IT: "🇮🇹",
  JE: "🇯🇪",
  JM: "🇯🇲",
  JO: "🇯🇴",
  JP: "🇯🇵",
  KE: "🇰🇪",
  KG: "🇰🇬",
  KH: "🇰🇭",
  KI: "🇰🇮",
  KM: "🇰🇲",
  KN: "🇰🇳",
  KP: "🇰🇵",
  KR: "🇰🇷",
  KW: "🇰🇼",
  KY: "🇰🇾",
  KZ: "🇰🇿",
  LA: "🇱🇦",
  LB: "🇱🇧",
  LC: "🇱🇨",
  LI: "🇱🇮",
  LK: "🇱🇰",
  LR: "🇱🇷",
  LS: "🇱🇸",
  LT: "🇱🇹",
  LU: "🇱🇺",
  LV: "🇱🇻",
  LY: "🇱🇾",
  MA: "🇲🇦",
  MC: "🇲🇨",
  MD: "🇲🇩",
  ME: "🇲🇪",
  MF: "🇲🇫",
  MG: "🇲🇬",
  MH: "🇲🇭",
  MK: "🇲🇰",
  ML: "🇲🇱",
  MM: "🇲🇲",
  MN: "🇲🇳",
  MO: "🇲🇴",
  MP: "🇲🇵",
  MQ: "🇲🇶",
  MR: "🇲🇷",
  MS: "🇲🇸",
  MT: "🇲🇹",
  MU: "🇲🇺",
  MV: "🇲🇻",
  MW: "🇲🇼",
  MX: "🇲🇽",
  MY: "🇲🇾",
  MZ: "🇲🇿",
  NA: "🇳🇦",
  NC: "🇳🇨",
  NE: "🇳🇪",
  NF: "🇳🇫",
  NG: "🇳🇬",
  NI: "🇳🇮",
  NL: "🇳🇱",
  NO: "🇳🇴",
  NP: "🇳🇵",
  NR: "🇳🇷",
  NU: "🇳🇺",
  NZ: "🇳🇿",
  OM: "🇴🇲",
  PA: "🇵🇦",
  PE: "🇵🇪",
  PF: "🇵🇫",
  PG: "🇵🇬",
  PH: "🇵🇭",
  PK: "🇵🇰",
  PL: "🇵🇱",
  PM: "🇵🇲",
  PN: "🇵🇳",
  PR: "🇵🇷",
  PS: "🇵🇸",
  PT: "🇵🇹",
  PW: "🇵🇼",
  PY: "🇵🇾",
  QA: "🇶🇦",
  RE: "🇷🇪",
  RO: "🇷🇴",
  RS: "🇷🇸",
  RU: "🇷🇺",
  RW: "🇷🇼",
  SA: "🇸🇦",
  SB: "🇸🇧",
  SC: "🇸🇨",
  SD: "🇸🇩",
  SE: "🇸🇪",
  SG: "🇸🇬",
  SH: "🇸🇭",
  SI: "🇸🇮",
  SJ: "🇸🇯",
  SK: "🇸🇰",
  SL: "🇸🇱",
  SM: "🇸🇲",
  SN: "🇸🇳",
  SO: "🇸🇴",
  SR: "🇸🇷",
  SS: "🇸🇸",
  ST: "🇸🇹",
  SV: "🇸🇻",
  SX: "🇸🇽",
  SY: "🇸🇾",
  SZ: "🇸🇿",
  TC: "🇹🇨",
  TD: "🇹🇩",
  TF: "🇹🇫",
  TG: "🇹🇬",
  TH: "🇹🇭",
  TJ: "🇹🇯",
  TK: "🇹🇰",
  TL: "🇹🇱",
  TM: "🇹🇲",
  TN: "🇹🇳",
  TO: "🇹🇴",
  TR: "🇹🇷",
  TT: "🇹🇹",
  TV: "🇹🇻",
  TW: "🇹🇼",
  TZ: "🇹🇿",
  UA: "🇺🇦",
  UG: "🇺🇬",
  UM: "🇺🇲",
  US: "🇺🇸",
  UY: "🇺🇾",
  UZ: "🇺🇿",
  VA: "🇻🇦",
  VC: "🇻🇨",
  VE: "🇻🇪",
  VG: "🇻🇬",
  VI: "🇻🇮",
  VN: "🇻🇳",
  VU: "🇻🇺",
  WF: "🇼🇫",
  WS: "🇼🇸",
  XK: "🇽🇰",
  YE: "🇾🇪",
  YT: "🇾🇹",
  ZA: "🇿🇦",
  ZM: "🇿🇲",
  ZW: "🇿🇼",
};

// Country name to code mapping (common names)
const countryNameToCode: Record<string, string> = {
  "United States": "US",
  "United States of America": "US",
  Indonesia: "ID",
  Singapore: "SG",
  "United Kingdom": "GB",
  Canada: "CA",
  Australia: "AU",
  Germany: "DE",
  France: "FR",
  Japan: "JP",
  China: "CN",
  India: "IN",
  Brazil: "BR",
  Mexico: "MX",
  Spain: "ES",
  Italy: "IT",
  Netherlands: "NL",
  "South Korea": "KR",
  Sweden: "SE",
  Norway: "NO",
  Denmark: "DK",
  Finland: "FI",
  Poland: "PL",
  Russia: "RU",
  Turkey: "TR",
  "South Africa": "ZA",
  Argentina: "AR",
  Chile: "CL",
  "New Zealand": "NZ",
  Thailand: "TH",
  Philippines: "PH",
  Malaysia: "MY",
  Vietnam: "VN",
  "Saudi Arabia": "SA",
  "United Arab Emirates": "AE",
  Israel: "IL",
  Egypt: "EG",
  Nigeria: "NG",
  Kenya: "KE",
  Ghana: "GH",
  Portugal: "PT",
  Greece: "GR",
  Belgium: "BE",
  Switzerland: "CH",
  Austria: "AT",
  Ireland: "IE",
  "Czech Republic": "CZ",
  Romania: "RO",
  Hungary: "HU",
  Ukraine: "UA",
  Colombia: "CO",
  Peru: "PE",
  Venezuela: "VE",
  Ecuador: "EC",
};

function getCountryFlag(countryName: string): string {
  // Try to get code from name mapping
  const code = countryNameToCode[countryName];
  if (code && countryFlags[code]) {
    return countryFlags[code];
  }

  // Try direct code lookup (in case API returns code)
  if (countryFlags[countryName.toUpperCase()]) {
    return countryFlags[countryName.toUpperCase()];
  }

  // Default fallback
  return "🌍";
}

interface LocationCardProps {
  timeRange: TimeRange;
}

export function LocationCard({ timeRange }: LocationCardProps) {
  const [activeTab, setActiveTab] = useState<"country" | "city">("country");
  const {
    data: locationData,
    isLoading,
    error,
  } = useLocationMetrics({
    range: timeRange,
    limit: 10,
  });

  if (error) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Location</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-center text-red-600 text-sm py-4">
            Error loading location data: {error.message}
          </div>
        </CardContent>
      </Card>
    );
  }

  if (isLoading || !locationData) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Location</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-center text-muted-foreground text-sm py-4">
            Loading...
          </div>
        </CardContent>
      </Card>
    );
  }

  const getDataForTab = (tab: "country" | "city"): LocationMetric[] => {
    switch (tab) {
      case "country":
        return locationData.countries;
      case "city":
        return locationData.cities;
      default:
        return [];
    }
  };

  const getTotalVisitors = (data: LocationMetric[]): number => {
    return data.reduce((sum, item) => sum + item.y, 0);
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Location</CardTitle>
      </CardHeader>
      <CardContent>
        <Tabs
          value={activeTab}
          onValueChange={(value) => setActiveTab(value as "country" | "city")}
        >
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="country">Countries</TabsTrigger>
            <TabsTrigger value="city">Cities</TabsTrigger>
          </TabsList>

          <TabsContent value="country" className="mt-4">
            <div className="space-y-3">
              <div className="flex items-center justify-between text-xs text-muted-foreground mb-2 pb-2 border-b">
                <span>Country</span>
                <span>Visitors</span>
              </div>
              {(() => {
                const data = getDataForTab("country");
                const totalVisitors = getTotalVisitors(data);
                return data.length > 0 ? (
                  <>
                    {data.map((item, index) => {
                      const percentage =
                        totalVisitors > 0
                          ? ((item.y / totalVisitors) * 100).toFixed(0)
                          : "0";
                      return (
                        <div
                          key={`${item.x}-${index}`}
                          className="flex items-center justify-between"
                        >
                          <div className="flex items-center gap-2 flex-1 min-w-0">
                            <span className="text-base">
                              {getCountryFlag(item.x)}
                            </span>
                            <span className="text-sm truncate">{item.x}</span>
                          </div>
                          <div className="flex items-center gap-2">
                            <span className="text-sm font-bold">{item.y}</span>
                            <span className="text-xs text-muted-foreground">
                              {percentage}%
                            </span>
                          </div>
                        </div>
                      );
                    })}
                  </>
                ) : (
                  <div className="text-sm text-muted-foreground text-center py-4">
                    No countries data available
                  </div>
                );
              })()}
            </div>
          </TabsContent>

          <TabsContent value="city" className="mt-4">
            <div className="space-y-3">
              <div className="flex items-center justify-between text-xs text-muted-foreground mb-2 pb-2 border-b">
                <span>City</span>
                <span>Visitors</span>
              </div>
              {(() => {
                const data = getDataForTab("city");
                const totalVisitors = getTotalVisitors(data);
                return data.length > 0 ? (
                  <>
                    {data.map((item, index) => {
                      const percentage =
                        totalVisitors > 0
                          ? ((item.y / totalVisitors) * 100).toFixed(0)
                          : "0";
                      return (
                        <div
                          key={`${item.x}-${index}`}
                          className="flex items-center justify-between"
                        >
                          <div className="flex items-center gap-2 flex-1 min-w-0">
                            <span className="text-sm truncate">{item.x}</span>
                          </div>
                          <div className="flex items-center gap-2">
                            <span className="text-sm font-bold">{item.y}</span>
                            <span className="text-xs text-muted-foreground">
                              {percentage}%
                            </span>
                          </div>
                        </div>
                      );
                    })}
                  </>
                ) : (
                  <div className="text-sm text-muted-foreground text-center py-4">
                    No cities data available
                  </div>
                );
              })()}
            </div>
          </TabsContent>
        </Tabs>
      </CardContent>
    </Card>
  );
}
