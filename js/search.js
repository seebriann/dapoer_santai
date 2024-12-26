document.addEventListener('DOMContentLoaded', () => {
    const searchInput = document.getElementById('search-input');
    const resultsContainer = document.getElementById('results');
    const searchIcon = document.querySelector('.search-icon');

    let recipes = [];
    fetch('./json/detail-resep.json')
        .then(response => response.json())
        .then(data => {
            recipes = data.recipes;
        })
        .catch(error => console.error('Error fetching the recipes:', error));

    // Fungsi untuk menangani pencarian dan menampilkan hasil
    const handleSearch = () => {
        const query = searchInput.value.toLowerCase();
        resultsContainer.innerHTML = ''; 

        const filteredRecipes = recipes.filter(recipe => recipe.name.toLowerCase().includes(query));

        if (filteredRecipes.length > 0) {
            resultsContainer.style.display = 'block';
            filteredRecipes.forEach(recipe => {
                const listItem = document.createElement('li');
                listItem.textContent = recipe.name;

                // Menambahkan tautan ke halaman detail resep
                listItem.addEventListener('click', () => {
                    window.location.href = `detail-resep.html?name=${encodeURIComponent(recipe.name)}`;
                });

                resultsContainer.appendChild(listItem);
            });
        } else {
            const noResult = document.createElement('li');
            noResult.textContent = 'Resep tidak ditemukan';
            noResult.style.color = 'firebrick';
            resultsContainer.appendChild(noResult);
        }
    };

    // Fungsi untuk pencarian ketika "Enter" ditekan atau ikon diklik
    const handleInstantSearch = () => {
        const query = searchInput.value.toLowerCase();

        // Pastikan input tidak kosong dan panjangnya lebih dari 4 karakter
        if (query === '' || query.length < 4) return;

        const filteredRecipes = recipes.filter(recipe => recipe.name.toLowerCase().includes(query));

        if (filteredRecipes.length > 0) {
            const recipe = filteredRecipes[0];
            window.location.href = `detail-resep.html?name=${encodeURIComponent(recipe.name)}`;
        }
    };

    // Event listener untuk input pencarian "Enter"
    searchInput.addEventListener('keypress', (event) => {
        if (event.key === 'Enter') {
            const query = searchInput.value.toLowerCase();

            // Pastikan input tidak kosong dan panjangnya lebih dari 4 karakter
            if (query === '' || query.length < 4) {
                event.preventDefault();
                return;
            }

            const filteredRecipes = recipes.filter(recipe => recipe.name.toLowerCase().includes(query));

            // Hanya lakukan pencarian jika ada hasil
            if (filteredRecipes.length > 0) {
                handleInstantSearch();
            } else {
                event.preventDefault();
            }
        }
    });

    // Event listener untuk klik ikon pencarian
    searchIcon.addEventListener('click', () => {
        const query = searchInput.value.toLowerCase();

        // Pastikan input tidak kosong dan panjangnya lebih dari 4 karakter
        if (query === '' || query.length < 4) return;

        const filteredRecipes = recipes.filter(recipe => recipe.name.toLowerCase().includes(query));

        // Hanya lakukan pencarian jika ada hasil
        if (filteredRecipes.length > 0) {
            handleInstantSearch();
        }
    });

    // Event listener untuk input pencarian
    searchInput.addEventListener('input', handleSearch);
});
