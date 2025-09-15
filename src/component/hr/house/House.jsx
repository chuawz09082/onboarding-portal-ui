import { useEffect } from "react";
import { Button, Table } from "react-bootstrap";
import { useDispatch, useSelector } from "react-redux";
import { Link } from "react-router-dom";
import { selectHouseList } from "../../../redux/hr/house/house.selector";
import {
  deleteHouseThunk,
  getHouseListThunk,
} from "../../../redux/hr/house/house.thunk";
import "./House.css";

const House = () => {
  const dispatch = useDispatch();
  useEffect(() => {
    dispatch(getHouseListThunk());
  }, [dispatch]);

  let data = [];

  const response = useSelector(selectHouseList) || [];
  data = response.data || [];

  const handleDelete = (id) => {
    dispatch(deleteHouseThunk(id)).then(() => {
      alert("House deleted successfully!");
      dispatch(getHouseListThunk());
    });
  };

  const body = data.map((data) => (
    <tbody key={data.id}>
      <tr>
        <td className="col-style">{data.id}</td>
        <td className="col-style">{data.address}</td>
        <td className="col-style">{data.maxOccupant}</td>
        <td className="col-style">
          {data.landlord.firstName + " " + data.landlord.lastName}
        </td>
        <td className="col-style">{data.landlord.cellphone}</td>
        <td className="col-style">{data.landlord.email}</td>

        <td
          style={{
            textAlign: "center",
            maxWidth: "30%",
            verticalAlign: "middle",
          }}
        >
          <Button
            as={Link}
            to={`/house/${data.id}`}
            className="btn-view mr-1"
            variant="info"
          >
            View
          </Button>

          <Button
            className="btn-edit mr-1"
            variant="warning"
            // onClick={(id, username, gender, password, email, photo) =>
            //   this.handleUpdate(
            //     data.id,
            //     data.username,
            //     data.gender,
            //     data.password,
            //     data.email,
            //     data.photo
            //   )
            // }
          >
            Edit
          </Button>

          <Button
            className="btn-delete mr-1"
            variant="danger"
            onClick={() => handleDelete(data.id)}
          >
            Delete
          </Button>
        </td>
      </tr>
    </tbody>
  ));

  return (
    <div className="container">
      <h2 className="header text-center">Housing management</h2>
      <Button
        as={Link}
        to={"/add-house"}
        className="btn-primary mr-1"
        style={{ tectAlign: "left !important" }}
      >
        Add House
      </Button>
      <Table className="mt-4 ">
        <thead className="table-dark">
          <tr>
            <th>#</th>
            <th>Address</th>
            <th>Number of Employees</th>
            <th>Landlord Full Name</th>
            <th>Landlord Phone</th>
            <th>Landlord Email</th>
            <th>Actions</th>
          </tr>
        </thead>
        {body}
      </Table>
    </div>
  );
};

export default House;
