import React, { useState } from "react";
import { Link } from "react-router-dom";
import "./styles/StartPage.css";

interface Player {
  position: number;
  name: string;
  job: string;
  company: string;
  rating: number;
}

const generateDummyPlayers = (count: number): Player[] => {
  return Array.from({ length: count }, (_, i) => ({
    position: i + 1,
    name: `Игрок ${i + 1}`,
    job: "Developer",
    company: "Знак",
    rating: 1500 - i * 5,
  }));
};

const StartPage: React.FC = () => {
  const [activeTab, setActiveTab] = useState<
    "play" | "rules" | "rating" | "profile"
  >("play");
  const [difficulty, setDifficulty] = useState<string>("Normal");
  const [players, setPlayers] = useState<Player[]>(generateDummyPlayers(10));
  const [page, setPage] = useState(1);

  const currentUser: Player = {
    position: 237,
    name: "Иван Иванов",
    job: "Websoft Developer",
    company: "UNIREST",
    rating: 1000,
  };

  const loadMore = () => {
    const newPage = page + 1;
    setPlayers((prev) => [
      ...prev,
      ...generateDummyPlayers(100).map((p) => ({
        ...p,
        position: p.position + prev.length,
      })),
    ]);
    setPage(newPage);
  };

  return (
    <div className="start-page">
      <div className="tabs">
        <button
          className={activeTab === "play" ? "tab active" : "tab"}
          onClick={() => setActiveTab("play")}
        >
          Играть
        </button>
        <button
          className={activeTab === "rules" ? "tab active" : "tab"}
          onClick={() => setActiveTab("rules")}
        >
          Правила
        </button>
        <button
          className={activeTab === "rating" ? "tab active" : "tab"}
          onClick={() => setActiveTab("rating")}
        >
          Рейтинг
        </button>
        <button
          className={activeTab === "profile" ? "tab active" : "tab"}
          onClick={() => setActiveTab("profile")}
        >
          Мой профиль
        </button>
      </div>

      {activeTab === "play" && (
        <div className="tab-content">
          <h2>Выберите режим</h2>
          <div className="play-modes">
            <div className="mode">
              <h3>Играть с ботом</h3>
              <div className="difficulties">
                {["Normal", "Hard", "Hell"].map((lvl) => (
                  <button
                    key={lvl}
                    className={`difficulty-button ${
                      difficulty === lvl ? "selected" : ""
                    }`}
                    onClick={() => setDifficulty(lvl)}
                  >
                    {lvl}
                  </button>
                ))}
              </div>
              <p>
                {difficulty === "Normal" &&
                  "Обычная скорость и поведение соперника"}
                {difficulty === "Hard" &&
                  "Более быстрая игра, соперник почти безошибочен"}
                {difficulty === "Hell" &&
                  "Максимальная сложность: скорость и агрессия"}
              </p>
              <Link to="/game" state={{ difficulty }}>
                <button className="regular-button">Начать игру</button>
              </Link>
            </div>

            <div className="mode disabled" title="В разработке">
              <h3>Играть с человеком</h3>
              <button className="regular-button" disabled>
                Скоро
              </button>
            </div>
          </div>
        </div>
      )}

      {activeTab === "rules" && (
        <div className="tab-content rules">
          <h2>Правила игры</h2>
          <ul>
            <li>Игрок управляет ракеткой слева, бот — справа.</li>
            <li>Мяч отскакивает от стен и ракеток.</li>
            <li>Очко засчитывается, если соперник пропустил мяч.</li>
            <li>Игра идёт до 10 очков.</li>
          </ul>
        </div>
      )}

      {activeTab === "rating" && (
        <div className="tab-content rating">
          <div className="rating-header">
            <h2>Рейтинговая таблица</h2>
            <span>
              <input type="text" placeholder="поиск"/>
              <button className="regular-button small">Поиск</button>
            </span>
          </div>

          <div className="current-user-row">
            <h4>Ты на {currentUser.position}-м месте</h4>
            <table className="rating-table">
              <tbody>
                <tr>
                  <td>{currentUser.position}</td>
                  <td>{currentUser.name}</td>
                  <td>{currentUser.job}</td>
                  <td>{currentUser.company}</td>
                  <td>{currentUser.rating}</td>
                </tr>
              </tbody>
            </table>
          </div>

          <table className="rating-table">
            <thead>
              <tr>
                <th>№</th>
                <th>Имя</th>
                <th>Должность</th>
                <th>Компания</th>
                <th>Рейтинг</th>
              </tr>
            </thead>
            <tbody>
              {players.map((p) => (
                <tr key={p.position}>
                  <td>{p.position}</td>
                  <td>{p.name}</td>
                  <td>{p.job}</td>
                  <td>{p.company}</td>
                  <td>{p.rating}</td>
                </tr>
              ))}
            </tbody>
          </table>

          <button className="regular-button small" onClick={loadMore}>
            Показать ещё
          </button>
        </div>
      )}

      {activeTab === "profile" && (
        <div className="tab-content profile">
          <div className="profile-header">
            <img
              src="https://via.placeholder.com/100"
              alt="avatar"
              className="avatar"
            />
            <div>
              <h3>Иван Иванов</h3>
              <p>Frontend Developer</p>
              <p>Компания: FastFood Corp</p>
              <p>Рейтинг: 1000</p>
            </div>
          </div>
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
        </div>
      )}
    </div>
  );
};

export default StartPage;
