"use client";

import { useState, useMemo } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { useRealtimeAnalytics } from "../_hooks/queries/use-realtime-analytics";
import {
  Bar,
  BarChart,
  CartesianGrid,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
  Legend,
} from "recharts";
import { RealtimeEvent } from "@/types/analytics";

// Country code to flag emoji mapping
const countryFlags: Record<string, string> = {
  AD: "🇦🇩", AE: "🇦🇪", AF: "🇦🇫", AG: "🇦🇬", AI: "🇦🇮", AL: "🇦🇱", AM: "🇦🇲", AO: "🇦🇴", AQ: "🇦🇶", AR: "🇦🇷",
  AS: "🇦🇸", AT: "🇦🇹", AU: "🇦🇺", AW: "🇦🇼", AX: "🇦🇽", AZ: "🇦🇿", BA: "🇧🇦", BB: "🇧🇧", BD: "🇧🇩", BE: "🇧🇪",
  BF: "🇧🇫", BG: "🇧🇬", BH: "🇧🇭", BI: "🇧🇮", BJ: "🇧🇯", BL: "🇧🇱", BM: "🇧🇲", BN: "🇧🇳", BO: "🇧🇴", BQ: "🇧🇶",
  BR: "🇧🇷", BS: "🇧🇸", BT: "🇧🇹", BV: "🇧🇻", BW: "🇧🇼", BY: "🇧🇾", BZ: "🇧🇿", CA: "🇨🇦", CC: "🇨🇨", CD: "🇨🇩",
  CF: "🇨🇫", CG: "🇨🇬", CH: "🇨🇭", CI: "🇨🇮", CK: "🇨🇰", CL: "🇨🇱", CM: "🇨🇲", CN: "🇨🇳", CO: "🇨🇴", CR: "🇨🇷",
  CU: "🇨🇺", CV: "🇨🇻", CW: "🇨🇼", CX: "🇨🇽", CY: "🇨🇾", CZ: "🇨🇿", DE: "🇩🇪", DJ: "🇩🇯", DK: "🇩🇰", DM: "🇩🇲",
  DO: "🇩🇴", DZ: "🇩🇿", EC: "🇪🇨", EE: "🇪🇪", EG: "🇪🇬", EH: "🇪🇭", ER: "🇪🇷", ES: "🇪🇸", ET: "🇪🇹", FI: "🇫🇮",
  FJ: "🇫🇯", FK: "🇫🇰", FM: "🇫🇲", FO: "🇫🇴", FR: "🇫🇷", GA: "🇬🇦", GB: "🇬🇧", GD: "🇬🇩", GE: "🇬🇪", GF: "🇬🇫",
  GG: "🇬🇬", GH: "🇬🇭", GI: "🇬🇮", GL: "🇬🇱", GM: "🇬🇲", GN: "🇬🇳", GP: "🇬🇵", GQ: "🇬🇶", GR: "🇬🇷", GS: "🇬🇸",
  GT: "🇬🇹", GU: "🇬🇺", GW: "🇬🇼", GY: "🇬🇾", HK: "🇭🇰", HM: "🇭🇲", HN: "🇭🇳", HR: "🇭🇷", HT: "🇭🇹", HU: "🇭🇺",
  ID: "🇮🇩", IE: "🇮🇪", IL: "🇮🇱", IM: "🇮🇲", IN: "🇮🇳", IO: "🇮🇴", IQ: "🇮🇶", IR: "🇮🇷", IS: "🇮🇸", IT: "🇮🇹",
  JE: "🇯🇪", JM: "🇯🇲", JO: "🇯🇴", JP: "🇯🇵", KE: "🇰🇪", KG: "🇰🇬", KH: "🇰🇭", KI: "🇰🇮", KM: "🇰🇲", KN: "🇰🇳",
  KP: "🇰🇵", KR: "🇰🇷", KW: "🇰🇼", KY: "🇰🇾", KZ: "🇰🇿", LA: "🇱🇦", LB: "🇱🇧", LC: "🇱🇨", LI: "🇱🇮", LK: "🇱🇰",
  LR: "🇱🇷", LS: "🇱🇸", LT: "🇱🇹", LU: "🇱🇺", LV: "🇱🇻", LY: "🇱🇾", MA: "🇲🇦", MC: "🇲🇨", MD: "🇲🇩", ME: "🇲🇪",
  MF: "🇲🇫", MG: "🇲🇬", MH: "🇲🇭", MK: "🇲🇰", ML: "🇲🇱", MM: "🇲🇲", MN: "🇲🇳", MO: "🇲🇴", MP: "🇲🇵", MQ: "🇲🇶",
  MR: "🇲🇷", MS: "🇲🇸", MT: "🇲🇹", MU: "🇲🇺", MV: "🇲🇻", MW: "🇲🇼", MX: "🇲🇽", MY: "🇲🇾", MZ: "🇲🇿", NA: "🇳🇦",
  NC: "🇳🇨", NE: "🇳🇪", NF: "🇳🇫", NG: "🇳🇬", NI: "🇳🇮", NL: "🇳🇱", NO: "🇳🇴", NP: "🇳🇵", NR: "🇳🇷", NU: "🇳🇺",
  NZ: "🇳🇿", OM: "🇴🇲", PA: "🇵🇦", PE: "🇵🇪", PF: "🇵🇫", PG: "🇵🇬", PH: "🇵🇭", PK: "🇵🇰", PL: "🇵🇱", PM: "🇵🇲",
  PN: "🇵🇳", PR: "🇵🇷", PS: "🇵🇸", PT: "🇵🇹", PW: "🇵🇼", PY: "🇵🇾", QA: "🇶🇦", RE: "🇷🇪", RO: "🇷🇴", RS: "🇷🇸",
  RU: "🇷🇺", RW: "🇷🇼", SA: "🇸🇦", SB: "🇸🇧", SC: "🇸🇨", SD: "🇸🇩", SE: "🇸🇪", SG: "🇸🇬", SH: "🇸🇭", SI: "🇸🇮",
  SJ: "🇸🇯", SK: "🇸🇰", SL: "🇸🇱", SM: "🇸🇲", SN: "🇸🇳", SO: "🇸🇴", SR: "🇸🇷", SS: "🇸🇸", ST: "🇸🇹", SV: "🇸🇻",
  SX: "🇸🇽", SY: "🇸🇾", SZ: "🇸🇿", TC: "🇹🇨", TD: "🇹🇩", TF: "🇹🇫", TG: "🇹🇬", TH: "🇹🇭", TJ: "🇹🇯", TK: "🇹🇰",
  TL: "🇹🇱", TM: "🇹🇲", TN: "🇹🇳", TO: "🇹🇴", TR: "🇹🇷", TT: "🇹🇹", TV: "🇹🇻", TW: "🇹🇼", TZ: "🇹🇿", UA: "🇺🇦",
  UG: "🇺🇬", UM: "🇺🇲", US: "🇺🇸", UY: "🇺🇾", UZ: "🇺🇿", VA: "🇻🇦", VC: "🇻🇨", VE: "🇻🇪", VG: "🇻🇬", VI: "🇻🇮",
  VN: "🇻🇳", VU: "🇻🇺", WF: "🇼🇫", WS: "🇼🇸", XK: "🇽🇰", YE: "🇾🇪", YT: "🇾🇹", ZA: "🇿🇦", ZM: "🇿🇲", ZW: "🇿🇼",
};

// Country code to name mapping
const countryNames: Record<string, string> = {
  AD: "Andorra", AE: "United Arab Emirates", AF: "Afghanistan", AG: "Antigua and Barbuda", AI: "Anguilla",
  AL: "Albania", AM: "Armenia", AO: "Angola", AQ: "Antarctica", AR: "Argentina", AS: "American Samoa",
  AT: "Austria", AU: "Australia", AW: "Aruba", AX: "Åland Islands", AZ: "Azerbaijan", BA: "Bosnia and Herzegovina",
  BB: "Barbados", BD: "Bangladesh", BE: "Belgium", BF: "Burkina Faso", BG: "Bulgaria", BH: "Bahrain", BI: "Burundi",
  BJ: "Benin", BL: "Saint Barthélemy", BM: "Bermuda", BN: "Brunei", BO: "Bolivia", BQ: "Caribbean Netherlands",
  BR: "Brazil", BS: "Bahamas", BT: "Bhutan", BV: "Bouvet Island", BW: "Botswana", BY: "Belarus", BZ: "Belize",
  CA: "Canada", CC: "Cocos Islands", CD: "Congo", CF: "Central African Republic", CG: "Congo", CH: "Switzerland",
  CI: "Côte d'Ivoire", CK: "Cook Islands", CL: "Chile", CM: "Cameroon", CN: "China", CO: "Colombia", CR: "Costa Rica",
  CU: "Cuba", CV: "Cape Verde", CW: "Curaçao", CX: "Christmas Island", CY: "Cyprus", CZ: "Czech Republic",
  DE: "Germany", DJ: "Djibouti", DK: "Denmark", DM: "Dominica", DO: "Dominican Republic", DZ: "Algeria",
  EC: "Ecuador", EE: "Estonia", EG: "Egypt", EH: "Western Sahara", ER: "Eritrea", ES: "Spain", ET: "Ethiopia",
  FI: "Finland", FJ: "Fiji", FK: "Falkland Islands", FM: "Micronesia", FO: "Faroe Islands", FR: "France",
  GA: "Gabon", GB: "United Kingdom", GD: "Grenada", GE: "Georgia", GF: "French Guiana", GG: "Guernsey",
  GH: "Ghana", GI: "Gibraltar", GL: "Greenland", GM: "Gambia", GN: "Guinea", GP: "Guadeloupe", GQ: "Equatorial Guinea",
  GR: "Greece", GS: "South Georgia", GT: "Guatemala", GU: "Guam", GW: "Guinea-Bissau", GY: "Guyana",
  HK: "Hong Kong", HM: "Heard Island", HN: "Honduras", HR: "Croatia", HT: "Haiti", HU: "Hungary",
  ID: "Indonesia", IE: "Ireland", IL: "Israel", IM: "Isle of Man", IN: "India", IO: "British Indian Ocean Territory",
  IQ: "Iraq", IR: "Iran", IS: "Iceland", IT: "Italy", JE: "Jersey", JM: "Jamaica", JO: "Jordan", JP: "Japan",
  KE: "Kenya", KG: "Kyrgyzstan", KH: "Cambodia", KI: "Kiribati", KM: "Comoros", KN: "Saint Kitts and Nevis",
  KP: "North Korea", KR: "South Korea", KW: "Kuwait", KY: "Cayman Islands", KZ: "Kazakhstan", LA: "Laos",
  LB: "Lebanon", LC: "Saint Lucia", LI: "Liechtenstein", LK: "Sri Lanka", LR: "Liberia", LS: "Lesotho",
  LT: "Lithuania", LU: "Luxembourg", LV: "Latvia", LY: "Libya", MA: "Morocco", MC: "Monaco", MD: "Moldova",
  ME: "Montenegro", MF: "Saint Martin", MG: "Madagascar", MH: "Marshall Islands", MK: "North Macedonia",
  ML: "Mali", MM: "Myanmar", MN: "Mongolia", MO: "Macao", MP: "Northern Mariana Islands", MQ: "Martinique",
  MR: "Mauritania", MS: "Montserrat", MT: "Malta", MU: "Mauritius", MV: "Maldives", MW: "Malawi", MX: "Mexico",
  MY: "Malaysia", MZ: "Mozambique", NA: "Namibia", NC: "New Caledonia", NE: "Niger", NF: "Norfolk Island",
  NG: "Nigeria", NI: "Nicaragua", NL: "Netherlands", NO: "Norway", NP: "Nepal", NR: "Nauru", NU: "Niue",
  NZ: "New Zealand", OM: "Oman", PA: "Panama", PE: "Peru", PF: "French Polynesia", PG: "Papua New Guinea",
  PH: "Philippines", PK: "Pakistan", PL: "Poland", PM: "Saint Pierre and Miquelon", PN: "Pitcairn", PR: "Puerto Rico",
  PS: "Palestine", PT: "Portugal", PW: "Palau", PY: "Paraguay", QA: "Qatar", RE: "Réunion", RO: "Romania",
  RS: "Serbia", RU: "Russia", RW: "Rwanda", SA: "Saudi Arabia", SB: "Solomon Islands", SC: "Seychelles",
  SD: "Sudan", SE: "Sweden", SG: "Singapore", SH: "Saint Helena", SI: "Slovenia", SJ: "Svalbard and Jan Mayen",
  SK: "Slovakia", SL: "Sierra Leone", SM: "San Marino", SN: "Senegal", SO: "Somalia", SR: "Suriname",
  SS: "South Sudan", ST: "São Tomé and Príncipe", SV: "El Salvador", SX: "Sint Maarten", SY: "Syria",
  SZ: "Eswatini", TC: "Turks and Caicos Islands", TD: "Chad", TF: "French Southern Territories", TG: "Togo",
  TH: "Thailand", TJ: "Tajikistan", TK: "Tokelau", TL: "East Timor", TM: "Turkmenistan", TN: "Tunisia",
  TO: "Tonga", TR: "Turkey", TT: "Trinidad and Tobago", TV: "Tuvalu", TW: "Taiwan", TZ: "Tanzania",
  UA: "Ukraine", UG: "Uganda", UM: "United States Minor Outlying Islands", US: "United States", UY: "Uruguay",
  UZ: "Uzbekistan", VA: "Vatican City", VC: "Saint Vincent and the Grenadines", VE: "Venezuela", VG: "British Virgin Islands",
  VI: "United States Virgin Islands", VN: "Vietnam", VU: "Vanuatu", WF: "Wallis and Futuna", WS: "Samoa",
  XK: "Kosovo", YE: "Yemen", YT: "Mayotte", ZA: "South Africa", ZM: "Zambia", ZW: "Zimbabwe",
};

function getCountryFlag(countryCode: string): string {
  return countryFlags[countryCode] || "🌍";
}

function getCountryName(countryCode: string): string {
  return countryNames[countryCode] || countryCode;
}

function formatTime(timestamp: string): string {
  const date = new Date(timestamp);
  return date.toLocaleTimeString("en-US", {
    hour: "numeric",
    minute: "2-digit",
    second: "2-digit",
    hour12: true,
  });
}

function formatEventDescription(event: RealtimeEvent): string {
  if (event.__type === "pageview") {
    return event.urlPath || "/";
  }
  if (event.__type === "session") {
    const device = event.device === "desktop" ? "Laptop" : event.device === "mobile" ? "Mobile" : event.device;
    return `Visitor from ${getCountryName(event.country)} using ${event.browser} on ${event.os} ${device}`;
  }
  return "";
}

export function RealtimeTab() {
  const { data: realtimeData, isLoading, error } = useRealtimeAnalytics();
  const [searchQuery, setSearchQuery] = useState("");
  const [filterType, setFilterType] = useState<"all" | "views" | "visitors" | "events">("all");

  const filteredEvents = useMemo(() => {
    if (!realtimeData?.events) return [];
    
    let filtered = realtimeData.events;

    // Filter by type
    if (filterType === "views") {
      filtered = filtered.filter((e) => e.__type === "pageview");
    } else if (filterType === "visitors") {
      filtered = filtered.filter((e) => e.__type === "session");
    } else if (filterType === "events") {
      filtered = filtered.filter((e) => e.__type !== "pageview" && e.__type !== "session");
    }

    // Filter by search query
    if (searchQuery) {
      const query = searchQuery.toLowerCase();
      filtered = filtered.filter((e) => {
        const description = formatEventDescription(e).toLowerCase();
        return description.includes(query);
      });
    }

    return filtered;
  }, [realtimeData?.events, filterType, searchQuery]);

  // Transform series data for chart - last 30 minutes with minute intervals
  const chartData = useMemo(() => {
    if (!realtimeData?.series) return [];

    const now = new Date();
    const dataMap = new Map<string, { views: number; visitors: number }>();

    // Process views data - group by minute
    realtimeData.series.views.forEach((point) => {
      const pointDate = new Date(point.x);
      // Round down to the nearest minute
      const minuteDate = new Date(
        pointDate.getFullYear(),
        pointDate.getMonth(),
        pointDate.getDate(),
        pointDate.getHours(),
        pointDate.getMinutes(),
        0,
        0
      );
      const minuteKey = minuteDate.toISOString();

      const existing = dataMap.get(minuteKey) || { views: 0, visitors: 0 };
      dataMap.set(minuteKey, {
        ...existing,
        views: existing.views + point.y,
      });
    });

    // Process visitors data - group by minute
    realtimeData.series.visitors.forEach((point) => {
      const pointDate = new Date(point.x);
      // Round down to the nearest minute
      const minuteDate = new Date(
        pointDate.getFullYear(),
        pointDate.getMonth(),
        pointDate.getDate(),
        pointDate.getHours(),
        pointDate.getMinutes(),
        0,
        0
      );
      const minuteKey = minuteDate.toISOString();

      const existing = dataMap.get(minuteKey) || { views: 0, visitors: 0 };
      dataMap.set(minuteKey, {
        ...existing,
        visitors: existing.visitors + point.y,
      });
    });

    // Generate last 30 minutes (from now backwards)
    const chartDataPoints: Array<{
      time: string;
      label: string;
      timestamp: string;
      views: number;
      visitors: number;
    }> = [];

    for (let i = 29; i >= 0; i--) {
      const minuteDate = new Date(now.getTime() - i * 60 * 1000);
      // Round down to the nearest minute
      minuteDate.setSeconds(0, 0);
      const minuteKey = minuteDate.toISOString();

      // Format label for display (HH:MM format)
      const label = minuteDate.toLocaleTimeString("en-US", {
        hour: "2-digit",
        minute: "2-digit",
        hour12: false,
      });

      const data = dataMap.get(minuteKey) || { views: 0, visitors: 0 };

      chartDataPoints.push({
        time: minuteKey,
        label,
        timestamp: minuteKey,
        views: data.views,
        visitors: data.visitors,
      });
    }

    return chartDataPoints;
  }, [realtimeData?.series]);

  if (error) {
    return (
      <div className="text-center text-red-600 py-8">
        Error loading realtime analytics: {error.message}
      </div>
    );
  }

  if (isLoading || !realtimeData) {
    return (
      <div className="text-center text-muted-foreground py-8">Loading...</div>
    );
  }

  const totals = realtimeData.totals || {
    views: 0,
    visitors: 0,
    events: 0,
    countries: 0,
  };

  return (
    <div className="space-y-6">
      {/* Metric Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Views</CardTitle>
            <i className="ri-eye-line text-sm text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{totals.views}</div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Visitors</CardTitle>
            <i className="ri-user-line text-sm text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{totals.visitors}</div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Events</CardTitle>
            <i className="ri-calendar-event-line text-sm text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{totals.events}</div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Countries</CardTitle>
            <i className="ri-global-line text-sm text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{totals.countries}</div>
          </CardContent>
        </Card>
      </div>

      {/* Realtime Chart */}
      <Card>
        <CardHeader>
          <CardTitle>Realtime Activity</CardTitle>
        </CardHeader>
        <CardContent>
          {chartData.length > 0 ? (
            <ResponsiveContainer width="100%" height={350}>
              <BarChart data={chartData}>
                <CartesianGrid strokeDasharray="3 3" className="stroke-muted" />
                <XAxis
                  dataKey="label"
                  tick={{ fill: "hsl(var(--muted-foreground))" }}
                  tickLine={{ stroke: "hsl(var(--muted-foreground))" }}
                  axisLine={{ stroke: "hsl(var(--muted-foreground))" }}
                  style={{ fontSize: "11px" }}
                  interval={0}
                  angle={-45}
                  textAnchor="end"
                  height={60}
                />
                <YAxis
                  tick={{ fill: "hsl(var(--muted-foreground))" }}
                  tickLine={{ stroke: "hsl(var(--muted-foreground))" }}
                  axisLine={{ stroke: "hsl(var(--muted-foreground))" }}
                  style={{ fontSize: "12px" }}
                  domain={[0, "auto"]}
                  allowDecimals={false}
                />
                <Tooltip
                  contentStyle={{
                    backgroundColor: "hsl(var(--background))",
                    border: "1px solid hsl(var(--border))",
                    borderRadius: "6px",
                  }}
                  labelStyle={{
                    color: "hsl(var(--foreground))",
                  }}
                  labelFormatter={(value) => {
                    const point = chartData.find((d) => d.label === value);
                    if (point) {
                      const date = new Date(point.timestamp);
                      return date.toLocaleTimeString("en-US", {
                        hour: "numeric",
                        minute: "2-digit",
                        second: "2-digit",
                        hour12: true,
                      });
                    }
                    return value;
                  }}
                />
                <Legend
                  wrapperStyle={{
                    paddingTop: "20px",
                  }}
                />
                <Bar
                  dataKey="visitors"
                  fill="#034b6e"
                  name="Visitors"
                  stackId="1"
                />
                <Bar
                  dataKey="views"
                  fill="#0a70a0"
                  name="Views"
                  stackId="1"
                />
              </BarChart>
            </ResponsiveContainer>
          ) : (
            <div className="h-[350px] flex items-center justify-center text-muted-foreground">
              No data available
            </div>
          )}
        </CardContent>
      </Card>

      {/* Activity Feed and Detail Cards */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Activity Feed */}
        <Card>
          <CardHeader>
            <div className="flex items-center justify-between">
              <CardTitle>Activity</CardTitle>
              <div className="flex gap-2">
                <Button
                  variant={filterType === "all" ? "default" : "outline"}
                  size="sm"
                  onClick={() => setFilterType("all")}
                >
                  All
                </Button>
                <Button
                  variant={filterType === "views" ? "default" : "outline"}
                  size="sm"
                  onClick={() => setFilterType("views")}
                >
                  Views
                </Button>
                <Button
                  variant={filterType === "visitors" ? "default" : "outline"}
                  size="sm"
                  onClick={() => setFilterType("visitors")}
                >
                  Visitors
                </Button>
                <Button
                  variant={filterType === "events" ? "default" : "outline"}
                  size="sm"
                  onClick={() => setFilterType("events")}
                >
                  Events
                </Button>
              </div>
            </div>
            <div className="mt-4">
              <div className="relative">
                <i className="ri-search-line absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" />
                <Input
                  placeholder="Search activity..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-9"
                />
              </div>
            </div>
          </CardHeader>
          <CardContent>
            <div className="space-y-4 max-h-[500px] overflow-y-auto">
              {filteredEvents.length === 0 ? (
                <div className="text-center text-muted-foreground py-8">
                  No activity found
                </div>
              ) : (
                filteredEvents.map((event, index) => (
                  <div
                    key={`${event.sessionId}-${event.createdAt}-${index}`}
                    className="flex items-start gap-3 pb-4 border-b last:border-b-0"
                  >
                    <div className="flex-shrink-0">
                      <div className="w-8 h-8 rounded-full bg-muted flex items-center justify-center">
                        {event.__type === "pageview" ? (
                          <i className="ri-eye-line text-sm" />
                        ) : (
                          <i className="ri-user-line text-sm" />
                        )}
                      </div>
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 mb-1">
                        <span className="text-sm text-muted-foreground">
                          {formatTime(event.createdAt)}
                        </span>
                      </div>
                      <p className="text-sm">{formatEventDescription(event)}</p>
                    </div>
                  </div>
                ))
              )}
            </div>
          </CardContent>
        </Card>

        {/* Detail Cards */}
        <div className="space-y-6">
          {/* Pages */}
          <Card>
            <CardHeader>
              <CardTitle>Pages</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {Object.entries(realtimeData.urls || {})
                  .sort(([, a], [, b]) => b - a)
                  .map(([url, count]) => {
                    const totalViews = Object.values(realtimeData.urls || {}).reduce(
                      (sum, val) => sum + val,
                      0
                    );
                    const percentage = totalViews > 0 ? ((count / totalViews) * 100).toFixed(0) : "0";
                    return (
                      <div
                        key={url}
                        className="flex items-center justify-between"
                      >
                        <span className="text-sm truncate flex-1">{url}</span>
                        <div className="flex items-center gap-2">
                          <span className="text-sm font-bold">{count}</span>
                          <span className="text-xs text-muted-foreground">
                            {percentage}%
                          </span>
                        </div>
                      </div>
                    );
                  })}
                {Object.keys(realtimeData.urls || {}).length === 0 && (
                  <div className="text-sm text-muted-foreground text-center py-4">
                    No pages visited
                  </div>
                )}
              </div>
            </CardContent>
          </Card>

          {/* Referrers */}
          <Card>
            <CardHeader>
              <CardTitle>Referrers</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {Object.entries(realtimeData.referrers || {})
                  .sort(([, a], [, b]) => b - a)
                  .map(([referrer, count]) => {
                    const totalReferrers = Object.values(realtimeData.referrers || {}).reduce(
                      (sum, val) => sum + val,
                      0
                    );
                    const percentage = totalReferrers > 0 ? ((count / totalReferrers) * 100).toFixed(0) : "0";
                    return (
                      <div
                        key={referrer}
                        className="flex items-center justify-between"
                      >
                        <span className="text-sm truncate flex-1">{referrer || "Direct"}</span>
                        <div className="flex items-center gap-2">
                          <span className="text-sm font-bold">{count}</span>
                          <span className="text-xs text-muted-foreground">
                            {percentage}%
                          </span>
                        </div>
                      </div>
                    );
                  })}
                {Object.keys(realtimeData.referrers || {}).length === 0 && (
                  <div className="text-sm text-muted-foreground text-center py-4">
                    No referrers
                  </div>
                )}
              </div>
            </CardContent>
          </Card>

          {/* Countries */}
          <Card>
            <CardHeader>
              <CardTitle>Countries</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {Object.entries(realtimeData.countries || {})
                  .sort(([, a], [, b]) => b - a)
                  .map(([countryCode, count]) => {
                    const totalVisitors = Object.values(realtimeData.countries || {}).reduce(
                      (sum, val) => sum + val,
                      0
                    );
                    const percentage = totalVisitors > 0 ? ((count / totalVisitors) * 100).toFixed(0) : "0";
                    return (
                      <div
                        key={countryCode}
                        className="flex items-center justify-between"
                      >
                        <div className="flex items-center gap-2 flex-1 min-w-0">
                          <span>{getCountryFlag(countryCode)}</span>
                          <span className="text-sm truncate">
                            {getCountryName(countryCode)}
                          </span>
                        </div>
                        <div className="flex items-center gap-2">
                          <span className="text-sm font-bold">{count}</span>
                          <span className="text-xs text-muted-foreground">
                            {percentage}%
                          </span>
                        </div>
                      </div>
                    );
                  })}
                {Object.keys(realtimeData.countries || {}).length === 0 && (
                  <div className="text-sm text-muted-foreground text-center py-4">
                    No countries
                  </div>
                )}
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}

