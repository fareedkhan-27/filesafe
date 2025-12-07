import React, { useState, useEffect } from 'react';
import { useParams, useNavigate, useSearchParams } from 'react-router-dom';
import { ArrowLeft, Plus, X, AlertCircle } from 'lucide-react';
import { useVault } from '../context/VaultContext';
import { useToast } from '../context/ToastContext';
import {
  getDocumentById,
  createDocument,
  updateDocument
} from '../services/vaultStorage';
import { Document, DocumentType, CustomField } from '../types/vault';
import { checkDuplicateDocument } from '../utils/duplicateChecker';
import { formatName, formatUpperCase, COUNTRIES } from '../utils/formatters';

const DocumentFormPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const { profiles, currentProfileId, refreshDocuments } = useVault();
  const { error: showErrorToast, success: showSuccessToast } = useToast();

  const [profileId, setProfileId] = useState(currentProfileId);
  const [documentType, setDocumentType] = useState<DocumentType>('passport');
  const [title, setTitle] = useState('');

  // Standard fields
  const [passportNumber, setPassportNumber] = useState('');
  const [licenseNumber, setLicenseNumber] = useState('');
  const [idNumber, setIdNumber] = useState('');
  const [permitNumber, setPermitNumber] = useState('');
  const [policyNumber, setPolicyNumber] = useState('');
  const [cardNumber, setCardNumber] = useState('');

  const [fullName, setFullName] = useState('');
  const [dateOfBirth, setDateOfBirth] = useState('');
  const [nationality, setNationality] = useState('');
  const [issueDate, setIssueDate] = useState('');
  const [expiryDate, setExpiryDate] = useState('');
  const [issuingAuthority, setIssuingAuthority] = useState('');

  // Insurance-specific fields
  const [insuranceType, setInsuranceType] = useState('');
  const [provider, setProvider] = useState('');
  const [coverageAmount, setCoverageAmount] = useState('');
  const [premium, setPremium] = useState('');

  // Bank/Medical card fields
  const [cardType, setCardType] = useState('');
  const [bankName, setBankName] = useState('');

  // Residence permit fields
  const [permitType, setPermitType] = useState('');
  const [sponsor, setSponsor] = useState('');

  // Custom fields
  const [customFields, setCustomFields] = useState<CustomField[]>([]);

  const [isLoading, setIsLoading] = useState(false);
  const [isQuickMode, setIsQuickMode] = useState(true); // Default to Quick Add mode
  const [validationErrors, setValidationErrors] = useState<Record<string, string>>({});
  const isEditing = id !== 'new';

  // Helper function to get display label for document type
  // Used to sync Title with Document Type in NEW document mode
  const getDocumentTypeLabel = (type: DocumentType): string => {
    const typeLabels: Record<DocumentType, string> = {
      passport: 'Passport',
      driving_license: 'Driving License',
      national_id: 'National ID',
      visa: 'Visa',
      residence_permit: 'Residence Permit',
      insurance: 'Insurance Policy',
      bank_card: 'Bank Card',
      medical_card: 'Medical Card',
      custom: 'Document'
    };
    return typeLabels[type];
  };

  useEffect(() => {
    const loadDocument = async () => {
      if (isEditing && id) {
        const doc = await getDocumentById(id);
        if (doc) {
          setProfileId(doc.profileId);
          setDocumentType(doc.type);
          setTitle(doc.title);
          setPassportNumber(doc.passport_number || '');
          setLicenseNumber(doc.license_number || '');
          setIdNumber(doc.id_number || '');
          setPermitNumber(doc.permit_number || '');
          setPolicyNumber(doc.policy_number || '');
          setCardNumber(doc.card_number || '');
          setFullName(doc.full_name || '');
          setDateOfBirth(doc.date_of_birth || '');
          setNationality(doc.nationality || '');
          setIssueDate(doc.issue_date || '');
          setExpiryDate(doc.expiry_date || '');
          setIssuingAuthority(doc.issuing_authority || '');
          setInsuranceType(doc.insurance_type || '');
          setProvider(doc.provider || '');
          setCoverageAmount(doc.coverage_amount || '');
          setPremium(doc.premium || '');
          setCardType(doc.card_type || '');
          setBankName(doc.bank_name || '');
          setPermitType(doc.permit_type || '');
          setSponsor(doc.sponsor || '');
          setCustomFields(doc.customFields);
        } else {
          navigate('/home', { replace: true });
        }
      }
    };

    loadDocument();
  }, [id, isEditing, navigate]);

  useEffect(() => {
    // Pre-fill document type from URL parameter (NEW documents only)
    const typeParam = searchParams.get('type');
    if (typeParam && !isEditing) {
      const validTypes: DocumentType[] = ['passport', 'driving_license', 'national_id', 'visa', 'residence_permit', 'insurance', 'bank_card', 'medical_card', 'custom'];
      if (validTypes.includes(typeParam as DocumentType)) {
        const newType = typeParam as DocumentType;
        setDocumentType(newType);
        // Sync title when document type is set from URL parameter
        setTitle(getDocumentTypeLabel(newType));
      }
    }
  }, [searchParams, isEditing]);

  useEffect(() => {
    // Set initial default title for NEW documents only (when title is empty)
    // This handles the case when form first loads without URL parameter
    // NOTE: This only runs when title is empty to avoid overwriting user edits
    if (!isEditing && !title) {
      setTitle(getDocumentTypeLabel(documentType));
    }
  }, [documentType, isEditing, title]);

  const handleAddCustomField = () => {
    setCustomFields([
      ...customFields,
      {
        id: `custom-${Date.now()}`,
        label: '',
        value: '',
        type: 'text'
      }
    ]);
  };

  const handleRemoveCustomField = (index: number) => {
    setCustomFields(customFields.filter((_, i) => i !== index));
  };

  const handleCustomFieldChange = (
    index: number,
    field: 'label' | 'value',
    value: string
  ) => {
    const updated = [...customFields];
    updated[index][field] = value;
    setCustomFields(updated);
  };

  // Comprehensive form validation
  const validateForm = (): boolean => {
    const errors: Record<string, string> = {};

    // Title is required
    if (!title.trim()) {
      errors.title = 'Document title is required';
    }

    // Expiry date is required for critical documents
    const documentsRequiringExpiry = ['passport', 'driving_license', 'national_id', 'visa', 'residence_permit'];
    if (documentsRequiringExpiry.includes(documentType) && !expiryDate) {
      errors.expiryDate = 'Expiry date is required for this document type';
    }

    // Validate expiry date
    if (expiryDate) {
      const expiry = new Date(expiryDate);
      const today = new Date();
      today.setHours(0, 0, 0, 0);
      
      const oneYearAgo = new Date();
      oneYearAgo.setFullYear(oneYearAgo.getFullYear() - 1);
      
      if (expiry < oneYearAgo) {
        errors.expiryDate = '⚠️ This document expired over a year ago. Please verify the date.';
      } else if (expiry < today) {
        errors.expiryDate = '⏰ This document has expired. You may want to renew it.';
      }
    }

    // Validate issue date vs expiry date
    if (issueDate && expiryDate) {
      const issue = new Date(issueDate);
      const expiry = new Date(expiryDate);
      
      if (issue >= expiry) {
        errors.issueDate = 'Issue date must be before expiry date';
      }

      // Check if issue date is in the future
      const today = new Date();
      today.setHours(0, 0, 0, 0);
      if (issue > today) {
        errors.issueDate = 'Issue date cannot be in the future';
      }
    }

    // Validate document numbers based on type
    if (documentType === 'passport' && isQuickMode && !passportNumber.trim()) {
      errors.passportNumber = 'Passport number is required';
    }

    if (documentType === 'driving_license' && isQuickMode && !licenseNumber.trim()) {
      errors.licenseNumber = 'License number is required';
    }

    if (documentType === 'national_id' && isQuickMode && !idNumber.trim()) {
      errors.idNumber = 'ID number is required';
    }

    // Validate passport number format (basic check)
    if (documentType === 'passport' && passportNumber) {
      if (passportNumber.length < 6) {
        errors.passportNumber = 'Passport number seems too short (minimum 6 characters)';
      }
      if (passportNumber.length > 15) {
        errors.passportNumber = 'Passport number seems too long (maximum 15 characters)';
      }
    }

    // Validate license number format
    if (documentType === 'driving_license' && licenseNumber) {
      if (licenseNumber.length < 5) {
        errors.licenseNumber = 'License number seems too short (minimum 5 characters)';
      }
    }

    setValidationErrors(errors);
    
    // Only block submit if there are critical errors (not warnings)
    const criticalErrors = Object.entries(errors).filter(([_, msg]) => 
      !msg.includes('⏰') && !msg.includes('⚠️')
    );
    
    return criticalErrors.length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    // Validate form first
    if (!validateForm()) {
      showErrorToast('Please fix the errors before saving');
      window.scrollTo({ top: 0, behavior: 'smooth' }); // Scroll to see errors
      return;
    }

    setIsLoading(true);
    try {
      // Check for duplicate documents (only for new documents)
      if (!isEditing) {
        const isDuplicate = await checkDuplicateDocument(title, profileId);
        if (isDuplicate) {
          const ownerProfile = profiles.find(p => p.id === profileId);
          const ownerName = ownerProfile ? `${ownerProfile.avatar} ${ownerProfile.name}` : 'this profile';
          showErrorToast(
            `A document with the title "${title}" already exists for ${ownerName}. Please use a different title.`
          );
          setIsLoading(false);
          return;
        }
      }


    const documentData: Partial<Document> = {
      profileId,
      // IMPORTANT: In Edit mode, Document Type is disabled in UI and should not change
      // The type field is included here for new documents, but for updates we rely on
      // the UI being disabled to prevent changes. If document type changes are ever
      // needed in Edit mode, this should be explicitly allowed and validated.
      type: documentType,
      title,
      full_name: fullName || undefined,
      date_of_birth: dateOfBirth || undefined,
      nationality: nationality || undefined,
      issue_date: issueDate || undefined,
      expiry_date: expiryDate || undefined,
      issuing_authority: issuingAuthority || undefined,
      customFields: customFields.filter(f => f.label && f.value)
    };

    // Add type-specific number fields
    if (documentType === 'passport') {
      documentData.passport_number = passportNumber || undefined;
    } else if (documentType === 'driving_license') {
      documentData.license_number = licenseNumber || undefined;
    } else if (documentType === 'national_id') {
      documentData.id_number = idNumber || undefined;
    } else if (documentType === 'residence_permit' || documentType === 'visa') {
      documentData.permit_number = permitNumber || undefined;
      documentData.permit_type = permitType || undefined;
      documentData.sponsor = sponsor || undefined;
    } else if (documentType === 'insurance') {
      documentData.policy_number = policyNumber || undefined;
      documentData.insurance_type = insuranceType || undefined;
      documentData.provider = provider || undefined;
      documentData.coverage_amount = coverageAmount || undefined;
      documentData.premium = premium || undefined;
    } else if (documentType === 'bank_card' || documentType === 'medical_card') {
      documentData.card_number = cardNumber || undefined;
      documentData.card_type = cardType || undefined;
      if (documentType === 'bank_card') {
        documentData.bank_name = bankName || undefined;
      } else {
        documentData.provider = provider || undefined;
      }
    }

      if (isEditing && id) {
        await updateDocument(id, documentData);
        showSuccessToast('✓ Document updated successfully');
      } else {
        await createDocument({
          ...documentData,
          id: `doc-${Date.now()}`,
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString()
        } as Document);
        showSuccessToast(`✓ ${title} added to your vault`);
      }

      // Haptic feedback on success
      if ('vibrate' in navigator) {
        navigator.vibrate([50, 100, 50]);
      }

      await refreshDocuments();
      
      // Small delay to show the success toast before navigation
      setTimeout(() => {
        navigate('/home', { replace: true });
      }, 500);
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Unknown error';
      showErrorToast(`Failed to save document: ${errorMessage}. Please try again.`);
      
      // Haptic feedback on error
      if ('vibrate' in navigator) {
        navigator.vibrate([100, 50, 100]);
      }
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 pb-20">
      {/* Header */}
      <div className="bg-white border-b border-gray-200 sticky top-0 z-10 safe-top">
        <div className="px-4 py-4">
          <div className="flex items-center gap-3">
            <button
              onClick={() => navigate('/home')}
              className="p-2 -ml-2 text-gray-600 hover:text-gray-900"
            >
              <ArrowLeft size={24} />
            </button>
            <h1 className="text-xl font-bold text-gray-900">
              {isEditing ? 'Edit Document' : 'Add Document'}
            </h1>
          </div>
        </div>
      </div>

      {/* Form */}
      <form onSubmit={handleSubmit} className="px-4 py-6 space-y-6" noValidate aria-label={isEditing ? 'Edit document form' : 'Add new document form'}>
        {/* Validation Error Summary */}
        {Object.keys(validationErrors).length > 0 && (
          <div className="bg-red-50 dark:bg-red-900/20 border-2 border-red-300 dark:border-red-700 rounded-xl p-5">
            <div className="flex items-start gap-3 mb-3">
              <AlertCircle size={24} className="text-red-600 dark:text-red-400 flex-shrink-0 mt-0.5" />
              <div>
                <h3 className="text-lg font-bold text-red-900 dark:text-red-200 mb-2">
                  Please fix {Object.keys(validationErrors).length} {Object.keys(validationErrors).length === 1 ? 'error' : 'errors'}:
                </h3>
                <ul className="space-y-1">
                  {Object.entries(validationErrors).map(([field, message]) => (
                    <li key={field} className="text-sm text-red-800 dark:text-red-300 flex items-start gap-2">
                      <span>•</span>
                      <span>{message}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          </div>
        )}

        {/* Quick Add Mode Toggle - Only show for new documents */}
        {!isEditing && (
          <div className="bg-gradient-to-r from-blue-50 to-primary-50 dark:from-blue-900/20 dark:to-primary-900/20 border-2 border-blue-200 dark:border-blue-800 rounded-xl p-5 mb-6">
            <div className="flex items-center justify-between mb-3">
              <div className="flex-1">
                <h3 className="text-lg font-bold text-gray-900 dark:text-white flex items-center gap-2">
                  <span className="text-2xl">{isQuickMode ? '⚡' : '📋'}</span>
                  <span>{isQuickMode ? 'Quick Add Mode' : 'Full Details Mode'}</span>
                </h3>
                <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">
                  {isQuickMode 
                    ? 'Just 3 essential fields - fast and simple'
                    : 'All fields available for complete information'}
                </p>
              </div>
              <button
                type="button"
                onClick={() => setIsQuickMode(!isQuickMode)}
                className={`relative inline-flex h-10 w-20 items-center rounded-full transition-colors focus:outline-none focus:ring-2 focus:ring-primary-500 focus:ring-offset-2 ${
                  isQuickMode ? 'bg-primary-600 dark:bg-primary-500' : 'bg-gray-300 dark:bg-gray-600'
                }`}
                aria-label="Toggle quick add mode"
              >
                <span
                  className={`inline-block h-8 w-8 transform rounded-full bg-white shadow-lg transition-transform ${
                    isQuickMode ? 'translate-x-11' : 'translate-x-1'
                  }`}
                />
              </button>
            </div>
            {!isQuickMode && (
              <p className="text-xs text-blue-700 dark:text-blue-300 bg-blue-100 dark:bg-blue-900/30 rounded-lg px-3 py-2 mt-3">
                💡 Tip: Start with Quick Add, you can always edit later to add more details
              </p>
            )}
          </div>
        )}

        {/* Owner/Profile */}
        <div>
          <label htmlFor="profile-select" className="block text-base font-semibold text-gray-700 dark:text-gray-300 mb-2">
            Owner
            {isQuickMode && <span className="text-red-500 ml-1" aria-label="required">*</span>}
          </label>
          <select
            id="profile-select"
            value={profileId}
            onChange={e => setProfileId(e.target.value)}
            className="input"
            required
            aria-required="true"
            aria-label="Select document owner profile"
          >
            {profiles.map(profile => (
              <option key={profile.id} value={profile.id}>
                {profile.avatar} {profile.name}
              </option>
            ))}
          </select>
        </div>

        {/* Document Type */}
        <div>
          <label htmlFor="document-type-select" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
            Document Type
            <span className="text-red-500 ml-1" aria-label="required">*</span>
          </label>
          <select
            id="document-type-select"
            value={documentType}
            onChange={e => {
              const newType = e.target.value as DocumentType;
              setDocumentType(newType);
              
              // NEW DOCUMENT MODE: Auto-sync Title with Document Type
              // When user changes Document Type, Title automatically updates to match
              // User can still edit Title manually, but changing Document Type again will reset it
              if (!isEditing) {
                setTitle(getDocumentTypeLabel(newType));
              }
              // EDIT MODE: Document Type is disabled, so this onChange won't fire
              // Title remains independent and editable in Edit mode
            }}
            className="input"
            required
            disabled={isEditing}
            aria-required="true"
            aria-label="Select document type"
            aria-describedby={isEditing ? 'document-type-readonly-hint' : undefined}
          >
            <optgroup label="Identity">
              <option value="passport">🛂 Passport</option>
              <option value="national_id">🪪 National/Resident ID</option>
              <option value="driving_license">🚗 Driving License</option>
            </optgroup>
            <optgroup label="Immigration">
              <option value="visa">✈️ Visa</option>
              <option value="residence_permit">🏠 Residence Permit</option>
            </optgroup>
            <optgroup label="Insurance & Cards">
              <option value="insurance">🛡️ Insurance</option>
              <option value="bank_card">💳 Bank/Credit Card</option>
              <option value="medical_card">🏥 Medical/Health Card</option>
            </optgroup>
            <optgroup label="Other">
              <option value="custom">📄 Custom Document</option>
            </optgroup>
          </select>
          {isEditing && (
            <p id="document-type-readonly-hint" className="mt-1 text-xs text-gray-500 dark:text-gray-400">
              Document type cannot be changed for existing documents
            </p>
          )}
        </div>

        {/* Title */}
        <div>
          <label htmlFor="document-title" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
            Title
            <span className="text-red-500 ml-1" aria-label="required">*</span>
          </label>
          <input
            id="document-title"
            type="text"
            value={title}
            onChange={e => setTitle(e.target.value)}
            className={`input ${validationErrors.title ? 'border-red-500 dark:border-red-400' : ''}`}
            placeholder="e.g., Passport"
            required
            aria-required="true"
            aria-invalid={!!validationErrors.title}
            aria-describedby={validationErrors.title ? 'title-error' : undefined}
          />
          {validationErrors.title && (
            <p id="title-error" className="mt-2 text-sm text-red-600 dark:text-red-400" role="alert">
              {validationErrors.title}
            </p>
          )}
        </div>

        {/* Type-specific Number Field */}
        {documentType === 'passport' && (
          <div>
            <label htmlFor="passport-number" className="block text-base font-semibold text-gray-700 dark:text-gray-300 mb-2">
              Passport Number
              {isQuickMode && <span className="text-red-500 ml-1" aria-label="required">*</span>}
            </label>
            <input
              id="passport-number"
              type="text"
              value={passportNumber}
              onChange={e => {
                setPassportNumber(e.target.value);
                // Clear error when user types
                setValidationErrors(prev => ({ ...prev, passportNumber: '' }));
              }}
              onBlur={e => setPassportNumber(formatUpperCase(e.target.value))}
              className={`input text-lg ${validationErrors.passportNumber ? 'border-red-500 dark:border-red-400 focus:ring-red-100 dark:focus:ring-red-900/50' : ''}`}
              placeholder="e.g., N1234567 or AB123456"
              required={isQuickMode}
              aria-required={isQuickMode}
              aria-invalid={!!validationErrors.passportNumber}
              aria-describedby={validationErrors.passportNumber ? 'passport-number-error' : 'passport-number-hint'}
            />
            {validationErrors.passportNumber ? (
              <div id="passport-number-error" className="mt-2 flex items-start gap-2 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg p-3" role="alert">
                <AlertCircle size={18} className="text-red-600 dark:text-red-400 flex-shrink-0 mt-0.5" aria-hidden="true" />
                <p className="text-sm font-semibold text-red-700 dark:text-red-300">
                  {validationErrors.passportNumber}
                </p>
              </div>
            ) : (
              <div id="passport-number-hint" className="mt-2 flex items-start gap-2">
                <span className="text-lg" aria-hidden="true">💡</span>
                <p className="text-sm text-gray-600 dark:text-gray-400">
                  Found on the top-right corner of your passport. Usually starts with a letter followed by numbers.
                </p>
              </div>
            )}
          </div>
        )}

        {documentType === 'driving_license' && (
          <div>
            <label className="block text-base font-semibold text-gray-700 dark:text-gray-300 mb-2">
              License Number
              {isQuickMode && <span className="text-red-500 ml-1">*</span>}
            </label>
            <input
              type="text"
              value={licenseNumber}
              onChange={e => {
                setLicenseNumber(e.target.value);
                setValidationErrors(prev => ({ ...prev, licenseNumber: '' }));
              }}
              onBlur={e => setLicenseNumber(formatUpperCase(e.target.value))}
              className={`input text-lg ${validationErrors.licenseNumber ? 'border-red-500 dark:border-red-400 focus:ring-red-100 dark:focus:ring-red-900/50' : ''}`}
              placeholder="e.g., DL123456789 or D1234567"
              required={isQuickMode}
            />
            {validationErrors.licenseNumber ? (
              <div className="mt-2 flex items-start gap-2 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg p-3">
                <AlertCircle size={18} className="text-red-600 dark:text-red-400 flex-shrink-0 mt-0.5" />
                <p className="text-sm font-semibold text-red-700 dark:text-red-300">
                  {validationErrors.licenseNumber}
                </p>
              </div>
            ) : (
              <div className="mt-2 flex items-start gap-2">
                <span className="text-lg">💡</span>
                <p className="text-sm text-gray-600 dark:text-gray-400">
                  Located at the top of your driver's license card. Format varies by region.
                </p>
              </div>
            )}
          </div>
        )}

        {documentType === 'national_id' && (
          <div>
            <label className="block text-base font-semibold text-gray-700 dark:text-gray-300 mb-2">
              ID Number
              {isQuickMode && <span className="text-red-500 ml-1">*</span>}
            </label>
            <input
              type="text"
              value={idNumber}
              onChange={e => {
                setIdNumber(e.target.value);
                setValidationErrors(prev => ({ ...prev, idNumber: '' }));
              }}
              onBlur={e => setIdNumber(formatUpperCase(e.target.value))}
              className={`input text-lg ${validationErrors.idNumber ? 'border-red-500 dark:border-red-400 focus:ring-red-100 dark:focus:ring-red-900/50' : ''}`}
              placeholder="e.g., ID123456 or 123456789"
              required={isQuickMode}
            />
            {validationErrors.idNumber ? (
              <div className="mt-2 flex items-start gap-2 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg p-3">
                <AlertCircle size={18} className="text-red-600 dark:text-red-400 flex-shrink-0 mt-0.5" />
                <p className="text-sm font-semibold text-red-700 dark:text-red-300">
                  {validationErrors.idNumber}
                </p>
              </div>
            ) : (
              <div className="mt-2 flex items-start gap-2">
                <span className="text-lg">💡</span>
                <p className="text-sm text-gray-600 dark:text-gray-400">
                  Your government-issued identification number. Check the front of your ID card.
                </p>
              </div>
            )}
          </div>
        )}

        {(documentType === 'residence_permit' || documentType === 'visa') && (
          <>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                {documentType === 'visa' ? 'Visa Number' : 'Permit Number'}
              </label>
              <input
                type="text"
                value={permitNumber}
                onChange={e => setPermitNumber(e.target.value)}
                onBlur={e => setPermitNumber(formatUpperCase(e.target.value))}
                className="input"
                placeholder="RP-2024-1234"
              />
              <p className="text-xs text-gray-500 mt-1">Auto-formats to UPPERCASE</p>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                {documentType === 'visa' ? 'Visa Type' : 'Permit Type'}
              </label>
              <select
                value={permitType}
                onChange={e => setPermitType(e.target.value)}
                className="input"
              >
                <option value="">Select type...</option>
                {documentType === 'visa' ? (
                  <>
                    <option value="Tourist">Tourist</option>
                    <option value="Business">Business</option>
                    <option value="Student">Student</option>
                    <option value="Work">Work</option>
                  </>
                ) : (
                  <>
                    <option value="Permanent Residence">Permanent Residence</option>
                    <option value="Temporary Residence">Temporary Residence</option>
                    <option value="Work Permit">Work Permit</option>
                    <option value="Student Permit">Student Permit</option>
                    <option value="Family Reunification">Family Reunification</option>
                  </>
                )}
              </select>
            </div>
          </>
        )}

        {documentType === 'insurance' && (
          <>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Policy Number</label>
              <input
                type="text"
                value={policyNumber}
                onChange={e => setPolicyNumber(e.target.value)}
                onBlur={e => setPolicyNumber(formatUpperCase(e.target.value))}
                className="input"
                placeholder="POL-2024-123456"
              />
              <p className="text-xs text-gray-500 mt-1">Auto-formats to UPPERCASE</p>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Insurance Type *
              </label>
              <select
                value={insuranceType}
                onChange={e => setInsuranceType(e.target.value)}
                className="input"
                required
              >
                <option value="">Select insurance type...</option>
                <option value="Health">🏥 Health Insurance</option>
                <option value="Auto">🚗 Auto/Vehicle Insurance</option>
                <option value="Home">🏠 Home/Property Insurance</option>
                <option value="Life">❤️ Life Insurance</option>
                <option value="Travel">✈️ Travel Insurance</option>
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Insurance Provider
              </label>
              <input
                type="text"
                value={provider}
                onChange={e => setProvider(e.target.value)}
                className="input"
                placeholder="Blue Cross Blue Shield"
              />
            </div>
            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Coverage Amount
                </label>
                <input
                  type="text"
                  value={coverageAmount}
                  onChange={e => setCoverageAmount(e.target.value)}
                  className="input"
                  placeholder="$500,000"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Premium</label>
                <input
                  type="text"
                  value={premium}
                  onChange={e => setPremium(e.target.value)}
                  className="input"
                  placeholder="$450/month"
                />
              </div>
            </div>
          </>
        )}

        {documentType === 'bank_card' && (
          <>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Card Number (last 4 digits recommended)
              </label>
              <input
                type="text"
                value={cardNumber}
                onChange={e => setCardNumber(e.target.value)}
                className="input"
                placeholder="**** **** **** 1234"
              />
            </div>
            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Card Type</label>
                <select
                  value={cardType}
                  onChange={e => setCardType(e.target.value)}
                  className="input"
                >
                  <option value="">Select...</option>
                  <option value="Visa">Visa</option>
                  <option value="Mastercard">Mastercard</option>
                  <option value="American Express">American Express</option>
                  <option value="Discover">Discover</option>
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Bank Name</label>
                <input
                  type="text"
                  value={bankName}
                  onChange={e => setBankName(e.target.value)}
                  className="input"
                  placeholder="Chase Bank"
                />
              </div>
            </div>
          </>
        )}

        {documentType === 'medical_card' && (
          <>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Card Number</label>
              <input
                type="text"
                value={cardNumber}
                onChange={e => setCardNumber(e.target.value)}
                className="input"
                placeholder="MED-123456789"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Healthcare Provider
              </label>
              <input
                type="text"
                value={provider}
                onChange={e => setProvider(e.target.value)}
                className="input"
                placeholder="Blue Cross Health"
              />
            </div>
          </>
        )}

        {/* Expiry Date - ALWAYS SHOW (Critical field) */}
        <div>
          <label htmlFor="expiry-date" className="block text-base font-semibold text-gray-700 dark:text-gray-300 mb-2">
            Expiry Date
            {isQuickMode && <span className="text-red-500 ml-1" aria-label="required">*</span>}
          </label>
          <input
            id="expiry-date"
            type="date"
            value={expiryDate}
            onChange={e => {
              setExpiryDate(e.target.value);
              setValidationErrors(prev => ({ ...prev, expiryDate: '', issueDate: '' }));
            }}
            className={`input text-lg ${validationErrors.expiryDate ? 'border-yellow-500 dark:border-yellow-400 focus:ring-yellow-100 dark:focus:ring-yellow-900/50' : ''}`}
            required={isQuickMode}
            aria-required={isQuickMode}
            aria-invalid={!!validationErrors.expiryDate}
            aria-describedby={validationErrors.expiryDate ? 'expiry-date-error' : 'expiry-date-hint'}
          />
          {validationErrors.expiryDate ? (
            <div 
              id="expiry-date-error"
              className={`mt-2 flex items-start gap-2 rounded-lg p-3 border ${
                validationErrors.expiryDate.includes('⏰') 
                  ? 'bg-yellow-50 dark:bg-yellow-900/20 border-yellow-200 dark:border-yellow-800' 
                  : 'bg-red-50 dark:bg-red-900/20 border-red-200 dark:border-red-800'
              }`}
              role="alert"
            >
              <AlertCircle size={18} className={`flex-shrink-0 mt-0.5 ${
                validationErrors.expiryDate.includes('⏰')
                  ? 'text-yellow-600 dark:text-yellow-400'
                  : 'text-red-600 dark:text-red-400'
              }`} aria-hidden="true" />
              <p className={`text-sm font-semibold ${
                validationErrors.expiryDate.includes('⏰')
                  ? 'text-yellow-700 dark:text-yellow-300'
                  : 'text-red-700 dark:text-red-300'
              }`}>
                {validationErrors.expiryDate}
              </p>
            </div>
          ) : isQuickMode && (
            <p id="expiry-date-hint" className="text-sm text-gray-600 dark:text-gray-400 mt-2 flex items-center gap-2">
              <span aria-hidden="true">💡</span>
              <span>This helps you track when to renew your document</span>
            </p>
          )}
        </div>

        {/* Optional Fields - Only show in Full Mode */}
        {!isQuickMode && (
          <>
            {/* Divider */}
            <div className="pt-4 border-t-2 border-gray-200 dark:border-gray-700">
              <h3 className="text-lg font-bold text-gray-900 dark:text-white mb-4 flex items-center gap-2">
                <span>📋</span>
                <span>Additional Details</span>
              </h3>
            </div>

            {/* Common Fields */}
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Full Name</label>
              <input
                type="text"
                value={fullName}
                onChange={e => setFullName(e.target.value)}
                onBlur={e => setFullName(formatName(e.target.value))}
                className="input"
                placeholder="John Doe"
              />
              <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">Auto-formats to Title Case</p>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Date of Birth</label>
              <input
                type="date"
                value={dateOfBirth}
                onChange={e => setDateOfBirth(e.target.value)}
                className="input"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Nationality</label>
              <select
                value={nationality}
                onChange={e => setNationality(e.target.value)}
                className="input"
              >
                <option value="">Select nationality...</option>
                {COUNTRIES.map((country, index) => {
                  if (country === '---') {
                    return <option key={index} disabled>───────────</option>;
                  }
                  return (
                    <option key={country} value={country}>
                      {country}
                    </option>
                  );
                })}
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Issue Date</label>
              <input
                type="date"
                value={issueDate}
                onChange={e => {
                  setIssueDate(e.target.value);
                  setValidationErrors(prev => ({ ...prev, issueDate: '', expiryDate: '' }));
                }}
                className={`input ${validationErrors.issueDate ? 'border-red-500 dark:border-red-400' : ''}`}
              />
              {validationErrors.issueDate && (
                <div className="mt-2 flex items-start gap-2 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg p-3">
                  <AlertCircle size={18} className="text-red-600 dark:text-red-400 flex-shrink-0 mt-0.5" />
                  <p className="text-sm font-semibold text-red-700 dark:text-red-300">
                    {validationErrors.issueDate}
                  </p>
                </div>
              )}
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Issuing Authority
              </label>
              <input
                type="text"
                value={issuingAuthority}
                onChange={e => setIssuingAuthority(e.target.value)}
                className="input"
                placeholder="US Department of State"
              />
            </div>
          </>
        )}

        {/* Custom Fields - Only show in Full Mode */}
        {!isQuickMode && (
          <div>
          <div className="flex items-center justify-between mb-3">
            <h3 className="text-md font-semibold text-gray-900">Custom Fields</h3>
            <button
              type="button"
              onClick={handleAddCustomField}
              className="text-sm text-primary-600 font-medium flex items-center gap-1"
            >
              <Plus size={16} />
              Add Field
            </button>
          </div>

          <div className="space-y-3">
            {customFields.map((field, index) => (
              <div key={field.id} className="flex gap-2">
                <input
                  type="text"
                  value={field.label}
                  onChange={e => handleCustomFieldChange(index, 'label', e.target.value)}
                  className="input flex-1"
                  placeholder="Field name"
                />
                <input
                  type="text"
                  value={field.value}
                  onChange={e => handleCustomFieldChange(index, 'value', e.target.value)}
                  className="input flex-1"
                  placeholder="Value"
                />
                <button
                  type="button"
                  onClick={() => handleRemoveCustomField(index)}
                  className="p-2 text-red-600 hover:bg-red-50 rounded-lg"
                >
                  <X size={20} />
                </button>
              </div>
            ))}
          </div>
        </div>
        )}

        {/* Quick Mode Summary */}
        {isQuickMode && !isEditing && (
          <div className="bg-green-50 dark:bg-green-900/20 border-2 border-green-200 dark:border-green-800 rounded-xl p-4">
            <p className="text-sm text-green-800 dark:text-green-200 font-medium flex items-center gap-2">
              <span>✨</span>
              <span>That's it! Just 3 quick fields. You can add more details later by editing.</span>
            </p>
          </div>
        )}

        {/* Submit Button */}
        <div className="pt-6">
          <button
            type="submit"
            disabled={isLoading}
            className="btn-primary w-full text-lg py-4"
          >
            {isLoading ? 'Saving...' : isEditing ? 'Save Changes' : isQuickMode ? '⚡ Quick Add Document' : '📋 Add Document with Full Details'}
          </button>
          {!isEditing && !isQuickMode && (
            <p className="text-center text-sm text-gray-500 dark:text-gray-400 mt-3">
              Or switch to Quick Add mode above for faster entry
            </p>
          )}
        </div>
      </form>
    </div>
  );
};

export default DocumentFormPage;
