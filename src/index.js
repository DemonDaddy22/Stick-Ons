const addListButton = document.querySelector('#add-list');
const dashboard = document.querySelector('.dashboard-wrapper');
const modal = document.querySelector('.modal');
const newListModalContent = document.querySelector('.modal-content-new-list');
const newCardModalContent = document.querySelector('.modal-content-new-card');
const modalTitle = document.querySelector('.modal-title');
const modalBody = document.querySelector('.modal-body');
const newListSubmit = document.querySelector('#new-list-submit');
const newCardSubmit = document.querySelector('#new-card-submit');
const closeModalBtns = document.querySelectorAll('.modal-close');
const inputs = document.querySelectorAll('input[type="text"]');
const modalError = document.querySelectorAll('.modal-error');

const MODAL_CONTENT = Object.freeze({
    NEW_LIST: {
        ELEMENT: newListModalContent,
        ID: 'modal-content-new-list'
    },
    NEW_CARD: {
        ELEMENT: newCardModalContent,
        ID: 'modal-content-new-card'
    }
});

const INPUTS = {
    'list-title': '',
    'card-title': '',
    'card-description': ''
};

const getRandomID = (offset = 1000) => Math.floor((Math.random() * new Date().getTime()) + (Math.random() * offset));

const getRandomColID = (offset = 1000) => `col-${getRandomID()}`;

const getRandomCardID = (offset = 1000) => `card-${getRandomID()}`;

let data = JSON.parse(localStorage.getItem('dashboard')) || [];

const clearInputs = () => {
    Object.keys(INPUTS).forEach(input => INPUTS[input] = '');
    inputs.forEach(input => input.value = '');
}

const openModal = (modalContentElement, id) => {
    modal.classList.remove('display-none');
    if (modalContentElement) {
        modalContentElement.ELEMENT.classList.add('animate-modal');
        modalContentElement.ELEMENT.classList.remove('display-none');
        modal.dataset.target = modalContentElement.ID;
        if (id) modal.dataset.id = id;
    }
}

const closeModal = () => {
    modal.classList.add('display-none');
    const modalContentElements = Object.keys(MODAL_CONTENT).filter(entry => MODAL_CONTENT[entry].ID === modal.dataset.target);

    let modalContentElement;
    if (modalContentElements.length) modalContentElement = MODAL_CONTENT[modalContentElements[0]].ELEMENT;

    if (modalContentElement) {
        modalContentElement.classList.add('display-none');
    }

    clearInputs();
}

const createElementWithClasses = (classes, element = 'div') => {
    const newElement = document.createElement(element);
    classes.forEach(entry => newElement.classList.add(entry));
    return newElement;
}

const createCloseElement = (id, target, classes, element = 'div') => {
    const close = createElementWithClasses(classes, element);
    close.innerText = '❌';
    close.dataset.id = id;
    close.dataset.target = target;
    return close;
}

const createCard = ({ id, title, description }) => {
    if (!title || !description) return null;

    const card = createElementWithClasses(['card']);
    const cardTitleWrapper = createElementWithClasses(['card-title-wrapper']);
    const cardTitle = createElementWithClasses(['card-title', 'text-dark']);
    const cardDescription = createElementWithClasses(['card-description', 'text-black']);
    const close = createCloseElement(id, 'close-card', ['close']);

    card.dataset.id = id;
    cardTitle.textContent = title;
    cardDescription.textContent = description;

    cardTitleWrapper.appendChild(cardTitle);
    cardTitleWrapper.appendChild(close);
    card.appendChild(cardTitleWrapper);
    card.appendChild(cardDescription);

    return card;
}

const createList = ({ id, title, cards }) => {
    const column = createElementWithClasses(['column-cards']);
    const columnTitleWrapper = createElementWithClasses(['column-title-wrapper']);
    const columnTitle = createElementWithClasses(['column-title', 'text-light']);
    const columnBody = createElementWithClasses(['column-body']);
    const close = createCloseElement(id, 'close-list', ['close']);
    const addCardBtn = createElementWithClasses(['button', 'button-light', 'text-primary', 'width-100']);

    column.dataset.id = id;
    columnTitle.textContent = title;
    addCardBtn.textContent = 'Add Card';
    addCardBtn.dataset.target = 'add-card';
    addCardBtn.dataset.colID = id;

    cards.forEach(({ id, title, description }) => columnBody.append(createCard({ id, title, description })));

    columnTitleWrapper.appendChild(columnTitle);
    columnTitleWrapper.appendChild(close);
    column.appendChild(columnTitleWrapper);
    column.appendChild(columnBody);
    column.appendChild(addCardBtn);

    return column;
}

const addNewCard = e => {
    if (!INPUTS['card-title'] || !INPUTS['card-description']) {
        modalError[1].classList.remove('display-none');
        return;
    }

    const newCard = { id: getRandomCardID(), title: INPUTS['card-title'], description: INPUTS['card-description'] };
    data = data.map(entry => entry.id === modal.dataset.id ? { ...entry, cards: [...entry.cards, newCard] } : entry);
    localStorage.setItem('dashboard', JSON.stringify(data));
    modalError[1].classList.add('display-none');
    setDashboard(data);
    closeModal();
}

const addNewList = () => {
    if (!INPUTS['list-title']) {
        modalError[0].classList.remove('display-none');
        return;
    }

    const newColumn = { id: getRandomColID(), title: INPUTS['list-title'], cards: [] };
    data = [...data, newColumn];
    localStorage.setItem('dashboard', JSON.stringify(data));
    modalError[1].classList.add('display-none');
    setDashboard(data);
    closeModal();
}

const removeList = id => {
    data = data.filter(entry => entry.id !== id);
    localStorage.setItem('dashboard', JSON.stringify(data));
    setDashboard(data);
}

const removeCard = id => {
    data = data.map(entry => ({ ...entry, cards: entry.cards.filter(card => card.id !== id) }));
    localStorage.setItem('dashboard', JSON.stringify(data));
    setDashboard(data);
}

const handleInputChange = e => {
    const { name, value } = e.target;
    INPUTS[name] = value;
}

const setDashboard = data => {
    dashboard.innerHTML = data.length
        ? data.map(entry => createList(entry).outerHTML).join('')
        : `<div class='no-data'>Your dashboard looks clean, make it messy by adding some lists 😃</div>`;
}

addListButton.addEventListener('click', () => openModal(MODAL_CONTENT.NEW_LIST));

newListSubmit.addEventListener('click', addNewList);

modal.addEventListener('click', e => {
    const modalContent = modal.dataset.target === MODAL_CONTENT.NEW_LIST.ID ? newListModalContent : newCardModalContent;
    const { left, right, top, bottom } = modalContent.getBoundingClientRect();
    const x = e.clientX, y = e.clientY;

    if ((x >= left && x <= right) && (y >= top && y <= bottom)) return;
    closeModal();
});

closeModalBtns.forEach(btn => btn.addEventListener('click', closeModal));

inputs.forEach(input => input.addEventListener('change', handleInputChange));

dashboard.addEventListener('click', e => {
    const target = e?.target?.dataset?.target, id = e?.target?.dataset?.id;
    switch (target) {
        case 'add-card': {
            openModal(MODAL_CONTENT.NEW_CARD, e?.target?.dataset?.colID);
            break;
        }
        case 'close-list': {
            removeList(id);
            break;
        }
        case 'close-card': {
            removeCard(id);
            break;
        }
        default: break;
    }
});

newCardSubmit.addEventListener('click', addNewCard);

setDashboard(data);