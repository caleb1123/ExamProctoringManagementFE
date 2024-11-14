import React, { useEffect, useState } from 'react';
import './Subjects.css';

const Subjects = () => {
    const [subjects, setSubjects] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [showCreateForm, setShowCreateForm] = useState(false);
    const [isEditing, setIsEditing] = useState(false);
    const [formData, setFormData] = useState({
        subjectId: '',
        subjectName: '',
        examId: ''
    });

    useEffect(() => {
        fetchSubjects();
    }, []);

    const fetchSubjects = () => {
        fetch('https://examproctoringmanagement.azurewebsites.net/api/Subject')
            .then((response) => response.json())
            .then((data) => {
                setSubjects(data);
                setLoading(false);
            })
            .catch((err) => {
                setError(err);
                setLoading(false);
            });
    };

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData({ ...formData, [name]: value });
    };

    const handleCreateSubmit = async (e) => {
        e.preventDefault();
        try {
            await fetch('https://examproctoringmanagement.azurewebsites.net/api/Subject', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(formData),
            });
            setShowCreateForm(false);
            alert('Subject created successfully!');
            fetchSubjects(); // Refetch subjects after create
        } catch (error) {
            console.error('Error creating subject:', error);
            alert('Failed to create subject.');
        }
    };

    const handleEdit = (subject) => {
        setIsEditing(true);
        setFormData(subject);
        setShowCreateForm(true);
    };

    const handleUpdateSubmit = async (e) => {
        e.preventDefault();
        const { exam, slotRoomSubjects, ...updatedData } = formData; // Destructure and remove the unwanted properties
        try {
            await fetch('https://examproctoringmanagement.azurewebsites.net/api/Subject', {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(updatedData),
            });
            setIsEditing(false);
            setShowCreateForm(false);
            alert('Subject updated successfully!');
            fetchSubjects(); // Refetch subjects after update
        } catch (error) {
            console.error('Error updating subject:', error);
            alert('Failed to update subject.');
        }
    };
    

    if (loading) return <div className="loading">Loading...</div>;
    if (error) return <div className="error">Error fetching data</div>;
    if (subjects.length === 0) return <div className="no-subjects">No subjects available</div>;

    return (
        <div className="subjects-container">
            <h2>Subjects List</h2>
            <button onClick={() => setShowCreateForm(!showCreateForm)} className="create-subject-btn">
                {showCreateForm ? 'Cancel' : 'Create Subject'}
            </button>

            {/* Modal for Create/Update Subject */}
            {showCreateForm && (
                <div className="modal">
                    <div className="modal-content">
                        <h3>{isEditing ? 'Edit Subject' : 'Create Subject'}</h3>
                        <form onSubmit={isEditing ? handleUpdateSubmit : handleCreateSubmit}>
                            <input
                                type="text"
                                name="subjectId"
                                placeholder="Subject ID"
                                value={formData.subjectId}
                                onChange={handleChange}
                                required
                            />
                            <input
                                type="text"
                                name="subjectName"
                                placeholder="Subject Name"
                                value={formData.subjectName}
                                onChange={handleChange}
                                required
                            />
                            <input
                                type="text"
                                name="examId"
                                placeholder="Exam ID"
                                value={formData.examId}
                                onChange={handleChange}
                                required
                            />
                            <button type="submit">{isEditing ? 'Update Subject' : 'Create Subject'}</button>
                            {/* Cancel Button */}
                            <button type="button" onClick={() => {
                                setShowCreateForm(false);
                                setFormData({ subjectId: '', subjectName: '', examId: '' }); // Reset form
                            }}>
                                Cancel
                            </button>
                        </form>
                    </div>
                </div>
            )}

            {/* Subjects Table */}
            <table className="subjects-table">
                <thead>
                    <tr>
                        <th>Subject ID</th>
                        <th>Subject Name</th>
                        <th>Exam ID</th>
                        <th>Action</th>
                    </tr>
                </thead>
                <tbody>
                    {subjects.map((subject) => (
                        <tr key={subject.subjectId}>
                            <td>{subject.subjectId}</td>
                            <td>{subject.subjectName}</td>
                            <td>{subject.examId}</td>
                            <td>
                                <button onClick={() => handleEdit(subject)}>Edit</button>
                            </td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    );
};

export default Subjects;
