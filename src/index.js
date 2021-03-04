const addListButton = document.querySelector('#add-list');
const dashboard = document.querySelector('.dashboard-wrapper');

const addNewList = () => {
    const newList = createElementWithClasses(['column-cards']);
    const columnTitleWrapper = createElementWithClasses(['column-title-wrapper']);
    const columnTitle = createElementWithClasses(['column-title', 'text-light']);
    const columnBody = createElementWithClasses(['column-body']);

    columnTitle.textContent = 'Testing';

    columnTitleWrapper.appendChild(columnTitle);
    newList.appendChild(columnTitleWrapper);
    newList.appendChild(columnBody);
    
    dashboard.appendChild(newList);
}

const createElementWithClasses = (classes, element = 'div') => {
    const newElement = document.createElement(element);
    classes.forEach(entry => newElement.classList.add(entry));
    return newElement;
}

addListButton.addEventListener('click', addNewList);