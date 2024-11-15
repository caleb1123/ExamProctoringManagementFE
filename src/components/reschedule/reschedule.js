import React, { useEffect, useState } from 'react';
import axios from 'axios';
import './reschedule.css';

const Reschedule = () => {
    const [exams, setExams] = useState([]);
    const [proctoringSchedules, setProctoringSchedules] = useState([]);
    const [selectedScheduleId, setSelectedScheduleId] = useState('');
    const [selectedExam, setSelectedExam] = useState(null);
    const [showModal, setShowModal] = useState(false);
    const [error, setError] = useState(null);
    const [successMessage, setSuccessMessage] = useState('');
    const token = localStorage.getItem("jwtToken");

    // Fetch exams that are gác thi (exam being rescheduled)
    useEffect(() => {
        const fetchExams = async () => {
            try {
                const response = await axios.get(
                    'https://examproctoringmanagement.azurewebsites.net/api/RegistrationForm/registration_user',
                    {
                        headers: {
                            Authorization: `Bearer ${token}`,
                        },
                    }
                );
                setExams(response.data);
            } catch (err) {
                setError('Error fetching exams');
            }
        };

        fetchExams();
    }, [token]);

    // Fetch available proctoring schedules
    const fetchProctoringSchedules = async () => {
        try {
            const response = await axios.get(
                'https://examproctoringmanagement.azurewebsites.net/api/ProctoringSchedule',
                {
                    headers: {
                        Authorization: `Bearer ${token}`,
                    },
                }
            );
            setProctoringSchedules(response.data);
        } catch (err) {
            setError('Error fetching proctoring schedules');
        }
    };

    const formatDate = (dateString) => {
        const date = new Date(dateString);
        return date.toLocaleDateString("vi-VN", { year: "numeric", month: "2-digit", day: "2-digit" });
      };

    // Handle selecting an exam to reschedule
    const handleExamSelect = (exam) => {
        setSelectedExam(exam);
        setShowModal(true);
        fetchProctoringSchedules(); // Fetch schedules when selecting an exam
    };

    // Handle selecting a schedule
    const handleScheduleSelect = (e) => {
        setSelectedScheduleId(e.target.value);
    };

    // Handle rescheduling the exam
    const handleReschedule = async () => {
        if (!selectedScheduleId) {
            setError('Please select a new schedule');
            return;
        }

        const requestBody = {
            formId: selectedExam.formId,
            proctoringId: selectedScheduleId,
        };

        try {
            const response = await axios.put(
                'https://examproctoringmanagement.azurewebsites.net/api/RegistrationForm/swap',
                requestBody,
                {
                    headers: {
                        Authorization: `Bearer ${token}`,
                        'Content-Type': 'application/json',
                    },
                }
            );
            setSuccessMessage('Exam rescheduled successfully');
            setShowModal(false); // Close the modal
        } catch (err) {
            setError('Failed to reschedule the exam');
        }
    };

    return (
        <div className="reschedule-container">
            <h2>Reschedule Exam</h2>

            {/* Show success or error messages */}
            {error && <div className="error-message">{error}</div>}
            {successMessage && <div className="success-message">{successMessage}</div>}

            {/* Exam List */}
            <h3>Exams Being Rescheduled</h3>
            <div className="schedule-grid">
            {exams.map((exam, index) => (
                    <div className="schedule-slot" key={index} onClick={() => handleExamSelect(exam)}>
                        <p><strong>Ngày thi:</strong> {formatDate(exam.date)}</p>
                        <p><strong>Giờ thi:</strong> {exam.startDate} - {exam.endDate}</p>
                        <p><strong>Loại giám thị:</strong> {exam.proctoringType}</p>
                        <p><strong>Trạng thái:</strong> {exam.status ? "Đã duyệt" : "Chưa duyệt"}</p>
                    </div>
                ))}
            </div>
            

            {/* Modal for selecting a new proctoring schedule */}
            {showModal && (
                <div className="modal">
                    <div className="modal-content">
                        <h3>Select a New Schedule</h3>
                        <select onChange={handleScheduleSelect} value={selectedScheduleId}>
                            <option value="">Select Schedule</option>
                            {proctoringSchedules.map((schedule) => (
                                <option key={schedule.scheduleId} value={schedule.scheduleId}>
                                    {schedule.scheduleId} - {schedule.proctorType}
                                </option>
                            ))}
                        </select>
                        <button onClick={handleReschedule}>Confirm Reschedule</button>
                        <button onClick={() => setShowModal(false)}>Cancel</button>
                    </div>
                </div>
            )}
        </div>
    );
};

export default Reschedule;
