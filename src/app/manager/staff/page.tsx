export const metadata = {
  title: "Staff | NRG Training",
};

export default function StaffPage() {
  return (
    <div>
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-nrg-charcoal">Staff</h1>
        <p className="text-gray-500 text-sm mt-1">
          Manage trainee accounts and track training progress.
        </p>
      </div>

      <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-8 text-center text-gray-400">
        <div className="text-4xl mb-3">👥</div>
        <p className="font-medium text-gray-500">No staff yet</p>
        <p className="text-sm mt-1">
          Trainee accounts will appear here once users are invited.
        </p>
      </div>
    </div>
  );
}
