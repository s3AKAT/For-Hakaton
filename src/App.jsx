import React, { useState } from "react";
import axios from "axios";
import "./App.css";

function App() {
  const [keyword, setKeyword] = useState("");
  const [experience, setExperience] = useState("");
  const [skill, setSkill] = useState("");
  const [selectedFile, setSelectedFile] = useState(null);
  const [resultText, setResultText] = useState("");
  const [filteredData, setFilteredData] = useState(null);
  const [toPdf, setToPdf] = useState(false);

  const skills = [
    "JavaScript",
    "Python",
    "SQL",
    "Project Management",
    "Анализ данных",
    "Программирование",
    "Дизайн интерфейсов",
    "Финансовый анализ",
    "Управление проектами",
    "Диагностика",
    "Преподавание",
    "Юридические консультации",
    "Планирование маркетинга",
    "Техническое проектирование",
    "Архитектурное проектирование",
    "Написание тестов",
    "Фотосъемка",
    "Кулинария",
    "Изобразительное искусство",
    "Музыкальное исполнение",
    "Психологическое консультирование",
    "Научные исследования",
    "Математическое моделирование",
    "Актерское мастерство",
  ];

  const cities = ["Москва", "Санкт-Петербург", "Алматы", "Ташкент"];
  const namesDatabase = [
    "Александр",
    "Мария",
    "Иван",
    "Екатерина",
    "Дмитрий",
    "Анастасия",
    "Максим",
    "Ольга",
    "Сергей",
    "Татьяна",
    "Роман",
    "Елена",
    "Владимир",
    "Наталья",
    "Петр",
    "Юлия",
    "Михаил",
    "Ирина",
    "Виктор",
    "Анна",
    "Константин",
    "Людмила",
    "Андрей",
    "Светлана",
    "Артем",
    "Дарина",
    "Евгений",
    "Алёна",
    "Олег",
    "Виктория",
    "Галина",
    "Роман",
    "Полина",
    "Кирилл",
    "Александра",
    "Тимур",
    "Валентина",
    "Данила",
    "Вероника",
    "Станислав",
    "Евдокия",
    "Никита",
    "Зинаида",
    "Тимофей",
    "Елизавета",
    "Аркадий",
    "Лариса",
    "Григорий",
    "Маргарита",
    "Фёдор",
  ];

  const handleKeywordChange = (event) => {
    setKeyword(event.target.value);
  };

  const handleExperienceChange = (event) => {
    setExperience(event.target.value);
  };

  const handleSkillChange = (event) => {
    setSkill(event.target.value);
  };

  const handleFileChange = (event) => {
    setSelectedFile(event.target.files[0]);
  };

  const handleFileUpload = async () => {
    if (!selectedFile) {
      alert("Пожалуйста, выберите файл для загрузки");
      return;
    }

    const formData = new FormData();
    formData.append("file", selectedFile);

    try {
      const response = await axios.post(
        "http://localhost:5000/upload",
        formData,
        {
          headers: {
            "Content-Type": "multipart/form-data",
          },
        }
      );
      setResultText(response.data.text);
      setToPdf(true);
    } catch (error) {
      console.error("Ошибка загрузки файла:", error);
      alert("Произошла ошибка при загрузке файла");
    }
  };

  const handleFilter = () => {
    const nameRegex = new RegExp(namesDatabase.join("|"), "i");
    const skillsRegex = new RegExp(skills.join("|"), "i");
    const professionRegex = /(?:Профессия|Должность)[\s:]*([a-zA-Zа-яА-ЯёЁ\s]+)/i;
    const cityRegex = new RegExp(cities.join("|"), "i");
    const ageRegex = /(?:Возраст)[\s:]*([0-9]{2})/i;

    const nameMatch = resultText.match(nameRegex);
    const skillsMatch = resultText.match(skillsRegex);
    const professionMatch = resultText.match(professionRegex);
    const cityMatch = resultText.match(cityRegex);
    const ageMatch = resultText.match(ageRegex);
    const peopleData = [];
    if (nameMatch) {
      nameMatch.forEach((name) => {
        const personData = {
          name,
          skills: skillsMatch ? skillsMatch[0] : "Не найдено",
          profession: professionMatch ? professionMatch[1] : "Не найдено",
          city: cityMatch ? cityMatch[0] : "Не найдено",
          age: ageMatch ? ageMatch[1] : "Не найдено",
        };
        peopleData.push(personData);
      });
    }

    setFilteredData(peopleData);
  };

  return (
    <>
      <div className="container bgColor">
        <div className="search-container">
          <header>
            <h1>Поиск сотрудника по вакансии</h1>
            <p className="description">
              Найдите профессионала по нужным навыкам и опыту
            </p>
          </header>
          <div className="text-container">
            <input type="file" onChange={handleFileChange} />
          </div>
          <button className="search-button" onClick={handleFileUpload}>
            Загрузить
          </button>
          <br />
          <br />
          <p className="no-results">
            Инструкция:
            <br />
            <br />
            1. Загрузите файл в формате PDF
            <br />
            <br />
            2. Нажмите на кнопку "Загрузить"
            <br />
            <br />
            3. Скопируйте текст, полученный ниже
            <br />
            <br />
            4. Нажмите на кнопку "Отфильтровать"
          </p>
        </div>

        <div className="results">
          {resultText ? (
            <>
              <pre>{resultText}</pre>
            </>
          ) : (
            <h2 id="waiting">Ожидание запроса...</h2>
          )}
        </div>
      </div>

      <br />
      <div className="filter-button">
        <button className="filter-btn" onClick={handleFilter}>
          Отфильтровать
        </button>
      </div>

      {filteredData && (
        <div className="filtered-results">
          <h2>Отфильтрованные данные:</h2>
          <br />
          {filteredData.map((person, index) => (
            <div key={index} className="person-data">
              <h3>Сотрудник {index + 1}</h3>
              <br />
              <ul>
                <li>
                  <strong>Имя:</strong> {person.name}
                </li>
                <br />
                <li>
                  <strong>Навыки:</strong> {person.skills}
                </li>
                <br />
                <li>
                  <strong>Профессия:</strong> {person.profession}
                </li>
                <br />
                <li>
                  <strong>Город:</strong> {person.city}
                </li>
                <br />
                <li>
                  <strong>Возраст:</strong> {person.age}
                </li>
              </ul>
            </div>
          ))}
        </div>
      )}
    </>
  );
}

export default App;
