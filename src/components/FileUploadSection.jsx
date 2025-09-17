import React, { useEffect, useState } from 'react'
import { useSelector, useDispatch } from 'react-redux'
import { fetchDocuments, uploadDocument } from '../redux/documentsSlice'

const FileUploadSection = ({ employeeId, currentVisaType }) => {
    const dispatch = useDispatch()
    const { documents, loading, error } = useSelector(state => state.documents)
    const [uploadingType, setUploadingType] = useState('')
    const [message, setMessage] = useState('')

    useEffect(() => {
        dispatch(fetchDocuments(employeeId))
    }, [dispatch, employeeId])

    // Helper to check if a document exists by type key in `path` or `title`
    const hasDoc = (typeKeyword) =>
        Array.isArray(documents) && documents.some(doc =>
            doc.path?.toLowerCase().includes(typeKeyword.toLowerCase()) ||
            doc.title?.toLowerCase().includes(typeKeyword.toLowerCase())
        )

    // Sequential progressive upload steps for F1 visa users
    const f1UploadSequence = [
        { type: 'I20', label: 'Upload I-20', msg: 'Please upload your I-20' },
        { type: 'Receipt', label: 'Upload OPT STEM Receipt', msg: 'Please upload your OPT STEM Receipt' },
        { type: 'EAD', label: 'Upload OPT STEM EAD', msg: 'Please upload your OPT STEM EAD' },
    ]

    // Find next step index not uploaded yet
    const nextStepIndex = f1UploadSequence.findIndex(step => !hasDoc(step.type))

    // Handler for file input change and dispatch upload
    const handleFileUpload = (e, type) => {
        const file = e.target.files[0]
        if (!file) return

        setUploadingType(type)
        setMessage(`Uploading ${file.name}...`)

        dispatch(uploadDocument({ employeeId, file, type }))
            .unwrap()
            .then(() => {
                setMessage(`${file.name} uploaded successfully.`)
                setUploadingType('')
                dispatch(fetchDocuments(employeeId)) // Refresh document list
            })
            .catch((err) => {
                setMessage(`Upload failed: ${err}`)
                setUploadingType('')
            })
    }

    return (
        <section>
            <h2>File Upload Section</h2>

            {loading && <p>Loading documents...</p>}
            {error && <p>Error loading documents: {error}</p>}

            {currentVisaType === 'F1 (CPT/OPT)' ? (
                <>
                    {/* Download I-983 button */}
                    <a
                        href="http://localhost:8080/api/visa/download/i983.pdf"
                        download="i983.pdf"
                        target="_blank"
                        rel="noopener noreferrer"
                    >
                        Download I-983
                    </a>

                    {/* Show messages and upload buttons in sequence */}
                    {nextStepIndex >= 0 ? (
                        <>
                            <p>{f1UploadSequence[nextStepIndex].msg}</p>
                            <input
                                type="file"
                                onChange={(e) => handleFileUpload(e, f1UploadSequence[nextStepIndex].type)}
                                disabled={uploadingType !== ''}
                            />
                        </>
                    ) : (
                        <p>All required files uploaded.</p>
                    )}
                </>
            ) : (
                <>
                    <p>Upload your document:</p>
                    <input
                        type="file"
                        onChange={(e) => handleFileUpload(e, 'Generic')}
                        disabled={uploadingType !== ''}
                    />
                </>
            )}

            {message && <p>{message}</p>}
        </section>
    )
}

export default FileUploadSection