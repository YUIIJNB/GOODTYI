'use client';

import { useEffect, useState } from 'react';
import { createClient } from '@/utils/supabase/client';

export default function AdminRequestsPage() {
  const [requests, setRequests] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const supabase = createClient();

  useEffect(() => {
    fetchRequests();
  }, []);

  const fetchRequests = async () => {
    const { data, error } = await supabase
      .from('contact_requests')
      .select('*')
      .order('created_at', { ascending: false });

    if (!error && data) {
      setRequests(data);
    }
    setLoading(false);
  };

  const updateStatus = async (id: string, newStatus: string) => {
    const { error } = await supabase
      .from('contact_requests')
      .update({ status: newStatus })
      .eq('id', id);
      
    if (!error) {
      setRequests(requests.map(r => r.id === id ? { ...r, status: newStatus } : r));
    }
  };

  if (loading) return <div className="p-8 text-center bg-gray-50 flex-1"><div className="animate-spin h-8 w-8 border-4 border-brand border-t-transparent rounded-full mx-auto"></div></div>;

  return (
    <div className="p-8 max-w-7xl mx-auto flex-1">
      <div className="flex justify-between items-center mb-8">
        <div>
          <h1 className="text-3xl font-black text-brand-dark uppercase tracking-tight">Demandes & Contacts</h1>
          <p className="text-gray-500 mt-1">Gérez les demandes de contact et les formulaires soumis sur la plateforme.</p>
        </div>
      </div>

      <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
        {requests.length === 0 ? (
          <div className="p-12 text-center text-gray-500">
            Aucune demande de contact pour le moment.
          </div>
        ) : (
          <table className="w-full text-left text-sm">
            <thead className="bg-gray-50 border-b border-gray-100 text-gray-600 uppercase text-xs font-bold">
              <tr>
                <th className="p-4">Date</th>
                <th className="p-4">Prénom & Nom</th>
                <th className="p-4">Contact</th>
                <th className="p-4">Message</th>
                <th className="p-4">Statut</th>
                <th className="p-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {requests.map((req) => (
                <tr key={req.id} className="hover:bg-gray-50/50 transition-colors">
                  <td className="p-4 whitespace-nowrap text-gray-500">
                    {new Date(req.created_at).toLocaleDateString('fr-FR', {
                      day: '2-digit', month: '2-digit', year: 'numeric',
                      hour: '2-digit', minute: '2-digit'
                    })}
                  </td>
                  <td className="p-4 font-bold text-gray-800">
                    {req.first_name} {req.last_name}
                  </td>
                  <td className="p-4 text-gray-600">
                    <div>{req.email}</div>
                    <div className="text-xs">{req.phone || 'N/A'}</div>
                  </td>
                  <td className="p-4">
                    <div className="font-bold text-gray-800 mb-1">{req.subject || 'Aucun sujet'}</div>
                    <div className="text-gray-500 line-clamp-2 max-w-md">{req.message}</div>
                  </td>
                  <td className="p-4">
                    <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-bold uppercase tracking-wider
                      ${req.status === 'nouveau' ? 'bg-blue-100 text-blue-800' : 
                        req.status === 'lu' ? 'bg-yellow-100 text-yellow-800' : 
                        'bg-green-100 text-green-800'}`}>
                      {req.status}
                    </span>
                  </td>
                  <td className="p-4 text-right gap-2">
                    <select 
                      value={req.status}
                      onChange={(e) => updateStatus(req.id, e.target.value)}
                      className="border border-gray-200 rounded text-xs p-1 ml-2 bg-white"
                    >
                      <option value="nouveau">Nouveau</option>
                      <option value="lu">Lu</option>
                      <option value="répondu">Répondu</option>
                    </select>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
    </div>
  );
}
