import React, { useEffect, useState } from 'react';
import './RegistrationForm.css';
import axios from 'axios';

const RegistrationForm = () => {
    const [registrations, setRegistrations] = useState([]);
    const [filteredRegistrations, setFilteredRegistrations] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [statusFilter, setStatusFilter] = useState('All');
    const [showCreateForm, setShowCreateForm] = useState(false);
    const [showSuccessPopup, setShowSuccessPopup] = useState(false);
    const [showErrorPopup, setShowErrorPopup] = useState(false);
    const [users, setUsers] = useState([]); // New state to store users
    const [proctoring, setProctorings] = useState([]);

    // Form data state
    const [formData, setFormData] = useState({
        formId: '',
        userId: '',
        examId: '',
        proctoringID: '',
        status: true,
    });

    // Fetch data from API
    useEffect(() => {
        const fetchRegistrationData = async () => {
            try {
                const response = await axios.get('https://examproctoringmanagement.azurewebsites.net/api/RegistrationForm');
                setRegistrations(response.data);
                setFilteredRegistrations(response.data);
                setLoading(false);
            } catch (err) {
                setError('Error fetching registration data');
                setLoading(false);
            }
        };

        const fetchproctoringsData = async () => {
            try {
                const response = await axios.get('https://examproctoringmanagement.azurewebsites.net/api/ProctoringSchedule'); // Update the URL to your API endpoint
                setProctorings(response.data);
            } catch (err) {
                setError('Error fetching users data');
            }
        };

        const fetchUsersData = async () => {
            try {
                const response = await axios.get('https://examproctoringmanagement.azurewebsites.net/api/Users/all'); // Update the URL to your API endpoint
                setUsers(response.data);
            } catch (err) {
                setError('Error fetching users data');
            }
        };

        fetchRegistrationData();
        fetchUsersData();
        fetchproctoringsData();
    }, []);

    // Handle filter change
    const handleStatusFilterChange = (event) => {
        const selectedStatus = event.target.value;
        setStatusFilter(selectedStatus);
        if (selectedStatus === 'All') {
            setFilteredRegistrations(registrations);
        } else {
            const filtered = registrations.filter(registration =>
                selectedStatus === 'Active' ? registration.status === true : registration.status === false
            );
            setFilteredRegistrations(filtered);
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

    // Handle form submission to create or update a registration
    const handleSubmit = async (e) => {
        e.preventDefault();

        const formattedData = {
            ...formData,
            status: formData.status === 'true' || formData.status === true,
        };

        try {
            let response;
            if (formData.formId) {
                // Update existing registration (using PUT and the new /update endpoint)
                response = await axios.put(
                    'https://examproctoringmanagement.azurewebsites.net/api/RegistrationForm/update',
                    formattedData,
                    {
                        headers: {
                            'Content-Type': 'application/json',
                        },
                    }
                );
            } else {
                // Create new registration (using POST)
                response = await axios.post(
                    'https://examproctoringmanagement.azurewebsites.net/api/RegistrationForm/create',
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

            // Add or update the registration in the list
            if (formData.formId) {
                setRegistrations(prevState => prevState.map(item =>
                    item.formId === formData.formId ? response.data : item
                ));
                setFilteredRegistrations(prevState => prevState.map(item =>
                    item.formId === formData.formId ? response.data : item
                ));
            } else {
                setRegistrations(prevState => [...prevState, response.data]);
                setFilteredRegistrations(prevState => [...prevState, response.data]);
            }

            // Reset form data
            setFormData({
                formId: '',
                userId: '',
                examId: '',
                proctoringID: '',
                status: true,
            });

            setShowCreateForm(false);
        } catch (err) {
            setError('Failed to create or update Registration.');
            setShowErrorPopup(true);
        }
    };

    const handleDelete = async (formId) => {
        if (window.confirm("Are you sure you want to delete this registration?")) {
            try {
                const response = await axios.delete(
                    `https://examproctoringmanagement.azurewebsites.net/api/RegistrationForm/${formId}`
                );

                if (response.status === 200) {
                    setRegistrations((prevState) =>
                        prevState.filter((registration) => registration.formId !== formId)
                    );
                    setFilteredRegistrations((prevState) =>
                        prevState.filter((registration) => registration.formId !== formId)
                    );

                    alert("Registration deleted successfully!");
                }
            } catch (err) {
                console.error("Error deleting registration:", err);
                alert("Failed to delete the registration. Please try again.");
            }
        }
    };

    // Handle editing a registration
    const handleEdit = (registration) => {
        setFormData({
            formId: registration.formId,
            userId: registration.userId,
            examId: registration.examId,
            proctoringID: registration.proctoringID,
            status: registration.status,
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
        <div className="registrations-container">
            <h2>Registration Form List</h2>

            <button onClick={() => setShowCreateForm(true)} className="create-registration-btn">
                Create Registration
            </button>

            {showCreateForm && (
                <div className="popup">
                    <div className="popup-content">
                        <h3>{formData.formId ? 'Edit Registration' : 'Create Registration'}</h3>
                        <form onSubmit={handleSubmit}>
                            <label>
                                Form ID:
                                <input
                                    type="text"
                                    name="formId"
                                    value={formData.formId}
                                    onChange={handleChange}
                                    required
                                    disabled={formData.formId !== ''}
                                />
                            </label>
                            <label>
                                User ID:
                                <select
                                    name="userId"
                                    value={formData.userId}
                                    onChange={handleChange}
                                    required
                                >
                                    <option value="">Select User</option>
                                    {users.map(user => (
                                        <option key={user.userId} value={user.userId}>
                                            {user.fullName} - {user.userId}
                                        </option>
                                    ))}
                                </select>
                            </label>

                            <label>
                                Proctoring ID:
                                <select
                                    name="proctoringID"
                                    value={formData.proctoringID}
                                    onChange={handleChange}
                                    required
                                >
                                    <option value="">Chọn một lịch giám thị</option>
                                    {proctoring.map(schedule => (
                                        <option key={schedule.scheduleId} value={schedule.scheduleId}>
                                            {schedule.proctorType} - {schedule.scheduleId}
                                        </option>
                                    ))}
                                </select>
                            </label>

                            <label>Status:
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

                            <button type="submit" className="create-btn">
                                {formData.formId ? 'Update Registration' : 'Create Registration'}
                            </button>
                            <button
                                type="button"
                                className="cancel-btn"
                                onClick={() => setShowCreateForm(false)}
                            >
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
                            <p>Registration form {formData.formId ? 'updated' : 'created'} successfully!</p>
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
                            <p>Failed to {formData.formId ? 'update' : 'create'} Registration form. Please try again.</p>
                            <button onClick={closeErrorModal}>Close</button>
                        </div>
                    </div>
                </div>
            )}

            {/* Registration Table */}
            <div className="filter">
                <label>
                    Status Filter:
                    <select value={statusFilter} onChange={handleStatusFilterChange}>
                        <option value="All">All</option>
                        <option value="Active">Active</option>
                        <option value="Inactive">Inactive</option>
                    </select>
                </label>
            </div>

            <table className="proctorings-table">
                <thead>
                    <tr>
                        <th>Form ID</th>
                        <th>User ID</th>
                        <th>Proctoring ID</th>
                        <th>Status</th>
                        <th>Actions</th>
                    </tr>
                </thead>
                <tbody>
                    {filteredRegistrations.map((registration) => (
                        <tr key={registration.formId}>
                            <td>{registration.formId}</td>
                            <td>{registration.userId}</td>
                            <td>{registration.proctoringID}</td>
                            <td>{registration.status ? 'Active' : 'Inactive'}</td>
                            <td>
                                <button onClick={() => handleEdit(registration)}>Edit</button>
                            </td>
                        </tr>
                    ))}
                </tbody>

            </table>
        </div>
    );
};

export default RegistrationForm;
