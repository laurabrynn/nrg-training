import LoginForm from "@/components/auth/LoginForm";

export default function LoginPage() {
  return (
    <main className="min-h-screen flex items-center justify-center px-4">
      <div className="w-full max-w-sm">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-nrg-green tracking-tight">
            NRG Training
          </h1>
          <p className="mt-2 text-sm text-gray-500">
            Neighborhood Restaurant Group
          </p>
        </div>
        <LoginForm />
      </div>
    </main>
  );
}
