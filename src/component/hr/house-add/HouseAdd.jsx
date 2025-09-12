import { useState } from "react";
import { Button, Card, Table } from "react-bootstrap";
import { useDispatch } from "react-redux";
import { addHouseThunk } from "../../../redux/hr/house/house.thunk";
import "./AddHouse.css";

const facilityTypes = ["Bed", "Mattress", "Table", "Chair"];

const AddHouse = () => {
  const dispatch = useDispatch();

  const [house, setHouse] = useState({
    address: "",
    maxOccupant: "",
    landlord: {
      id: null,
      firstName: "",
      lastName: "",
      email: "",
      cellphone: "",
    },
    facilityList: [],
  });

  const [newFacility, setNewFacility] = useState({
    type: "",
    description: "",
    quantity: "",
  });

  const addFacility = () => {
    if (newFacility.type && newFacility.quantity > 0) {
      setHouse((prev) => ({
        ...prev,
        facilityList: [...prev.facilityList, newFacility],
      }));
      setNewFacility({ type: "", description: "", quantity: "" });
    }
  };

  const removeFacility = (index) => {
    setHouse((prev) => ({
      ...prev,
      facilityList: prev.facilityList.filter((_, i) => i !== index),
    }));
  };

  const handleSubmit = () => {
    // Make sure quantity is a number
    const payload = {
      ...house,
      maxOccupant: Number(house.maxOccupant),
      facilityList: house.facilityList.map((f) => ({
        ...f,
        quantity: Number(f.quantity),
      })),
    };

    dispatch(addHouseThunk(payload)).then(() => {
      alert("House added successfully!");
      resetForm();
    });
  };

  const resetForm = () => {
    setHouse({
      address: "",
      maxOccupant: "",
      landlord: {
        id: null,
        firstName: "",
        lastName: "",
        email: "",
        cellphone: "",
      },
      facilityList: [],
    });
    setNewFacility({ type: "", description: "", quantity: "" });
  };

  return (
    <div className="container my-4">
      <h2 className="text-center mb-4">Add New House</h2>

      <Card className="mb-4 shadow-sm">
        <Card.Header>House Information</Card.Header>
        <Card.Body>
          <div className="mb-3">
            <label className="form-label">Address</label>
            <input
              type="text"
              className="form-control"
              value={house.address}
              onChange={(e) => setHouse({ ...house, address: e.target.value })}
            />
          </div>
          <div className="mb-3">
            <label className="form-label">Max Occupants</label>
            <input
              type="number"
              className="form-control"
              value={house.maxOccupant}
              onChange={(e) =>
                setHouse({ ...house, maxOccupant: e.target.value })
              }
            />
          </div>
        </Card.Body>
      </Card>

      <Card className="mb-4 shadow-sm">
        <Card.Header>Landlord Information</Card.Header>
        <Card.Body>
          <div className="mb-3">
            <label className="form-label">First Name</label>
            <input
              type="text"
              className="form-control"
              value={house.landlord.firstName}
              onChange={(e) =>
                setHouse({
                  ...house,
                  landlord: { ...house.landlord, firstName: e.target.value },
                })
              }
            />
          </div>
          <div className="mb-3">
            <label className="form-label">Last Name</label>
            <input
              type="text"
              className="form-control"
              value={house.landlord.lastName}
              onChange={(e) =>
                setHouse({
                  ...house,
                  landlord: { ...house.landlord, lastName: e.target.value },
                })
              }
            />
          </div>
          <div className="mb-3">
            <label className="form-label">Email</label>
            <input
              type="email"
              className="form-control"
              value={house.landlord.email}
              onChange={(e) =>
                setHouse({
                  ...house,
                  landlord: { ...house.landlord, email: e.target.value },
                })
              }
            />
          </div>
          <div className="mb-3">
            <label className="form-label">Cellphone</label>
            <input
              type="text"
              className="form-control"
              value={house.landlord.cellphone}
              onChange={(e) =>
                setHouse({
                  ...house,
                  landlord: { ...house.landlord, cellphone: e.target.value },
                })
              }
            />
          </div>
        </Card.Body>
      </Card>

      <Card className="mb-4 shadow-sm">
        <Card.Header>Facilities</Card.Header>
        <Card.Body>
          <div className="row g-2 align-items-end mb-3">
            <div className="col">
              <label className="form-label">Type</label>
              <select
                className="form-select"
                value={newFacility.type}
                onChange={(e) =>
                  setNewFacility({ ...newFacility, type: e.target.value })
                }
              >
                <option value="">Select Type</option>
                {facilityTypes.map((ft, i) => (
                  <option key={i} value={ft}>
                    {ft}
                  </option>
                ))}
              </select>
            </div>
            <div className="col">
              <label className="form-label">Description</label>
              <input
                type="text"
                className="form-control"
                value={newFacility.description}
                onChange={(e) =>
                  setNewFacility({
                    ...newFacility,
                    description: e.target.value,
                  })
                }
              />
            </div>
            <div className="col">
              <label className="form-label">Quantity</label>
              <input
                type="number"
                className="form-control"
                value={newFacility.quantity}
                onChange={(e) =>
                  setNewFacility({ ...newFacility, quantity: e.target.value })
                }
              />
            </div>
            <div className="col-auto">
              <Button variant="success" onClick={addFacility}>
                + Add
              </Button>
            </div>
          </div>

          {house.facilityList.length > 0 && (
            <Table striped bordered hover responsive>
              <thead>
                <tr>
                  <th>Type</th>
                  <th>Description</th>
                  <th>Quantity</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {house.facilityList.map((f, index) => (
                  <tr key={index}>
                    <td>{f.type}</td>
                    <td>{f.description}</td>
                    <td>{f.quantity}</td>
                    <td>
                      <Button
                        variant="danger"
                        size="sm"
                        onClick={() => removeFacility(index)}
                      >
                        Delete
                      </Button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </Table>
          )}
        </Card.Body>
      </Card>

      <div className="text-center">
        <Button variant="primary" onClick={handleSubmit}>
          Save House
        </Button>
      </div>
    </div>
  );
};

export default AddHouse;
