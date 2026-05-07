import React, { useEffect, useState } from 'react';
import api from '../api';
import { User, ShieldCheck, Clock, Key } from 'lucide-react';

const Dashboard = ({ user, setUser }) => {
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchUser = async () => {
      try {
        const response = await api.get('/users/me');
        setUser(response.data);
      } catch (err) {
        console.error('Failed to fetch user data');
      } finally {
        setLoading(false);
      }
    };

    fetchUser();
  }, [setUser]);

  if (loading) return <div className="animate-fade-in" style={{ textAlign: 'center', marginTop: '5rem' }}><div className="loading-spinner" style={{ margin: '0 auto', width: '40px', height: '40px' }}></div><p style={{ marginTop: '1rem' }}>Verifying session...</p></div>;

  return (
    <div className="animate-fade-in">
      <div style={{ marginBottom: '3rem' }}>
        <h1>Welcome, {user?.username}</h1>
        <p style={{ color: 'var(--text-muted)' }}>You have successfully authenticated using facial biometrics.</p>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '1.5rem' }}>
        <div className="card" style={{ margin: 0, maxWidth: '100%' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', marginBottom: '1.5rem' }}>
            <div style={{ padding: '0.75rem', background: 'rgba(99, 102, 241, 0.1)', borderRadius: '12px', color: 'var(--primary)' }}>
              <User size={24} />
            </div>
            <h3>Account Details</h3>
          </div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
            <div>
              <label>Username</label>
              <div style={{ fontSize: '1.1rem', fontWeight: 500 }}>{user?.username}</div>
            </div>
            <div>
              <label>User ID</label>
              <div style={{ fontSize: '0.9rem', color: 'var(--text-muted)', fontFamily: 'monospace' }}>#{user?.id?.toString().padStart(5, '0')}</div>
            </div>
          </div>
        </div>

        <div className="card" style={{ margin: 0, maxWidth: '100%' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', marginBottom: '1.5rem' }}>
            <div style={{ padding: '0.75rem', background: 'rgba(34, 197, 94, 0.1)', borderRadius: '12px', color: 'var(--success)' }}>
              <ShieldCheck size={24} />
            </div>
            <h3>Security Status</h3>
          </div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', color: 'var(--success)', fontWeight: 600 }}>
              <ShieldCheck size={18} /> Biometric Verified
            </div>
            <div style={{ color: 'var(--text-muted)', fontSize: '0.875rem' }}>
              Your session is protected by JWT and facial recognition.
            </div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', fontSize: '0.875rem', color: 'var(--text-muted)' }}>
              <Clock size={16} /> Last Login: {new Date().toLocaleString()}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
