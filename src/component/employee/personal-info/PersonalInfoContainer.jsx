import { useDispatch, useSelector } from "react-redux"
import { getPersonalInfoThunk } from "../../../redux/employee/personal-info/personal-info.thunk";
import { useEffect, useState, useRef } from "react";
import { selectPersonalInfo, selectPersonalInfoStatus } from "../../../redux/employee/personal-info/personal-info.selector";
import NameForm from "./NameForm";
import AddressForm from "./AddressForm";
import ContactForm from "./ContactForm";
import EmploymentForm from "./EmploymentForm";
import EmergencyContactForm from "./EmergencyContactForm";



const PersonalInfoContainer = () => {
    const placeholderId = "mongo_emp_001";
    const id = placeholderId;
    const dispatch = useDispatch();

    //personal info retrieved from endpoint
    const personalInfo = useSelector(selectPersonalInfo);
    //status of personal info
    const status = useSelector(selectPersonalInfoStatus);

    //visibility of forms
    const [nameFormVisible, setNameFormVisible] = useState(false);
    const [addressFormVisible, setAddressFormVisible] = useState(false);
    const [contactFormVisible, setContactFormVisible] = useState(false);
    const [employmentFormVisible, setEmploymentFormVisible] = useState(false);
    const [emergencyContactFormVisible, setEmergencyContactFormVisible] = useState(false);

    //pass into forms
    const refreshPersonalInfo = () => {
        dispatch(getPersonalInfoThunk());
    };


    useEffect(() => {
        dispatch(getPersonalInfoThunk());
    }, [dispatch]);


    //button press to make forms visible
    const editNameForm = () => setNameFormVisible(true);
    const editAddressForm = () => setAddressFormVisible(true);
    const editContactForm = () => setContactFormVisible(true);
    const editEmploymentForm = () => setEmploymentFormVisible(true);
    const editEmergencyContactForm = () => setEmergencyContactFormVisible(true);


    // console.log(personalInfo)
    // console.log(updateForm)

    if (status === "loading") {
        return <p>loading</p>
    }
    if (status === "failed" || !personalInfo) {
        return <p>personal info not found</p>
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

                <button onClick={editNameForm}>Edit</button>

                {nameFormVisible ?
                    <NameForm
                        personalInfo={personalInfo}
                        setNameFormVisible={setNameFormVisible}
                        refreshPersonalInfo={refreshPersonalInfo}
                    /> : null}

            </div>
            <br/>

            <div>
                <h4>Address Details</h4>
                {personalInfo.addressList.map((address, index) => (
                    <div key={index}>
                        <h5>Address {index + 1}</h5>
                        <span>{address.addressLine1} {address.addressLine2}</span>
                        <br />
                        <p>{address.city}, {address.state} {address.zipCode}</p>
                    </div>
                ))}

                <button onClick={editAddressForm}>Edit</button>

                {addressFormVisible ?
                    <AddressForm
                        personalInfo={personalInfo}
                        setAddressFormVisible={setAddressFormVisible}
                        refreshPersonalInfo={refreshPersonalInfo}
                    /> : null}
            </div>
            <br/>
            <div>
                <h4>Contact Information</h4>
                <ul>
                    <li>Email: {personalInfo.personalEmail}</li>
                    <li>Phone: {personalInfo.cellPhone}</li>
                </ul>

                <button onClick={editContactForm}>Edit</button>

                {contactFormVisible ?
                    <ContactForm
                        personalInfo={personalInfo}
                        setContactFormVisible={setContactFormVisible}
                        refreshPersonalInfo={refreshPersonalInfo}
                    /> : null}
            </div>
            <br/>
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

                <button onClick={editEmploymentForm}>Edit</button>

                {employmentFormVisible ?
                    <EmploymentForm
                        personalInfo={personalInfo}
                        setEmploymentFormVisible={setEmploymentFormVisible}
                        refreshPersonalInfo={refreshPersonalInfo}
                    /> : null}

            </div>
            <br/>

            <div>
                <h4>Emergency Contacts</h4>
                <ul>
                    {personalInfo.emergencyContact.map((contact, index) => (
                        <li key={index}>Name: {contact.firstName} {contact.lastName}
                            <ul>
                                <li>Phone number: {contact.alternatePhone}</li>
                                <li>Email: {contact.email}</li>
                                <li>Relationship: {contact.relationship}</li>
                                <li>Type: {contact.type}</li>
                            </ul>
                        </li>
                    ))}
                </ul>

                <button onClick={editEmergencyContactForm}>Edit</button>

                {emergencyContactFormVisible ?
                    <EmergencyContactForm
                        personalInfo={personalInfo}
                        setEmergencyContactFormVisible={setEmergencyContactFormVisible}
                        refreshPersonalInfo={refreshPersonalInfo}
                    /> : null}
            </div>

        </>


    )

}



export default PersonalInfoContainer;