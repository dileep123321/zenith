export default function Home() {
  return (
    <main className="flex min-h-screen flex-col items-center justify-center bg-gray-50 p-10">
      <h1 className="text-4xl font-bold text-gray-900 mb-4">
        Zenith Project Management
      </h1>

      <p className="text-lg text-gray-600 mb-8 text-center max-w-xl">
        Manage your projects, tasks, and teams efficiently.
        Built with Next.js, Node.js, MongoDB, Redis and deployed on Kubernetes.
      </p>

      <div className="flex gap-4">
        <a
          href="/login"
          className="px-6 py-3 bg-black text-white rounded-lg hover:bg-gray-800"
        >
          Login
        </a>

        <a
          href="/register"
          className="px-6 py-3 border border-black rounded-lg hover:bg-gray-100"
        >
          Register
        </a>
      </div>

      <div className="mt-12 text-sm text-gray-500">
        DevOps Deployment: Docker • Kubernetes • GKE • GitHub Actions
      </div>
    </main>
  );
}