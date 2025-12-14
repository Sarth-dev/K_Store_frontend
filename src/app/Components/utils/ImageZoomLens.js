/* eslint-disable @next/next/no-img-element */
"use client";
import { useRef, useState } from "react";

export default function ImageZoomLens({ src }) {
  const imgRef = useRef(null);
  const lensRef = useRef(null);
  const resultRef = useRef(null);

  const [visible, setVisible] = useState(false);

  const moveLens = (e) => {
    e.preventDefault();
    const img = imgRef.current;
    const lens = lensRef.current;
    const result = resultRef.current;

    const rect = img.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;

    const lensSize = 120;
    let lx = x - lensSize / 2;
    let ly = y - lensSize / 2;

    if (lx < 0) lx = 0;
    if (ly < 0) ly = 0;
    if (lx > img.width - lensSize) lx = img.width - lensSize;
    if (ly > img.height - lensSize) ly = img.height - lensSize;

    lens.style.left = lx + "px";
    lens.style.top = ly + "px";

    const cx = result.offsetWidth / lensSize;
    const cy = result.offsetHeight / lensSize;

    result.style.backgroundPosition =
      `-${lx * cx}px -${ly * cy}px`;
  };

  return (
    <div className="relative hidden md:flex gap-6">
      {/* Image Container */}
      <div
        className="relative border rounded-xl bg-gray-50 p-4"
        onMouseEnter={() => setVisible(true)}
        onMouseLeave={() => setVisible(false)}
        onMouseMove={moveLens}
      >
        <img
          ref={imgRef}
          src={src}
          alt="product"
          className="max-h-[420px] object-contain"
        />

        {/* Lens */}
        {visible && (
          <div
            ref={lensRef}
            className="absolute border-2 border-indigo-600 bg-indigo-200/30 pointer-events-none"
            style={{ width: 120, height: 120 }}
          />
        )}
      </div>

      {/* Zoom Result */}
      {visible && (
        <div
          ref={resultRef}
          className="w-[420px] h-[420px] border rounded-xl bg-no-repeat bg-white shadow-md"
          style={{
            backgroundImage: `url(${src})`,
            backgroundSize: "800px 800px",
          }}
        />
      )}
    </div>
  );
}
