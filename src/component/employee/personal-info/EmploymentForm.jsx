import { useDispatch } from "react-redux"
import { useEffect, useState } from "react";
import { editEmploymentSectionThunk } from "../../../redux/employee/personal-info/personal-info.thunk";

const EmploymentForm = ({ personalInfo, setEmploymentFormVisible, refreshPersonalInfo }) => {
    const dispatch = useDispatch();

    const [formData, setFormData] = useState(null);
    const [status, setStatus] = useState('idle');

    const setFields = () => ({
        workAuthorization: personalInfo.workAuthorization || "",
        workAuthorizationStartDate: personalInfo.workAuthorizationStartDate || "",
        workAuthorizationEndDate: personalInfo.workAuthorizationEndDate || "",
        employmentStartDate: personalInfo.employmentStartDate || "",
        employmentEndDate: personalInfo.employmentEndDate || ""
    });

    useEffect(() => {
        if (personalInfo) {
            setFormData(setFields());
        }
    }, [personalInfo])

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData((prev) => ({ ...prev, [name]: value }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setStatus("submitting");
        //console.log(formData)

        try {
            await dispatch(editEmploymentSectionThunk(formData))
            setStatus("success");
            refreshPersonalInfo();
            setEmploymentFormVisible(false);
            setFields()
        } catch (error) {
            console.error(error);
            setStatus("error");
        }
    }

    const closeForm = () => {
        if (confirm("Discard changes?")) {
            setEmploymentFormVisible(false);
            setFields();
        } 
    }

    if(!formData){
        return <p>form not found</p>
    }

    return (
        <form onSubmit={handleSubmit}>
            <label>Work Authorization</label>
            <input name="workAuthorization" value={formData.workAuthorization} onChange={handleChange} /><br />
            <label>Start Date</label>
            <input name="workAuthorizationStartDate" value={formData.workAuthorizationStartDate} onChange={handleChange} /><br />
            <label>End Date</label>
            <input name="workAuthorizationEndDate" value={formData.workAuthorizationEndDate} onChange={handleChange} /><br />
            <label>Start Date</label>
            <input name="employmentStartDate" value={formData.employmentStartDate} onChange={handleChange} /><br />
            <label>End Date</label>
            <input name="employmentEndDate" value={formData.employmentEndDate} onChange={handleChange} /><br />



            <br></br>
            <button type="submit">Save</button>
            <button type="button" onClick={closeForm}>Cancel</button>



            {status === "success" && <p>Updated successfully</p>}
            {status === "error" && <p>Update failed</p>}
        </form>
    )

}

export default EmploymentForm;