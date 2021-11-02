document.addEventListener('DOMContentLoaded', () => {
  const errorMsg = document.querySelector('.errors');
  const successMsg = document.querySelector('.success');

  if (errorMsg !== '') {
    setTimeout(() => {
      errorMsg.innerHTML = '';
    }, 3000);
  }

  if (successMsg !== '') {
    setTimeout(() => {
      successMsg.innerHTML = '';
    }, 3000);
  }
});
