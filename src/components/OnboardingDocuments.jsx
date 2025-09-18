import React, { useEffect, useState } from 'react'
import { useSelector, useDispatch } from 'react-redux'
import { fetchDigitalDocuments, uploadDigitalDocument } from '../redux/digitalDocumentsSlice'
import '../App.css'

const API = import.meta.env.VITE_API_BASE ?? 'http://localhost:8080' // or use your http.js wrapper

export default function OnboardingDocuments({ employeeId }) {
    //hardcoded employeeId
    if(!employeeId){
        employeeId = "mongo_emp_001"
    }

    const dispatch = useDispatch();
    const { digitalDocuments, loading, error } = useSelector(s => s.digitalDocuments);

    const [selectedFiles, setSelectedFiles] = useState({});
    const [uploadedDocs, setUploadedDocs] = useState({});

    useEffect(() => {
        dispatch(fetchDigitalDocuments())
    }, [dispatch])



    console.log(digitalDocuments)

    if(loading){
        return <p>Loading</p>
    }
    if(error){
        return <p>Error: {String(error)}</p>
    }

    async function authFetchBlob(url) {
        const token = sessionStorage.getItem('access_token') // wherever you store it
        const res = await fetch(url, {
            headers: { Authorization: `Bearer ${token}` }
        })
        if (!res.ok) throw new Error(`HTTP ${res.status}`)
        return await res.blob()
    }

    async function handleDownload(path) {
        console.log(path)
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

    const handleFileSelect = (docId, event) => {
        const file = event.target.files[0];
        if (file) {
            setSelectedFiles(prev => ({
                ...prev, [docId]: file
            }))
        }
    };

    const handleUpload = async (docId, type) => {
        const file = selectedFiles[docId];
        if (!file) {
            alert("Select a file");
            return;
        }

        try {
            await dispatch(uploadDigitalDocument({
                employeeId,
                file,
                type
            })).unwrap();

            setUploadedDocs(prev => ({ ...prev, [docId]: true}));
            alert("Upload successful");
        }
        catch (error) {
            console.log(error);
            alert("Upload failed");
        }

        
    };

    const allRequiredUploaded = digitalDocuments
        .filter(doc => doc.required)
        .every(doc => uploadedDocs[doc.id])







    return (
        <>
            <table>
                <thead>
                    <tr>
                        <th>
                            Title
                        </th>
                        <th>
                            Description
                        </th>
                        <th>
                            Required?
                        </th>
                        <th>
                            Download
                        </th>
                        <th>
                            Upload
                        </th>
                    </tr>
                </thead>
                <tbody>
                    {digitalDocuments.map(doc => (
                        <tr key={doc.id}>
                            <td>{doc.title}</td>
                            <td>{doc.description}</td>
                            <td>{doc.required ? "Yes" : "No"}</td>
                            <td><button onClick={() => handleDownload(doc.path)}>
                                Download
                            </button></td>
                            <td>
                                <input 
                                type="file"
                                onChange={(e) => handleFileSelect(doc.id, e)}
                                />
                                <button
                                onClick={() => handleUpload(doc.id, doc.type)}>Upload</button>
                                {uploadedDocs[doc.id] && <span>Uploaded</span>}
                            </td>
                        </tr>

                    ))}
                </tbody>

            </table>
            <button type="button" disabled={!allRequiredUploaded}>
                Continue
            </button>
        </>
    )


}