// Search Engine Service
// Rule-based query parsing for MVP
// Parses queries like: "When does my passport expire?" or "Sara's passport number"

import { Profile, Document, DocumentType, QueryIntent, SearchResult } from '../types/vault';

// Keywords for document types
const DOCUMENT_TYPE_KEYWORDS: Record<string, DocumentType> = {
  'passport': 'passport',
  'passports': 'passport',
  'driving license': 'driving_license',
  'driver license': 'driving_license',
  'license': 'driving_license',
  'driver': 'driving_license',
  'national id': 'national_id',
  'resident id': 'national_id',
  'id card': 'national_id',
  'id': 'national_id',
  'identification': 'national_id',
  'visa': 'visa',
  'visas': 'visa',
  'residence permit': 'residence_permit',
  'resident permit': 'residence_permit',
  'work permit': 'residence_permit',
  'permit': 'residence_permit',
  'insurance': 'insurance',
  'policy': 'insurance',
  'health insurance': 'insurance',
  'auto insurance': 'insurance',
  'car insurance': 'insurance',
  'life insurance': 'insurance',
  'travel insurance': 'insurance',
  'bank card': 'bank_card',
  'credit card': 'bank_card',
  'debit card': 'bank_card',
  'card': 'bank_card',
  'medical card': 'medical_card',
  'health card': 'medical_card'
};

// Keywords for field names
const FIELD_KEYWORDS: Record<string, string> = {
  'expire': 'expiry_date',
  'expires': 'expiry_date',
  'expiry': 'expiry_date',
  'expiration': 'expiry_date',
  'valid until': 'expiry_date',
  'number': 'number',
  'numbers': 'number',
  'policy number': 'number',
  'card number': 'number',
  'permit number': 'number',
  'dob': 'date_of_birth',
  'birth': 'date_of_birth',
  'birthday': 'date_of_birth',
  'born': 'date_of_birth',
  'name': 'full_name',
  'nationality': 'nationality',
  'issue': 'issue_date',
  'issued': 'issue_date',
  'provider': 'provider',
  'insurance provider': 'provider',
  'coverage': 'coverage_amount',
  'premium': 'premium',
  'type': 'insurance_type'
};

// Relationship keywords
const RELATIONSHIP_KEYWORDS: Record<string, string[]> = {
  'self': ['my', 'me', 'i', 'mine'],
  'spouse': ['wife', 'husband', 'spouse', 'partner'],
  'child': ['kid', 'child', 'son', 'daughter']
};

/**
 * Parse a natural language query into a structured intent
 */
export const parseQuery = (query: string, profiles: Profile[], currentProfileId: string): QueryIntent => {
  const lowerQuery = query.toLowerCase();
  const intent: QueryIntent = {};

  // 1. Detect profile/person
  // Check for explicit profile names
  for (const profile of profiles) {
    if (lowerQuery.includes(profile.name.toLowerCase())) {
      intent.profileId = profile.id;
      intent.profileName = profile.name;
      break;
    }
  }

  // Check for relationship keywords
  if (!intent.profileId) {
    for (const [relationship, keywords] of Object.entries(RELATIONSHIP_KEYWORDS)) {
      for (const keyword of keywords) {
        if (new RegExp(`\\b${keyword}\\b`).test(lowerQuery)) {
          // Find profile with this relationship
          if (keyword === 'my' || keyword === 'me' || keyword === 'i' || keyword === 'mine') {
            intent.profileId = currentProfileId;
          } else {
            const matchingProfile = profiles.find(p => p.relationship === relationship);
            if (matchingProfile) {
              intent.profileId = matchingProfile.id;
              intent.profileName = matchingProfile.name;
            }
          }
          break;
        }
      }
      if (intent.profileId) break;
    }
  }

  // Default to current profile if no specific person mentioned
  if (!intent.profileId) {
    intent.profileId = currentProfileId;
  }

  // 2. Detect document type
  for (const [keyword, docType] of Object.entries(DOCUMENT_TYPE_KEYWORDS)) {
    if (lowerQuery.includes(keyword)) {
      intent.documentType = docType;
      break;
    }
  }

  // 3. Detect field name
  for (const [keyword, fieldName] of Object.entries(FIELD_KEYWORDS)) {
    if (lowerQuery.includes(keyword)) {
      intent.fieldName = fieldName;
      break;
    }
  }

  // 4. Detect action
  if (lowerQuery.includes('next') || lowerQuery.includes('expiring soon') || lowerQuery.includes('upcoming')) {
    intent.action = 'expiry_check';
  } else if (lowerQuery.includes('list') || lowerQuery.includes('all') || lowerQuery.includes('show')) {
    intent.action = 'list';
  } else {
    intent.action = 'find';
  }

  return intent;
};

/**
 * Execute a search based on the parsed intent
 */
export const executeSearch = (
  intent: QueryIntent,
  documents: Document[],
  profiles: Profile[],
  query: string
): SearchResult => {
  let filteredDocs = [...documents];

  // Filter by profile
  if (intent.profileId) {
    filteredDocs = filteredDocs.filter(doc => doc.profileId === intent.profileId);
  }

  // Filter by document type
  if (intent.documentType) {
    filteredDocs = filteredDocs.filter(doc => doc.type === intent.documentType);
  }

  // Special action: expiry check
  if (intent.action === 'expiry_check') {
    // Sort by expiry date
    filteredDocs = filteredDocs
      .filter(doc => doc.expiry_date)
      .sort((a, b) => {
        const dateA = new Date(a.expiry_date!);
        const dateB = new Date(b.expiry_date!);
        return dateA.getTime() - dateB.getTime();
      });

    return {
      type: filteredDocs.length === 1 ? 'document' : 'multiple',
      documents: filteredDocs,
      highlightedField: 'expiry_date',
      query
    };
  }

  // Get the profile for context
  const profile = profiles.find(p => p.id === intent.profileId);

  // If we have a specific field to highlight
  if (intent.fieldName) {
    return {
      type: filteredDocs.length === 1 ? 'field' : 'multiple',
      documents: filteredDocs,
      highlightedField: intent.fieldName,
      profile,
      query
    };
  }

  return {
    type: filteredDocs.length === 1 ? 'document' : 'multiple',
    documents: filteredDocs,
    profile,
    query
  };
};

/**
 * Main search function
 */
export const search = (
  query: string,
  documents: Document[],
  profiles: Profile[],
  currentProfileId: string
): SearchResult => {
  const intent = parseQuery(query, profiles, currentProfileId);
  return executeSearch(intent, documents, profiles, query);
};

/**
 * Generate quick search suggestions - Mobile-friendly shorter text
 */
export const getQuickSearchSuggestions = (
  currentProfile: Profile,
  documents: Document[]
): string[] => {
  const suggestions: string[] = [];

  // Find most common document for current profile
  const myDocs = documents.filter(doc => doc.profileId === currentProfile.id);

  if (myDocs.find(d => d.type === 'passport')) {
    suggestions.push("🛂 Passport");
  }

  if (myDocs.find(d => d.type === 'driving_license')) {
    suggestions.push("🚗 License");
  }

  if (myDocs.find(d => d.type === 'insurance')) {
    suggestions.push("🛡️ Insurance");
  }

  if (myDocs.find(d => d.type === 'residence_permit')) {
    suggestions.push("🏠 Permit");
  }

  if (myDocs.find(d => d.type === 'bank_card')) {
    suggestions.push("💳 Card");
  }

  // Add a general one
  suggestions.push("⏰ Expiring");

  return suggestions;
};
