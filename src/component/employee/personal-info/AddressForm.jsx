import { useDispatch } from "react-redux"
import { useEffect, useState } from "react";
import { editAddressSectionThunk } from "../../../redux/employee/personal-info/personal-info.thunk";

const AddressForm = ({personalInfo, setAddressFormVisible, refreshPersonalInfo}) => {

    const dispatch = useDispatch();

    const [formData, setFormData] = useState(null);
    const [status, setStatus] = useState('idle');

    // const setFields = () => ({
    //     addressList: personalInfo.addressList.map(addr => ({ ...addr }))
    // });

    useEffect(() => {
        if (personalInfo && Array.isArray(personalInfo.addressList)) {
            // Deep copy of the address list
            setFormData({
                addressList: [...(personalInfo.addressList || [])]
            });
        }
    }, [personalInfo]);

    const handleChange = (index, e) => {
        const { name, value } = e.target;

        setFormData(prev => {
            const updatedList = [...prev.addressList];
            updatedList[index] = {
                ...updatedList[index],
                [name]: value
            };
            return { ...prev, addressList: updatedList };
        });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setStatus("submitting");
        //console.log(formData)

        try {
            await dispatch(editAddressSectionThunk(formData))
            setStatus("success");
            refreshPersonalInfo();
            setAddressFormVisible(false);
            //setFields()
        } catch (error) {
            console.error(error);
            setStatus("error");
        }
    }

    const closeForm = () => {
        if (confirm("Discard changes?")) {
            setAddressFormVisible(false);
            //setFields();
        }
    }

    const addAddress = () => {
        setFormData((prev) => ({
            addressList: [
                ...prev.addressList,
                {
                    addressLine1: "",
                    addressLine2: "",
                    city: "",
                    state: "",
                    zipCode: ""
                }
            ]
        }));
    };

    const deleteAddress = (indexToRemove) => {
        setFormData((prev) => ({
            addressList: prev.addressList.filter((_, index) => index !== indexToRemove)
        }));
    };

    if (!formData) {
        return <p>form not found</p>
    }

    return(
        <form onSubmit={handleSubmit}>
            {formData.addressList.map((address, index) => (
                <div key={index}>
                    <h6>Address {index+1} <button type="button" onClick={() => deleteAddress(index)}>Delete</button></h6>
                    <label>Street</label>
                    <input name="addressLine1" value={address.addressLine1} onChange={(e) => handleChange(index, e)} /><br />
                    <label>Apartment</label>
                    <input name="addressLine2" value={address.addressLine2} onChange={(e) => handleChange(index, e)} /><br />
                    <label>City</label>
                    <input name="city" value={address.city} onChange={(e) => handleChange(index, e)} /><br />
                    <label>State</label>
                    <input name="state" value={address.state} onChange={(e) => handleChange(index, e)} /><br />
                    <label>Zip Code</label>
                    <input name="zipCode" value={address.zipCode} onChange={(e) => handleChange(index, e)} /><br />
                </div>
            ))}


            <button type="button" onClick={addAddress}>Add address</button>
            <br></br>
            <button type="submit">Save</button>
            <button type="button" onClick={closeForm}>Cancel</button>
        </form>
    )
}

export default AddressForm;