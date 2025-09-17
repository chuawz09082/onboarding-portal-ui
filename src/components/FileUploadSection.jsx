import React, { useEffect, useRef, useState } from 'react'
import { useSelector, useDispatch } from 'react-redux'
import { fetchDocuments, uploadDocument } from '../redux/documentsSlice'

const FileUploadSection = ({ employeeId, currentVisaType }) => {
  const dispatch = useDispatch()
  const { documents, loading, error } = useSelector(state => state.documents)

  const [uploadingType, setUploadingType] = useState('')
  const [message, setMessage] = useState('')
  const [pickedName, setPickedName] = useState('')
  const fileInputRef = useRef(null)
  const [pendingType, setPendingType] = useState('Generic')

  useEffect(() => {
    dispatch(fetchDocuments(employeeId))
  }, [dispatch, employeeId])

  const hasDoc = (typeKeyword) =>
    Array.isArray(documents) && documents.some(doc =>
      doc.path?.toLowerCase().includes(typeKeyword.toLowerCase()) ||
      doc.title?.toLowerCase().includes(typeKeyword.toLowerCase())
    )

  const f1UploadSequence = [
    { type: 'I20',     label: 'Upload I-20',             msg: 'Please upload your I-20' },
    { type: 'Receipt', label: 'Upload OPT STEM Receipt', msg: 'Please upload your OPT STEM Receipt' },
    { type: 'EAD',     label: 'Upload OPT STEM EAD',     msg: 'Please upload your OPT STEM EAD' },
  ]
  const nextStepIndex = f1UploadSequence.findIndex(step => !hasDoc(step.type))

  function openPicker(forType = 'Generic') {
    setPendingType(forType)
    fileInputRef.current?.click()
  }

  function onFilePicked(e) {
    const file = e.target.files?.[0]
    if (!file) return
    setPickedName(file.name)

    setUploadingType(pendingType)
    setMessage(`Uploading ${file.name}...`)

    dispatch(uploadDocument({ employeeId, file, type: pendingType }))
      .unwrap()
      .then(() => {
        setMessage(`${file.name} uploaded successfully.`)
        setUploadingType('')
        setPickedName('')
        dispatch(fetchDocuments(employeeId))
      })
      .catch(err => {
        setMessage(`Upload failed: ${String(err)}`)
        setUploadingType('')
      })
      .finally(() => { e.target.value = '' }) // allow re-choosing same file
  }

  return (
    <section>
      <h2>File Upload Section</h2>

      {/* Hidden real input */}
      <input
        ref={fileInputRef}
        type="file"
        accept=".pdf,application/pdf"
        style={{ display: 'none' }}
        onChange={onFilePicked}
      />

      {loading && <p>Loading documents...</p>}
      {error && <p>Error loading documents: {error}</p>}

      {currentVisaType === 'F1 (CPT/OPT)' ? (
        <>
          {/* If this endpoint needs auth, switch to a fetch+blob flow */}
          <a
            className="btn"
            href="http://localhost:8080/api/visa/download/i983.pdf"
            download="i983.pdf"
            target="_blank"
            rel="noopener noreferrer"
            style={{ marginBottom: '0.75rem', display: 'inline-block' }}
          >
            Download I-983
          </a>

          {nextStepIndex >= 0 ? (
            <>
              <p>{f1UploadSequence[nextStepIndex].msg}</p>
              <button
                type="button"
                className="btn"
                onClick={() => openPicker(f1UploadSequence[nextStepIndex].type)}
                disabled={!!uploadingType}
              >
                {uploadingType ? 'Uploading…' : f1UploadSequence[nextStepIndex].label}
              </button>
              {pickedName && <span style={{ marginLeft: 8, opacity: .75 }}>{pickedName}</span>}
            </>
          ) : (
            <p>All required files uploaded.</p>
          )}
        </>
      ) : (
        <>
          <p>Upload your document:</p>
          <button
            onClick={() => openPicker('Generic')}
            disabled={!!uploadingType}
            style={{ marginLeft: '1rem' }}
          >
            {uploadingType ? 'Uploading…' : 'Choose File'}
          </button>
          {pickedName && <span style={{ marginLeft: 8, opacity: .75 }}>{pickedName}</span>}
        </>
      )}

      {message && <p style={{ marginTop: '0.75rem' }}>{message}</p>}
    </section>
  )
}

export default FileUploadSection