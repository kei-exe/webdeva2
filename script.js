// Target all elements to save to constants
const page1btn = document.querySelector("#page1btn");
const page2btn = document.querySelector("#page2btn");
const page3btn = document.querySelector("#page3btn");
const page4btn = document.querySelector("#page4btn");
const allpages = document.querySelectorAll(".page");
const hamBtn = document.querySelector("#hamIcon");
const menuItemsList = document.querySelector("nav ul");
const ingredients = document.querySelectorAll('.ingredient');
const dropzone = document.getElementById('dropzone');
const trashicon = document.getElementById("trashicon");

// Select all subtopic pages and log them to the console
console.log(allpages);

// Function to hide all pages
function hideall() {
    allpages.forEach(page => {
        page.classList.remove("active", "fade-enter", "fade-enter-active");
    });
}

// Function to show selected page number
function show(pgno) {
    hideall();
    const onepage = document.querySelector("#page" + pgno);
    onepage.classList.add("fade-enter");
    setTimeout(() => {
        onepage.classList.add("active", "fade-enter-active");
    }, 0);
}

// Listen for clicks on the links, assign anonymous event handler functions to call show function
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

window.addEventListener('load', () => {
    document.body.classList.add('loaded');
});

// Function to toggle the hamburger menu
function toggleMenus() {
    menuItemsList.classList.toggle("menuHide");
}

// JS for hamMenu
hamBtn.addEventListener("click", toggleMenus);

// Function to toggle recipe details
function toggleRecipeDetails() {
    const instructions = document.getElementById('instructions');
    instructions.style.display = (instructions.style.display === 'none' || instructions.style.display === '') ? 'block' : 'none';
    instructions.classList.toggle('show');
}

// Initialize by showing the first page
show(1);

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
