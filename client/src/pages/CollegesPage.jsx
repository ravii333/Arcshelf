import React, { useState, useEffect } from 'react';
import * as api from '../api';
import { Input } from '../components/forms/Input';
import { Select } from '../components/forms/Select';

const CollegesPage = () => {
  const [colleges, setColleges] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [formData, setFormData] = useState({ name: '', slug: '', location: '', university: '' });
  const [universities, setUniversities] = useState([]);
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    const loadInitialData = async () => {
      try {
        const [uniResponse, colResponse] = await Promise.all([
          api.fetchUniversities(),
          api.fetchColleges()
        ]);
        setUniversities(uniResponse.data);
        setColleges(colResponse.data);
      } catch (err) {
        setError('Could not load page data.');
      } finally {
        setLoading(false);
      }
    };
    loadInitialData();
  }, []);

  const handleChange = (e) => {
    const { name, value } = e.target;
    if (name === 'name') {
      const slug = value.toLowerCase().replace(/\s+/g, '-').replace(/[^a-z0-9-]/g, '');
      setFormData({ ...formData, name: value, slug });
    } else {
      setFormData({ ...formData, [name]: value });
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!formData.university) {
      setError('Please select a university.');
      return;
    }
    setError('');
    setIsSubmitting(true);
    try {
      const { data: newCollege } = await api.createCollege(formData);
      setColleges((prev) => [...prev, newCollege].sort((a, b) => a.name.localeCompare(b.name)));
      setFormData({ name: '', slug: '', location: '', university: '' });
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to add college.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="p-4 lg:p-6">
      <h1 className="text-2xl font-bold text-gray-900">Manage Colleges</h1>
      <p className="mt-1 text-sm text-gray-600">
        Add colleges and assign them to a parent university.
      </p>

      <div className="mt-8 grid grid-cols-1 gap-10 lg:grid-cols-3">
        {/* --- Form Section --- */}
        <div className="lg:col-span-1">
          <form
            onSubmit={handleSubmit}
            className="space-y-6 bg-white p-6 rounded-2xl border border-gray-200 shadow-sm hover:shadow-md transition-shadow duration-300"
          >
            <h2 className="text-lg font-semibold text-gray-900">Add New College</h2>
            {error && <p className="text-sm text-red-600">{error}</p>}

            <Select
              label="Parent University"
              name="university"
              value={formData.university}
              onChange={handleChange}
              required
            >
              <option value="" disabled>
                -- Select University --
              </option>
              {universities.map((uni) => (
                <option key={uni._id} value={uni._id}>
                  {uni.name}
                </option>
              ))}
            </Select>

            <Input
              label="College Name"
              name="name"
              value={formData.name}
              onChange={handleChange}
              placeholder="e.g., School of Engineering"
              required
            />
            <Input
              label="URL Slug"
              name="slug"
              value={formData.slug}
              onChange={handleChange}
              placeholder="e.g., soe-stanford"
              required
            />
            <Input
              label="Location (Optional)"
              name="location"
              value={formData.location}
              onChange={handleChange}
              placeholder="e.g., Stanford, CA"
            />

            {/* ✅ Updated Add Button with green gradient */}
            <button
              type="submit"
              disabled={isSubmitting}
              className="w-full rounded-xl bg-gradient-to-r from-emerald-500 to-green-600 text-white py-3 font-semibold shadow-md hover:from-emerald-600 hover:to-green-700 hover:shadow-lg transition-all duration-300 disabled:opacity-60"
            >
              {isSubmitting ? 'Adding...' : 'Add College'}
            </button>
          </form>
        </div>

        {/* --- List Section --- */}
        <div className="lg:col-span-2">
          <div className="bg-white p-6 rounded-2xl border border-gray-200 shadow-sm hover:shadow-md transition-shadow duration-300">
            <h2 className="text-lg font-semibold text-gray-900">Existing Colleges</h2>
            {loading ? (
              <p className="mt-4 text-gray-500">Loading...</p>
            ) : (
              <ul className="mt-4 space-y-3">
                {colleges.map((college) => (
                  <li
                    key={college._id}
                    className="p-4 bg-gray-50 rounded-xl border border-gray-200 hover:border-emerald-300 hover:bg-emerald-50/40 transition-all duration-200"
                  >
                    <p className="font-semibold text-gray-900">{college.name}</p>
                    <p className="text-sm text-gray-600 font-medium">
                      {college.university?.name || 'Unassigned University'}
                    </p>
                    <p className="text-xs text-gray-500 mt-1">{college.slug}</p>
                  </li>
                ))}
              </ul>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default CollegesPage;
