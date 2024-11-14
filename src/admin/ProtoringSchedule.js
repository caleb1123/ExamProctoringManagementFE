import React, { useEffect, useState } from 'react';
import './ProtoringSchedule.css';
import axios from 'axios';

const ProctoringSchedule = () => {
    const [schedules, setSchedules] = useState([]);
    const [filteredSchedules, setFilteredSchedules] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [statusFilter, setStatusFilter] = useState('All');
    const [showCreateForm, setShowCreateForm] = useState(false);
    const [isEditing, setIsEditing] = useState(false);
    const [currentSchedule, setCurrentSchedule] = useState(null);
    const [formData, setFormData] = useState({
        scheduleId: '',
        userId: '',
        proctorType: '',
        slotReferenceId: '',
        status: true,
        isFinished: false,
        count: 0
    });
    const [updateTrigger, setUpdateTrigger] = useState(false); // Trigger for reload

    useEffect(() => {
        // Fetch schedules
        axios.get('https://examproctoringmanagement.azurewebsites.net/api/ProctoringSchedule')
            .then((response) => {
                setSchedules(response.data);
                setFilteredSchedules(response.data);
                setLoading(false);
            })
            .catch((err) => {
                setError(err);
                setLoading(false);
            });
    }, [updateTrigger]); // Reload data when updateTrigger changes

    const handleStatusFilterChange = (event) => {
        const selectedStatus = event.target.value;
        setStatusFilter(selectedStatus);
        if (selectedStatus === 'All') {
            setFilteredSchedules(schedules);
        } else {
            const filtered = schedules.filter((schedule) =>
                selectedStatus === 'Active' ? schedule.status === true : schedule.status === false
            );
            setFilteredSchedules(filtered);
        }
    };

    const handleChange = (e) => {
        const { name, value } = e.target;

        // Ensure isFinished is treated as a boolean
        if (name === "isFinished") {
            setFormData({ ...formData, [name]: value === "true" });
        } else {
            setFormData({ ...formData, [name]: value });
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            await axios.post('https://examproctoringmanagement.azurewebsites.net/api/ProctoringSchedule', formData);
            alert('Proctoring Schedule created successfully!');
            setShowCreateForm(false);
        } catch (error) {
            console.error('Error creating schedule:', error);
            alert('Failed to create schedule.');
        }
    };

    const handleEdit = (schedule) => {
        setIsEditing(true);
        setCurrentSchedule(schedule);
        setFormData({
            scheduleId: schedule.scheduleId,
            userId: schedule.userId,
            proctorType: schedule.proctorType,
            slotReferenceId: schedule.slotReferenceId,
            status: schedule.status,
            isFinished: schedule.isFinished, // Ensure it's boolean
            count: schedule.count
        });
    };

    const handleUpdate = async (e) => {
        e.preventDefault();
        try {
            await axios.put('https://examproctoringmanagement.azurewebsites.net/api/ProctoringSchedule/update', formData);
            alert('Proctoring Schedule updated successfully!');
            setIsEditing(false);
   
            // Cập nhật dữ liệu trong local state sau khi chỉnh sửa
            const updatedSchedules = schedules.map((schedule) =>
                schedule.scheduleId === formData.scheduleId ? { ...schedule, ...formData } : schedule
            );
            setSchedules(updatedSchedules);
            setFilteredSchedules(updatedSchedules);
   
        } catch (error) {
            console.error('Error updating schedule:', error);
            alert('Failed to update schedule.');
        }
    };
   
    const getAllSchedules = async () => {
        try {
            const response = await axios.get('https://examproctoringmanagement.azurewebsites.net/api/ProctoringSchedule');
            setSchedules(response.data);
            setFilteredSchedules(response.data);
            setLoading(false);
        } catch (err) {
            setError(err);
            setLoading(false);
        }
    };


    if (loading) return <div className="loading">Loading...</div>;
    if (error) return <div className="error">Error fetching data</div>;
    if (filteredSchedules.length === 0) return <div className="no-schedules">No schedules available</div>;

    return (
        <div className="proctorings-container">
            <h2>Proctoring Schedule List</h2>

            <button onClick={() => setShowCreateForm(!showCreateForm)} className="create-exam-btn">
                {showCreateForm ? 'Cancel' : 'Create Schedule'}
            </button>

            {/* Modal for Create/Edit Schedule */}
           {/* Modal for Create/Edit Schedule */}
{(showCreateForm || isEditing) && (
    <div className="popup">
        <div className="popup-content">
            <h3>{isEditing ? 'Edit Schedule' : 'Create Schedule'}</h3>
            <form onSubmit={isEditing ? handleUpdate : handleSubmit}>
                {/* Conditionally render fields for create or edit */}
                {isEditing && (
                    <>
                        <input
                            type="text"
                            name="scheduleId"
                            placeholder="Schedule ID"
                            value={formData.scheduleId}
                            onChange={handleChange}
                            required
                        />
                        <input
                            type="text"
                            name="userId"
                            placeholder="User ID"
                            value={formData.userId}
                            onChange={handleChange}
                            required
                        />
                    </>
                )}
                {/* Common fields for both create and edit */}
                <input
                    type="text"
                    name="proctorType"
                    placeholder="Proctor Type"
                    value={formData.proctorType}
                    onChange={handleChange}
                    required
                />
                <input
                    type="text"
                    name="slotReferenceId"
                    placeholder="Slot Reference ID"
                    value={formData.slotReferenceId}
                    onChange={handleChange}
                    required
                />
                <input
                    type="number"
                    name="count"
                    placeholder="Count"
                    value={formData.count}
                    onChange={handleChange}
                    required
                />
                {/* Render status and isFinished fields only for editing */}
                {isEditing && (
                    <>
                        <label>
                            Status:
                            <select name="status" value={formData.status} onChange={handleChange} required>
                                <option value="true">Active</option>
                                <option value="false">Inactive</option>
                            </select>
                        </label>
                        <label>
                            Is Finished:
                            <select name="isFinished" value={formData.isFinished} onChange={handleChange} required>
                                <option value={true}>Yes</option>
                                <option value={false}>No</option>
                            </select>
                        </label>
                    </>
                )}
                <button type="submit" className="create-btn">
                    {isEditing ? 'Update Schedule' : 'Create Schedule'}
                </button>
                <button
                    type="button"
                    className="cancel-btn"
                    onClick={() => {
                        setIsEditing(false);
                        setShowCreateForm(false);
                        setFormData({
                            scheduleId: '',
                            userId: '',
                            proctorType: '',
                            slotReferenceId: '',
                            status: true,
                            isFinished: false,
                            count: 0
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
                <select id="status-filter" value={statusFilter} onChange={handleStatusFilterChange}>
                    <option value="All">All</option>
                    <option value="Active">Active</option>
                    <option value="Inactive">Inactive</option>
                </select>
            </div>

            {/* Schedule Table */}
            <table className="proctorings-table">
                <thead>
                    <tr>
                        <th>Schedule ID</th>
                        <th>User ID</th>
                        <th>Proctor Type</th>
                        <th>Slot Reference ID</th>
                        <th>Status</th>
                        <th>Is Finished</th>
                        <th>Count</th>
                        <th>Actions</th>
                    </tr>
                </thead>
                <tbody>
                    {filteredSchedules.map((schedule) => (
                        <tr key={schedule.scheduleId}>
                            <td>{schedule.scheduleId}</td>
                            <td>{schedule.userId}</td>
                            <td>{schedule.proctorType}</td>
                            <td>{schedule.slotReferenceId}</td>
                            <td className={schedule.status ? 'status-active' : 'status-inactive'}>
                                {schedule.status ? 'Active' : 'Inactive'}
                            </td>
                            <td>{schedule.isFinished ? 'Yes' : 'No'}</td>
                            <td>{schedule.count}</td>
                            <td>
                                <button onClick={() => handleEdit(schedule)}>Edit</button>
                            </td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    );
};

export default ProctoringSchedule;
