// On créé ici un tableau TODO_ITEMS qui contient deux objets 
const TODO_ITEMS = [
    {id: 1, text:'Faire les courses', done: false},
    {id: 2, text:'Aller chercher les enfants', done: true},
];

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
};

// Pour chaque élément du tableau TODO_ITEMS, on appelle la fonction addTodo en fournissant
// l'item
TODO_ITEMS.forEach((item) => addTodo(item));
