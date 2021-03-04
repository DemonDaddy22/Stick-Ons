const addListButton = document.querySelector('#add-list');
const dashboard = document.querySelector('.dashboard-wrapper');
const modal = document.querySelector('.modal');
const modalContent = document.querySelector('.modal-content');
const closeModalBtn = document.querySelector('#modal-close');

const openModal = () => {
    modal.classList.remove('display-none');
    modalContent.classList.add('animate-modal');
}

const closeModal = () => modal.classList.add('display-none');

const createElementWithClasses = (classes, element = 'div') => {
    const newElement = document.createElement(element);
    classes.forEach(entry => newElement.classList.add(entry));
    return newElement;
}

const addNewList = () => {
    openModal();
    // const newList = createElementWithClasses(['column-cards']);
    // const columnTitleWrapper = createElementWithClasses(['column-title-wrapper']);
    // const columnTitle = createElementWithClasses(['column-title', 'text-light']);
    // const columnBody = createElementWithClasses(['column-body']);

    // columnTitle.textContent = 'Testing';

    // columnTitleWrapper.appendChild(columnTitle);
    // newList.appendChild(columnTitleWrapper);
    // newList.appendChild(columnBody);

    // dashboard.appendChild(newList);
}

addListButton.addEventListener('click', addNewList);

modal.addEventListener('click', e => {
    const { left, right, top, bottom } = modalContent.getBoundingClientRect();
    const x = e.clientX, y = e.clientY;

    if ((x >= left && x <= right) && (y >= top && y <= bottom)) return;
    closeModal();
});

closeModalBtn.addEventListener('click', closeModal);