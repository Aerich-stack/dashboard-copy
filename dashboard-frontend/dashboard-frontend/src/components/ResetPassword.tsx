import React, { useState, useEffect } from 'react';
import Modal from './Modal';

interface ResetPasswordProps {
  onBack?: () => void;
}

export default function ResetPassword({ onBack }: ResetPasswordProps) {
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');
  const [showModal, setShowModal] = useState(false);
  const [token, setToken] = useState('');
  const [email, setEmail] = useState('');

  useEffect(() => {
    // Extract token and email from URL query params
    const params = new URLSearchParams(window.location.search);
    const urlToken = params.get('token') || '';
    const urlEmail = params.get('email') || '';
    
    setToken(urlToken);
    setEmail(urlEmail);

    if (!urlToken || !urlEmail) {
      setError('Invalid reset link. Missing token or email.');
    }
  }, []);

  const handleResetPassword = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setMessage('');

    if (!newPassword || !confirmPassword) {
      setError('All fields are required');
      setShowModal(true);
      return;
    }

    if (newPassword.length < 6) {
      setError('Password must be at least 6 characters long');
      setShowModal(true);
      return;
    }

    if (newPassword !== confirmPassword) {
      setError('Passwords do not match');
      setShowModal(true);
      return;
    }

    setLoading(true);

    try {
      const response = await fetch('http://localhost:3000/api/teachers/reset-password', {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          token,
          email,
          newPassword,
        }),
      });

      const data = await response.json();

      if (data.success) {
        setMessage('Password reset successfully! You can now login with your new password.');
        setShowModal(true);
        setTimeout(() => {
          window.location.href = '/';
        }, 2000);
      } else {
        setError(data.message || 'Failed to reset password');
        setShowModal(true);
      }
    } catch (error) {
      console.error('Error resetting password:', error);
      setError('An error occurred while resetting your password. Please try again.');
      setShowModal(true);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div 
      className="min-h-screen bg-cover bg-center bg-fixed relative overflow-hidden flex items-center justify-center"
      style={{
        backgroundImage: `url(${require('../images/bg.png')})`,
        backgroundSize: 'cover',
        backgroundPosition: 'center',
        backgroundAttachment: 'fixed',
      }}
    >
      {/* Dark Overlay */}
      <div className="absolute inset-0 bg-black/40"></div>

      {/* Animated Background Elements */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute top-20 left-10 w-72 h-72 bg-blue-400 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-pulse"></div>
        <div className="absolute top-40 right-10 w-72 h-72 bg-purple-400 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-pulse" style={{ animationDelay: '0.5s' }}></div>
        <div className="absolute bottom-20 left-1/2 w-72 h-72 bg-pink-400 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-pulse" style={{ animationDelay: '1s' }}></div>
      </div>

      {/* Content */}
      <div className="relative z-10 w-full max-w-md px-4">
        <div className="bg-white/10 backdrop-blur-xl border border-white/20 rounded-2xl p-8 shadow-2xl">
          <div className="text-center mb-8">
            <h1 className="text-3xl font-bold text-white mb-2">Reset Password</h1>
            <p className="text-blue-100">Enter your new password below</p>
          </div>

          {token && email ? (
            <form onSubmit={handleResetPassword} className="space-y-6">
              <div>
                <label className="block text-sm font-medium text-white mb-2">
                  New Password
                </label>
                <input
                  type="password"
                  value={newPassword}
                  onChange={(e) => setNewPassword(e.target.value)}
                  placeholder="Enter new password (min 6 characters)"
                  className="w-full px-4 py-3 bg-white/10 border border-white/30 rounded-lg text-white placeholder-blue-100 focus:outline-none focus:ring-2 focus:ring-blue-400 focus:border-transparent transition-all"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-white mb-2">
                  Confirm Password
                </label>
                <input
                  type="password"
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  placeholder="Confirm your password"
                  className="w-full px-4 py-3 bg-white/10 border border-white/30 rounded-lg text-white placeholder-blue-100 focus:outline-none focus:ring-2 focus:ring-blue-400 focus:border-transparent transition-all"
                />
              </div>

              <button
                type="submit"
                disabled={loading}
                className="w-full py-3 bg-gradient-to-r from-blue-500 to-blue-600 text-white font-semibold rounded-lg hover:from-blue-600 hover:to-blue-700 transition-all transform hover:scale-105 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {loading ? 'Resetting...' : 'Reset Password'}
              </button>

              {onBack && (
                <button
                  type="button"
                  onClick={onBack}
                  className="w-full py-2 bg-white/10 text-white font-medium rounded-lg hover:bg-white/20 transition-all border border-white/30"
                >
                  Back
                </button>
              )}
            </form>
          ) : (
            <div className="text-center py-8">
              <p className="text-red-300 mb-4">Invalid reset link</p>
              {onBack && (
                <button
                  onClick={onBack}
                  className="px-6 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-all"
                >
                  Go Back
                </button>
              )}
            </div>
          )}
        </div>
      </div>

      {/* Modal for messages */}
      {showModal && (
        <Modal
          onClose={() => setShowModal(false)}
          title={error ? 'Error' : 'Success'}
        >
          <p className={error ? 'text-red-600' : 'text-green-600'}>
            {error || message}
          </p>
        </Modal>
      )}
    </div>
  );
}
