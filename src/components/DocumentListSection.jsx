import React, { useEffect } from 'react'
import { useSelector, useDispatch } from 'react-redux'
import { fetchDocuments } from '../redux/documentsSlice'

const API = import.meta.env.VITE_API_BASE ?? 'http://localhost:8080' // or use your http.js wrapper

export default function DocumentListSection({ employeeId }) {
  const dispatch = useDispatch()
  const { documents, loading, error } = useSelector(s => s.documents)

  useEffect(() => {
    dispatch(fetchDocuments(employeeId))
  }, [dispatch, employeeId])

  async function authFetchBlob(url) {
    const token = sessionStorage.getItem('access_token') // wherever you store it
    const res = await fetch(url, {
      headers: { Authorization: `Bearer ${token}` }
    })
    if (!res.ok) throw new Error(`HTTP ${res.status}`)
    return await res.blob()
  }

  async function handlePreview(path) {
    const url = `${API}/api/visa/download/${encodeURIComponent(path)}`
    const blob = await authFetchBlob(url)
    const blobUrl = URL.createObjectURL(blob)
    window.open(blobUrl, '_blank', 'noopener,noreferrer')
    // optional: setTimeout(() => URL.revokeObjectURL(blobUrl), 30_000)
  }

  async function handleDownload(path) {
    const url = `${API}/api/visa/download/${encodeURIComponent(path)}`
    const blob = await authFetchBlob(url)
    const blobUrl = URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = blobUrl
    a.download = path
    document.body.appendChild(a)
    a.click()
    a.remove()
    // optional: URL.revokeObjectURL(blobUrl)
  }

  return (
    <section>
      <h2>Uploaded Documents</h2>
      {loading && <p>Loading documents...</p>}
      {error && <p>Error loading documents: {String(error)}</p>}

      {documents.length === 0 ? (
        <p>No documents uploaded yet.</p>
      ) : (
        <ul>
          {documents.map(doc => (
            <li key={doc.id} style={{ marginBottom: '1rem' }}>
              <span>{doc.title || doc.path}</span>
              <button onClick={() => handlePreview(doc.path)} style={{ marginLeft: '1rem' }}>
                Preview
              </button>
              <button onClick={() => handleDownload(doc.path)} style={{ marginLeft: '1rem' }}>
                Download
              </button>
            </li>
          ))}
        </ul>
      )}
    </section>
  )
}
