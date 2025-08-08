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
    questionDiv.setAttribute('id', `question-${q.id}`);
    questionDiv.innerHTML = `
      <h3>${index + 1}. ${q.question} (${q.subject})</h3>
      ${q.options.map((option, i) => `
        <label>
          <input type="radio" name="q${q.id}" value="${option}" required>
          ${option}
        </label><br>
      `).join('')}
      <div class="feedback" id="feedback-${q.id}" style="display: none;"></div>
    `;
    questionContainer.appendChild(questionDiv);
  });

  // Store daily questions for feedback and email
  window.dailyQuestions = dailyQuestions;
}

// Add CSS for feedback
const style = document.createElement('style');
style.innerHTML = `
  .correct { color: green; font-weight: bold; }
  .wrong { color: red; font-weight: bold; }
  .feedback { margin-top: 10px; }
`;
document.head.appendChild(style);

document.getElementById('quiz-form').addEventListener('submit', function(e) {
  e.preventDefault();
  const formData = new FormData(this);
  let results = '';
  let score = 0;

  // Check answers and show feedback
  window.dailyQuestions.forEach(q => {
    const selectedAnswer = formData.get(`q${q.id}`);
    const feedbackDiv = document.getElementById(`feedback-${q.id}`);
    if (selectedAnswer === q.answer) {
      feedbackDiv.innerHTML = '<span class="correct">Correct!</span>';
      score++;
    } else {
      feedbackDiv.innerHTML = `<span class="wrong">Wrong! The correct answer is ${q.answer}</span>`;
    }
    feedbackDiv.style.display = 'block';
    // Build email content
    results += `Question ${q.id}: ${q.question} (${q.subject})\nYour Answer: ${selectedAnswer}\nCorrect Answer: ${q.answer}\n\n`;
  });

  // Show score
  const resultDiv = document.getElementById('result');
  resultDiv.innerHTML = `🎈 You got ${score}/10! Great job! 🎈`;
  resultDiv.style.display = 'block';

  // Disable form to prevent resubmission
  document.getElementById('quiz-form').querySelector('button').disabled = true;

  // Send email
  emailjs.send('service_mvgtdzj', 'template_e6smd0o', {
    to_email: 'aditya1205a@gmail.com',
    message: results
  })
  .then(() => {
    console.log('Email sent successfully!');
  }, (error) => {
    console.error('EmailJS error:', error);
    alert('Answers saved, but email failed. Try again later.');
  });
});