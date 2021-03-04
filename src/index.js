const addListButton = document.querySelector('#add-list');
const dashboard = document.querySelector('.dashboard-wrapper');
const modal = document.querySelector('.modal');
const newListModalContent = document.querySelector('.modal-content-new-list');
const newCardModalContent = document.querySelector('.modal-content-new-card');
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

const getRandomColID = (offset = 1000) => `col-${getRandomID(offset)}`;

const getRandomCardID = (offset = 1000) => `card-${getRandomID(offset)}`;

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
    if (modalContentElement) modalContentElement.classList.add('display-none');

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

const createCard = ({ colID, id, title, description }) => {
    if (!title || !description) return null;

    const card = createElementWithClasses(['card']);
    const cardTitleWrapper = createElementWithClasses(['card-title-wrapper']);
    const cardTitle = createElementWithClasses(['card-title', 'text-dark']);
    const cardDescription = createElementWithClasses(['card-description', 'text-black']);
    const close = createCloseElement(id, 'close-card', ['close']);

    card.draggable = true;
    card.dataset.id = id;
    card.dataset.colid = colID;
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
    const addCardBtn = createElementWithClasses(['button', 'text-white', 'width-100', 'font-large']);

    column.dataset.id = id;
    columnTitle.textContent = title;
    addCardBtn.textContent = '+';
    addCardBtn.dataset.target = 'add-card';
    addCardBtn.dataset.colid = id;

    cards.forEach(card => columnBody.append(createCard({ colID: id, ...card })));

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
    data = data.map(entry => entry?.id === modal?.dataset?.id ? { ...entry, cards: [...entry.cards, newCard] } : entry);
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
    data = data.filter(entry => entry?.id !== id);
    localStorage.setItem('dashboard', JSON.stringify(data));
    setDashboard(data);
}

const removeCard = (id, colID) => {
    data = data.map(entry => entry?.id === colID ? ({ ...entry, cards: entry.cards.filter(card => card?.id !== id) }) : entry);
    localStorage.setItem('dashboard', JSON.stringify(data));
    setDashboard(data);
}

const moveCard = (cardElement, oldColID, newColID) => {
    const cardID = cardElement.dataset.id;
    let foundCard = null;
    data = data.map(entry => entry?.id === oldColID ? ({
        ...entry, cards: entry.cards.filter(card => {
            if (card?.id !== cardID) return true;
            else {
                foundCard = card;
                return false;
            }
        })
    }) : entry);

    if (foundCard) {
        data = data.map(entry => entry?.id === newColID ? ({
            ...entry, cards: entry.cards.find(card => card?.id === cardID) ? entry.cards : [foundCard, ...entry.cards]
        }) : entry);
        localStorage.setItem('dashboard', JSON.stringify(data));
        setDashboard(data);
    }
}

const setDashboard = data => {
    dashboard.innerHTML = data.length
        ? data.map(entry => createList(entry).outerHTML).join('')
        : `<div class='no-data'>Your dashboard looks clean, make it messy by adding some lists 😃</div>`;
}

const handleInputChange = e => {
    const { name, value } = e.target;
    INPUTS[name] = value;
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
    const target = e?.target?.dataset?.target, id = e?.target?.dataset?.id, colID = e?.target?.dataset?.colid;
    switch (target) {
        case 'add-card': {
            openModal(MODAL_CONTENT.NEW_CARD, colID);
            break;
        }
        case 'close-list': {
            removeList(id);
            break;
        }
        case 'close-card': {
            removeCard(id, colID);
            break;
        }
        default: break;
    }
});

let targetCard = null;

dashboard.addEventListener('dragstart', e => {
    const card = e.target;
    targetCard = card;
    card.classList.add('dragging');
}, false);

dashboard.addEventListener('dragend', e => {
    const card = e.target;
    card.classList.remove('dragging');
}, false);

dashboard.addEventListener('dragover', e => {
    e.preventDefault();
}, false);

dashboard.addEventListener('drop', e => {
    e.preventDefault();
    let oldColID = targetCard?.dataset?.colid;
    const targetNode = e.target;
    if (targetNode?.className === 'column-cards' || targetNode?.className === 'column-title-wrapper' || targetNode?.className === 'column-body') {
        const id = targetNode?.dataset?.id;
        const target = id && id.includes('col') ? targetNode : targetNode.parentNode;
        let newColID = target.dataset?.id;
        if (oldColID && newColID) {
            moveCard(targetCard, oldColID, newColID);
            targetCard.dataset.colid = newColID;
            oldColID = null;
            newColID = null;
        }
    }
}, false);

newCardSubmit.addEventListener('click', addNewCard);

setDashboard(data);