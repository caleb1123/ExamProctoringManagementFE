import React, { useEffect, useState } from 'react';
import './Exams.css'; // Import the CSS file for styles
import axios from 'axios'; // Import axios for API requests

const Exams = () => {
    const [exams, setExams] = useState([]);
    const [filteredExams, setFilteredExams] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [statusFilter, setStatusFilter] = useState('All');
    const [showCreateForm, setShowCreateForm] = useState(false); // State to toggle form visibility
    const [formData, setFormData] = useState({
        examId: '',
        examName: '',
        type: '',
        fromDate: '',
        toDate: '',
        semesterId: '',
        status: true,
    });

    useEffect(() => {
        fetch('https://examproctoringmanagement.azurewebsites.net/api/Exam/all')
            .then((response) => response.json())
            .then((data) => {
                setExams(data);
                setFilteredExams(data);
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
            setFilteredExams(exams);
        } else {
            const filtered = exams.filter((exam) =>
                selectedStatus === 'Active' ? exam.status === true : exam.status === false
            );
            setFilteredExams(filtered);
        }
    };

    // Handle input changes in the create exam form
    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData({ ...formData, [name]: value });
    };

    // Submit the create exam form
    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            await axios.post('https://examproctoringmanagement.azurewebsites.net/api/Exam', formData);
            alert('Exam created successfully!');
            setShowCreateForm(false); // Hide the form after submission
        } catch (error) {
            console.error("Error creating exam:", error);
            alert("Failed to create exam.");
        }
    };

    if (loading) return <div className="loading">Loading...</div>;
    if (error) return <div className="error">Error fetching data</div>;
    if (filteredExams.length === 0) return <div className="no-exams">No exams available</div>;

    return (
        <div className="exams-container">
            <h2>Exams List</h2>

            {/* Button to toggle the form visibility */}
            <button onClick={() => setShowCreateForm(!showCreateForm)} className="create-exam-btn">
                {showCreateForm ? 'Cancel' : 'Create Exam'}
            </button>

            {/* Conditional render for the create exam form */}
            {showCreateForm && (
                <form onSubmit={handleSubmit} className="create-exam-form">
                    <h3>Create Exam</h3>
                    <input type="text" name="examName" placeholder="Exam Name" value={formData.examName} onChange={handleChange} required />
                    <input type="text" name="type" placeholder="Type" value={formData.type} onChange={handleChange} required />
                    <input type="date" name="fromDate" value={formData.fromDate} onChange={handleChange} required />
                    <input type="date" name="toDate" value={formData.toDate} onChange={handleChange} required />
                    <input type="text" name="semesterId" placeholder="Semester ID" value={formData.semesterId} onChange={handleChange} required />
                    <label>
                        Status:
                        <select name="status" value={formData.status} onChange={(e) => setFormData({ ...formData, status: e.target.value === 'true' })}>
                            <option value="true">Active</option>
                            <option value="false">Inactive</option>
                        </select>
                    </label>
                    <button type="submit">Create Exam</button>
                </form>
            )}

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
                        <th>Semester ID</th>
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
                            <td>{exam.semesterId}</td>
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
