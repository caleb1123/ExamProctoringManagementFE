import React, { useEffect, useState } from 'react';
import './Exams.css';
import axios from 'axios';

const Exams = () => {
    const [exams, setExams] = useState([]);
    const [filteredExams, setFilteredExams] = useState([]);
    const [semesters, setSemesters] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [statusFilter, setStatusFilter] = useState('All');
    const [showCreateForm, setShowCreateForm] = useState(false);
    const [isEditing, setIsEditing] = useState(false);
    const [currentExam, setCurrentExam] = useState(null);
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
        // Fetch exams data
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

        // Fetch semesters data
        axios.get('https://examproctoringmanagement.azurewebsites.net/api/Semester')
            .then((response) => {
                setSemesters(response.data);
            })
            .catch((err) => {
                setError(err);
            });
    }, []);

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

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData({ ...formData, [name]: value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            await axios.post('https://examproctoringmanagement.azurewebsites.net/api/Exam', formData);
            alert('Exam created successfully!');
            setShowCreateForm(false);
        } catch (error) {
            console.error('Error creating exam:', error);
            alert('Failed to create exam.');
        }
    };

    const handleEdit = (exam) => {
        setIsEditing(true);
        setCurrentExam(exam);
        setFormData({
            examId: exam.examId,
            examName: exam.examName,
            type: exam.type,
            fromDate: new Date(exam.fromDate).toISOString().split('T')[0], // Format date to YYYY-MM-DD
            toDate: new Date(exam.toDate).toISOString().split('T')[0], // Format date to YYYY-MM-DD
            semesterId: exam.semesterId,
            status: exam.status,
        });
    };
    

    const handleUpdate = async (e) => {
        e.preventDefault();
        try {
            await axios.put('https://examproctoringmanagement.azurewebsites.net/api/Exam', formData);
            alert('Exam updated successfully!');
            setIsEditing(false);
            setFilteredExams(exams.map((exam) =>
                exam.examId === formData.examId ? { ...exam, ...formData } : exam
            ));
        } catch (error) {
            console.error('Error updating exam:', error);
            alert('Failed to update exam.');
        }
    };

    if (loading) return <div className="loading">Loading...</div>;
    if (error) return <div className="error">Error fetching data</div>;
    if (filteredExams.length === 0) return <div className="no-exams">No exams available</div>;

    return (
        <div className="exams-container">
            <h2>Exams List</h2>

            <button onClick={() => setShowCreateForm(!showCreateForm)} className="create-exam-btn">
                {showCreateForm ? 'Cancel' : 'Create Exam'}
            </button>

            {/* Modal for Edit and Create Exam */}
            {(showCreateForm || isEditing) && (
                <div className="modal">
                    <div className="modal-content">
                        <h3>{isEditing ? 'Edit Exam' : 'Create Exam'}</h3>
                        <form onSubmit={isEditing ? handleUpdate : handleSubmit} className="create-exam-form">
                            <input type="text" name="examId" placeholder="Exam ID" value={formData.examId} onChange={handleChange} required />
                            <input type="text" name="examName" placeholder="Exam Name" value={formData.examName} onChange={handleChange} required />
                            <input type="text" name="type" placeholder="Type" value={formData.type} onChange={handleChange} required />
                            <input type="date" name="fromDate" value={formData.fromDate} onChange={handleChange} required />
                            <input type="date" name="toDate" value={formData.toDate} onChange={handleChange} required />

                            <label>
                                Semester:
                                <select name="semesterId" value={formData.semesterId} onChange={handleChange} required>
                                    <option value="">Select Semester</option>
                                    {semesters.map((semester) => (
                                        <option key={semester.semesterId} value={semester.semesterId}>
                                            {semester.semesterName}
                                        </option>
                                    ))}
                                </select>
                            </label>

                            <label>
                                Status:
                                <select name="status" value={formData.status} onChange={(e) => setFormData({ ...formData, status: e.target.value === 'true' })}>
                                    <option value="true">Active</option>
                                    <option value="false">Inactive</option>
                                </select>
                            </label>
                            <button type="submit">{isEditing ? 'Update Exam' : 'Create Exam'}</button>
                            <button
                                type="button"
                                className="cancel-btn"
                                onClick={() => {
                                    setIsEditing(false);
                                    setShowCreateForm(false);
                                    setFormData({
                                        examId: '',
                                        examName: '',
                                        type: '',
                                        fromDate: '',
                                        toDate: '',
                                        semesterId: '',
                                        status: true,
                                    });
                                }}
                            >
                                Cancel
                            </button>

                        </form>
                    </div>
                </div>
            )}

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
                        <th>Action</th>
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
                            <td>
                                <button onClick={() => handleEdit(exam)}>Edit</button>

                            </td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    );
};

export default Exams;
