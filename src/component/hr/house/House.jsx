import { useEffect } from "react";
import { Button, Table } from "react-bootstrap";
import { useDispatch, useSelector } from "react-redux";
import { selectHouseList } from "../../../redux/hr/house/house.selector";
import { getHouseListThunk } from "../../../redux/hr/house/house.thunk";
import "./House.css";

const House = () => {
  const dispatch = useDispatch();
  useEffect(() => {
    dispatch(getHouseListThunk());
  }, [dispatch]);

  let data = [];

  const response = useSelector(selectHouseList) || [];
  data = response.data || [];

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
            className="btn-view mr-1"
            variant="info"
            // onClick={(id, username, email, gender, phot) =>
            //   this.handleView(
            //     data.id,
            //     data.username,
            //     data.gender,
            //     data.email,
            //     data.photo
            //   )
            // }
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
            // onClick={(id) => this.handleDelete(data.id)}
          >
            Delete
          </Button>
        </td>
      </tr>
    </tbody>
  ));

  return (
    <div className="container text-center">
      <h2 className="header">Housing management</h2>
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
