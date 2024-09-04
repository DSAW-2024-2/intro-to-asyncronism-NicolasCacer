window.addEventListener('beforeunload', () => {
    document.body.classList.remove('fade-in');
    document.body.classList.add('fade-out');
});

