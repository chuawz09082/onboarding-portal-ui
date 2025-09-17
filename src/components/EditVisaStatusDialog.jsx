import React, { useState, useEffect } from 'react'
import { useSelector, useDispatch } from 'react-redux'
import { setEditMode, setEditedStatus, updateVisaStatus } from '../redux/visaStatusSlice'

const visaOptions = ['H1-B', 'L2', 'F1 (CPT/OPT)', 'H4', 'Other']

const EditVisaStatusDialog = ({ employeeId }) => {
    const dispatch = useDispatch()
    const { statusList, editedStatus } = useSelector(state => state.visaStatus)
    const [editedList, setEditedList] = useState([])

    useEffect(() => {
        setEditedList(statusList.map(vs => ({ ...vs })))
    }, [statusList])

    const handleVisaTypeChange = (index, newVisaType) => {
        const updatedList = [...editedList]
        updatedList[index].visa_type = newVisaType
        if (newVisaType !== 'Other') {
            updatedList[index].other_visa_type = ''
        }
        setEditedList(updatedList)
    }

    const handleOtherVisaTypeChange = (index, value) => {
        const updatedList = [...editedList]
        updatedList[index].other_visa_type = value
        setEditedList(updatedList)
    }

    const handleDateChange = (index, field, value) => {
        const updatedList = [...editedList]
        updatedList[index][field] = value
        setEditedList(updatedList)
    }

    const handleSave = () => {
        const updatedStatus = editedList.map((item) => ({
            ...item,
            active_flag: false,
            visa_type: item.visa_type === 'Other' ? item.other_visa_type : item.visa_type,
        }))
        dispatch(updateVisaStatus({ employeeId, updatedStatus }))
    }

    const handleCancel = () => {
        dispatch(setEditMode(false))
    }

    return (
        <div className="edit-dialog">
            {editedList.map((status, index) => (
                <div key={status.id} style={{ marginBottom: '1rem' }}>
                    <label>
                        Visa Type:
                        <select
                            value={status.visa_type}
                            onChange={(e) => handleVisaTypeChange(index, e.target.value)}
                        >
                            {visaOptions.map((option) => (
                                <option key={option} value={option}>
                                    {option}
                                </option>
                            ))}
                        </select>
                    </label>

                    {status.visa_type === 'Other' && (
                        <input
                            type="text"
                            placeholder="Enter visa type"
                            value={status.other_visa_type || ''}
                            onChange={(e) => handleOtherVisaTypeChange(index, e.target.value)}
                        />
                    )}

                    <label>
                        Start Date:
                        <input
                            type="date"
                            value={status.start_date ? new Date(status.start_date).toISOString().substr(0,10) : ''}
                            onChange={(e) => handleDateChange(index, 'start_date', e.target.value)}
                        />
                    </label>

                    <label>
                        End Date:
                        <input
                            type="date"
                            value={status.end_date ? new Date(status.end_date).toISOString().substr(0,10) : ''}
                            onChange={(e) => handleDateChange(index, 'end_date', e.target.value)}
                        />
                    </label>
                </div>
            ))}

            <button onClick={handleSave}>Save</button>
            <button onClick={handleCancel}>Cancel</button>
        </div>
    )
}

export default EditVisaStatusDialog
