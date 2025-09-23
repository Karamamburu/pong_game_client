import React from "react";

const AboutMe: React.FC = () => {
  return (
    <div className="profile-header">
      <img
        src="https://via.placeholder.com/100"
        alt="avatar"
        className="avatar"
      />
      <div>
        <h3>Иван Иванов</h3>
        <p>Websoft Developer</p>
        <p>Компания: UNIREST</p>
        <p>Рейтинг: 1000</p>
      </div>
    </div>
  );
};

export default AboutMe;
