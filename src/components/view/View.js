import React, { useEffect, useState } from "react";
import axios from "axios";
import "./View.css";

function View() {
  const [registrations, setRegistrations] = useState([]);
  const [selectedRegistration, setSelectedRegistration] = useState(null); // Track selected registration for details popup
  const [token, setToken] = useState("");

  useEffect(() => {
    const savedToken = localStorage.getItem("jwtToken");
    if (savedToken) {
      setToken(savedToken);
    }

    if (savedToken) {
      axios
        .get("https://examproctoringmanagement.azurewebsites.net/api/RegistrationForm/registration_user", {
          headers: {
            Authorization: `Bearer ${savedToken}`,
          },
        })
        .then((response) => {
          setRegistrations(response.data);
        })
        .catch((error) => {
          console.error("Error fetching data:", error);
        });
    }
  }, []);

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString("vi-VN", { year: "numeric", month: "2-digit", day: "2-digit" });
  };

  const openPopup = (registration) => {
    setSelectedRegistration(registration);
  };

  const closePopup = () => {
    setSelectedRegistration(null);
  };

  return (
    <div className="schedule-container">
      <h2>Danh sách Lịch Gác Thi</h2>
      <div className="schedule-grid">
        {registrations.map((registration, index) => (
          <div className="schedule-slot" key={index} onClick={() => openPopup(registration)}>
            <p><strong>Ngày thi:</strong> {formatDate(registration.date)}</p>
            <p><strong>Giờ thi:</strong> {registration.startDate} - {registration.endDate}</p>
            <p><strong>Loại giám thị:</strong> {registration.proctoringType}</p>
            <p><strong>Trạng thái:</strong> {registration.status ? "Đã duyệt" : "Chưa duyệt"}</p>
          </div>
        ))}
      </div>

      {selectedRegistration && (
        <div className="popup">
          <div className="popup-content">
            <h3>Chi tiết ca gác thi</h3>
            <p><strong>Loại giám thị:</strong> {selectedRegistration.proctoringType}</p>
            <p><strong>Ngày thi:</strong> {formatDate(selectedRegistration.date)}</p>
            <p><strong>Giờ thi:</strong> {selectedRegistration.startDate} - {selectedRegistration.endDate}</p>
            <button className="cancel-button" onClick={closePopup}>Đóng</button>
          </div>
        </div>
      )}
    </div>
  );
}

export default View;
