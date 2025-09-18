import React, { useEffect } from 'react'
import { useSelector, useDispatch } from 'react-redux'
import { fetchVisaStatus, setEditMode } from '../redux/visaStatusSlice'
import EditVisaStatusDialog from './EditVisaStatusDialog'

const VisaStatusSection = ({ employeeId }) => {
    const dispatch = useDispatch()
    const { statusList, loading,  editMode } = useSelector(state => state.visaStatus)

    useEffect(() => {
        dispatch(fetchVisaStatus(employeeId))
    }, [dispatch, employeeId])

    if (loading) return <p>Loading visa status...</p>

    return (
        <section>
            <h2>Visa Status Management</h2>
            <ul>
                {statusList.map((status) => (
                    <li key={status.id}>
                        <p>Id: {status.id}</p>
                        <p>Visa Type: {status.visa_type} </p>
                        <p>Active flag: {status.active_flag ? "Approve" : "Reject"}</p>
                        <p>Start Date: {new Date(status.start_date).toLocaleDateString()} </p>
                        <p>End Date: {new Date(status.end_date).toLocaleDateString()}</p>
                        <p>Last Modification Date: {new Date(status.last_modification_date).toLocaleDateString()}</p>
                    </li>
                ))}
            </ul>
            <button onClick={() => dispatch(setEditMode(true))}>Edit</button>
            {editMode && <EditVisaStatusDialog employeeId={employeeId} />}
        </section>
    )
}

export default VisaStatusSection
