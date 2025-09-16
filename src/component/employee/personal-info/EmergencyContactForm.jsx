import { useDispatch } from "react-redux"
import { useEffect, useState } from "react";
import { editEmergencyContactSectionThunk } from "../../../redux/employee/personal-info/personal-info.thunk";

const EmergencyContactForm = ({ personalInfo, setEmergencyContactFormVisible, refreshPersonalInfo }) => {

    const dispatch = useDispatch();

    const [formData, setFormData] = useState(null);
    const [status, setStatus] = useState('idle');

    useEffect(() => {
        if (personalInfo && Array.isArray(personalInfo.emergencyContact)) {
            // Deep copy
            setFormData({
                emergencyContact: [...(personalInfo.emergencyContact || [])]
            });
        }
    }, [personalInfo]);

    const handleChange = (index, e) => {
        const { name, value } = e.target;

        setFormData(prev => {
            const updatedList = [...prev.emergencyContact];
            updatedList[index] = {
                ...updatedList[index],
                [name]: value
            };
            return { ...prev, emergencyContact: updatedList };
        });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setStatus("submitting");
        //console.log(formData)

        try {
            await dispatch(editEmergencyContactSectionThunk(formData))
            setStatus("success");
            refreshPersonalInfo();
            setEmergencyContactFormVisible(false);
            //setFields()
        } catch (error) {
            console.error(error);
            setStatus("error");
        }
    }

    const closeForm = () => {
        if (confirm("Discard changes?")) {
            setEmergencyContactFormVisible(false);
            //setFields();
        }
    }

    const addContact = () => {
        setFormData((prev) => ({
            emergencyContact: [
                ...prev.emergencyContact,
                {
                    firstName: "",
                    lastName: "",
                    alternatePhone: "",
                    email: "",
                    relationship: "",
                    type: ""
                }
            ]
        }));
    };

    const deleteContact = (indexToRemove) => {
        setFormData((prev) => ({
            emergencyContact: prev.emergencyContact.filter((_, index) => index !== indexToRemove)
        }));
    };

    if (!formData) {
        return <p>form not found</p>
    }

    return(
        <form onSubmit={handleSubmit}>
            {formData.emergencyContact.map((contact, index) => (
                <div key={index}>
                    <h6>EmergencyContact {index+1} <button type="button" onClick={() => deleteContact(index)}>Delete</button></h6>
                    <label>First name</label>
                    <input name="firstName" value={contact.firstName} onChange={(e) => handleChange(index, e)} /><br />
                    <label>Last name</label>
                    <input name="lastName" value={contact.lastName} onChange={(e) => handleChange(index, e)} /><br />
                    <label>Phone number</label>
                    <input name="alternatePhone" value={contact.alternatePhone} onChange={(e) => handleChange(index, e)} /><br />
                    <label>Email</label>
                    <input name="email" value={contact.email} onChange={(e) => handleChange(index, e)} /><br />
                    <label>Relationship</label>
                    <input name="relationship" value={contact.relationship} onChange={(e) => handleChange(index, e)} /><br />
                    <label>Type</label>
                    <input name="type" value={contact.type} onChange={(e) => handleChange(index, e)} /><br />
                </div>
            ))}


            <button type="button" onClick={addContact}>Add contact</button>
            <br></br>
            <button type="submit">Save</button>
            <button type="button" onClick={closeForm}>Cancel</button>
        </form>
    )

}

export default EmergencyContactForm