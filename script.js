const languageSelector = document.getElementById('languageSelector');
const statusMessage = document.getElementById('statusMessage');
const repoCard = document.getElementById('repoCard');
const refreshBtn = document.getElementById('refreshBtn');

let currentLanguage = "";

// Lista de lenguajes
const languages = [
  { name: "JavaScript", value: "javascript" },
  { name: "Python", value: "python" },
  { name: "Java", value: "java" },
  { name: "C++", value: "cpp" },
  { name: "TypeScript", value: "typescript" },
  { name: "Go", value: "go" },
  { name: "Ruby", value: "ruby" },
  { name: "PHP", value: "php" },
  { name: "C#", value: "csharp" }
];

// Cargar opciones
languages.forEach(lang => {
  const option = document.createElement('option');
  option.value = lang.value;
  option.textContent = lang.name;
  languageSelector.appendChild(option);
});

// Cambio de lenguaje
languageSelector.addEventListener('change', () => {
  currentLanguage = languageSelector.value;
  if (!currentLanguage) {
    updateUI('empty');
    return;
  }
  fetchRepo(currentLanguage);
});

// Botón de refresco
refreshBtn.addEventListener('click', () => {
  fetchRepo(currentLanguage);
});

// Actualizar estado UI
function updateUI(state, data = null) {
  repoCard.classList.add('hidden');
  refreshBtn.classList.add('hidden');

  switch (state) {
    case 'empty':
      statusMessage.textContent = 'Please select a language';
      statusMessage.className = 'status-message';
      break;
    case 'loading':
      statusMessage.textContent = 'Loading, please wait..';
      statusMessage.className = 'status-message loading';
      break;
    case 'error':
      statusMessage.innerHTML = 'Error fetching repositories<br><button onclick="fetchRepo(currentLanguage)">Click to retry</button>';
      statusMessage.className = 'status-message error';
      break;
    case 'success':
      statusMessage.textContent = '';
      statusMessage.className = 'status-message hidden';
      renderRepo(data);
      break;
  }
}

// Petición a GitHub
function fetchRepo(language) {
  updateUI('loading');

  fetch(`https://api.github.com/search/repositories?q=language:${language}&sort=stars&order=desc`)
    .then(res => {
      if (!res.ok) throw new Error('Network response was not ok');
      return res.json();
    })
    .then(data => {
      if (!data.items || data.items.length === 0) throw new Error("No repositories found");
      const randomRepo = data.items[Math.floor(Math.random() * data.items.length)];
      updateUI('success', randomRepo);
    })
    .catch(() => {
      updateUI('error');
    });
}

// Renderizar tarjeta
function renderRepo(repo) {
  repoCard.innerHTML = `
    <h3><a href="${repo.html_url}" target="_blank">${repo.name}</a></h3>
    <p>${repo.description || 'No description available.'}</p>
    <p>⭐ ${repo.stargazers_count} | 🍴 ${repo.forks_count} | 🐞 ${repo.open_issues_count}</p>
    <p><strong>Language:</strong> ${repo.language}</p>
  `;
  repoCard.classList.remove('hidden');
  refreshBtn.classList.remove('hidden');
}
