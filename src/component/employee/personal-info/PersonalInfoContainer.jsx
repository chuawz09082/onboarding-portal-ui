import { useDispatch, useSelector } from "react-redux"
import { getPersonalInfoThunk } from "../../../redux/employee/personal-info/personal-info.thunk";
import { useEffect, useState, useRef } from "react";
import { selectPersonalInfo, selectPersonalInfoStatus } from "../../../redux/employee/personal-info/personal-info.selector";



const PersonalInfoContainer = () => {
    const placeholderId = "mongo_emp_001";
    const id = placeholderId;
    const dispatch = useDispatch();

    const personalInfo = useSelector(selectPersonalInfo);
    const status = useSelector(selectPersonalInfoStatus);

    const [updateForm, setUpdateForm] = useState(null);
    

    useEffect(() => {
        dispatch(getPersonalInfoThunk());
    }, [dispatch]);
    
    useEffect(() => {
        if (personalInfo) {
            setUpdateForm({
                firstName: personalInfo.firstName || "",
                middleName: personalInfo.middleName || "",
                lastName: personalInfo.lastName || "",
                preferredName: personalInfo.preferredName || "",
                gender: personalInfo.gender || "",

                addressList: personalInfo.addressList || [],

            });
        }
    }, [personalInfo])
    

    const handleChange = (e) => {
        const { name, value } = e.target;
        setUpdateForm((prev) => ({...prev, [name]: value}));
        console.log(updateForm)
    }

    // function toggleFormVisibility(trigger){
    //     console.log(trigger)
    // }

    const toggleFormVisibility = (e) => {
        const { message } = e.target;
        console.log(message);
    }

    console.log(personalInfo)
    console.log(updateForm)

    if(!personalInfo || !updateForm){
        return <p>employee not found</p>
    }

    const fullName = [personalInfo.firstName, personalInfo.middleName, personalInfo.lastName].join(" ");

    return (
        <>
        <div>
            <h4>Personal Details</h4>
            <ul>
                <li>Full Name: {fullName}</li>
                <li>Preferred Name: {personalInfo.preferredName}</li>
                <li>Date of Birth: {personalInfo.dob}</li>
                <li>Age: {personalInfo.age}</li>
                <li>Gender: {personalInfo.gender}</li>
                <li>SSN: *****{personalInfo.ssn}</li>
            </ul>
            {/* <button message="nameForm" onClick={toggleFormVisibility}>Edit</button>

            <form id="nameForm">
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
            </form> */}
        </div>

        <div>
            <h4>Address Details</h4>
            {personalInfo.addressList.map((address, index) => (
                <div key={address.id}>
                    <h5>Address {index + 1}</h5>
                    <span>{address.addressLine1} {address.addressLine2}</span>
                    <br/>
                    <p>{address.city}, {address.state} {address.zipCode}</p>
                </div>
            ))}
        </div>

        <div>
            <h4>Contact Information</h4>
            <ul>
                <li>Email: {personalInfo.personalEmail}</li>
                <li>Phone: {personalInfo.cellPhone}</li>
            </ul>
        </div>

        <div>
            <h4>Employment Information</h4>
            <ul>
                <li>Work Authorization: {personalInfo.workAuthorization}
                    <ul>
                        <li>Start Date: {personalInfo.workAuthorizationStartDate}</li>
                        <li>End Date: {personalInfo.workAuthorizationEndDate}</li>
                    </ul>
                </li>
                <li>Employment
                    <ul>
                        <li>Start Date: {personalInfo.employmentStartDate}</li>
                        <li>End Date: {personalInfo.employmentEndDate}</li>
                    </ul>
                </li>
            </ul>
            <h5>Emergency Contacts:</h5>
            <ul>
            {personalInfo.emergencyContact.map((contact, index) => (
                <li key={contact.id}>Name: {contact.firstName} {contact.lastName}
                    <ul>
                        <li>Phone number: {contact.alternatePhone}</li>
                        <li>Email: {contact.email}</li>
                        <li>Relationship: {contact.relationship}</li>
                        <li>Type: {contact.type}</li>
                    </ul>

                </li>
            ))}
            </ul>
        </div>
            
        </>
        

    )

}



export default PersonalInfoContainer;