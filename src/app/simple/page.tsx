export default function SimplePage() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-blue-50">
      <div className="text-center">
        <h1 className="text-4xl font-bold text-blue-900">Simple Test Page</h1>
        <p className="text-blue-600 mt-4">This is a test to verify routing works</p>
        <a href="/admin" className="inline-block mt-6 px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700">
          Go to Admin
        </a>
      </div>
    </div>
  );
}
