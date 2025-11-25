// OpenWeatherMap API 설정 (실제 키로 대체해야 합니다!) [cite: 11, 14]
const API_KEY = "$YOUR_API_KEY";
const BASE_URL = "https://api.openweathermap.org/data/2.5/weather";

const cityInput = document.querySelector("#cityInput");
const searchBtn = document.querySelector("#searchBtn");
const weatherResult = document.querySelector("#weatherResult");

// 날씨 데이터를 가져오는 비즈니스 로직
async function getWeather(city) {
  if (!city) {
    throw new Error("도시 이름을 입력해 주세요.");
  }
  const url = `${BASE_URL}?q=${city}&appid=${API_KEY}&units=metric&lang=kr`;

  // fetch API 호출
  const response = await fetch(url);

  // HTTP 오류 처리 (404 Not Found 등)
  if (!response.ok) {
    if (response.status === 404) {
      throw new Error(`도시 '${city}'를 찾을 수 없습니다. (잘못된 도시 입력)`);
    }
    throw new Error("API 호출 중 문제가 발생했습니다.");
  }

  const data = await response.json(); // JSON 파싱
  return data;
}

// DOM 업데이트 및 UI 조작 (뷰)
function displayWeather(data) {
  // API 데이터 추출 [cite: 23, 24]
  const city = data.name;
  const temp = data.main.temp.toFixed(1); // 현재 온도
  const description = data.weather[0].description; // 날씨 상태
  const iconCode = data.weather[0].icon; // 날씨 아이콘
  const humidity = data.main.humidity; // 습도
  const windSpeed = data.wind.speed; // 풍속

  const iconUrl = `https://openweathermap.org/img/wn/${iconCode}@2x.png`;

  // 결과를 HTML로 렌더링
  weatherResult.innerHTML = `
        <h2>${city}</h2>
        <img src="${iconUrl}" alt="${description}">
        <p class="temperature">${temp}°C</p>
        <p>상태: ${description}</p>
        <p>습도: ${humidity}%</p>
        <p>풍속: ${windSpeed} m/s</p>
    `;

  // TODO: 날씨/시간에 따른 배경/아이콘 변화 로직 추가 (시각적 변화 필수 기능) [cite: 27]
}

// 오류 처리 (UI 피드백)
function handleError(error) {
  console.error("오류 발생:", error.message);
  weatherResult.innerHTML = `<p class="error-message">🚨 ${error.message}</p>`;
}

// 검색 버튼 클릭 이벤트 처리 [cite: 22]
searchBtn.addEventListener("click", async () => {
  const city = cityInput.value.trim();

  try {
    const weatherData = await getWeather(city);
    displayWeather(weatherData);
  } catch (error) {
    handleError(error);
  }
});

// Enter 키 입력 이벤트 처리 [cite: 22]
cityInput.addEventListener("keypress", (event) => {
  if (event.key === "Enter") {
    searchBtn.click();
  }
});

// async/await 사용 권장 [cite: 41]
