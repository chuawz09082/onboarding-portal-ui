import React, { useEffect } from 'react'
import { useSelector, useDispatch } from 'react-redux'
import { fetchDocuments } from '../redux/documentsSlice'

const DocumentListSection = ({ employeeId }) => {
    const dispatch = useDispatch()
    const { documents, loading, error } = useSelector(state => state.documents)

    useEffect(() => {
        dispatch(fetchDocuments(employeeId))
    }, [dispatch, employeeId])

    const handlePreview = (path) => {
        window.open(`http://localhost:8080/api/visa/preview/${path}`, '_blank', 'noopener,noreferrer')
    }

    return (
        <section>
            <h2>Uploaded Documents</h2>
            {loading && <p>Loading documents...</p>}
            {error && <p>Error loading documents: {error}</p>}

            {documents.length === 0 ? (
                <p>No documents uploaded yet.</p>
            ) : (
                <ul>
                    {documents.map((doc) => (
                        <li key={doc.id} style={{ marginBottom: '1rem' }}>
                            <span>{doc.title || doc.path}</span>
                            <button onClick={() => handlePreview(doc.path)} style={{ marginLeft: '1rem' }}>
                                Preview
                            </button>
                            <a
                                href={`http://localhost:8080/api/visa/download/${doc.path}`}
                                download={doc.path}
                                target="_blank"
                                rel="noopener noreferrer"
                                style={{ marginLeft: '1rem' }}
                            >
                                Download
                            </a>
                        </li>
                    ))}
                </ul>
            )}
        </section>
    )
}

export default DocumentListSection
