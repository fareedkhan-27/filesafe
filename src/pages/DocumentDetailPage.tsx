import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { ArrowLeft, Edit, Trash2, FileText } from 'lucide-react';
import { useVault } from '../context/VaultContext';
import { getDocumentById, deleteDocument } from '../services/vaultStorage';
import { Document, Profile } from '../types/vault';
import FieldItem from '../components/FieldItem';
import { formatDate, getExpiryStatus } from '../utils/dateHelpers';

const DocumentDetailPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { profiles, refreshDocuments } = useVault();
  const [document, setDocument] = useState<Document | null>(null);
  const [profile, setProfile] = useState<Profile | null>(null);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);

  useEffect(() => {
    const loadDocument = async () => {
      if (id) {
        try {
          const doc = await getDocumentById(id);
          if (doc) {
            setDocument(doc);
            const owner = profiles.find(p => p.id === doc.profileId);
            setProfile(owner || null);
          } else {
            navigate('/home', { replace: true });
          }
        } catch (error) {
          // Failed to load document, redirect to home
          navigate('/home', { replace: true });
        }
      }
    };

    loadDocument();
  }, [id, profiles, navigate]);

  const handleDelete = async () => {
    if (document) {
      try {
        await deleteDocument(document.id);
        await refreshDocuments();
        navigate('/home', { replace: true });
      } catch (error) {
        alert('Failed to delete document. Please try again.');
        setShowDeleteConfirm(false);
      }
    }
  };

  if (!document || !profile) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <p className="text-gray-500">Loading...</p>
      </div>
    );
  }

  const expiryStatus = document.expiry_date ? getExpiryStatus(document.expiry_date) : null;

  return (
    <div className="min-h-screen bg-gray-50 pb-20">
      {/* Header */}
      <div className="bg-white border-b border-gray-200 sticky top-0 z-10 safe-top">
        <div className="px-4 py-4">
          <div className="flex items-center gap-3 mb-3">
            <button
              onClick={() => navigate('/home')}
              className="p-2 -ml-2 text-gray-600 hover:text-gray-900"
            >
              <ArrowLeft size={24} />
            </button>
            <div className="flex-1">
              <h1 className="text-xl font-bold text-gray-900">{document.title}</h1>
              <p className="text-sm text-gray-500">
                {profile.name} · {document.type.replace('_', ' ')}
              </p>
            </div>
          </div>

          <div className="flex gap-2">
            <button
              onClick={() => navigate(`/documents/${document.id}`)}
              className="flex-1 btn-secondary flex items-center justify-center gap-2"
            >
              <Edit size={18} />
              Edit
            </button>
            <button
              onClick={() => setShowDeleteConfirm(true)}
              className="flex-1 btn-danger flex items-center justify-center gap-2"
            >
              <Trash2 size={18} />
              Delete
            </button>
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="px-4 py-6">
        {/* Expiry Status */}
        {expiryStatus && (
          <div className={`card mb-4 ${expiryStatus.status === 'expired' ? 'border-red-300 bg-red-50' : expiryStatus.status === 'expiring_soon' ? 'border-yellow-300 bg-yellow-50' : 'border-green-300 bg-green-50'}`}>
            <div className="flex items-center gap-3">
              <FileText size={24} className={expiryStatus.status === 'expired' ? 'text-red-600' : expiryStatus.status === 'expiring_soon' ? 'text-yellow-600' : 'text-green-600'} />
              <div>
                <p className="font-semibold text-gray-900">Status</p>
                <p className={`text-sm ${expiryStatus.status === 'expired' ? 'text-red-700' : expiryStatus.status === 'expiring_soon' ? 'text-yellow-700' : 'text-green-700'}`}>
                  {expiryStatus.message}
                </p>
              </div>
            </div>
          </div>
        )}

        {/* All Fields */}
        <div className="space-y-3">
          <h2 className="text-lg font-semibold text-gray-900 mb-3">Document Details</h2>

          {/* Standard Fields */}
          {document.passport_number && (
            <FieldItem label="Passport Number" value={document.passport_number} />
          )}
          {document.license_number && (
            <FieldItem label="License Number" value={document.license_number} />
          )}
          {document.id_number && (
            <FieldItem label="ID Number" value={document.id_number} />
          )}
          {document.full_name && (
            <FieldItem label="Full Name" value={document.full_name} />
          )}
          {document.date_of_birth && (
            <FieldItem label="Date of Birth" value={formatDate(document.date_of_birth, 'long')} />
          )}
          {document.nationality && (
            <FieldItem label="Nationality" value={document.nationality} />
          )}
          {document.issue_date && (
            <FieldItem label="Issue Date" value={formatDate(document.issue_date, 'long')} />
          )}
          {document.expiry_date && (
            <FieldItem label="Expiry Date" value={formatDate(document.expiry_date, 'long')} />
          )}
          {document.issuing_authority && (
            <FieldItem label="Issuing Authority" value={document.issuing_authority} />
          )}

          {/* Custom Fields */}
          {document.customFields.length > 0 && (
            <>
              <h3 className="text-md font-semibold text-gray-900 mt-6 mb-3">Additional Information</h3>
              {document.customFields.map(field => (
                <FieldItem key={field.id} label={field.label} value={field.value} />
              ))}
            </>
          )}
        </div>

        {/* Metadata */}
        <div className="mt-6 pt-6 border-t border-gray-200">
          <p className="text-xs text-gray-400">
            Created {new Date(document.createdAt).toLocaleDateString()}
          </p>
          <p className="text-xs text-gray-400">
            Last updated {new Date(document.updatedAt).toLocaleDateString()}
          </p>
        </div>
      </div>

      {/* Delete Confirmation Modal */}
      {showDeleteConfirm && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50 animate-fadeIn">
          <div className="bg-white rounded-2xl p-6 max-w-sm w-full">
            <h3 className="text-lg font-bold text-gray-900 mb-2">Delete Document?</h3>
            <p className="text-gray-600 mb-6">
              Are you sure you want to delete this document? This action cannot be undone.
            </p>
            <div className="flex gap-3">
              <button
                onClick={() => setShowDeleteConfirm(false)}
                className="flex-1 btn-secondary"
              >
                Cancel
              </button>
              <button
                onClick={handleDelete}
                className="flex-1 btn-danger"
              >
                Delete
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default DocumentDetailPage;
