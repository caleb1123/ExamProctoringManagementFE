import React, { useState, useEffect } from 'react';
import './Slot.css';

const Slots = () => {
    const [slots, setSlots] = useState([]);
    const [filteredSlots, setFilteredSlots] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [statusFilter, setStatusFilter] = useState('All');
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [isEditMode, setIsEditMode] = useState(false);
    const [slotIdToEdit, setSlotIdToEdit] = useState(null);
    const [slotDetails, setSlotDetails] = useState({
        slotId: '',
        slotName: '',
        fromTime: '',
        toTime: '',
        status: true,
        examId: '' // Added examId
    });
    const [exams, setExams] = useState([]); // Store the exams data

    // Fetch slots from API
    const fetchSlots = async () => {
        try {
            const response = await fetch('https://examproctoringmanagement.azurewebsites.net/api/Slot');
            if (!response.ok) throw new Error('Failed to fetch slots');
            const data = await response.json();
            setSlots(data);
            setFilteredSlots(data);
        } catch (error) {
            setError(error.message);
        } finally {
            setLoading(false);
        }
    };

    // Fetch exams from API
    const fetchExams = async () => {
        try {
            const response = await fetch('https://examproctoringmanagement.azurewebsites.net/api/Exam/all');
            if (!response.ok) throw new Error('Failed to fetch exams');
            const data = await response.json();
            setExams(data);
        } catch (error) {
            setError(error.message);
        }
    };

    useEffect(() => {
        fetchSlots();
        fetchExams(); // Fetch exams data when the component mounts
    }, []);

    useEffect(() => {
        if (statusFilter === 'All') {
            setFilteredSlots(slots);
        } else {
            setFilteredSlots(
                slots.filter((slot) => (statusFilter === 'Active' ? slot.status : !slot.status))
            );
        }
    }, [statusFilter, slots]);

    const handleFilterChange = (event) => setStatusFilter(event.target.value);

    const toggleModal = () => {
        setIsModalOpen(!isModalOpen);
        setIsEditMode(false);
        setSlotDetails({
            slotId: '',
            slotName: '',
            fromTime: '',
            toTime: '',
            status: true,
            examId: '' // Reset examId
        });
    };

    const formatDate = (dateString) => {
        const date = new Date(dateString);
        const year = date.getFullYear();
        const month = String(date.getMonth() + 1).padStart(2, '0'); // Month is 0-indexed, so add 1
        const day = String(date.getDate()).padStart(2, '0'); // Pad single digits with zero

        return `${year}-${month}-${day}`; // Returns in YYYY-MM-DD format
    };


    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setSlotDetails((prev) => ({
            ...prev,
            [name]: value,
        }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        const url = isEditMode
            ? `https://your-api-url/api/Slot/update`
            : 'https://your-api-url/api/Slot/create';
        const method = isEditMode ? 'PUT' : 'POST';

        const updatedDetails = {
            ...slotDetails,
            status: slotDetails.status === 'true' ? true : false,
        };

        try {
            const response = await fetch(url, {
                method: method,
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(updatedDetails),
            });
            if (!response.ok) throw new Error('Failed to save slot');

            const data = await response.json();

            if (isEditMode) {
                setSlots(slots.map((slot) =>
                    slot.slotId === slotIdToEdit ? data : slot
                ));
            } else {
                setSlots([...slots, data]);
            }
            fetchSlots(); // Refresh the list of slots
            setIsModalOpen(false);
        } catch (error) {
            setError(error.message);
        }
    };

    const handleEdit = (slotId) => {
        const slot = slots.find((s) => s.slotId === slotId);
        setSlotDetails(slot);
        setSlotIdToEdit(slotId);
        setIsEditMode(true);
        setIsModalOpen(true);
    };

    if (loading) return <div className="loading">Loading...</div>;
    if (error) return <div className="error">Error: {error}</div>;

    return (
        <div className="slots-container">
            <h2>Manage Slots</h2>

            <div className="filter-controls">
                <label htmlFor="statusFilter">Filter by status: </label>
                <select id="statusFilter" value={statusFilter} onChange={handleFilterChange}>
                    <option value="All">All</option>
                    <option value="Active">Active</option>
                    <option value="Inactive">Inactive</option>
                </select>
            </div>

            <button className="create-button" onClick={toggleModal}>
                {isEditMode ? 'Edit Slot' : 'Create New Slot'}
            </button>

            {isModalOpen && (
                <div className="modal">
                    <div className="modal-content">
                        <h3>{isEditMode ? 'Edit Slot' : 'Create New Slot'}</h3>
                        <form onSubmit={handleSubmit}>
                            <label>
                                Slot ID:
                                <input
                                    type="text"
                                    name="slotId"
                                    value={slotDetails.slotId}
                                    onChange={handleInputChange}
                                    required
                                    disabled={isEditMode}
                                />
                            </label>
                            <label>
                                Date:
                                <input
                                    type="date"
                                    name="date"
                                    value={formatDate(slotDetails.date)}
                                    onChange={handleInputChange}
                                    required
                                />
                            </label>

                            <label>
                                From Time:
                                <input
                                    type="time"
                                    name="start"
                                    value={slotDetails.start}
                                    onChange={handleInputChange}
                                    required
                                />
                            </label>
                            <label>
                                To Time:
                                <input
                                    type="time"
                                    name="end"
                                    value={slotDetails.end}
                                    onChange={handleInputChange}
                                    required
                                />
                            </label>
                            <label>
                                Status:
                                <select
                                    name="status"
                                    value={slotDetails.status}
                                    onChange={handleInputChange}
                                >
                                    <option value={true}>Active</option>
                                    <option value={false}>Inactive</option>
                                </select>
                            </label>
                            <label>
                                Exam:
                                <select
                                    name="examId"
                                    value={slotDetails.examId}
                                    onChange={handleInputChange}
                                    required
                                >
                                    <option value="">Select an Exam</option>
                                    {exams.map((exam) => (
                                        <option key={exam.examId} value={exam.examId}>
                                            {exam.examId}
                                        </option>
                                    ))}
                                </select>
                            </label>
                            <button type="submit">{isEditMode ? 'Update Slot' : 'Create Slot'}</button>
                            <button type="button" onClick={toggleModal}>
                                Cancel
                            </button>
                        </form>
                    </div>
                </div>
            )}

            {filteredSlots.length === 0 ? (
                <p className="no-slots">No slots available.</p>
            ) : (
                <table className="slots-table">
                    <thead>
                        <tr>
                            <th>Slot ID</th>
                            <th>Date</th>
                            <th>From Time</th>
                            <th>To Time</th>
                            <th>Status</th>
                            <th>Actions</th>
                        </tr>
                    </thead>
                    <tbody>
                        {filteredSlots.map((slot) => (
                            <tr key={slot.slotId}>
                                <td>{slot.slotId}</td>
                                <td>{new Date(slot.date).toLocaleDateString('en-GB')}</td>
                                <td>{slot.start}</td>
                                <td>{slot.end}</td>
                                <td className={slot.status ? 'status-active' : 'status-inactive'}>
                                    {slot.status ? 'Active' : 'Inactive'}
                                </td>
                                <td>
                                    <button onClick={() => handleEdit(slot.slotId)}>Edit</button>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            )}
        </div>
    );
};

export default Slots;
