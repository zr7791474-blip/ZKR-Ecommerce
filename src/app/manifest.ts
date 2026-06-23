import type { MetadataRoute } from "next";

export default function manifest(): MetadataRoute.Manifest {

  return {
    name: "ZKR Ecommerce",
    short_name: "ZKR",
    description:
      "Modern ecommerce shopping platform",
    start_url: "/",
    display: "standalone",
    background_color: "#ffffff",
    theme_color: "#2563eb",

    icons: [
      {
        src: "/logo.png",
        sizes: "192x192",
        type: "image/png",
      },
      {
        src: "/logo.png",
        sizes: "512x512",
        type: "image/png",
      },
    ],
  };
}