document.getElementById('userForm').addEventListener('submit', function(e) {
    e.preventDefault();

    // Gather user data
    const userData = {
        name: document.getElementById('name').value,
        email: document.getElementById('email').value,
        password: document.getElementById('password').value, 
        profilepic: document.getElementById('profilepic').value,
        isAdmin: document.getElementById('isAdmin').checked, 
        favorites: [],
        posted: [],
    };

    // Create user first
    fetch('/api/users/register', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(userData),
    })
    .then(res => res.json())
    .then(user => {
        alert('User saved: ' + user.name);
        document.getElementById('userForm').reset();

        // Prepare recipe form data
        const formData = new FormData();
        const imageInput = document.getElementById('image');

        formData.append('image', imageInput.files[0]);
        formData.append('title', document.getElementById('recipeTitle').value);
        formData.append('description', document.getElementById('description').value);
        formData.append('ingredients', document.getElementById('ingredients').value); // let backend split it
        formData.append('userId', user._id); // assuming user._id is returned from register

        // Send recipe creation request
        return fetch('/api/recipes', {
            method: 'POST',
            body: formData // Do not set Content-Type header manually
        });
    })
    .then(res => res.json())
    .then(recipe => {
        alert('Recipe saved: ' + recipe.title);
    })
    .catch(error => {
        console.error('Error:', error);
        alert('Something went wrong.');
    });
});
