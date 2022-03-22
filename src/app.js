const SUPABASE_URL = "https://fbcrskgxnamvucyhzbjj.supabase.co/rest/v1/todos";
const SUPABASE_API_KEY = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImZiY3Jza2d4bmFtdnVjeWh6YmpqIiwicm9sZSI6ImFub24iLCJpYXQiOjE2NDc4MjA4NTksImV4cCI6MTk2MzM5Njg1OX0.n-VJRhAx9pY21uIuX_5X0Vi3LYQ6Bzi8cH-oXL4ckFk";

// Lorsque les éléments du DOM sont tous connus
document.addEventListener('DOMContentLoaded', () => {
    // Appel HTTP vers Supabase
    fetch(`${SUPABASE_URL}?order=created_at`, {
        headers: {
            apiKey: SUPABASE_API_KEY,
        },
    })
    .then(response => response.json())
    .then(items => {
        items.forEach(item => addTodo(item));
    });
});

// Nous créons une fonction qui servira à ajouter un élément dans le UL à partir d'un objet tâche
const addTodo = (item) => {
    // On sélectionne le <ul>
    const container = document.querySelector('ul');

    // On ajoute du HTML à la fin du <ul>
    container.insertAdjacentHTML(
        'beforeend',
        `
        <li>
            <label>
                <input type='checkbox' id='todo-${item.id}' ${item.done ? 'checked' : ''} />
                ${item.text}
            </label>
        </li>
        `
    );

    // Nous sélectionnons la checkbox fraichement ajoutée au DOM
    // Et nous lions la fonction onClickCheckbox au click
    document.querySelector("input#todo-" + item.id).addEventListener('click', onClickCheckbox)
};

// On souhaite réagir à chaque fois que le formulaire est soumis
document.querySelector('form').addEventListener('submit', (e) => {
    // On souhaite aussi empêcher le rechargement de la page
    e.preventDefault();

    // On récupère l'input
    const input = document.querySelector('input[name="todo-text"]');

    // On créé une nouvelle tâche avec pour text la valeur tapée dans l'input
    const item = {
        text: input.value,
        done: false,
    };

    fetch(SUPABASE_URL, {
        method: "POST",
        body: JSON.stringify(item),
        headers: {
            "Content-Type": "application/json",
            "apiKey": SUPABASE_API_KEY,
            Prefer: "return=representation",
        },
    })
    .then(response => response.json())
    .then(items => {
        addTodo(items[0]);
        input.value = '';
        input.focus();
    });
});

// Nous souhaitons intervenir lors d'un click sur une checkbox
const onClickCheckbox = (e) => {
    // Nous récupérons l'identifiant de la checkbox (ressemble à "todo-1" ou "todo-23" ...)
    const inputId = e.target.id;
    // Nous en déduisons l'identifiant de la tâche dans Supabase (ne récupérant que le nombre)
    const id = +inputId.split("-").pop();
    // On découvre si la checkbox était déjà cochée ou pas
    const isDone = e.target.checked;

    // Nous empêchons le comportement par défaut de l'événement (cocher ou décocher)
    e.preventDefault();

    fetch(`${SUPABASE_URL}?id=eq.${id}`, {
        method: "PATCH",
        headers: {
            "Content-Type": "application/json",
            apiKey: SUPABASE_API_KEY,
            Prefer: "return=representation",
        },
        body: JSON.stringify({done: isDone}),
    } ).then(() => {
        // Lorsque le serveur a pris en compte la demande et nous a répond
        // Nous cochons (ou décochons) la case
        e.target.checked = isDone;
    });
};
