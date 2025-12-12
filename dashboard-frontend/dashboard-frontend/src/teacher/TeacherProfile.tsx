import React, { useState, useEffect } from 'react';
import axios from 'axios';

interface Props {
  teacherId?: number;
  isViewOnly?: boolean; // true when admin views teacher profile
}

const TeacherProfile: React.FC<Props> = ({ teacherId, isViewOnly = false }) => {
  const [teacher, setTeacher] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [editing, setEditing] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    department: '',
    basic_pay: '',
    bio: '',
    phone: '',
    address: '',
  });
  const [message, setMessage] = useState<{ type: string; text: string } | null>(null);

  useEffect(() => {
    if (teacherId) {
      fetchTeacher();
    }
  }, [teacherId]);

  const fetchTeacher = async () => {
    setLoading(true);
    try {
      const response = await axios.get(`http://localhost:4000/api/teachers/${teacherId}`);
      if (response.data.success) {
        const t = response.data.data;
        setTeacher(t);
        setFormData({
          name: t.name || '',
          email: t.email || '',
          department: t.department || '',
          basic_pay: t.basic_pay || '',
          bio: t.bio || '',
          phone: t.phone || '',
          address: t.address || '',
        });
      }
    } catch (error) {
      console.error('Error fetching teacher:', error);
      setMessage({ type: 'error', text: 'Failed to load teacher profile' });
    }
    setLoading(false);
  };

  const handleUpdate = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!teacherId) return;

    try {
      const response = await axios.put(`http://localhost:4000/api/teachers/${teacherId}`, {
        name: formData.name,
        email: formData.email,
        department: formData.department,
        basic_pay: parseFloat(formData.basic_pay),
        bio: formData.bio,
        phone: formData.phone,
        address: formData.address,
      });

      if (response.data.success) {
        setMessage({ type: 'success', text: 'Profile updated successfully' });
        fetchTeacher();
        setEditing(false);
      } else {
        setMessage({ type: 'error', text: 'Failed to update profile' });
      }
    } catch (error: any) {
      console.error('Error updating profile:', error);
      setMessage({ type: 'error', text: error.response?.data?.message || 'Error updating profile' });
    }
  };

  if (loading) {
    return <div className="text-center text-gray-600">Loading profile...</div>;
  }

  if (!teacher) {
    return <div className="text-center text-gray-600">No profile found</div>;
  }

  return (
    <div className="max-w-4xl mx-auto">
      {message && (
        <div
          className={`mb-4 p-4 rounded-lg ${
            message.type === 'success'
              ? 'bg-green-100 text-green-800'
              : 'bg-red-100 text-red-800'
          }`}
        >
          {message.text}
        </div>
      )}

      {!editing && !isViewOnly && (
        <div className="mb-4">
          <button
            onClick={() => setEditing(true)}
            className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
          >
            ✎ Edit Profile
          </button>
        </div>
      )}

      {editing && !isViewOnly ? (
        // Edit Mode
        <div className="bg-white rounded-lg shadow-md p-8">
          <h2 className="text-2xl font-bold mb-6">Edit Profile</h2>
          <form onSubmit={handleUpdate} className="space-y-6">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Full Name</label>
                <input
                  type="text"
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-300 rounded"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Email</label>
                <input
                  type="email"
                  value={formData.email}
                  onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-300 rounded"
                  disabled
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Department</label>
                <input
                  type="text"
                  value={formData.department}
                  onChange={(e) => setFormData({ ...formData, department: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-300 rounded"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Basic Pay</label>
                <input
                  type="number"
                  value={formData.basic_pay}
                  onChange={(e) => setFormData({ ...formData, basic_pay: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-300 rounded"
                  disabled
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Phone</label>
                <input
                  type="tel"
                  value={formData.phone}
                  onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                  placeholder="e.g., +1 (555) 123-4567"
                  className="w-full px-3 py-2 border border-gray-300 rounded"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Address</label>
                <input
                  type="text"
                  value={formData.address}
                  onChange={(e) => setFormData({ ...formData, address: e.target.value })}
                  placeholder="Street address"
                  className="w-full px-3 py-2 border border-gray-300 rounded"
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Bio</label>
              <textarea
                value={formData.bio}
                onChange={(e) => setFormData({ ...formData, bio: e.target.value })}
                placeholder="Brief professional biography..."
                rows={5}
                className="w-full px-3 py-2 border border-gray-300 rounded"
              />
            </div>

            <div className="flex gap-2">
              <button
                type="submit"
                className="px-6 py-2 bg-green-600 text-white rounded hover:bg-green-700"
              >
                Save Changes
              </button>
              <button
                type="button"
                onClick={() => setEditing(false)}
                className="px-6 py-2 bg-gray-300 text-gray-700 rounded hover:bg-gray-400"
              >
                Cancel
              </button>
            </div>
          </form>
        </div>
      ) : (
        // View Mode
        <div className="bg-white rounded-lg shadow-md p-8">
          <div className="flex items-center gap-6 mb-8">
            <div className="w-24 h-24 bg-gradient-to-br from-blue-400 to-blue-600 rounded-full flex items-center justify-center text-4xl text-white font-bold">
              {teacher.name?.charAt(0)?.toUpperCase() || '?'}
            </div>
            <div>
              <h1 className="text-3xl font-bold text-gray-800">{teacher.name}</h1>
              <p className="text-lg text-gray-600">{teacher.department || 'Department not specified'}</p>
              <p className="text-sm text-gray-500">{teacher.email}</p>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-6 mb-8">
            <div className="bg-blue-50 p-4 rounded-lg">
              <p className="text-sm text-gray-600">Basic Pay</p>
              <p className="text-2xl font-bold text-blue-600">
                ₱{parseFloat(teacher.basic_pay || 0).toLocaleString()}
              </p>
            </div>

            <div className="bg-green-50 p-4 rounded-lg">
              <p className="text-sm text-gray-600">Teacher ID</p>
              <p className="text-2xl font-bold text-green-600">{teacher.id}</p>
            </div>

            {teacher.phone && (
              <div className="bg-purple-50 p-4 rounded-lg">
                <p className="text-sm text-gray-600">Phone</p>
                <p className="text-lg font-semibold text-purple-600">{teacher.phone}</p>
              </div>
            )}

            {teacher.address && (
              <div className="bg-orange-50 p-4 rounded-lg">
                <p className="text-sm text-gray-600">Address</p>
                <p className="text-lg font-semibold text-orange-600">{teacher.address}</p>
              </div>
            )}
          </div>

          {teacher.bio && (
            <div className="bg-gray-50 p-6 rounded-lg">
              <h3 className="text-lg font-bold text-gray-800 mb-2">Bio</h3>
              <p className="text-gray-700 leading-relaxed">{teacher.bio}</p>
            </div>
          )}

          {!isViewOnly && !teacher.bio && (
            <div className="bg-gray-50 p-6 rounded-lg text-center text-gray-500">
              <p>No bio added yet. <button onClick={() => setEditing(true)} className="text-blue-600 underline">Add one now</button></p>
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default TeacherProfile;
