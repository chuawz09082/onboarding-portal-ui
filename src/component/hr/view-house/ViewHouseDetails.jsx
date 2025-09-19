// src/pages/hr/house/ViewHouse.jsx
import { useEffect, useState } from "react";
import {
  Button,
  Card,
  ListGroup,
  Modal,
  Pagination,
  Table,
} from "react-bootstrap";
import { useDispatch, useSelector } from "react-redux";
import { useParams } from "react-router-dom";
import { selectFacilityReport } from "../../../redux/hr/facility-report/facility-report.selector";
import {
  addCommentThunk,
  getFacilityReportByIdThunk,
  getFacilityReportsThunk,
  updateCommentThunk,
} from "../../../redux/hr/facility-report/facility-report.thunk";
import {
  selectEmployeesByHouseId,
  selectHouseById,
} from "../../../redux/hr/house/house.selector";
import {
  getEmployeeByHouseIdThunk,
  getHouseByIdThunk,
} from "../../../redux/hr/house/house.thunk";

import { selectEmployeeReportData } from "../../../redux/employee/personal-info/personal-info.selector";
import { getPersonalInfoByIdsThunk } from "../../../redux/employee/personal-info/personal-info.thunk";

const ITEMS_PER_PAGE = 3;

const ViewHouse = () => {
  const { id } = useParams();
  const dispatch = useDispatch();
  const house = useSelector(selectHouseById);
  const facilityReportList = useSelector(selectFacilityReport);

  const employees = useSelector(selectEmployeesByHouseId);

  const [currentPage, setCurrentPage] = useState(1);
  const [selectedReport, setSelectedReport] = useState(null);

  const employeesReportData = useSelector(selectEmployeeReportData);

  useEffect(() => {
    if (employeesReportData.length > 0 && selectedReport) {
      setSelectedReport((prev) => ({
        ...prev,
        employeesData: employeesReportData,
      }));
    }
  }, [employeesReportData]);

  useEffect(() => {
    // Fetch house details
    dispatch(getHouseByIdThunk(id)).then((res) => {
      // After house fetched, fetch facility reports
      if (res.payload?.facilityList) {
        res.payload.facilityList.forEach((facility) => {
          dispatch(getFacilityReportsThunk(facility.id));
        });
      }
    });
    dispatch(getEmployeeByHouseIdThunk(id));
  }, [dispatch, id]);

  if (!house) {
    return <p>Loading house details...</p>;
  }

  const facilityCounts = { Bed: 0, Mattress: 0, Table: 0, Chair: 0 };
  house.facilityList?.forEach((facility) => {
    if (facility.type in facilityCounts) {
      facilityCounts[facility.type] += facility.quantity;
    }
  });

  const sortedReports = [...(facilityReportList || [])].sort(
    (a, b) => new Date(b.createdDate) - new Date(a.createdDate)
  );

  const startIndex = (currentPage - 1) * ITEMS_PER_PAGE;
  const paginatedReports = sortedReports.slice(
    startIndex,
    startIndex + ITEMS_PER_PAGE
  );

  const totalPages = Math.ceil(sortedReports.length / ITEMS_PER_PAGE);

  const handleViewReport = (reportId) => {
    dispatch(getFacilityReportByIdThunk(reportId))
      .unwrap()
      .then((report) => {
        const employeeIds = report.data.facilityReportDetailsResponseList?.map(
          (detail) => detail.employeeId
        );
        dispatch(getPersonalInfoByIdsThunk(employeeIds))
          .unwrap()
          .then((employeeData) => {
            setSelectedReport((prev) => ({
              ...report.data,
              employeeData: employeeData,
            }));
          });
      })
      .catch((err) => {
        console.error("Failed to fetch report details:", err);
      });
  };

  const [newComment, setNewComment] = useState("");
  const [editingComment, setEditingComment] = useState(null);

  const [showEditModal, setShowEditModal] = useState(false);
  const [commentToEdit, setCommentToEdit] = useState(null);

  return (
    <div className="container mt-4">
      {/* Basic House Info */}
      <Card className="mb-4">
        <Card.Header>
          <h3>Basic House Information</h3>
        </Card.Header>
        <Card.Body>
          <ListGroup variant="flush">
            <ListGroup.Item>
              <strong>Address:</strong> {house.address}
            </ListGroup.Item>
            <ListGroup.Item>
              <strong>Number of People:</strong> {house.maxOccupant}
            </ListGroup.Item>
            {house.landlord && (
              <>
                <h5 className="mt-3">Landlord</h5>
                <ListGroup.Item>
                  <strong>Name:</strong> {house.landlord.firstName}{" "}
                  {house.landlord.lastName}
                </ListGroup.Item>
                <ListGroup.Item>
                  <strong>Email:</strong> {house.landlord.email}
                </ListGroup.Item>
                <ListGroup.Item>
                  <strong>Phone:</strong> {house.landlord.cellphone}
                </ListGroup.Item>
              </>
            )}
          </ListGroup>
        </Card.Body>
      </Card>
      {/* Employee Information List */}
      <Card className="mb-4">
        <Card.Header>
          <h3>Employee Information</h3>
        </Card.Header>
        <Card.Body>
          {/* {{house.employe}} */}
          {employees && employees.length > 0 ? (
            <Table striped bordered hover>
              <thead>
                <tr>
                  <th>Name</th>
                  <th>Phone</th>
                  <th>Email</th>
                </tr>
              </thead>
              <tbody>
                {employees.map((emp) => (
                  <tr
                    key={emp.id}
                    style={{ cursor: "pointer" }}
                    onClick={() =>
                      // navigate to employee profile page (adjust route as needed)
                      (window.location.href = `/hr/employee/${emp.employeeId}`)
                    }
                  >
                    <td>{emp.preferredName || emp.firstName}</td>
                    <td>{emp.phone}</td>
                    <td>{emp.email}</td>
                  </tr>
                ))}
              </tbody>
            </Table>
          ) : (
            <p>No employees assigned to this house.</p>
          )}
        </Card.Body>
      </Card>

      {/* Facility Info */}
      <Card className="mb-4">
        <Card.Header>
          <h3>Facility Information</h3>
        </Card.Header>
        <Card.Body>
          <ListGroup variant="flush">
            <ListGroup.Item>
              <strong>Number of Beds:</strong> {facilityCounts.Bed}
            </ListGroup.Item>
            <ListGroup.Item>
              <strong>Number of Mattresses:</strong> {facilityCounts.Mattress}
            </ListGroup.Item>
            <ListGroup.Item>
              <strong>Number of Tables:</strong> {facilityCounts.Table}
            </ListGroup.Item>
            <ListGroup.Item>
              <strong>Number of Chairs:</strong> {facilityCounts.Chair}
            </ListGroup.Item>
          </ListGroup>
        </Card.Body>
      </Card>

      {/* Facility Report List */}
      <Card className="mb-4">
        <Card.Header>
          <h3>Facility Reports</h3>
        </Card.Header>
        <Card.Body>
          {paginatedReports.length > 0 ? (
            <>
              <Table striped bordered hover>
                <thead>
                  <tr>
                    <th>Title</th>
                    <th>Date</th>
                    <th>Status</th>
                    <th>Action</th>
                  </tr>
                </thead>
                <tbody>
                  {paginatedReports.map((report, idx) => (
                    <tr key={`${report.id}-${idx}`}>
                      <td>{report.title}</td>
                      <td>
                        {new Date(report.createdDate).toLocaleDateString()}
                      </td>
                      <td>{report.status}</td>
                      <td>
                        <Button
                          size="sm"
                          variant="info"
                          onClick={() => handleViewReport(report.id)}
                        >
                          View
                        </Button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </Table>

              {/* Pagination */}
              <Pagination>
                {Array.from({ length: totalPages }, (_, idx) => (
                  <Pagination.Item
                    key={idx + 1}
                    active={idx + 1 === currentPage}
                    onClick={() => setCurrentPage(idx + 1)}
                  >
                    {idx + 1}
                  </Pagination.Item>
                ))}
              </Pagination>
            </>
          ) : (
            <p>No facility reports available.</p>
          )}
        </Card.Body>
      </Card>

      {/* Report Modal */}
      <Modal
        show={!!selectedReport}
        onHide={() => setSelectedReport(null)}
        size="lg"
      >
        <Modal.Header closeButton>
          <Modal.Title>{selectedReport?.title}</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          {selectedReport && (
            <>
              <p>
                <strong>Description:</strong> {selectedReport.description}
              </p>
              <p>
                <strong>Created By:</strong> {selectedReport.createdBy}
              </p>
              <p>
                <strong>Report Date:</strong>{" "}
                {new Date(selectedReport.createdDate).toLocaleString()}
              </p>
              <p>
                <strong>Status:</strong> {selectedReport.status}
              </p>

              {selectedReport.facilityReportDetailsResponseList?.length > 0 && (
                <>
                  <h5>Comments</h5>
                  <ListGroup>
                    {selectedReport.facilityReportDetailsResponseList.map(
                      (c, idx) => (
                        <ListGroup.Item key={`${c.id || idx}-${idx}`}>
                          <p>{c.comment}</p>
                          <small>
                            By{" "}
                            {selectedReport.employeeData?.find(
                              (e) => e.employeeId == c.employeeId
                            )?.preferredName ||
                              selectedReport.employeeData?.find(
                                (e) => e.employeeId == c.employeeId
                              )?.firstName +
                                selectedReport.employeeData?.find(
                                  (e) => e.employeeId == c.employeeId
                                )?.lastName ||
                              "Unknown"}{" "}
                            on{" "}
                            {new Date(
                              c.lastModificationDate || c.createDate
                            ).toLocaleString()}
                          </small>
                          <Button
                            size="sm"
                            variant="warning"
                            className="ms-2"
                            onClick={() => {
                              setCommentToEdit(c);
                              setShowEditModal(true);
                            }}
                          >
                            Edit
                          </Button>
                        </ListGroup.Item>
                      )
                    )}
                  </ListGroup>
                </>
              )}
              <div className="mt-3">
                <h5>{editingComment ? "Edit Comment" : "Add Comment"}</h5>
                <textarea
                  className="form-control mb-2"
                  rows={3}
                  value={
                    editingComment ? editingComment.description : newComment
                  }
                  onChange={(e) =>
                    editingComment
                      ? setEditingComment({
                          ...editingComment,
                          description: e.target.value,
                        })
                      : setNewComment(e.target.value)
                  }
                />
                <Button
                  variant="primary"
                  onClick={() => {
                    if (editingComment) {
                      dispatch(
                        updateCommentThunk({
                          reportId: selectedReport.id,
                          commentId: editingComment.id,
                          comment: editingComment.comment,
                        })
                      ).then(() => {
                        setEditingComment(null);
                        handleViewReport(selectedReport.id);
                        // dispatch(getFacilityReportByIdThunk(selectedReport.id))
                      });
                    } else {
                      dispatch(
                        addCommentThunk({
                          reportId: selectedReport.id,
                          comment: newComment,
                        })
                      ).then(() => {
                        setNewComment("");
                        handleViewReport(selectedReport.id);
                        // dispatch(getFacilityReportByIdThunk(selectedReport.id)); // refresh report
                      });
                    }
                  }}
                >
                  {editingComment ? "Update" : "Submit"}
                </Button>
                {editingComment && (
                  <Button
                    variant="secondary"
                    className="ms-2"
                    onClick={() => setEditingComment(null)}
                  >
                    Cancel
                  </Button>
                )}
              </div>
            </>
          )}
        </Modal.Body>
      </Modal>
      <Modal
        show={showEditModal}
        onHide={() => {
          setShowEditModal(false);
          setCommentToEdit(null);
        }}
      >
        <Modal.Header closeButton>
          <Modal.Title>Edit Comment</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <textarea
            className="form-control mb-2"
            rows={3}
            value={commentToEdit?.comment || ""}
            onChange={(e) =>
              setCommentToEdit({
                ...commentToEdit,
                comment: e.target.value,
              })
            }
          />
        </Modal.Body>
        <Modal.Footer>
          <Button
            variant="secondary"
            onClick={() => {
              setShowEditModal(false);
              setCommentToEdit(null);
            }}
          >
            Cancel
          </Button>
          <Button
            variant="primary"
            onClick={() => {
              if (commentToEdit) {
                dispatch(
                  updateCommentThunk({
                    reportId: selectedReport.id,
                    commentId: commentToEdit.id,
                    comment: commentToEdit.comment,
                  })
                ).then(() => {
                  setShowEditModal(false);
                  setCommentToEdit(null);
                  handleViewReport(selectedReport.id);
                });
              }
            }}
          >
            Save
          </Button>
        </Modal.Footer>
      </Modal>
    </div>
  );
};

export default ViewHouse;
