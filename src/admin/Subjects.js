import React, { useEffect, useState } from 'react';
import './Subjects.css'; // Import the CSS file for styles

const Subjects = () => {
    const [subjects, setSubjects] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        // Fetch the subjects data from the API
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
    }, []);

    if (loading) return <div className="loading">Loading...</div>;
    if (error) return <div className="error">Error fetching data</div>;
    if (subjects.length === 0) return <div className="no-subjects">No subjects available</div>;

    return (
        <div className="subjects-container">
            <h2>Subjects List</h2>

            {/* Table of subjects */}
            <table className="subjects-table">
                <thead>
                    <tr>
                        <th>Subject ID</th>
                        <th>Subject Name</th>
                        <th>Exam ID</th>
                    </tr>
                </thead>
                <tbody>
                    {subjects.map((subject) => (
                        <tr key={subject.subjectId}>
                            <td>{subject.subjectId}</td>
                            <td>{subject.subjectName}</td>
                            <td>{subject.examId}</td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    );
};

export default Subjects;
