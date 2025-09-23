import React from "react";

const Rules: React.FC = () => {
  return (
    <div className="tab-content rules">
      <h2>Правила игры</h2>
      <ul>
        <li>Игрок управляет ракеткой слева, бот — справа.</li>
        <li>Мяч отскакивает от стен и ракеток.</li>
        <li>Очко засчитывается, если соперник пропустил мяч.</li>
        <li>Игра идёт до 10 очков.</li>
      </ul>
    </div>
  );
};

export default Rules;