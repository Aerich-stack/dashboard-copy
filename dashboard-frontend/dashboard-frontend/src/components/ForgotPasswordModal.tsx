import React, { useState } from 'react';
import axios from "axios";
import api from "../services/api";
import Modal from './Modal';

interface Props {
  role: 'admin' | 'teacher';
  onClose: () => void;
}

export const ForgotPasswordModal: React.FC<Props> = ({ role, onClose }) => {
  const [email, setEmail] = useState('');
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setMessage('');
    if (!email) return setError('Please enter your email');
    setLoading(true);
    try {
      const url = role === 'teacher' ? '/api/teachers/forgot-password' : '/api/admin/forgot-password';
      // call backend endpoint if available
      const resp = await api.post(`${url}`, { email });
      if (resp.data && resp.data.success) {
        setMessage(resp.data.message || 'Check your email for reset instructions');
      } else {
        setMessage(resp.data?.message || 'If the account exists, an email was sent');
      }
    } catch (err: any) {
      console.error('Forgot password error:', err);
      setError(err.response?.data?.message || 'Failed to process request');
    }
    setLoading(false);
  };

  return (
    <Modal title="Forgot Password" onClose={onClose}>
      <form onSubmit={handleSubmit} className="space-y-4">
        <p className="text-sm text-gray-600">Enter the email associated with your account. We'll send reset instructions.</p>
        {message && <div className="p-3 bg-green-100 text-green-800 rounded">{message}</div>}
        {error && <div className="p-3 bg-red-100 text-red-800 rounded">{error}</div>}
        <div>
          <label className="block text-sm font-medium text-gray-700">Email</label>
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="w-full px-3 py-2 border border-gray-300 rounded"
            required
          />
        </div>
        <div className="flex justify-end gap-2">
          <button type="button" onClick={onClose} className="px-4 py-2 rounded bg-gray-200">Cancel</button>
          <button type="submit" disabled={loading} className="px-4 py-2 rounded bg-blue-600 text-white">{loading ? 'Sending...' : 'Send'}</button>
        </div>
      </form>
    </Modal>
  );
};

export default ForgotPasswordModal;
