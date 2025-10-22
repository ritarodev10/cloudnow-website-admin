import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  output: "standalone",
  eslint: {
    // Warning: This allows production builds to successfully complete even if
    // your project has ESLint errors.
    ignoreDuringBuilds: true,
  },
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'popular-angel-fc8402eb81.strapiapp.com',
      },
    ],
  },
  async headers() {
    return [
      {
        // Apply security headers to all routes
        source: "/(.*)",
        headers: [
          // Content Security Policy - Prevents XSS attacks
          {
            key: "Content-Security-Policy",
            value: [
              "default-src 'self'",
              "script-src 'self' 'unsafe-inline' 'unsafe-eval' https://api.emailjs.com https://cdn.emailjs.com",
              "style-src 'self' 'unsafe-inline' https://fonts.googleapis.com",
              "font-src 'self' https://fonts.gstatic.com",
              "img-src 'self' data: https: blob: https://popular-angel-fc8402eb81.strapiapp.com",
              "connect-src 'self' https://api.emailjs.com https://cdn.emailjs.com https://popular-angel-fc8402eb81.strapiapp.com",
              "frame-src 'self' https://www.google.com",
              "object-src 'none'",
              "base-uri 'self'",
              "form-action 'self'",
              "frame-ancestors 'none'",
              "upgrade-insecure-requests"
            ].join("; ")
          },
          // HTTP Strict Transport Security - Forces HTTPS
          {
            key: "Strict-Transport-Security",
            value: "max-age=31536000; includeSubDomains; preload"
          },
          // X-Frame-Options - Prevents clickjacking (allow Google Maps)
          {
            key: "X-Frame-Options",
            value: "SAMEORIGIN"
          },
          // X-Content-Type-Options - Prevents MIME type sniffing
          {
            key: "X-Content-Type-Options",
            value: "nosniff"
          },
          // Referrer Policy - Controls referrer information
          {
            key: "Referrer-Policy",
            value: "strict-origin-when-cross-origin"
          },
          // Permissions Policy - Controls browser features
          {
            key: "Permissions-Policy",
            value: [
              "camera=()",
              "microphone=()",
              "geolocation=()",
              "interest-cohort=()",
              "payment=()",
              "usb=()",
              "magnetometer=()",
              "gyroscope=()",
              "accelerometer=()",
              "ambient-light-sensor=()"
            ].join(", ")
          },
          // X-XSS-Protection - Additional XSS protection
          {
            key: "X-XSS-Protection",
            value: "1; mode=block"
          },
          // Cross-Origin Embedder Policy - Prevents cross-origin attacks
          {
            key: "Cross-Origin-Embedder-Policy",
            value: "require-corp"
          },
          // Cross-Origin Opener Policy - Isolates browsing contexts
          {
            key: "Cross-Origin-Opener-Policy",
            value: "same-origin"
          },
          // Cross-Origin Resource Policy - Controls resource loading
          {
            key: "Cross-Origin-Resource-Policy",
            value: "same-origin"
          }
        ]
      }
    ];
  }
};

export default nextConfig;
