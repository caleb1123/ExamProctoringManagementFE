import React, { useEffect, useState } from 'react';
import './ProtoringSchedule.css';
import axios from 'axios';

const ProtoringSchedule = () => {
    const [proctorings, setProctorings] = useState([]);
    const [filteredProctorings, setFilteredProctorings] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [statusFilter, setStatusFilter] = useState('All');
    const [showCreateForm, setShowCreateForm] = useState(false);
    const [showSuccessPopup, setShowSuccessPopup] = useState(false);
    const [showErrorPopup, setShowErrorPopup] = useState(false);

    // Form data state
    const [formData, setFormData] = useState({
        scheduleId: '',
        userId: '',
        proctorType: '',
        slotReferenceId: '',
        count: 0,
        isFinished: false,
        status: true,
    });

    // Fetch data from API
    useEffect(() => {
        const fetchProctoringData = async () => {
            try {
                const response = await axios.get('https://examproctoringmanagement.azurewebsites.net/api/ProctoringSchedule');
                setProctorings(response.data);
                setFilteredProctorings(response.data);
                setLoading(false);
            } catch (err) {
                setError('Error fetching data');
                setLoading(false);
            }
        };
        fetchProctoringData();
    }, []);

    // Handle filter change
    const handleStatusFilterChange = (event) => {
        const selectedStatus = event.target.value;
        setStatusFilter(selectedStatus);
        if (selectedStatus === 'All') {
            setFilteredProctorings(proctorings);
        } else {
            const filtered = proctorings.filter(proctoring =>
                selectedStatus === 'Active' ? proctoring.status === true : proctoring.status === false
            );
            setFilteredProctorings(filtered);
        }
    };

    // Handle form input changes
    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData(prevData => ({
            ...prevData,
            [name]: value,
        }));
    };

    // Handle form submission to create or update a schedule
    const handleSubmit = async (e) => {
        e.preventDefault();

        const formattedData = {
            ...formData,
            count: parseInt(formData.count, 10), // Ensure count is an integer
            status: formData.status === 'true' || formData.status === true,
            isFinished: formData.isFinished === 'true' || formData.isFinished === true,
        };

        try {
            let response;
            if (formData.scheduleId) {
                // Update existing schedule (using PUT and the new /update endpoint)
                response = await axios.put(
                    'https://examproctoringmanagement.azurewebsites.net/api/ProctoringSchedule/update', // Updated endpoint
                    formattedData,
                    {
                        headers: {
                            'Content-Type': 'application/json',
                        },
                    }
                );
            } else {
                // Create new schedule (using POST)
                response = await axios.post(
                    'https://examproctoringmanagement.azurewebsites.net/api/ProctoringSchedule',
                    formattedData,
                    {
                        headers: {
                            'Content-Type': 'application/json',
                        },
                    }
                );
            }
            
            // Show success message
            setShowSuccessPopup(true);

            // Add or update the proctoring in the list
            if (formData.scheduleId) {
                setProctorings(prevState => prevState.map(item =>
                    item.scheduleId === formData.scheduleId ? response.data : item
                ));
                setFilteredProctorings(prevState => prevState.map(item =>
                    item.scheduleId === formData.scheduleId ? response.data : item
                ));
            } else {
                setProctorings(prevState => [...prevState, response.data]);
                setFilteredProctorings(prevState => [...prevState, response.data]);
            }

            // Reset form data
            setFormData({
                scheduleId: '',
                userId: '',
                proctorType: '',
                slotReferenceId: '',
                count: 0,
                isFinished: false,
                status: true,
            });

            setShowCreateForm(false);
        } catch (err) {
            setError('Failed to create or update Proctoring.');
            setShowErrorPopup(true);
        }
    };

    const handleDelete = async (scheduleId) => {
        // Confirm the deletion action
        if (window.confirm("Are you sure you want to delete this schedule?")) {
            try {
                // Sending the DELETE request to the API with the provided scheduleId
                const response = await axios.delete(
                    `https://examproctoringmanagement.azurewebsites.net/api/ProctoringSchedule/${scheduleId}`
                );
    
                // Check if the deletion was successful based on the response
                if (response.status === 200) {
                    // Remove the deleted proctoring from the state
                    setProctorings((prevState) =>
                        prevState.filter((proctoring) => proctoring.scheduleId !== scheduleId)
                    );
                    setFilteredProctorings((prevState) =>
                        prevState.filter((proctoring) => proctoring.scheduleId !== scheduleId)
                    );
    
                    // Optional: Show a success alert or popup
                    alert("Proctoring schedule deleted successfully!");
                }
            } catch (err) {
                // Handle any errors that occur during the deletion
                console.error("Error deleting schedule:", err);
                alert("Failed to delete the proctoring schedule. Please try again.");
            }
        }
    };

    // Handle editing a proctoring schedule
    const handleEdit = (proctoring) => {
        setFormData({
            scheduleId: proctoring.scheduleId,
            userId: proctoring.userId,
            proctorType: proctoring.proctorType,
            slotReferenceId: proctoring.slotReferenceId,
            count: proctoring.count,
            isFinished: proctoring.isFinished,
            status: proctoring.status,
        });
        setShowCreateForm(true);
    };

    // Close success popup
    const closeSuccessModal = () => setShowSuccessPopup(false);

    // Close error popup
    const closeErrorModal = () => setShowErrorPopup(false);

    if (loading) return <div className="loading">Loading...</div>;
    if (error) return <div className="error">{error}</div>;

    return (
        <div className="proctorings-container">
            <h2>Proctoring Schedule List</h2>

            <button onClick={() => setShowCreateForm(true)} className="create-exam-btn">
                Create Exam
            </button>

            {showCreateForm && (
                <div className="popup">
                    <div className="popup-content">
                        <h3>{formData.scheduleId ? 'Edit Exam' : 'Create Exam'}</h3>
                        <form onSubmit={handleSubmit}>
                            {/* Form Fields */}
                            <label>
                                Schedule ID:
                                <input
                                    type="text"
                                    name="scheduleId"
                                    value={formData.scheduleId}
                                    onChange={handleChange}
                                    required
                                    disabled={formData.scheduleId !== ''}  // Disable if scheduleId is set (edit mode)
                                />
                            </label>
                            <label>
                                User ID:
                                <input
                                    type="text"
                                    name="userId"
                                    value={formData.userId}
                                    onChange={handleChange}
                                    required
                                />
                            </label>
                            <label>
                                Proctor Type:
                                <input
                                    type="text"
                                    name="proctorType"
                                    value={formData.proctorType}
                                    onChange={handleChange}
                                    required
                                />
                            </label>
                            <label>
                                Slot Reference ID:
                                <input
                                    type="text"
                                    name="slotReferenceId"
                                    value={formData.slotReferenceId}
                                    onChange={handleChange}
                                    required
                                />
                            </label>
                            <label>
                                Count:
                                <input
                                    type="number"
                                    name="count"
                                    value={formData.count}
                                    onChange={handleChange}
                                    required
                                />
                            </label>
                            <label>
                                Is Finished:
                                <input
                                    type="checkbox"
                                    name="isFinished"
                                    checked={formData.isFinished}
                                    onChange={() => setFormData(prevData => ({ ...prevData, isFinished: !prevData.isFinished }))}
                                />
                            </label>
                            <label>
                                Status:
                                <select
                                    name="status"
                                    value={formData.status}
                                    onChange={handleChange}
                                    required
                                >
                                    <option value={true}>Active</option>
                                    <option value={false}>Inactive</option>
                                </select>
                            </label>

                            <button type="submit" className="create-btn">{formData.scheduleId ? 'Update Exam' : 'Create Exam'}</button>
                            <button type="button" onClick={() => setShowCreateForm(false)} className="cancel-btn">
                                Cancel
                            </button>
                        </form>
                    </div>
                </div>
            )}

            {/* Success Popup */}
            {showSuccessPopup && (
                <div className="popup">
                    <div className="popup-content">
                        <div className="success-popup">
                            <p>Proctoring exam {formData.scheduleId ? 'updated' : 'created'} successfully!</p>
                            <button onClick={closeSuccessModal}>Close</button>
                        </div>
                    </div>
                </div>
            )}

            {/* Error Popup */}
            {showErrorPopup && (
                <div className="popup">
                    <div className="popup-content">
                        <div className="error-popup">
                            <p>Failed to create or update Proctoring.</p>
                            <button onClick={closeErrorModal}>Close</button>
                        </div>
                    </div>
                </div>
            )}

            <div>
                <label>Filter by status: </label>
                <select onChange={handleStatusFilterChange} value={statusFilter}>
                    <option value="All">All</option>
                    <option value="Active">Active</option>
                    <option value="Inactive">Inactive</option>
                </select>
            </div>

            <table className="proctorings-table">
                <thead>
                    <tr>
                        <th>Schedule ID</th>
                        <th>User ID</th>
                        <th>Proctor Type</th>
                        <th>Slot Reference ID</th>
                        <th>Status</th>
                        <th>Is Finished</th>
                        <th>Count</th>
                        <th>Actions</th>
                    </tr>
                </thead>
                <tbody>
                    {filteredProctorings.map(proctoring => (
                        <tr key={proctoring.scheduleId}>
                            <td>{proctoring.scheduleId}</td>
                            <td>{proctoring.userId}</td>
                            <td>{proctoring.proctorType}</td>
                            <td>{proctoring.slotReferenceId}</td>
                            <td>{proctoring.status ? 'Active' : 'Inactive'}</td>
                            <td>{proctoring.isFinished ? 'Yes' : 'No'}</td>
                            <td>{proctoring.count}</td>
                            <button onClick={() => handleEdit(proctoring)} className="edit-btn">
                        Edit
                    </button>
                    <button onClick={() => handleDelete(proctoring.scheduleId)} className="delete-btn">
                        Delete
                    </button>
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    );
};

export default ProtoringSchedule;
