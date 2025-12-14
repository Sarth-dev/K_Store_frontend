export default function PrivacyPage() {
  return (
    <div className="max-w-4xl mx-auto px-4 py-10">
      <h1 className="text-3xl font-bold mb-4">Privacy Policy</h1>

      <p className="text-gray-700 mb-4">
        Your privacy is important to us. We collect only the information
        necessary to process orders and improve your experience.
      </p>

      <ul className="list-disc ml-5 text-gray-700 space-y-2">
        <li>Personal data is never sold to third parties</li>
        <li>Secure payment and encrypted data storage</li>
        <li>Used only for order processing and support</li>
      </ul>
    </div>
  );
}
