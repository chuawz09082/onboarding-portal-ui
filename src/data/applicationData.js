// Sample application tracking data - will be replaced with backend API calls later
export const applicationData = [
  {
    awf_id: '850e8400-e29b-41d4-a716-446655440001',
    employee_id: 'mongo_emp_001',
    legal_full_name: 'Sarah Johnson',
    create_date: '2025-09-10 22:31:20',
    last_modification_date: '2025-09-10 22:31:20',
    status: 'COMPLETED',
    comment: 'New hire onboarding application',
    application_type: 'NEW_HIRE',
    documents: [
      { id: 'doc-001', name: 'Passport.pdf', type: 'PDF', uploaded_at: '2025-09-10 21:05:00', url: '#' },
      { id: 'doc-002', name: 'I-9 Form.pdf', type: 'PDF', uploaded_at: '2025-09-10 21:10:00', url: '#' },
      { id: 'doc-003', name: 'Offer Letter.pdf', type: 'PDF', uploaded_at: '2025-09-10 21:15:00', url: '#' }
    ]
  },
  {
    awf_id: 'e6cd8978-5695-4b25-9932-24f583f4efe8',
    employee_id: 'mongo_emp_003',
    legal_full_name: 'Emily Rodriguez',
    create_date: '2025-09-16 16:56:19',
    last_modification_date: '2025-09-16 16:56:19',
    status: 'OPEN',
    comment: 'Visa application under review',
    application_type: 'VISA',
    documents: [
      { id: 'doc-101', name: 'DS-160.pdf', type: 'PDF', uploaded_at: '2025-09-16 12:10:00', url: '#' },
      { id: 'doc-102', name: 'Resume.pdf', type: 'PDF', uploaded_at: '2025-09-16 12:22:00', url: '#' }
    ]
  },
  {
    awf_id: 'a1b2c3d4-e5f6-7890-abcd-ef1234567890',
    employee_id: 'mongo_emp_002',
    legal_full_name: 'Michael Chen',
    create_date: '2025-09-15 14:22:10',
    last_modification_date: '2025-09-17 09:15:30',
    status: 'REJECTED',
    comment: 'Missing required documents',
    application_type: 'VISA',
    documents: [
      { id: 'doc-201', name: 'Passport.pdf', type: 'PDF', uploaded_at: '2025-09-15 14:30:00', url: '#' }
    ]
  },
  {
    awf_id: 'f9e8d7c6-b5a4-3210-9876-543210fedcba',
    employee_id: 'mongo_emp_004',
    legal_full_name: 'David Kim',
    create_date: '2025-09-12 11:45:33',
    last_modification_date: '2025-09-18 16:20:45',
    status: 'COMPLETED',
    comment: 'Onboarding completed successfully',
    application_type: 'NEW_HIRE',
    documents: [
      { id: 'doc-301', name: 'Background Check.pdf', type: 'PDF', uploaded_at: '2025-09-12 12:00:00', url: '#' },
      { id: 'doc-302', name: 'NDA.pdf', type: 'PDF', uploaded_at: '2025-09-12 12:10:00', url: '#' }
    ]
  },
  {
    awf_id: '12345678-90ab-cdef-1234-567890abcdef',
    employee_id: 'mongo_emp_005',
    legal_full_name: 'Lisa Wang',
    create_date: '2025-09-14 08:30:15',
    last_modification_date: '2025-09-19 12:45:22',
    status: 'OPEN',
    comment: 'Work permit renewal in progress',
    application_type: 'VISA',
    documents: [
      { id: 'doc-401', name: 'Work Permit.pdf', type: 'PDF', uploaded_at: '2025-09-14 08:40:00', url: '#' }
    ]
  },
  {
    awf_id: 'abcdef12-3456-7890-abcd-ef1234567890',
    employee_id: 'mongo_emp_006',
    legal_full_name: 'James Wilson',
    create_date: '2025-09-11 15:20:40',
    last_modification_date: '2025-09-11 15:20:40',
    status: 'OPEN',
    comment: 'Background check pending',
    application_type: 'NEW_HIRE',
    documents: [
      { id: 'doc-501', name: 'Photo ID.jpg', type: 'Image', uploaded_at: '2025-09-11 15:30:00', url: '#' }
    ]
  },
  {
    awf_id: '98765432-10fe-dcba-9876-543210fedcba',
    employee_id: 'mongo_emp_007',
    legal_full_name: 'Maria Garcia',
    create_date: '2025-09-13 13:15:25',
    last_modification_date: '2025-09-20 10:30:18',
    status: 'COMPLETED',
    comment: 'Visa extension approved',
    application_type: 'VISA',
    documents: [
      { id: 'doc-601', name: 'Visa Approval.pdf', type: 'PDF', uploaded_at: '2025-09-20 10:00:00', url: '#' }
    ]
  },
  {
    awf_id: 'fedcba98-7654-3210-fedc-ba9876543210',
    employee_id: 'mongo_emp_008',
    legal_full_name: 'Alex Thompson',
    create_date: '2025-09-09 16:45:12',
    last_modification_date: '2025-09-21 14:22:35',
    status: 'REJECTED',
    comment: 'Incomplete documentation submitted',
    application_type: 'NEW_HIRE',
    documents: [
      { id: 'doc-701', name: 'W-4.pdf', type: 'PDF', uploaded_at: '2025-09-09 17:00:00', url: '#' },
      { id: 'doc-702', name: 'Direct Deposit Form.pdf', type: 'PDF', uploaded_at: '2025-09-09 17:05:00', url: '#' }
    ]
  }
];
