export default function ShippingPage() {
  return (
    <div className="max-w-4xl mx-auto px-4 py-10">
      <h1 className="text-3xl font-bold mb-4">Shipping Information</h1>

      <p className="text-gray-700 mb-4">
        We provide fast and reliable shipping across India.
      </p>

      <ul className="list-disc ml-5 text-gray-700 space-y-2">
        <li>Standard delivery time: 3–4 business days</li>
        <li>Free shipping on eligible orders</li>
        <li>Orders are processed within 24 hours</li>
        <li>Tracking details shared via email/SMS</li>
      </ul>
    </div>
  );
}
