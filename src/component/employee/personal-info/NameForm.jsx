import { useDispatch } from "react-redux"
import { useEffect, useState } from "react";
import { editNameSectionThunk } from "../../../redux/employee/personal-info/personal-info.thunk";

const NameForm = ({ personalInfo, setNameFormVisible, refreshPersonalInfo }) => {
    const dispatch = useDispatch();

    const [formData, setFormData] = useState(null);
    const [status, setStatus] = useState('idle');

    const setFields = () => ({
        firstName: personalInfo.firstName || "",
        middleName: personalInfo.middleName || "",
        lastName: personalInfo.lastName || "",
        preferredName: personalInfo.preferredName || "",
        gender: personalInfo.gender || "",
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
            await dispatch(editNameSectionThunk(formData))
            setStatus("success");
            refreshPersonalInfo();
            setNameFormVisible(false);
            setFields()
            //onClose();
        } catch (error) {
            console.error(error);
            setStatus("error");
        }
    }

    const closeForm = () => {
        if (confirm("Discard changes?")) {
            setNameFormVisible(false);
            setFields();
        }

    }

    if (!formData) {
        return <p>form not found</p>
    }

    //console.log(formData)

    return (
        <form onSubmit={handleSubmit}>
            <label>First Name</label>
            <input name="firstName" value={formData.firstName} onChange={handleChange} /><br />
            <label>Middle Name</label>
            <input name="middleName" value={formData.middleName} onChange={handleChange} /><br />
            <label>Last Name</label>
            <input name="lastName" value={formData.lastName} onChange={handleChange} /><br />
            <label>Preferred Name</label>
            <input name="preferredName" value={formData.preferredName} onChange={handleChange} /><br />
            <label>Gender</label>
            <input name="gender" value={formData.gender} onChange={handleChange} /><br />

            <br></br>
            <button type="submit">Save</button>
            <button type="button" onClick={closeForm}>Cancel</button>



            {status === "success" && <p>Updated successfully</p>}
            {status === "error" && <p>Update failed</p>}
        </form>
    )


}

export default NameForm;