import { useDispatch } from "react-redux"
import { useEffect, useState } from "react";
import { editContactSectionThunk } from "../../../redux/employee/personal-info/personal-info.thunk";


const ContactForm = ({personalInfo, setContactFormVisible, refreshPersonalInfo}) => {
    const dispatch = useDispatch();

    const [formData, setFormData] = useState(null);
    const [status, setStatus] = useState('idle');

    const setFields = () => ({
        personalEmail: personalInfo.personalEmail || "",
        cellPhone: personalInfo.cellPhone || ""
    });

    useEffect(() => {
        if (personalInfo) {
            setFormData(setFields());
        }
    }, [personalInfo])

    const handleChange = (e) => {
        const {name, value } = e.target;
        setFormData((prev) => ({ ...prev, [name]: value }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setStatus("submitting");
        //console.log(formData)

        try {
            await dispatch(editContactSectionThunk(formData))
            setStatus("success");
            refreshPersonalInfo();
            setContactFormVisible(false);
            setFields()
        } catch (error) {
            console.error(error);
            setStatus("error");
        }
    }

    const closeForm = () => {
        if (confirm("Discard changes?")) {
            setContactFormVisible(false);
            setFields();
        } 
    }

    if(!formData){
        return <p>form not found</p>
    }

    return (
        <form onSubmit={handleSubmit}>
            <label>Email</label>
            <input name="personalEmail" value={formData.personalEmail} onChange={handleChange} /><br />
            <label>Cell phone number</label>
            <input name="cellPhone" value={formData.cellPhone} onChange={handleChange} /><br />

            <br></br>
            <button type="submit">Save</button>
            <button type="button" onClick={closeForm}>Cancel</button>



            {status === "success" && <p>Updated successfully</p>}
            {status === "error" && <p>Update failed</p>}
        </form>
    )


}

export default ContactForm;