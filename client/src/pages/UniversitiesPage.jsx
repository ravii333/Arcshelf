import React, { useState, useEffect } from 'react';
import * as api from '../api';
import { Input } from '../components/forms/Input'; // Import your reusable component

const UniversitiesPage = () => {
  const [universities, setUniversities] = useState([]);
  const [loading, setLoading] = useState(true);
  const [formData, setFormData] = useState({ name: '', slug: '', location: '' });
  const [error, setError] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    const loadUniversities = async () => {
      try {
        const { data } = await api.fetchUniversities();
        setUniversities(data);
      } catch (err) {
        setError('Could not load university data.');
      } finally {
        setLoading(false);
      }
    };
    loadUniversities();
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
    setError('');
    setIsSubmitting(true);
    try {
      const { data: newUniversity } = await api.createUniversity(formData);
      setUniversities((prev) => [...prev, newUniversity].sort((a, b) => a.name.localeCompare(b.name)));
      setFormData({ name: '', slug: '', location: '' });
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to add university.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div>
      <h1 className="text-2xl font-bold tracking-tight text-foreground">Manage Universities</h1>
      <p className="mt-1 text-sm text-muted">Add, edit, or remove universities from the platform.</p>

      <div className="mt-8 grid grid-cols-1 gap-12 lg:grid-cols-3">
        {/* --- Form Section --- */}
        <div className="lg:col-span-1">
          <form onSubmit={handleSubmit} className="space-y-6 bg-card p-6 rounded-lg border border-border">
            <h2 className="text-lg font-semibold text-foreground">Add New University</h2>
            {error && <p className="text-sm text-red-600">{error}</p>}
            
            <Input label="University Name" name="name" value={formData.name} onChange={handleChange} placeholder="e.g., Stanford University" required />
            <Input label="URL Slug" name="slug" value={formData.slug} onChange={handleChange} placeholder="e.g., stanford" required />
            <Input label="Location (Optional)" name="location" value={formData.location} onChange={handleChange} placeholder="e.g., Stanford, CA" />

            <button
              type="submit"
              disabled={isSubmitting}
              className="w-full rounded-md bg-primary px-3 py-2 text-sm font-semibold text-white shadow-sm hover:opacity-90 disabled:opacity-50"
            >
              {isSubmitting ? 'Adding...' : 'Add University'}
            </button>
          </form>
        </div>

        {/* --- List Section --- */}
        <div className="lg:col-span-2">
          <div className="bg-card p-6 rounded-lg border border-border">
            <h2 className="text-lg font-semibold text-foreground">Existing Universities</h2>
            {loading ? (
              <p className="mt-4 text-muted">Loading...</p>
            ) : (
              <ul className="mt-4 space-y-3">
                {universities.map((uni) => (
                  <li key={uni._id} className="p-4 bg-background rounded-md border border-border">
                    <p className="font-semibold text-foreground">{uni.name}</p>
                    <p className="text-sm text-muted">{uni.slug} — {uni.location || 'No location'}</p>
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

export default UniversitiesPage;