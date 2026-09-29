/* =========================================
   DAILY TASK PLANNER
========================================= */


/* =========================================
   VARIABLES
========================================= */

const taskForm = document.getElementById("taskForm");
const taskInput = document.getElementById("taskInput");
const taskList = document.getElementById("taskList");
const emptyMessage = document.getElementById("emptyMessage");
const taskCount = document.getElementById("taskCount");
const errorMessage = document.getElementById("errorMessage");
const currentDate = document.getElementById("currentDate");

const filterButtons = document.querySelectorAll(".filter-btn");


/*
   Store tasks in an array.

   Each task looks like:

   {
       id: 123456,
       title: "Study JavaScript",
       completed: false
   }
*/

let tasks = [];

let currentFilter = "all";


/* =========================================
   DISPLAY CURRENT DATE
========================================= */

function displayCurrentDate() {

    const today = new Date();

    const options = {
        weekday: "long",
        year: "numeric",
        month: "long",
        day: "numeric"
    };

    currentDate.textContent =
        today.toLocaleDateString("en-US", options);
}


/* =========================================
   LOAD TASKS FROM LOCAL STORAGE
========================================= */

function loadTasks() {

    const savedTasks = localStorage.getItem("dailyTasks");

    if (savedTasks) {

        try {

            tasks = JSON.parse(savedTasks);

            if (!Array.isArray(tasks)) {
                tasks = [];
            }

        } catch (error) {

            console.error("Error loading tasks:", error);

            tasks = [];
        }
    }

    renderTasks();
}


/* =========================================
   SAVE TASKS TO LOCAL STORAGE
========================================= */

function saveTasks() {

    localStorage.setItem(
        "dailyTasks",
        JSON.stringify(tasks)
    );
}


/* =========================================
   ADD NEW TASK
========================================= */

taskForm.addEventListener("submit", function (event) {

    event.preventDefault();

    const taskText = taskInput.value.trim();


    /* Empty task validation */

    if (taskText === "") {

        errorMessage.textContent =
            "Please enter a task.";

        taskInput.focus();

        return;
    }


    /* Duplicate task validation */

    const duplicateTask = tasks.some(function (task) {

        return task.title.toLowerCase() === taskText.toLowerCase();

    });


    if (duplicateTask) {

        errorMessage.textContent =
            "This task already exists.";

        taskInput.focus();

        return;
    }


    /* Create task */

    const newTask = {

        id: Date.now(),

        title: taskText,

        completed: false

    };


    /* Add task */

    tasks.push(newTask);


    /* Save */

    saveTasks();


    /* Clear input */

    taskInput.value = "";

    errorMessage.textContent = "";


    /* Display */

    renderTasks();

    taskInput.focus();

});


/* =========================================
   RENDER TASKS
========================================= */

function renderTasks() {

    taskList.innerHTML = "";


    /* Filter tasks */

    let filteredTasks = tasks;


    if (currentFilter === "pending") {

        filteredTasks = tasks.filter(function (task) {

            return !task.completed;

        });

    }


    if (currentFilter === "completed") {

        filteredTasks = tasks.filter(function (task) {

            return task.completed;

        });

    }


    /* Empty state */

    if (filteredTasks.length === 0) {

        emptyMessage.style.display = "block";

    } else {

        emptyMessage.style.display = "none";
    }


    /* Create task elements */

    filteredTasks.forEach(function (task) {

        const listItem = document.createElement("li");

        listItem.className =
            "list-group-item task-item";


        if (task.completed) {

            listItem.classList.add("completed");

        }


        /* Checkbox */

        const checkbox = document.createElement("input");

        checkbox.type = "checkbox";

        checkbox.className = "form-check-input task-checkbox";

        checkbox.checked = task.completed;


        checkbox.addEventListener("change", function () {

            toggleTask(task.id);

        });


        /* Task text */

        const taskText = document.createElement("span");

        taskText.className = "task-text";

        taskText.textContent = task.title;


        /* Actions */

        const actions = document.createElement("div");

        actions.className = "task-actions";


        /* Edit button */

        const editButton = document.createElement("button");

        editButton.className =
            "btn btn-outline-primary btn-sm";

        editButton.innerHTML =
            '<i class="bi bi-pencil"></i>';

        editButton.title = "Edit task";


        editButton.addEventListener("click", function () {

            editTask(task.id);

        });


        /* Delete button */

        const deleteButton = document.createElement("button");

        deleteButton.className =
            "btn btn-outline-danger btn-sm";

        deleteButton.innerHTML =
            '<i class="bi bi-trash"></i>';

        deleteButton.title = "Delete task";


        deleteButton.addEventListener("click", function () {

            deleteTask(task.id);

        });


        /* Add buttons */

        actions.appendChild(editButton);

        actions.appendChild(deleteButton);


        /* Add everything */

        listItem.appendChild(checkbox);

        listItem.appendChild(taskText);

        listItem.appendChild(actions);


        taskList.appendChild(listItem);

    });


    updateTaskCount();

}


/* =========================================
   TOGGLE TASK
========================================= */

function toggleTask(id) {

    const task = tasks.find(function (task) {

        return task.id === id;

    });


    if (task) {

        task.completed = !task.completed;

        saveTasks();

        renderTasks();

    }

}


/* =========================================
   EDIT TASK
========================================= */

function editTask(id) {

    const task = tasks.find(function (task) {

        return task.id === id;

    });


    if (!task) {
        return;
    }


    const newTitle = prompt(
        "Edit your task:",
        task.title
    );


    if (newTitle === null) {
        return;
    }


    const trimmedTitle = newTitle.trim();


    if (trimmedTitle === "") {

        alert("Task cannot be empty.");

        return;
    }


    /* Check duplicate */

    const duplicateTask = tasks.some(function (item) {

        return (
            item.id !== id &&
            item.title.toLowerCase() === trimmedTitle.toLowerCase()
        );

    });


    if (duplicateTask) {

        alert("Another task with this name already exists.");

        return;
    }


    /* Update */

    task.title = trimmedTitle;


    /* Save */

    saveTasks();


    /* Re-render */

    renderTasks();

}


/* =========================================
   DELETE TASK
========================================= */

function deleteTask(id) {

    const task = tasks.find(function (task) {

        return task.id === id;

    });


    if (!task) {
        return;
    }


    const confirmed = confirm(
        `Are you sure you want to delete "${task.title}"?`
    );


    if (!confirmed) {
        return;
    }


    tasks = tasks.filter(function (task) {

        return task.id !== id;

    });


    saveTasks();

    renderTasks();

}


/* =========================================
   UPDATE TASK COUNT
========================================= */

function updateTaskCount() {

    const totalTasks = tasks.length;

    const completedTasks = tasks.filter(function (task) {

        return task.completed;

    }).length;


    if (currentFilter === "all") {

        taskCount.textContent =
            `${totalTasks} task${totalTasks !== 1 ? "s" : ""}`;

    }

    else if (currentFilter === "pending") {

        const pendingTasks = totalTasks - completedTasks;

        taskCount.textContent =
            `${pendingTasks} pending`;

    }

    else {

        taskCount.textContent =
            `${completedTasks} completed`;

    }

}


/* =========================================
   FILTER TASKS
========================================= */

filterButtons.forEach(function (button) {

    button.addEventListener("click", function () {

        currentFilter = button.dataset.filter;


        /* Update button styles */

        filterButtons.forEach(function (btn) {

            btn.classList.remove("active");

            btn.classList.remove("btn-primary");

            btn.classList.add("btn-outline-primary");

        });


        button.classList.add("active");

        button.classList.remove("btn-outline-primary");

        button.classList.add("btn-primary");


        renderTasks();

    });

});


/* =========================================
   ENTER KEY SUPPORT
========================================= */

taskInput.addEventListener("keydown", function (event) {

    if (event.key === "Enter") {

        event.preventDefault();

        taskForm.dispatchEvent(
            new Event("submit")
        );

    }

});


/* =========================================
   INITIALIZE APPLICATION
========================================= */

displayCurrentDate();

loadTasks();