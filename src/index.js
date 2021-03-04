const addListButton = document.querySelector('#add-list');
const dashboard = document.querySelector('.dashboard-wrapper');
const modal = document.querySelector('.modal');
const modalContent = document.querySelector('.modal-content');
const newListModalContent = document.querySelector('.modal-content-new-list');
const newCardModalContent = document.querySelector('.modal-content-new-card');
const modalTitle = document.querySelector('.modal-title');
const modalBody = document.querySelector('.modal-body');
const newListSubmit = document.querySelector('#new-list-submit');
const newCardSubmit = document.querySelector('#new-card-submit');
const closeModalBtn = document.querySelector('#modal-close');
const inputs = document.querySelectorAll('input[type="text"]');
const modalError = document.querySelector('.modal-error');

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

const clearInputs = () => Object.keys(INPUTS).forEach(input => INPUTS[input] = '');

const openModal = modalContentElement => {
    modal.classList.remove('display-none');
    if (modalContentElement) {
        modalContentElement.ELEMENT.classList.add('animate-modal');
        modalContentElement.ELEMENT.classList.remove('display-none');
        modal.dataset.target = modalContentElement.ID;
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

const addNewList = () => {
    if (!INPUTS['list-title']) {
        modalError.classList.remove('display-none');
        return;
    }

    const newList = createElementWithClasses(['column-cards']);
    const columnTitleWrapper = createElementWithClasses(['column-title-wrapper']);
    const columnTitle = createElementWithClasses(['column-title', 'text-light']);
    const columnBody = createElementWithClasses(['column-body']);

    columnTitle.textContent = INPUTS['list-title'];

    columnTitleWrapper.appendChild(columnTitle);
    newList.appendChild(columnTitleWrapper);
    newList.appendChild(columnBody);

    dashboard.appendChild(newList);

    clearInputs();
    closeModal();
}

const handleInputChange = e => {
    const { name, value } = e.target;
    INPUTS[name] = value;
}

addListButton.addEventListener('click', () => openModal(MODAL_CONTENT.NEW_LIST));

newListSubmit.addEventListener('click', addNewList);

modal.addEventListener('click', e => {
    const { left, right, top, bottom } = modalContent.getBoundingClientRect();
    const x = e.clientX, y = e.clientY;

    if ((x >= left && x <= right) && (y >= top && y <= bottom)) return;
    closeModal();
});

closeModalBtn.addEventListener('click', closeModal);

inputs.forEach(input => input.addEventListener('change', handleInputChange));