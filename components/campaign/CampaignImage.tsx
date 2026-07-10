"use client";

import { useState } from "react";

type CampaignImageProps = {
  src: string;
  alt: string;
  className?: string;
  containerClassName?: string;
};

/**
 * Renders an image from /public/images/campaign with a gradient placeholder
 * underneath. Until the real file is dropped in, the 404 is swallowed and the
 * placeholder shows instead of a broken-image icon.
 */
export function CampaignImage({
  src,
  alt,
  className = "",
  containerClassName = "",
}: CampaignImageProps) {
  const [failed, setFailed] = useState(false);
  const [loaded, setLoaded] = useState(false);

  return (
    <div
      className={`relative overflow-hidden bg-mesh-dawn ${containerClassName}`}
    >
      {!failed && (
        // eslint-disable-next-line @next/next/no-img-element
        <img
          src={src}
          alt={alt}
          onError={() => setFailed(true)}
          onLoad={() => setLoaded(true)}
          className={`transition-opacity duration-700 ${
            loaded ? "opacity-100" : "opacity-0"
          } ${className}`}
        />
      )}
    </div>
  );
}
