let currentQuiz = [];
let currentIndex = 0;
let isReviewMode = false;

// 復習件数の初期表示
updateReviewCount();

function updateReviewCount() {
    const reviewList = JSON.parse(localStorage.getItem('reviewList') || '[]');
    document.getElementById('review-count').innerText = reviewList.length;
}

function startQuiz(category) {
    if (category === 'review') {
        // 全カテゴリのデータから、復習リストに入っているIDを抽出
        const reviewIds = JSON.parse(localStorage.getItem('reviewList') || '[]');
        currentQuiz = [];
        Object.values(QuizData).forEach(list => {
            list.forEach(q => {
                if(reviewIds.includes(q.id)) currentQuiz.push(q);
            });
        });
        isReviewMode = true;
    } else {
        // ボタンに指定されたカテゴリデータを取得
        currentQuiz = QuizData[category] || [];
        isReviewMode = false;
    }

    if (currentQuiz.length === 0) {
        alert("問題がありません。");
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
    
    document.querySelectorAll('.option').forEach(btn => btn.disabled = true);

    const label = document.getElementById('result-label');
    if (isCorrect) {
        label.innerText = "正解！";
        label.className = "correct-label";
        if (isReviewMode) removeFromReview(q.id);
    } else {
        label.innerText = "不正解...";
        label.className = "wrong-label";
        addToReview(q.id);
    }

    document.getElementById('explanation-text').innerText = q.explanation;
    document.getElementById('feedback-container').classList.remove('hidden');
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
}

function removeFromReview(id) {
    let reviewList = JSON.parse(localStorage.getItem('reviewList') || '[]');
    reviewList = reviewList.filter(rid => rid !== id);
    localStorage.setItem('reviewList', JSON.stringify(reviewList));
}

function showPage(id) {
    document.querySelectorAll('.page').forEach(p => p.classList.add('hidden'));
    document.getElementById(id).classList.remove('hidden');
}

function goHome() {
    updateReviewCount();
    showPage('top-page');
}
