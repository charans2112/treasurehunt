const clues = [
    { question: "When did you we meet in my college?", key: "q1" },
    { question: "What was the first thing that I bought you in the college?", key: "q2" },
    { question: "What's my nick name that you and su used to make fun of me in school?", key: "q3" },
    { question: "Why did you hate me so much when I came to school?", key: "q4" },
    { question: "What's the one thing that you like about me?", key: "q5" }
];

let currentClue = 0;
let randomFailureChance = 0.3; // 30% chance to show "Wrong Answer"

// Track forced wrong answer for all except q1
let forcedWrong = { q2: true, q3: true, q4: true, q5: true };

// Initialize Supabase
const SUPABASE_URL = "https://vqpuvujyujjpaotlsyon.supabase.co";
const SUPABASE_ANON_KEY = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InZxcHV2dWp5dWpqcGFvdGxzeW9uIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDI1MDc0NzcsImV4cCI6MjA1ODA4MzQ3N30.tGdiVabr15laevpWTytzbog2IP3Y-PiL_-0IcgbXSgQ";

const supabase = window.supabase?.createClient(SUPABASE_URL, SUPABASE_ANON_KEY) || supabase.createClient(SUPABASE_URL, SUPABASE_ANON_KEY);
console.log("Supabase initialized:", supabase); // Debugging check

document.addEventListener("DOMContentLoaded", function() {
    const startButton = document.getElementById("start-button");
    const submitButton = document.getElementById("submit-button");
    const answerInput = document.getElementById("answer-input");
    const clueText = document.getElementById("clue");
    const resultText = document.getElementById("result");

    startButton.addEventListener("click", function() {
        startButton.style.display = "none";
        answerInput.style.display = "block";
        submitButton.style.display = "block";
        clueText.textContent = clues[currentClue].question;
    });

    submitButton.addEventListener("click", async function() {
        let userAnswer = answerInput.value.trim();
        if (userAnswer === "") {
            resultText.textContent = "Answer cannot be empty!";
            return;
        }

        let key = clues[currentClue].key;
        let uuid = crypto.randomUUID();

        // Store answer in Supabase
        const { error } = await supabase.from("treasure_hunt_answers").insert([
            { id: uuid, clue_key: key, answer: userAnswer }
        ]);

        if (error) {
            console.error("Database Error:", error);
            resultText.textContent = "Error saving answer!";
            return;
        }

        // Force "Wrong Answer" for all questions except q1 once
        if (forcedWrong[key]) {
            resultText.textContent = "Wrong Answer! Try again.";
            forcedWrong[key] = false; // Remove forced wrong after first attempt
            return;
        }

        // Randomly display "Wrong Answer" 30% of the time for other questions
        if (Math.random() < randomFailureChance) {
            resultText.textContent = "Wrong Answer! Try again.";
            return;
        }

        currentClue++;
        resultText.textContent = "Correct!";
        answerInput.value = "";

        if (currentClue < clues.length) {
            clueText.textContent = clues[currentClue].question;
        } else {
            clueText.textContent = "🎉 Congrats! You completed the treasure hunt! 🎉";
            resultText.innerHTML = "Your final surprise: <a href='https://yourlinkhere.com' target='_blank'>Click here for a surprise! 🎁</a>";
            answerInput.style.display = "none";
            submitButton.style.display = "none";
        }
    });
});
