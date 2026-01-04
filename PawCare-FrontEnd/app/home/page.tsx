import Image from 'next/image';
import Link from 'next/link';

export default function ProtectedHome() {
  return (
    <main className="min-h-screen bg-gradient-to-b from-gray-900 to-gray-800 text-white flex items-center justify-center px-4">
      <div className="max-w-4xl w-full">
        <div className="bg-gray-900 border border-amber-500/50 rounded-2xl p-10 shadow-xl shadow-amber-800/40">
          <div className="flex flex-col md:flex-row gap-10 items-center">
            <div className="flex-1 space-y-4">
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-amber-500/10 text-amber-400 border border-amber-500/40 text-sm font-semibold">
                (Dummy)
              </div>
              <h1 className="text-4xl font-bold text-white">Home Page</h1>
              <p className="text-gray-300 leading-relaxed">
                This is a placeholder for your authenticated home page.
                 For now it is visible to everyone.
              </p>
              {/* <div className="space-y-2 text-sm text-gray-400">
                <p className="font-semibold text-amber-300">Suggested next steps to secure:</p>
                <ul className="list-disc list-inside space-y-1">
                  <li>Add an auth check (middleware or server-side) and redirect unauthenticated users to /login.</li>
                  <li>Protect data fetching with session validation on the server.</li>
                </ul>
              </div> */}
              <div className="flex flex-wrap gap-3 pt-4">
                <Link href="/login" className="bg-amber-500 text-black px-6 py-3 rounded-lg font-semibold hover:bg-amber-600 transition">
                  Go to Login
                </Link>
                <Link href="/" className="border border-amber-500 text-amber-400 px-6 py-3 rounded-lg font-semibold hover:bg-amber-500 hover:text-black transition">
                  Back to Landing
                </Link>
              </div>
            </div>
            <div className="flex-1 flex justify-center">
              <div className="relative w-full max-w-sm">
                <div className="absolute inset-0 bg-amber-600 rounded-3xl transform rotate-6 blur-3xl opacity-20"></div>
                <Image
                  src="/images/cat.png"
                  alt="PawCare Cat"
                  width={360}
                  height={360}
                  className="relative z-10 drop-shadow-lg rounded-2xl"
                />
              </div>
            </div>
          </div>
        </div>
      </div>
    </main>
  );
}
