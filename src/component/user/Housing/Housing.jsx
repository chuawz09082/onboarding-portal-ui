import { useState } from "react";
import { Button, Card, ListGroup, Modal, Table } from "react-bootstrap";
import { useSelector } from "react-redux";
import {
  selectEmployeesByHouseId,
  selectHouseById,
} from "../../../redux/hr/house/house.selector";

import { useEffect } from "react";
import { Pagination } from "react-bootstrap";
import { useDispatch } from "react-redux";
import { selectFacilityReport } from "../../../redux/hr/facility-report/facility-report.selector";
import {
  addCommentThunk,
  getFacilityReportByIdThunk,
  getFacilityReportsThunk,
  updateCommentThunk,
} from "../../../redux/hr/facility-report/facility-report.thunk";
import {
  getEmployeeByHouseIdThunk,
  getHouseByIdThunk,
} from "../../../redux/hr/house/house.thunk";
const ITEMS_PER_PAGE = 3;
const Housing = () => {
  const dispatch = useDispatch();
  const house = useSelector(selectHouseById);
  const employees = useSelector(selectEmployeesByHouseId);
  const facilityReportList = useSelector(selectFacilityReport);

  const [showNewReportModal, setShowNewReportModal] = useState(false);
  const [newReport, setNewReport] = useState({ title: "", description: "" });

  useEffect(() => {
    const employeeId = 1; // Replace with actual employee ID
    const houseId = 7;
    dispatch(getHouseByIdThunk(houseId)).then((res) => {
      // After house fetched, fetch facility reports
      if (res.payload?.facilityList) {
        res.payload.facilityList.forEach((facility) => {
          dispatch(getFacilityReportsThunk(facility.id));
        });
      }
    });
    dispatch(getEmployeeByHouseIdThunk(houseId));
  }, [dispatch]);
  if (!house) {
    return <div>Loading...</div>;
  }
  const [currentPage, setCurrentPage] = useState(1);

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
        setSelectedReport(report.data);
      })
      .catch((err) => {
        console.error("Failed to fetch report details:", err);
      });
  };

  const [selectedReport, setSelectedReport] = useState(null);
  const [newComment, setNewComment] = useState("");
  const [editingComment, setEditingComment] = useState(null);

  const [showEditModal, setShowEditModal] = useState(false);
  const [commentToEdit, setCommentToEdit] = useState(null);

  return (
    <div className="container mt-4">
      <Card className="mb-4">
        <Card.Header>
          <h3>House Information</h3>
        </Card.Header>
        <Card.Body>
          <ListGroup variant="flush">
            <ListGroup.Item>
              <strong>Address:</strong> {house.address}
            </ListGroup.Item>
            <ListGroup.Item>
              <strong>Employees:</strong>
              {employees && employees.length > 0 ? (
                <Table striped bordered hover className="mt-3">
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
                          (window.location.href = `/employee/${emp.employeeId}`)
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
            </ListGroup.Item>
          </ListGroup>
        </Card.Body>
      </Card>
      <Card className="mb-4">
        <Card.Header>
          <h3>Facility Reports</h3>
        </Card.Header>
        <Card.Body>
          <Button
            className="mb-3"
            variant="primary"
            onClick={() => setShowNewReportModal(true)}
          >
            + Create New Report
          </Button>

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
      <Modal
        show={showNewReportModal}
        onHide={() => {
          setShowNewReportModal(false);
          setNewReport({ title: "", description: "" });
        }}
      >
        <Modal.Header closeButton>
          <Modal.Title>New Facility Report</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <input
            type="text"
            className="form-control mb-2"
            placeholder="Report Title"
            value={newReport.title}
            onChange={(e) =>
              setNewReport({ ...newReport, title: e.target.value })
            }
          />
          <textarea
            className="form-control"
            rows={4}
            placeholder="Describe the issue..."
            value={newReport.description}
            onChange={(e) =>
              setNewReport({ ...newReport, description: e.target.value })
            }
          />
        </Modal.Body>
        <Modal.Footer>
          <Button
            variant="secondary"
            onClick={() => {
              setShowNewReportModal(false);
              setNewReport({ title: "", description: "" });
            }}
          >
            Cancel
          </Button>
          <Button
            variant="primary"
            onClick={() => {
              dispatch(
                createFacilityReportThunk({
                  houseId: house.id,
                  title: newReport.title,
                  description: newReport.description,
                })
              ).then(() => {
                setShowNewReportModal(false);
                setNewReport({ title: "", description: "" });
                // refresh reports
                dispatch(getFacilityReportsByHouseIdThunk(house.id));
              });
            }}
          >
            Submit
          </Button>
        </Modal.Footer>
      </Modal>
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
                            By {c.employeeId} on{" "}
                            {new Date(
                              c.lastModificationDate || c.createDate
                            ).toLocaleString()}
                          </small>
                          <Button
                            size="sm"
                            variant="warning"
                            className="ms-2"
                            onClick={() => {
                              if (c.employeeId !== 1) {
                                alert("You can only edit your own comments.");
                                return;
                              }
                              setCommentToEdit(c);
                              setShowEditModal(true);
                            }}
                            hidden={c.employeeId !== 1} // Assuming current user ID is 1
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

export default Housing;
