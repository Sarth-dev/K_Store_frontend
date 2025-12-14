export default function FAQPage() {
  return (
    <div className="max-w-5xl mx-auto px-4 py-10">
      <h1 className="text-3xl font-bold mb-6">Frequently Asked Questions</h1>

      <div className="space-y-4 text-gray-700">
        <div>
          <h3 className="font-semibold">How long does delivery take?</h3>
          <p>Delivery usually takes 3–4 business days after order confirmation.</p>
        </div>

        <div>
          <h3 className="font-semibold">Is Cash on Delivery available?</h3>
          <p>Yes, Cash on Delivery (COD) is available on eligible products.</p>
        </div>

        <div>
          <h3 className="font-semibold">Can I return a product?</h3>
          <p>Yes, we offer a 7-day easy return policy on most products.</p>
        </div>

        <div>
          <h3 className="font-semibold">How do I track my order?</h3>
          <p>You will receive tracking details via email once your order is shipped.</p>
        </div>
      </div>
    </div>
  );
}
