(() => {
  function wire(container, buttons, items, mode) {
    function activate(index) {
      items.forEach((item, i) => {
        item.classList.toggle('is-active', i === index);
        if (mode === 'posters') item.hidden = i !== index;
      });
      buttons.forEach((button, i) => button.setAttribute(mode === 'posters' ? 'aria-pressed' : 'aria-expanded', String(i === index)));
    }
    buttons.forEach((button, index) => {
      button.addEventListener('click', () => activate(index));
      button.addEventListener('keydown', event => {
        let next;
        if (event.key === 'ArrowRight' || event.key === 'ArrowDown') next = (index + 1) % buttons.length;
        else if (event.key === 'ArrowLeft' || event.key === 'ArrowUp') next = (index + buttons.length - 1) % buttons.length;
        else if (event.key === 'Home') next = 0;
        else if (event.key === 'End') next = buttons.length - 1;
        else return;
        event.preventDefault(); activate(next); buttons[next].focus();
      });
    });
    container.classList.add(mode + '-ready'); activate(0);
  }
  const shutters = document.querySelector('.shutters');
  if (shutters) wire(shutters, [...shutters.querySelectorAll('.shutter-select')], [...shutters.querySelectorAll('.shutter')], 'shutters');
  const posters = document.querySelector('.poster-study');
  if (posters) wire(posters, [...posters.querySelectorAll('.poster-tabs button')], [...posters.querySelectorAll('.type-poster')], 'posters');
})();
