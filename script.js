// Select navigation buttons and all pages
const page1btn = document.querySelector("#page1btn");
const page2btn = document.querySelector("#page2btn");
const page3btn = document.querySelector("#page3btn");
const page4btn = document.querySelector("#page4btn");
const page5btn = document.querySelector("#page5btn");
const allpages = document.querySelectorAll(".page");

// Select elements for the hamburger menu, ingredients, dropzone, and trash icon
const hamBtn = document.querySelector("#hamIcon");
const menuItemsList = document.querySelector("nav ul");
const ingredients = document.querySelectorAll('.ingredient');
const dropzone = document.getElementById('dropzone');
const trashicon = document.getElementById("trashicon");

// Function to hide all pages
function hideall() {
    allpages.forEach(page => {
        page.classList.remove("active", "fade-enter", "fade-enter-active");
    });
}

// Function to show the selected page number
function show(pgno) {
    hideall();
    const onepage = document.querySelector("#page" + pgno);
    onepage.classList.add("fade-enter");
    setTimeout(() => {
        onepage.classList.add("active", "fade-enter-active");
    }, 0);
}

// Initialize by showing the first page
show(1);

// Event listeners for page navigation
page1btn.addEventListener("click", event => {
    event.preventDefault();
    show(1);
});
page2btn.addEventListener("click", event => {
    event.preventDefault();
    show(2);
});
page3btn.addEventListener("click", event => {
    event.preventDefault();
    show(3);
});
page4btn.addEventListener("click", event => {
    event.preventDefault();
    show(4);
});
page5btn.addEventListener("click", event => {
    event.preventDefault();
    show(5);
});

// Function to handle page load and apply loaded class
window.addEventListener('load', () => {
    document.body.classList.add('loaded');
});

// Function to manage background audio playback
document.addEventListener('DOMContentLoaded', () => {
    const audio = document.getElementById('background-audio');

    // Attempt to play the audio on page load
    const playAudio = () => {
        audio.play().then(() => {
            localStorage.setItem('audioPlaying', 'true');
        }).catch(error => {
            console.error('Autoplay was prevented:', error);
            localStorage.setItem('audioPlaying', 'false');
        });
    };

    // Check if audio was playing before the page was reloaded
    if (localStorage.getItem('audioPlaying') === 'true') {
        playAudio();
    }

    // Event listener to play audio when user interacts with the page
    document.addEventListener('click', () => {
        if (localStorage.getItem('audioPlaying') === 'false') {
            playAudio();
        }
    });

    // Listen for the audio ending to reset the play button and state
    audio.addEventListener('ended', () => {
        localStorage.setItem('audioPlaying', 'false');
    });

    // Reset the state if the audio is paused
    audio.addEventListener('pause', () => {
        if (audio.currentTime < audio.duration) {
            localStorage.setItem('audioPlaying', 'false');
        }
    });
});

// Function to toggle the hamburger menu
function toggleMenus() {
    menuItemsList.classList.toggle("menuHide");
}

// Event listener for the hamburger menu
hamBtn.addEventListener("click", toggleMenus);

// Function to toggle recipe details
function toggleRecipeDetails() {
    const instructions = document.getElementById('instructions');
    instructions.style.display = (instructions.style.display === 'none' || instructions.style.display === '') ? 'block' : 'none';
    instructions.classList.toggle('show');
}

// Drag-and-drop functionality for ingredients
ingredients.forEach(ingredient => {
    ingredient.addEventListener('dragstart', dragStart);
});

dropzone.addEventListener('dragover', dragOver);
dropzone.addEventListener('drop', drop);
trashicon.addEventListener('dragover', dragOver);
trashicon.addEventListener('drop', trash);

// Function to handle drag start
function dragStart(event) {
    event.dataTransfer.setData('text/plain', event.target.id);
    setTimeout(() => {
        event.target.classList.add('hide');
    }, 0);
}

// Function to allow drag over
function dragOver(event) {
    event.preventDefault();
}

// Function to handle drop on the plate
function drop(event) {
    event.preventDefault();
    const id = event.dataTransfer.getData('text/plain');
    const draggableElement = document.getElementById(id);

    const sticker = draggableElement.cloneNode(true);
    sticker.classList.remove('hide');
    sticker.style.position = 'absolute';

    // Ensure the sticker keeps its original size
    sticker.style.width = `${draggableElement.clientWidth}px`;
    sticker.style.height = `${draggableElement.clientHeight}px`;

    const dropzoneRect = dropzone.getBoundingClientRect();
    const offsetX = event.clientX - dropzoneRect.left;
    const offsetY = event.clientY - dropzoneRect.top;

    sticker.style.left = `${offsetX - sticker.clientWidth / 2}px`;
    sticker.style.top = `${offsetY - sticker.clientHeight / 2}px`;
    dropzone.appendChild(sticker);

    // Allow the sticker to be dragged within the drop zone
    sticker.addEventListener('mousedown', event => {
        event.preventDefault();
        const shiftX = event.clientX - sticker.getBoundingClientRect().left;
        const shiftY = event.clientY - sticker.getBoundingClientRect().top;

        function moveAt(pageX, pageY) {
            sticker.style.left = pageX - dropzoneRect.left - shiftX + 'px';
            sticker.style.top = pageY - dropzoneRect.top - shiftY + 'px';

            // Check for overlap with trash icon
            if (isOverlapping(sticker, trashicon)) {
                sticker.remove();
            }
        }

        function onMouseMove(event) {
            moveAt(event.pageX, event.pageY);
        }

        document.addEventListener('mousemove', onMouseMove);

        sticker.onmouseup = () => {
            document.removeEventListener('mousemove', onMouseMove);
            sticker.onmouseup = null;
        };
    });

    sticker.ondragstart = () => false;

    // Make the sticker draggable and set up trash functionality
    sticker.setAttribute('draggable', 'true');
    sticker.addEventListener('dragstart', dragStartForSticker);
}

// Function to check if two elements overlap
function isOverlapping(element1, element2) {
    const rect1 = element1.getBoundingClientRect();
    const rect2 = element2.getBoundingClientRect();

    return !(rect1.right < rect2.left ||
        rect1.left > rect2.right ||
        rect1.bottom < rect2.top ||
        rect1.top > rect2.bottom);
}

// Function to handle drop on the trash icon
function trash(event) {
    event.preventDefault();
    const id = event.dataTransfer.getData('text/plain');
    const sticker = document.getElementById(id);
    if (sticker && sticker.parentElement === dropzone) {
        sticker.remove();
    }
}

// Function to handle drag start for stickers on the plate
function dragStartForSticker(event) {
    event.dataTransfer.setData('text/plain', event.target.id);
}

// Function to handle quiz submission
function submitQuiz() {
    const form = document.getElementById('quiz-form');
    const questions = form.querySelectorAll('.quiz-question');
    let score = 0;

    questions.forEach(question => {
        const selected = question.querySelector('input[type="radio"]:checked');
        const correctAnswer = question.querySelector('input[type="radio"][value="right"]');

        // Reset previous styles
        question.querySelectorAll('label').forEach(label => {
            label.style.color = '';
            label.style.fontWeight = '';
            label.style.backgroundColor = '';
        });

        const questionText = question.querySelector('p');

        if (selected) {
            if (selected.value === 'right') {
                score++;
                // Mark correct answer
                questionText.style.color = '#d4edda'; // Green text for correct
                selected.nextElementSibling.style.color = '#155724'; // Green text for correct
                selected.nextElementSibling.style.backgroundColor = '#d4edda'; // Light green background for correct
                selected.nextElementSibling.style.fontWeight = 'bold'; // Bold correct answer
            } else {
                // Mark wrong answer
                questionText.style.color = '#f8d7da'; // Red text for incorrect
                selected.nextElementSibling.style.color = '#721c24'; // Dark red text for incorrect
                selected.nextElementSibling.style.backgroundColor = '#f8d7da'; // Light red background for incorrect
                correctAnswer.nextElementSibling.style.color = '#155724'; // Green text for correct
                correctAnswer.nextElementSibling.style.backgroundColor = '#d4edda'; // Light green background for correct
                correctAnswer.nextElementSibling.style.fontWeight = 'bold'; // Bold correct answer
            }
        } else {
            // No answer selected
            questionText.style.color = '#e0df9e'; // Yellow text for unanswered
            // Highlight correct answer for unanswered questions
            correctAnswer.nextElementSibling.style.color = '#155724'; // Green text for correct
            correctAnswer.nextElementSibling.style.backgroundColor = '#d4edda'; // Light green background for correct
            correctAnswer.nextElementSibling.style.fontWeight = 'bold'; // Bold correct answer
        }
    });

    const resultDiv = document.getElementById('quiz-result');
    resultDiv.textContent = `You scored ${score} out of ${questions.length}!`;

    // Disable all inputs after submission
    form.querySelectorAll('input').forEach(input => {
        input.disabled = true;
    });

    // Disable the submit button
    form.querySelector('button').disabled = true;
}