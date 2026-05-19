let currentQuiz = [];
let currentIndex = 0;
let isReviewMode = false;

// 初期表示時に復習問題の件数を更新
updateReviewCount();

function updateReviewCount() {
    const reviewList = JSON.parse(localStorage.getItem('reviewList') || '[]');
    document.getElementById('review-count').innerText = reviewList.length;
}

function startQuiz(category) {
    if (category === 'review') {
        const reviewIds = JSON.parse(localStorage.getItem('reviewList') || '[]');
        currentQuiz = questionData.filter(q => reviewIds.includes(q.id));
        isReviewMode = true;
    } else {
        currentQuiz = questionData.filter(q => q.group === category);
        isReviewMode = false;
    }

    if (currentQuiz.length === 0) {
        alert("該当する問題がありません。");
        return;
    }

    currentIndex = 0;
    showPage('quiz-page');
    displayQuestion();
}

function displayQuestion() {
    const q = currentQuiz[currentIndex];
    document.getElementById('quiz-progress').innerText = `${currentIndex + 1} / ${currentQuiz.length}`;
    document.getElementById('question-text').innerText = q.question;
    
    const optionsHtml = q.options.map((opt, i) => 
        `<button class="option" onclick="checkAnswer(${i})">${i + 1}. ${opt}</button>`
    ).join('');
    
    document.getElementById('options-container').innerHTML = optionsHtml;
    document.getElementById('feedback-container').classList.add('hidden');
}

function checkAnswer(selected) {
    const q = currentQuiz[currentIndex];
    const isCorrect = (selected === q.answer);
    const feedback = document.getElementById('feedback-container');
    const label = document.getElementById('result-label');
    
    // 全ボタン無効化
    const buttons = document.querySelectorAll('.option');
    buttons.forEach(btn => btn.disabled = true);

    if (isCorrect) {
        label.innerText = "正解！";
        label.className = "correct-label";
        // 復習モードで正解したらリストから消す
        if (isReviewMode) removeFromReview(q.id);
    } else {
        label.innerText = "不正解...";
        label.className = "wrong-label";
        // 間違えたらリストに追加
        addToReview(q.id);
    }

    document.getElementById('explanation-text').innerText = q.explanation;
    feedback.classList.remove('hidden');
}

function nextQuestion() {
    currentIndex++;
    if (currentIndex < currentQuiz.length) {
        displayQuestion();
    } else {
        showPage('result-page');
    }
}

function addToReview(id) {
    let reviewList = JSON.parse(localStorage.getItem('reviewList') || '[]');
    if (!reviewList.includes(id)) {
        reviewList.push(id);
        localStorage.setItem('reviewList', JSON.stringify(reviewList));
    }
    updateReviewCount();
}

function removeFromReview(id) {
    let reviewList = JSON.parse(localStorage.getItem('reviewList') || '[]');
    reviewList = reviewList.filter(rid => rid !== id);
    localStorage.setItem('reviewList', JSON.stringify(reviewList));
    updateReviewCount();
}

function showPage(id) {
    document.querySelectorAll('.page').forEach(p => p.classList.add('hidden'));
    document.getElementById(id).classList.remove('hidden');
}

function goHome() {
    updateReviewCount();
    showPage('top-page');
}
