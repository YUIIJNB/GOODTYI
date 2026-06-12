export default function AdminKYC() {
  return (
    <div className="flex min-h-screen bg-gray-50 dark:bg-zinc-950">
      <main className="flex-1 p-8">
        <h1 className="text-3xl font-bold mb-8 text-gray-800 dark:text-white">Validation KYC</h1>
        
        <div className="bg-white dark:bg-zinc-900 rounded-xl border border-gray-200 dark:border-zinc-800 overflow-hidden shadow-sm">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-gray-50 dark:bg-zinc-800/50 border-b border-gray-200 dark:border-zinc-800">
                <th className="p-4 font-semibold text-sm text-gray-600 dark:text-gray-300">Date de Soumission</th>
                <th className="p-4 font-semibold text-sm text-gray-600 dark:text-gray-300">Utilisateur</th>
                <th className="p-4 font-semibold text-sm text-gray-600 dark:text-gray-300">Document</th>
                <th className="p-4 font-semibold text-sm text-gray-600 dark:text-gray-300">Statut</th>
                <th className="p-4 font-semibold text-sm text-gray-600 dark:text-gray-300 text-right">Actions</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td colSpan={5} className="p-8 text-center text-gray-500">
                  Aucun document KYC en attente.
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </main>
    </div>
  );
}
