
(() => {
  const darkBtn = document.getElementById('darkBtn');
  if(darkBtn){
    darkBtn.addEventListener('click', () => {
      document.body.classList.toggle('dark');
    });
  }
})();
