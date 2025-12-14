export default function ContactPage() {
  return (
    <div className="max-w-4xl mx-auto px-4 py-10">
      <h1 className="text-3xl font-bold mb-4">Contact Us</h1>

      <p className="text-gray-700 mb-4">
        Have questions or need help? We’re here for you.
      </p>

      <div className="space-y-3 text-gray-700">
        <p><strong>Email:</strong> support@kstore.com</p>
        <p><strong>Phone:</strong> +91 90000 00000</p>
        <p><strong>Working Hours:</strong> Monday – Saturday, 9 AM – 6 PM</p>
      </div>

      <p className="mt-6 text-gray-600">
        Our support team typically responds within 24 hours.
      </p>
    </div>
  );
}
