document.addEventListener('DOMContentLoaded', () => {
    // Seleksi elemen kontainer resep
    const recipeContainer = document.getElementById('recipe-container');

    // Mengambil data dari file JSON eksternal untuk resep
    fetch('./json/detail-resep.json')
        .then(response => response.json())
        .then(data => {
            const recipes = data.recipes;

            // Membuat kartu resep
            recipes.forEach(recipe => {
                // Membuat elemen kartu resep
                const recipeCard = document.createElement('div');
                recipeCard.classList.add('recipe-card');

                // Menambahkan gambar resep
                const recipeImage = document.createElement('img');
                recipeImage.src = recipe.image;
                recipeImage.alt = recipe.name;

                // Menambahkan judul resep
                const recipeName = document.createElement('p');
                recipeName.textContent = recipe.name;

                // Menyusun elemen ke dalam kartu
                recipeCard.appendChild(recipeImage);
                recipeCard.appendChild(recipeName);

                // Menambahkan event listener untuk membuka detail resep
                recipeCard.addEventListener('click', () => {
                    window.location.href = `detail-resep.html?name=${encodeURIComponent(recipe.name)}`;
                });

                // Menambahkan kartu ke dalam kontainer
                recipeContainer.appendChild(recipeCard);
            });
        })
        .catch(error => console.error('Error fetching the recipes:', error));
});