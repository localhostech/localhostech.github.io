(() => {
  'use strict';

  const { intro, disclaimer, questions } = quizContent;
  const total = questions.length;
  const storageKey = 'first-aid-quiz:v1';
  const quiz = document.querySelector('#quiz');
  const brand = document.querySelector('#brand');
  const count = document.querySelector('#site-count');
  const arrow = '<span class="button-arrow" aria-hidden="true">→</span>';
  let state = restore();

  function validSelection(selection, question, minimum) {
    return Array.isArray(selection)
      && selection.length >= minimum
      && selection.length <= (question.correctIds.length > 1 ? question.options.length : 1)
      && new Set(selection).size === selection.length
      && selection.every(id => question.options.some(option => option.id === id));
  }

  function restore() {
    try {
      const saved = JSON.parse(localStorage.getItem(storageKey));
      if (!saved || !Number.isInteger(saved.index) || saved.index < 0 || saved.index > total) return null;
      const { index, checked, selected } = saved;
      if (!Array.isArray(checked) || checked.length > total
        || (checked.length !== index && checked.length !== index + 1)
        || !checked.every((answer, position) => validSelection(answer, questions[position], 1))) return null;
      const draftAllowed = index < total && checked.length === index;
      if (draftAllowed ? !validSelection(selected, questions[index], 0)
        : !Array.isArray(selected) || selected.length !== 0) return null;
      return { index, checked, selected };
    } catch {
      return null;
    }
  }

  function save() {
    try {
      if (state) localStorage.setItem(storageKey, JSON.stringify(state));
      else localStorage.removeItem(storageKey);
    } catch {
      // The quiz remains playable when browser storage is unavailable.
    }
  }

  function matchesKey(question, selection) {
    return selection.length === question.correctIds.length
      && question.correctIds.every(id => selection.includes(id));
  }

  function number(position) {
    return String(position).padStart(2, '0');
  }

  function welcome() {
    return `
      <section class="welcome screen" aria-labelledby="screen-title">
        <div class="welcome-copy">
          <h1 id="screen-title" tabindex="-1">What would<br class="title-break"> you do?</h1>
          <p class="intro">${intro}</p>
          <p class="disclaimer">${disclaimer}</p>
          <button class="button button-primary" type="button" data-action="start">Start quiz ${arrow}</button>
        </div>
        <img class="hero-image" src="./assets/first-aid-kit.webp" width="900" height="900" alt="">
      </section>`;
  }

  function explanation(question) {
    const [paragraph, ...bullets] = question.explanation.split('\n').filter(Boolean);
    const list = bullets.length
      ? `<ul class="explanation-list">${bullets.map(line => `<li>${line.slice(2)}</li>`).join('')}</ul>`
      : '';
    return `
      <div class="explanation">
        <p class="eyebrow">Explanation</p>
        <p>${paragraph}</p>
        ${list}
      </div>`;
  }

  function optionRow(option, question, selection, checked) {
    const chosen = selection.includes(option.id);
    const keyed = checked && question.correctIds.includes(option.id);
    const id = option.id;
    return `
      <div class="option${keyed ? ' is-keyed' : ''}${checked && chosen && !keyed ? ' is-missed' : ''}">
        <input class="visually-hidden" type="${question.correctIds.length > 1 ? 'checkbox' : 'radio'}"
          name="answer" id="${id}" value="${option.id}" ${chosen ? 'checked' : ''} ${checked ? 'disabled' : ''}>
        <label for="${id}" class="option-row">
          <span class="choice-letter">${option.label}</span>
          <span class="choice-content">
            <span class="choice-text">${option.text}</span>
            ${checked && (chosen || keyed) ? `
              <span class="choice-feedback">
                ${chosen ? '<span class="choice-tag">Your choice</span>' : ''}
                ${keyed ? '<span class="choice-tag key-tag">Correct answer</span>' : ''}
              </span>` : ''}
          </span>
          <span class="choice-indicator" aria-hidden="true"></span>
        </label>
      </div>`;
  }

  function questionScreen() {
    const { index, checked, selected } = state;
    const question = questions[index];
    const answer = checked[index];
    const selection = answer ?? selected;
    const correct = answer && matchesKey(question, answer);
    const multiple = question.correctIds.length > 1;
    return `
      <section class="content-column question-screen screen" aria-labelledby="screen-title">
        <div class="progress-section">
          <p class="eyebrow">Question <span>${number(index + 1)}</span> / ${number(total)}</p>
          <div class="progress-track" role="progressbar" aria-label="Quiz progress"
            aria-valuemin="0" aria-valuemax="${total}" aria-valuenow="${index + 1}"
            aria-valuetext="Question ${index + 1} of ${total}">
            <div class="progress-fill" style="--previous-progress: ${index / total}; --progress: ${(index + 1) / total}"></div>
          </div>
        </div>
        <div class="question-layout">
          <h1 class="question-title" id="screen-title" tabindex="-1">${question.text}</h1>
          <img class="question-image" src="./assets/questions/${question.id}.webp" width="768" height="512" alt="" decoding="async">
          <div class="question-body">
            <form id="answer-form">
              <fieldset class="answers" aria-labelledby="screen-title"${multiple ? ' aria-describedby="selection-hint"' : ''}>
                <legend class="visually-hidden">Answer options</legend>
                ${multiple ? '<p id="selection-hint" class="selection-hint">Select all that apply</p>' : ''}
                <div class="option-list">
                  ${question.options.map(option => optionRow(option, question, selection, Boolean(answer))).join('')}
                </div>
              </fieldset>
              ${!answer ? `
                <div class="actions">
                  <button class="button button-primary" type="submit"${selection.length ? '' : ' disabled'}>Check answer</button>
                </div>` : ''}
            </form>
            ${answer ? `
              <section class="feedback" aria-labelledby="feedback-title">
                <h2 id="feedback-title" tabindex="-1" class="feedback-title ${correct ? 'is-match' : 'is-no-match'}">
                  <span class="feedback-symbol" aria-hidden="true">${correct ? '✓' : '×'}</span>
                  ${correct ? 'Correct answer.' : 'Not quite.'}
                </h2>
                ${explanation(question)}
              </section>
              <div class="actions">
                <button class="button button-primary" type="button" data-action="next">
                  ${index === total - 1 ? 'See results' : 'Next question'} ${arrow}
                </button>
              </div>` : ''}
          </div>
        </div>
      </section>`;
  }

  function answerList(question, ids) {
    return `<ul class="plain-list">${question.options.filter(option => ids.includes(option.id))
      .map(option => `<li><span>${option.label}</span> ${option.text}</li>`).join('')}</ul>`;
  }

  function review(matches) {
    return `
      <details class="review">
        <summary>Review all answers <span class="expand-icon" aria-hidden="true"></span></summary>
        <div class="review-list">
          ${questions.map((question, index) => `
            <details class="review-item">
              <summary>
                <span class="review-number" aria-hidden="true">${number(index + 1)}</span>
                <span class="review-question">${question.text}
                  <span class="review-verdict ${matches[index] ? 'is-match' : 'is-no-match'}">
                    ${matches[index] ? 'Correct' : 'Incorrect'}
                  </span>
                </span>
                <span class="expand-icon" aria-hidden="true"></span>
              </summary>
              <div class="review-body">
                <div class="review-answers">
                  <div><p class="eyebrow">Your selection</p>${answerList(question, state.checked[index])}</div>
                  <div><p class="eyebrow">Correct answer</p>${answerList(question, question.correctIds)}</div>
                </div>
                ${explanation(question)}
              </div>
            </details>`).join('')}
        </div>
      </details>`;
  }

  function results() {
    const matches = questions.map((question, index) => matchesKey(question, state.checked[index]));
    const score = matches.filter(Boolean).length;
    const percentage = Math.round(score / total * 100);
    const message = percentage === 100 ? 'You answered every question correctly.'
      : percentage >= 75 ? 'You got most questions right. Review the ones you missed.'
      : 'Read the explanations and try again.';
    return `
      <section class="content-column results screen" aria-labelledby="screen-title">
        <h1 class="eyebrow results-title" id="screen-title" tabindex="-1">Quiz complete</h1>
        <p class="score" aria-label="${score} out of ${total}">${score} <span>/ ${total}</span></p>
        <p class="score-percent">${percentage}% correct</p>
        <div class="score-strip" aria-hidden="true">
          ${matches.map(match => `<span${match ? ' class="score-hit"' : ''}></span>`).join('')}
        </div>
        <p class="result-message">${message}</p>
        <button class="button button-primary" type="button" data-action="restart">Try again</button>
        ${review(matches)}
      </section>`;
  }

  function render(focus = '') {
    brand.textContent = state ? 'First Aid / Quiz' : 'First Aid';
    count.textContent = state ? '' : `${total} questions`;
    quiz.innerHTML = !state ? welcome() : state.index === total ? results() : questionScreen();
    if (focus === 'feedback') {
      const title = document.querySelector('#feedback-title');
      title.focus({ preventScroll: true });
      title.scrollIntoView({ block: 'nearest' });
    } else if (focus) {
      window.scrollTo(0, 0);
      document.querySelector('#screen-title').focus({ preventScroll: true });
    }
  }

  quiz.addEventListener('change', event => {
    const form = event.target.form;
    if (form?.id !== 'answer-form' || !state || state.checked[state.index]) return;
    state.selected = Array.from(form.querySelectorAll('input:checked'), input => input.value);
    form.querySelector('button[type="submit"]').disabled = state.selected.length === 0;
    save();
  });

  quiz.addEventListener('submit', event => {
    if (event.target.id !== 'answer-form') return;
    event.preventDefault();
    if (!state || state.index >= total || state.checked[state.index]
      || !validSelection(state.selected, questions[state.index], 1)) return;
    state.checked.push(state.selected);
    state.selected = [];
    save();
    render('feedback');
  });

  quiz.addEventListener('click', event => {
    const action = event.target.closest('[data-action]')?.dataset.action;
    if (action === 'start' && !state) {
      state = { index: 0, checked: [], selected: [] };
    } else if (action === 'next' && state?.checked[state.index]) {
      state.index += 1;
    } else if (action === 'restart' && state?.index === total) {
      state = null;
    } else {
      return;
    }
    save();
    render('screen');
  });

  render();
})();
