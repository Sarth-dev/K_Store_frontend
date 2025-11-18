/* eslint-disable @next/next/no-img-element */
"use client";

export const BRAND_DATA = [
  // Use only 6 logos for concise display
  {
    id: 1,
    name: "Apple",
    logo: "https://upload.wikimedia.org/wikipedia/commons/thumb/f/fa/Apple_logo_black.svg/800px-Apple_logo_black.svg.png",
    category: "Electronics",
  },
  {
    id: 2,
    name: "Samsung",
    logo: "https://imgs.search.brave.com/BUQvthB8ldwwFoEf4nLUADLuzPqmMpm_LXaveognzWQ/rs:fit:0:180:1:0/g:ce/aHR0cHM6Ly93d3cu/cG5nYWxsLmNvbS93/cC1jb250ZW50L3Vw/bG9hZHMvMTMvU2Ft/c3VuZy1Mb2dvLVBO/Ry1JbWFnZXMucG5n",
    category: "Electronics",
  },
  {
    id: 3,
    name: "Nike",
    logo: "https://imgs.search.brave.com/CY4-UdSEU-3o2o2uIjBq3BvSEZgGZvWu3flTtlxyc8E/rs:fit:500:0:0:0/g:ce/aHR0cHM6Ly91cGxv/YWQud2lraW1lZGlh/Lm9yZy93aWtpcGVk/aWEvY29tbW9ucy90/aHVtYi9hL2E2L0xv/Z29fTklLRS5zdmcv/MjUwcHgtTG9nb19O/SUtFLnN2Zy5wbmc",
    category: "Fashion",
  },
  {
    id: 4,
    name: "Tesla",
    logo: "https://upload.wikimedia.org/wikipedia/commons/thumb/e/e8/Tesla_logo.png/1200px-Tesla_logo.png",
    category: "Automotive",
  },
  {
    id: 5,
    name: "Amazon",
    logo: "https://upload.wikimedia.org/wikipedia/commons/thumb/a/a9/Amazon_logo.svg/1200px-Amazon_logo.svg.png",
    category: "Retail",
  },
  {
    id: 6,
    name: "Gucci",
    logo: "https://imgs.search.brave.com/CY4-UdSEU-3o2o2uIjBq3BvSEZgGZvWu3flTtlxyc8E/rs:fit:500:0:0:0/g:ce/aHR0cHM6Ly91cGxv/YWQud2lraW1lZGlh/Lm9yZy93aWtpcGVk/aWEvY29tbW9ucy90/aHVtYi9hL2E2L0xv/Z29fTklLRS5zdmcv/MjUwcHgtTG9nb19O/SUtFLnN2Zy5wbmc",
    category: "Cloth",
  },
];

export default function BrandLogoMarquee() {
  return (
    <section className="overflow-hidden bg-gray-50 py-12">
      <h2 className="text-center text-3xl font-bold text-gray-800 mb-8">
        Trusted by Global Leaders
      </h2>

     <div className="overflow-hidden whitespace-nowrap w-full">
  {/* Inner span with moving logos */}
  <div className="inline-block whitespace-nowrap animate-marquee">
    {BRAND_DATA.map((brand) => (
      <div key={brand.id} className="inline-block px-4">
        <img
          src={brand.logo}
          alt={brand.name}
          title={brand.name}
          className="h-20 object-contain opacity-70 hover:opacity-100 transition-opacity"
        />
      </div>
    ))}
    {/* Repeat logos for seamless loop */}
    {BRAND_DATA.map((brand) => (
      <div key={brand.id + "-copy"} className="inline-block px-4">
        <img
          src={brand.logo}
          alt={brand.name}
          title={brand.name}
          className="h-20 object-contain opacity-70 hover:opacity-100 transition-opacity"
        />
      </div>
    ))}
  </div>
</div>

<style jsx>{`
  @keyframes marquee {
    from {
      transform: translateX(0);
    }
    to {
      transform: translateX(-50%);
    }
  }

  .animate-marquee {
    display: inline-block;
    white-space: nowrap;
    animation: marquee 30s linear infinite;
  }
`}</style>

    </section>
  );
}
