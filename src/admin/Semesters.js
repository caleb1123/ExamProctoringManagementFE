import React, { useState, useEffect } from 'react';
import './Semesters.css';

const Semesters = () => {
    const [semesters, setSemesters] = useState([]);
    const [filteredSemesters, setFilteredSemesters] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [statusFilter, setStatusFilter] = useState('All');
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [isEditMode, setIsEditMode] = useState(false);
    const [semesterIdToEdit, setSemesterIdToEdit] = useState(null);
    const [semesterDetails, setSemesterDetails] = useState({
        semesterId: '',
        semesterName: '',
        fromDate: '',
        toDate: '',
        status: true,
    });

    useEffect(() => {
        const fetchSemesters = async () => {
            try {
                const response = await fetch('https://examproctoringmanagement.azurewebsites.net/api/Semester');
                if (!response.ok) throw new Error('Failed to fetch semesters');
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

    useEffect(() => {
        if (statusFilter === 'All') {
            setFilteredSemesters(semesters);
        } else {
            setFilteredSemesters(
                semesters.filter((semester) => (statusFilter === 'Active' ? semester.status : !semester.status))
            );
        }
    }, [statusFilter, semesters]);

    const handleFilterChange = (event) => setStatusFilter(event.target.value);
    const fetchSemesters = async () => {
        try {
            const response = await fetch('https://examproctoringmanagement.azurewebsites.net/api/Semester');
            if (!response.ok) throw new Error('Failed to fetch semesters');
            const data = await response.json();
            setSemesters(data);
            setFilteredSemesters(data);
        } catch (error) {
            setError(error.message);
        } finally {
            setLoading(false);
        }
    };

    const toggleModal = () => {
        setIsModalOpen(!isModalOpen);
        setIsEditMode(false);
        setSemesterDetails({
            semesterId: '',
            semesterName: '',
            fromDate: '',
            toDate: '',
            status: true,
        });
    };

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setSemesterDetails((prev) => ({
            ...prev,
            [name]: value,
        }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        const url = isEditMode
            ? `https://examproctoringmanagement.azurewebsites.net/api/Semester/update`
            : 'https://examproctoringmanagement.azurewebsites.net/api/Semester/create';
        const method = isEditMode ? 'PUT' : 'POST';
    
        // Ensure status is boolean
        const updatedDetails = {
            ...semesterDetails,
            status: semesterDetails.status === 'true' ? true : false, // Convert string to boolean
        };
    
        try {
            const response = await fetch(url, {
                method: method,
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(updatedDetails),
            });
            if (!response.ok) throw new Error('Failed to save semester');
    
            const data = await response.json();
    
            if (isEditMode) {
                setSemesters(semesters.map((semester) =>
                    semester.semesterId === semesterIdToEdit ? data : semester
                ));
            } else {
                setSemesters([...semesters, data]);
            }
            fetchSemesters();
            setIsModalOpen(false);
        } catch (error) {
            setError(error.message);
        }
    };
    
    const handleEdit = (semesterId) => {
        const semester = semesters.find((s) => s.semesterId === semesterId);
        setSemesterDetails(semester);
        setSemesterIdToEdit(semesterId);
        setIsEditMode(true);
        setIsModalOpen(true);
    };

    if (loading) return <div className="loading">Loading...</div>;
    if (error) return <div className="error">Error: {error}</div>;

    return (
        <div className="semesters-container">
            <h2>Manage Semesters</h2>

            <div className="filter-container">
                <label htmlFor="statusFilter">Filter by Status: </label>
                <select id="statusFilter" value={statusFilter} onChange={handleFilterChange}>
                    <option value="All">All</option>
                    <option value="Active">Active</option>
                    <option value="Inactive">Inactive</option>
                </select>
            </div>

            <button className="create-button" onClick={toggleModal}>
                {isEditMode ? 'Edit Semester' : 'Create New Semester'}
            </button>

            {isModalOpen && (
                <div className="modal">
                    <div className="modal-content">
                        <h3>{isEditMode ? 'Create Semester' : 'Create New Semester'}</h3>
                        <form onSubmit={handleSubmit}>
                            <label>
                                Semester ID:
                                <input
                                    type="text"
                                    name="semesterId"
                                    value={semesterDetails.semesterId}
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
                                    value={semesterDetails.semesterName}
                                    onChange={handleInputChange}
                                    required
                                />
                            </label>
                            <label>
                                From Date:
                                <input
                                    type="datetime-local"
                                    name="fromDate"
                                    value={semesterDetails.fromDate}
                                    onChange={handleInputChange}
                                    required
                                />
                            </label>
                            <label>
                                To Date:
                                <input
                                    type="datetime-local"
                                    name="toDate"
                                    value={semesterDetails.toDate}
                                    onChange={handleInputChange}
                                    required
                                />
                            </label>
                            <label>
                                Status:
                                <select
                                    name="status"
                                    value={semesterDetails.status}
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
