import React, { useState, useEffect } from 'react';
import './Semesters.css'; // Import CSS file for styling

const Semesters = () => {
    const [semesters, setSemesters] = useState([]);
    const [filteredSemesters, setFilteredSemesters] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [statusFilter, setStatusFilter] = useState('All');
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [isEditMode, setIsEditMode] = useState(false);
    const [semesterIdToEdit, setSemesterIdToEdit] = useState(null);
    const [newSemester, setNewSemester] = useState({
        semesterId: '',
        semesterName: '',
        fromDate: '',
        toDate: '',
        status: true,
    });

    // Fetch semesters data from API
    useEffect(() => {
        const fetchSemesters = async () => {
            try {
                const response = await fetch('https://examproctoringmanagement.azurewebsites.net/api/Semester');
                if (!response.ok) {
                    throw new Error('Failed to fetch semesters');
                }
                const data = await response.json();
                setSemesters(data);
                setFilteredSemesters(data);
            } catch (error) {
                setError(error.message);
            } finally {
                setLoading(false);
            }
        };

        fetchSemesters();
    }, []);

    // Filter semesters based on status
    useEffect(() => {
        if (statusFilter === 'All') {
            setFilteredSemesters(semesters);
        } else {
            setFilteredSemesters(
                semesters.filter((semester) => (statusFilter === 'Active' ? semester.status : !semester.status))
            );
        }
    }, [statusFilter, semesters]);

    // Handle filter change
    const handleFilterChange = (event) => {
        setStatusFilter(event.target.value);
    };

    // Handle modal state change
    const toggleModal = () => {
        setIsModalOpen(!isModalOpen);
        setIsEditMode(false);
        setNewSemester({
            semesterId: '',
            semesterName: '',
            fromDate: '',
            toDate: '',
            status: true,
        });
    };

    // Handle input changes for new semester
    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setNewSemester((prev) => ({
            ...prev,
            [name]: value,
        }));
    };

    // Handle form submission to create or update a semester
    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            const url = isEditMode
                ? `https://examproctoringmanagement.azurewebsites.net/api/Semester/update/${semesterIdToEdit}`
                : 'https://examproctoringmanagement.azurewebsites.net/api/Semester/create';
            const method = isEditMode ? 'PUT' : 'POST';

            const response = await fetch(url, {
                method: method,
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(newSemester),
            });

            if (!response.ok) {
                throw new Error('Failed to save semester');
            }

            const data = await response.json();

            if (isEditMode) {
                setSemesters(
                    semesters.map((semester) =>
                        semester.semesterId === semesterIdToEdit ? data : semester
                    )
                );
            } else {
                setSemesters([...semesters, data]); // Add the new semester to the list
            }
            
            setIsModalOpen(false); // Close the modal
        } catch (error) {
            setError(error.message);
        }
    };

    // Handle edit semester
    const handleEdit = (semesterId) => {
        const semester = semesters.find((s) => s.semesterId === semesterId);
        setNewSemester(semester);
        setSemesterIdToEdit(semesterId);
        setIsEditMode(true);
        setIsModalOpen(true);
    };

    // If data is loading or an error occurs
    if (loading) {
        return <div className="loading">Loading...</div>;
    }

    if (error) {
        return <div className="error">Error: {error}</div>;
    }

    return (
        <div className="semesters-container">
            <h2>Manage Semesters</h2>

            {/* Dropdown to filter by status */}
            <div className="filter-container">
                <label htmlFor="statusFilter">Filter by Status: </label>
                <select id="statusFilter" value={statusFilter} onChange={handleFilterChange}>
                    <option value="All">All</option>
                    <option value="Active">Active</option>
                    <option value="Inactive">Inactive</option>
                </select>
            </div>

            {/* Create Button to open modal */}
            <button className="create-button" onClick={toggleModal}>
                {isEditMode ? 'Edit Semester' : 'Create New Semester'}
            </button>

            {/* Modal to create or edit semester */}
            {isModalOpen && (
                <div className="modal">
                    <div className="modal-content">
                        <h3>{isEditMode ? 'Edit Semester' : 'Create New Semester'}</h3>
                        <form onSubmit={handleSubmit}>
                            <label>
                                Semester ID:
                                <input
                                    type="text"
                                    name="semesterId"
                                    value={newSemester.semesterId}
                                    onChange={handleInputChange}
                                    required
                                    disabled={isEditMode}
                                />
                            </label>
                            <label>
                                Semester Name:
                                <input
                                    type="text"
                                    name="semesterName"
                                    value={newSemester.semesterName}
                                    onChange={handleInputChange}
                                    required
                                />
                            </label>
                            <label>
                                From Date:
                                <input
                                    type="datetime-local"
                                    name="fromDate"
                                    value={newSemester.fromDate}
                                    onChange={handleInputChange}
                                    required
                                />
                            </label>
                            <label>
                                To Date:
                                <input
                                    type="datetime-local"
                                    name="toDate"
                                    value={newSemester.toDate}
                                    onChange={handleInputChange}
                                    required
                                />
                            </label>
                            <label>
                                Status:
                                <select
                                    name="status"
                                    value={newSemester.status}
                                    onChange={handleInputChange}
                                >
                                    <option value={true}>Active</option>
                                    <option value={false}>Inactive</option>
                                </select>
                            </label>
                            <button type="submit">{isEditMode ? 'Update Semester' : 'Create Semester'}</button>
                            <button type="button" onClick={toggleModal}>
                                Cancel
                            </button>
                        </form>
                    </div>
                </div>
            )}

            {/* Display message if no semesters */}
            {filteredSemesters.length === 0 ? (
                <p className="no-semesters">No semesters available.</p>
            ) : (
                <table className="semesters-table">
                    <thead>
                        <tr>
                            <th>Semester ID</th>
                            <th>Semester Name</th>
                            <th>From Date</th>
                            <th>To Date</th>
                            <th>Status</th>
                            <th>Actions</th>
                        </tr>
                    </thead>
                    <tbody>
                        {filteredSemesters.map((semester) => (
                            <tr key={semester.semesterId}>
                                <td>{semester.semesterId}</td>
                                <td>{semester.semesterName}</td>
                                <td>{new Date(semester.fromDate).toLocaleDateString()}</td>
                                <td>{new Date(semester.toDate).toLocaleDateString()}</td>
                                <td className={semester.status ? 'status-active' : 'status-inactive'}>
                                    {semester.status ? 'Active' : 'Inactive'}
                                </td>
                                <td>
                                    <button onClick={() => handleEdit(semester.semesterId)}>Edit</button>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            )}
        </div>
    );
};

export default Semesters;
