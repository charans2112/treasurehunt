const clues = [
    { question: "Where did we first meet?", key: "q1" },
    { question: "What’s my favorite snack?", key: "q2" },
    { question: "Which game do we always argue about?", key: "q3" },
    { question: "Our favorite hangout spot?", key: "q4" },
    { question: "What’s my favorite color?", key: "q5" },
    { question: "Which subject do I hate the most?", key: "q6" },
    { question: "Who always loses in our dares?", key: "q7" },
    { question: "What’s the name of our secret code language?", key: "q8" },
    { question: "Which movie do we watch again and again?", key: "q9" },
    { question: "Final clue! What's our friendship nickname?", key: "q10" }
];

let currentClue = 0;
let randomFailureChance = 0.3; // 30% chance to show "Wrong Answer"

// Initialize Supabase (Replace with your actual Supabase URL and Key)
const SUPABASE_URL = "https://vqpuvujyujjpaotlsyon.supabase.co";
const SUPABASE_ANON_KEY = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InZxcHV2dWp5dWpqcGFvdGxzeW9uIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDI1MDc0NzcsImV4cCI6MjA1ODA4MzQ3N30.tGdiVabr15laevpWTytzbog2IP3Y-PiL_-0IcgbXSgQ";

const supabase = window.supabase?.createClient(SUPABASE_URL, SUPABASE_ANON_KEY) || supabase.createClient(SUPABASE_URL, SUPABASE_ANON_KEY);

console.log("Supabase initialized:", supabase); // Debugging check

// Ensure DOM is fully loaded before adding event listeners
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

        // Generate a random UUID for each entry
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

        // Randomly display "Wrong Answer" 30% of the time
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
            resultText.innerHTML = "Your final surprise: 'Siri, you owe me a treat now! 😂' <br> <a href='https://yourlinkhere.com' target='_blank'>Click here for a surprise! 🎁</a>";
            answerInput.style.display = "none";
            submitButton.style.display = "none";
        } 
    });
});
