import React, { useEffect } from 'react'
import { useSelector, useDispatch } from 'react-redux'
import { fetchDigitalDocuments } from '../redux/digitalDocumentsSlice'

export default function OnboardingDocuments({employeeId}) {
    const dispatch = useDispatch()
    const { digitalDocuments, loading, error } = useSelector(s => s.digitalDocuments)

    useEffect(() => {
        dispatch(fetchDigitalDocuments())
    }, [dispatch, employeeId])

    console.log(digitalDocuments)


    return(
        <>
          {digitalDocuments.map(doc => (
            <p>{doc.title}</p>
          ))}  
        </>
    )


}