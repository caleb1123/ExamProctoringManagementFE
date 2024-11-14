import React, { useEffect, useState } from 'react';
import './RegistrationForm.css';
import axios from 'axios';

const RegistrationForm = () => {
    const [registrations, setRegistrations] = useState([]);
    const [filteredRegistrations, setFilteredRegistrations] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [statusFilter, setStatusFilter] = useState('All');
    const [showSuccessPopup, setShowSuccessPopup] = useState(false);
    const [showErrorPopup, setShowErrorPopup] = useState(false);

    // Form data state
    const [formData, setFormData] = useState({
        formId: '',
        userId: '',
        examId: '',
        scheduleID: '',
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
        
        fetchRegistrationData();
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

    // Handle form submission to create or update a registration
    const handleSubmit = async (e,formId) => {
        e.preventDefault();

        const formattedData = {
            formId: formId,
            status: true
        };

        try {
            const response = await axios.put(
                'https://examproctoringmanagement.azurewebsites.net/api/RegistrationForm/update',
                formattedData,
                {
                    headers: {
                        'Content-Type': 'application/json',
                    },
                }
            );

            // Show success message
            setShowSuccessPopup(true);
            fetchRegistrationData();
            // Update the registrations and filteredRegistrations state
            setRegistrations((prevRegistrations) =>
                prevRegistrations.map((item) =>
                    item.formId === formData.formId ? response.data : item
                )
            );

            setFilteredRegistrations((prevFiltered) =>
                prevFiltered.map((item) =>
                    item.formId === formData.formId ? response.data : item
                )
            );

            // Reset form data
            setFormData({
                formId: '',
                userId: '',
                examId: '',
                proctoringID: '',
                status: true,
            });

        } catch (err) {
            setError('Failed to update Registration.');
            setShowErrorPopup(true);
        }
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
                            <td>{registration.scheduleID}</td>
                            <td>{registration.status ? 'Active' : 'Inactive'}</td>
                            <td>
                                <button onClick={(e) => {
                                
                                handleSubmit(e,registration.formId);
                            }
                                }>Edit</button>
                            </td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    );
};

export default RegistrationForm;
