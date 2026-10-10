import React, { useState, useEffect } from 'react';
import api from '../../api/axios';
import { useToast } from '../../context/ToastContext';

const AdminUsers = () => {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const { showToast } = useToast();

  const fetchUsers = async () => {
    try {
      const res = await api.get('/admin/users');
      if (res.data.success) {
        setUsers(res.data.users || []);
      }
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchUsers();
  }, []);

  const handleRoleToggle = async (userId, currentRole) => {
    const newRole = currentRole === 'admin' ? 'customer' : 'admin';
    if (!window.confirm(`Change role to ${newRole}?`)) return;

    try {
      const res = await api.put(`/admin/users/${userId}/role`, { role: newRole });
      if (res.data.success) {
        showToast(`User role changed to ${newRole}`, 'success');
        fetchUsers();
      }
    } catch (err) {
      showToast(err.message, 'error');
    }
  };

  return (
    <div className="flex flex-col gap-6 pb-16">
      <div>
        <span className="font-label text-xs text-primary font-bold uppercase tracking-wider">
          Patron Directory
        </span>
        <h1 className="font-headline text-2xl sm:text-3xl font-bold text-on-surface">
          User Accounts & Roles ({users.length})
        </h1>
      </div>

      <div className="bg-surface-container-lowest rounded-3xl border border-outline-variant/60 shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs sm:text-sm">
            <thead className="bg-surface-container-low border-b border-surface-container-high text-secondary text-xs uppercase font-bold tracking-wider">
              <tr>
                <th className="p-4">User</th>
                <th className="p-4">Contact</th>
                <th className="p-4">Addresses</th>
                <th className="p-4">Role</th>
                <th className="p-4">Joined</th>
                <th className="p-4 text-right">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-surface-container-high/60">
              {users.map((u) => (
                <tr key={u._id} className="hover:bg-surface-container-low/40 transition-colors">
                  <td className="p-4">
                    <div className="flex items-center gap-3">
                      <img
                        src={u.avatar || '/assets/customer-portrait.png'}
                        alt={u.name}
                        className="w-10 h-10 rounded-full object-cover"
                        onError={(e) => {
                          e.target.onerror = null;
                          e.target.src = 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=100&q=80';
                        }}
                      />
                      <div>
                        <span className="font-bold text-on-surface block">{u.name}</span>
                        <span className="text-[11px] text-secondary">{u.email}</span>
                      </div>
                    </div>
                  </td>
                  <td className="p-4 text-secondary">
                    {u.phone || 'No phone'}
                  </td>
                  <td className="p-4 font-semibold text-on-surface">
                    {u.addresses?.length || 0} saved
                  </td>
                  <td className="p-4">
                    <span
                      className={`px-2.5 py-0.5 rounded-full text-xs font-bold uppercase tracking-wider ${
                        u.role === 'admin'
                          ? 'bg-primary-container text-on-primary-container'
                          : 'bg-surface-container text-secondary'
                      }`}
                    >
                      {u.role}
                    </span>
                  </td>
                  <td className="p-4 text-secondary">
                    {new Date(u.createdAt).toLocaleDateString()}
                  </td>
                  <td className="p-4 text-right">
                    <button
                      onClick={() => handleRoleToggle(u._id, u.role)}
                      className="px-3 py-1.5 rounded-xl bg-surface-container-low text-xs font-semibold text-primary hover:bg-surface-container transition-colors"
                    >
                      {u.role === 'admin' ? 'Revoke Admin' : 'Make Admin'}
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default AdminUsers;
