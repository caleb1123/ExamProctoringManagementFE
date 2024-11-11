import React, { useEffect, useState } from 'react';
import './Exams.css'; // Import the CSS file for styles

const Exams = () => {
    const [exams, setExams] = useState([]);
    const [filteredExams, setFilteredExams] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [statusFilter, setStatusFilter] = useState('All'); // Track selected status filter

    useEffect(() => {
        // Fetch the exam data from the API
        fetch('https://examproctoringmanagement.azurewebsites.net/api/Exam/all')
            .then((response) => response.json())
            .then((data) => {
                setExams(data);
                setFilteredExams(data); // Initially show all exams
                setLoading(false);
            })
            .catch((err) => {
                setError(err);
                setLoading(false);
            });
    }, []);

    // Filter exams based on status
    const handleStatusFilterChange = (event) => {
        const selectedStatus = event.target.value;
        setStatusFilter(selectedStatus);

        if (selectedStatus === 'All') {
            setFilteredExams(exams); // Show all exams
        } else {
            const filtered = exams.filter((exam) =>
                selectedStatus === 'Active' ? exam.status === true : exam.status === false
            );
            setFilteredExams(filtered); // Filter exams based on selected status
        }
    };

    if (loading) return <div className="loading">Loading...</div>;
    if (error) return <div className="error">Error fetching data</div>;
    if (filteredExams.length === 0) return <div className="no-exams">No exams available</div>;

    return (
        <div className="exams-container">
            <h2>Exams List</h2>
            {/* Filter Dropdown for Status */}
            <div className="filter-container">
                <label htmlFor="status-filter">Filter by Status:</label>
                <select
                    id="status-filter"
                    value={statusFilter}
                    onChange={handleStatusFilterChange}
                >
                    <option value="All">All</option>
                    <option value="Active">Active</option>
                    <option value="Inactive">Inactive</option>
                </select>
            </div>

            {/* Table of exams */}
            <table className="exams-table">
                <thead>
                    <tr>
                        <th>Exam ID</th>
                        <th>Exam Name</th>
                        <th>Type</th>
                        <th>From Date</th>
                        <th>To Date</th>
                        <th>Semester ID</th> {/* Semester ID column */}
                        <th>Status</th>
                    </tr>
                </thead>
                <tbody>
                    {filteredExams.map((exam) => (
                        <tr key={exam.examId}>
                            <td>{exam.examId}</td>
                            <td>{exam.examName}</td>
                            <td>{exam.type}</td>
                            <td>{new Date(exam.fromDate).toLocaleDateString()}</td>
                            <td>{new Date(exam.toDate).toLocaleDateString()}</td>
                            <td>{exam.semesterId}</td> {/* Display Semester ID */}
                            <td className={exam.status ? 'status-active' : 'status-inactive'}>
                                {exam.status ? 'Active' : 'Inactive'}
                            </td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    );
};

export default Exams;
