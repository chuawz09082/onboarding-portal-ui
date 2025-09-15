import { useDispatch, useSelector } from "react-redux"
import { useEffect, useState, useRef } from "react";
import { editPersonalInfoThunk } from "../../../redux/employee/personal-info/personal-info.thunk";

const NameForm = () => {
    const dispatch = useDispatch();

    const [formData, setFormData] = useState(initialData);
    const [status, setStatus] = useState('idle');

    const handleChange = (e) => {
        const {name, value } = e.target;
        setFormData((prev) => ({ ...prev, [name]: value }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setStatus("submitting");

        try {
            await dispatch(editPersonalInfoThunk(formData))
            setStatus("success");
            onClose();
        } catch (error) {
            console.error(error);
            setStatus("error");
        }
      
    }

    return (
        <form onSubmit={handleSubmit}>
                <label>First Name</label>
                <input name="firstName" value={updateForm.firstName} onChange={handleChange} /><br/>
                <label>Middle Name</label>
                <input name="middleName" value={updateForm.middleName} onChange={handleChange} /><br/>
                <label>Last Name</label>
                <input name="lastName" value={updateForm.lastName} onChange={handleChange} /><br/>
                <label>Preferred Name</label>
                <input name="preferredName" value={updateForm.preferredName} onChange={handleChange} /><br/>
                <label>Gender</label>
                <input name="gender" value={updateForm.gender} onChange={handleChange} /><br/>
                
                <br></br>
                <button type="submit">Save</button>
                <button type="button" onClick={onClose}>Cancel</button>

                {status === "success" && <p>Updated successfully</p> }
                {status === "error" && <p>Update failed</p>}
            </form>
    )

   
}