import React, { useEffect, useState } from "react";
import './exam.css';
import axios from "axios";

function Exam() {
  const [schedules, setSchedules] = useState([]);
  const [selectedSchedule, setSelectedSchedule] = useState(null);
  const [showPopup, setShowPopup] = useState(false);

  useEffect(() => {
    // Gọi API để lấy lịch gác thi
    axios
      .get("https://examproctoringmanagement.azurewebsites.net/api/ProctoringSchedule/proctoringSlot")
      .then((response) => {
        setSchedules(response.data);
      })
      .catch((error) => {
        console.error("Error fetching data:", error);
      });
  }, []);

  // Chuyển đổi định dạng ngày tháng
  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString("vi-VN", { year: "numeric", month: "2-digit", day: "2-digit" });
  };

  // Xử lý sự kiện khi nhấn nút đăng ký
  const handleRegisterClick = (schedule) => {
    setSelectedSchedule(schedule);
    setShowPopup(true);
  };

  // Đóng popup
  const closePopup = () => {
    setShowPopup(false);
    setSelectedSchedule(null);
  };

  return (
    <div className="schedule-container">
      <h2>Lịch Gác Thi</h2>
      <div className="schedule-grid">
        {schedules.map((schedule, index) => (
          <div className="schedule-slot" key={index}>
            <h3>{schedule.proctorType}</h3>
            <p>Ngày: {formatDate(schedule.date)}</p>
            <p>Giờ: {schedule.startDate} - {schedule.endDate}</p>
            <button onClick={() => handleRegisterClick(schedule)}>Đăng ký</button>
          </div>
        ))}
      </div>

      {/* Popup chi tiết lịch gác thi */}
      {showPopup && selectedSchedule && (
        <div className="popup">
          <div className="popup-content">
            <h3>Chi tiết ca gác thi</h3>
            <p><strong>Loại giám thị:</strong> {selectedSchedule.proctorType}</p>
            <p><strong>Ngày:</strong> {formatDate(selectedSchedule.date)}</p>
            <p><strong>Giờ:</strong> {selectedSchedule.startDate} - {selectedSchedule.endDate}</p>
            <p><strong>Số lượng:</strong> {selectedSchedule.count ?? "Chưa có"}</p>
            <button onClick={closePopup}>Hủy</button>
            <button onClick={() => alert("Đã đăng ký thành công!")}>Xác nhận đăng ký</button>
          </div>
        </div>
      )}
    </div>
  );
}

export default Exam;
