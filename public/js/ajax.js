document.getElementById('userForm').addEventListener('submit', async function (e) {
    e.preventDefault();

    // Gather user data
    const name = document.getElementById('name').value.trim();
    const email = document.getElementById('email').value.trim();
    const password = document.getElementById('password').value;
    const img = document.getElementById('img').value.trim();
    const admin = document.getElementById('isAdmin').checked;

    // Basic validation
    if (!name || !email || !password) {
        return alert('Please fill in name, email, and password.');
    }

    const userData = {
        name,
        email,
        password,
        img,
        admin,
        favs: [],
        adds: [],
    };

    try {
        // Register user
        const userRes = await fetch('/api/users/register', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(userData),
        });

        if (!userRes.ok) {
            const errMsg = await userRes.text();
            throw new Error(`Registration failed: ${errMsg}`);
        }

        const user = await userRes.json();
        alert('User saved: ' + user.name);
        document.getElementById('userForm').reset();

        // Prepare recipe form data
        const formData = new FormData();
        const imageInput = document.getElementById('image');

        formData.append('image', imageInput.files[0]);
        formData.append('title', document.getElementById('recipeTitle').value);
        formData.append('description', document.getElementById('description').value);
        formData.append('ingredients', document.getElementById('ingredients').value);
        formData.append('userId', user.id || user._id); // account for either key

        // Create recipe
        const recipeRes = await fetch('/api/recipes', {
            method: 'POST',
            body: formData,
        });

        if (!recipeRes.ok) {
            const errMsg = await recipeRes.text();
            throw new Error(`Recipe creation failed: ${errMsg}`);
        }

        const recipe = await recipeRes.json();
        alert('Recipe saved: ' + recipe.title);

    } catch (error) {
        console.error('Error:', error);
        alert('Something went wrong: ' + error.message);
    }
});
