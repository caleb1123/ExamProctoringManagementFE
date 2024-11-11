import React, { useState, useEffect } from 'react';
import './Semesters.css'; // Import CSS file for styling

const Semesters = () => {
    const [semesters, setSemesters] = useState([]); // Store list of semesters
    const [filteredSemesters, setFilteredSemesters] = useState([]); // Store filtered list of semesters
    const [loading, setLoading] = useState(true); // Loading state
    const [error, setError] = useState(null); // Error state
    const [statusFilter, setStatusFilter] = useState('All'); // Filter state (All, Active, Inactive)

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
                setFilteredSemesters(data); // Set initial filtered data
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
    }, [statusFilter, semesters]); // Re-filter when statusFilter or semesters change

    // Handle filter change
    const handleFilterChange = (event) => {
        setStatusFilter(event.target.value);
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
                            </tr>
                        ))}
                    </tbody>
                </table>
            )}
        </div>
    );
};

export default Semesters;
