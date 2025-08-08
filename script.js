fetch('questions.json')
  .then(response => response.json())
  .then(data => {
    const questions = data;
    displayDailyQuestions(questions);
  })
  .catch(error => console.error('Error loading questions:', error));

function getRandomQuestions(questions, count) {
  const shuffled = questions.sort(() => 0.5 - Math.random());
  return shuffled.slice(0, count);
}

function displayDailyQuestions(questions) {
  const questionContainer = document.getElementById('questions');
  const dailyQuestions = getRandomQuestions(questions, 10);

  dailyQuestions.forEach((q, index) => {
    const questionDiv = document.createElement('div');
    questionDiv.classList.add('question');
    questionDiv.innerHTML = `
      <h3>${index + 1}. ${q.question} (${q.subject})</h3>
      ${q.options.map((option, i) => `
        <label>
          <input type="radio" name="q${q.id}" value="${option}" required>
          ${option}
        </label><br>
      `).join('')}
    `;
    questionContainer.appendChild(questionDiv);
  });
}

document.getElementById('quiz-form').addEventListener('submit', function(e) {
  e.preventDefault();
  const formData = new FormData(this);
  let results = '';

  formData.forEach((value, key) => {
    results += `${key}: ${value}\n`;
  });

  emailjs.send('service_mvgtdzj', 'template_e6smd0o', {
    to_email: 'aditya1205a@gmail.com',
    message: results
  })
  .then(() => {
    document.getElementById('quiz-form').style.display = 'none';
    document.getElementById('result').style.display = 'block';
  }, (error) => {
    console.error('EmailJS error:', error);
    alert('Oops! Something went wrong. Try again later.');
  });
});