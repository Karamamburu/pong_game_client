import React from "react";

const MyRecentGames: React.FC = () => {
  return (
    <div className="profile-games">
      <h4>Последние игры</h4>
      <ul>
        <li>Победа против Бота (Normal)</li>
        <li>Поражение против Бота (Hard)</li>
        <li>Победа против Бота (Normal)</li>
        <li>Поражение против Бота (Hell)</li>
        <li>Победа против Бота (Hard)</li>
      </ul>
      <button className="regular-button small">Показать ещё</button>
    </div>
  );
};

export default MyRecentGames;
