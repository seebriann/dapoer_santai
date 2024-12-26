document.addEventListener('DOMContentLoaded', () => {
    // Mengambil nama resep dari parameter URL
    const urlParams = new URLSearchParams(window.location.search);
    const recipeName = decodeURIComponent(urlParams.get('name'));

    // Ubah title halaman sesuai dengan nama resep
    document.title = `Resep ${recipeName}`;

    // Mengambil data dari file JSON eksternal untuk detail resep
    fetch('./json/detail-resep.json')
        .then(response => response.json())
        .then(data => {
            // Mencari resep berdasarkan nama
            const recipe = data.recipes.find(r => r.name === recipeName);

            if (recipe) {
                // Menampilkan nama resep
                document.getElementById('recipe-name').textContent = recipe.name;

                // Menampilkan gambar resep
                const recipeImage = document.getElementById('recipe-image');
                recipeImage.src = recipe.image;
                recipeImage.alt = recipe.name;

                // Menampilkan bahan-bahan
                const ingredientsList = document.getElementById('ingredients-list');
                recipe.ingredients.main.forEach(ingredient => {
                    const listItem = document.createElement('li');
                    listItem.textContent = `${ingredient.item} - ${ingredient.quantity}`;
                    ingredientsList.appendChild(listItem);
                });

                // Menampilkan bumbu
                const spicesList = document.getElementById('spices-list');
                recipe.ingredients.spices.forEach(spice => {
                    const listItem = document.createElement('li');
                    listItem.textContent = `${spice.item} - ${spice.quantity}`;
                    spicesList.appendChild(listItem);
                });

                // Menampilkan bahan pelengkap
                const garnishesList = document.getElementById('garnishes-list');
                recipe.ingredients.garnishes.forEach(garnish => {
                    const listItem = document.createElement('li');
                    listItem.textContent = garnish;
                    garnishesList.appendChild(listItem);
                });

                // Menampilkan langkah-langkah
                const stepsList = document.getElementById('steps-list');
                recipe.steps.forEach(step => {
                    const listItem = document.createElement('li');
                    listItem.textContent = step;
                    stepsList.appendChild(listItem);
                });

                // Menampilkan video tutorial
                const videoTutorial = document.getElementById('video-tutorial');
                videoTutorial.src = recipe.video_link;

                // Menambahkan Resep Lainnya
                addOtherRecipes(data.recipes, recipeName);
                
                // Initialize likes and comments for this specific recipe
                initializeLikesAndComments(recipeName);
            } else {
                console.error('Recipe not found:', recipeName);
            }
        })
        .catch(error => console.error('Error fetching the recipe details:', error));

    // Fungsi untuk menyimpan jumlah kunjungan
    function updateVisitCount(recipeName) {
        let visitData = JSON.parse(localStorage.getItem('visitData')) || {};

        // Perbarui jumlah kunjungan untuk resep tertentu
        if (visitData[recipeName]) {
            visitData[recipeName] += 1;
        } else {
            visitData[recipeName] = 1;
        }

        localStorage.setItem('visitData', JSON.stringify(visitData));

        // Menampilkan jumlah kunjungan di halaman (opsional)
        const visitCountElement = document.getElementById('visit-count');
        if (visitCountElement) {
            visitCountElement.textContent = `Dikunjungi ${visitData[recipeName]} kali`;
        }
    }

    // Panggil fungsi updateVisitCount saat halaman dimuat
    updateVisitCount(recipeName);


    // Fungsi untuk menambahkan resep lainnya
    function addOtherRecipes(recipes, currentRecipeName) {
        const otherRecipesContainer = document.getElementById('other-recipes');
        
        // Mengambil indeks resep saat ini
        const currentIndex = recipes.findIndex(recipe => recipe.name === currentRecipeName);
        const numberOfRecipes = recipes.length;
        const otherRecipes = [];

        // Mengambil 3 resep berikutnya
        for (let i = 1; i <= 3; i++) {
            // Hitung indeks untuk kembali ke awal
            const nextIndex = (currentIndex + i) % numberOfRecipes;
            otherRecipes.push(recipes[nextIndex]);
        }

        otherRecipes.forEach(recipe => {
            const recipeCard = document.createElement('a');
            recipeCard.href = `detail-resep.html?name=${encodeURIComponent(recipe.name)}`;
            
            const cardDiv = document.createElement('div');
            cardDiv.classList.add('recipe-card');

            const recipeImage = document.createElement('img');
            recipeImage.src = recipe.image;
            recipeImage.alt = recipe.name;

            const recipeName = document.createElement('p');
            recipeName.textContent = recipe.name;

            cardDiv.appendChild(recipeImage);
            cardDiv.appendChild(recipeName);
            recipeCard.appendChild(cardDiv);

            // Menambahkan resep lainnya ke kontainer
            otherRecipesContainer.appendChild(recipeCard);
        });
    }

    // Fungsi untuk menangani komentar, rating, dan like
    function initializeLikesAndComments(recipeName) {
        const stars = document.querySelectorAll('#star-container .star');
        const reviewResult = document.getElementById('review-result');
        const commentInput = document.getElementById('comment-input');
        const submitComment = document.getElementById('submit-comment');
        const commentsList = document.getElementById('comments-list');
        const errorMessage = document.getElementById('error-message');
        const prevBtn = document.getElementById('prev-btn');
        const nextBtn = document.getElementById('next-btn');
        let selectedRating = 0;
        let currentPage = 1; // Menyimpan halaman saat ini
        const commentsPerPage = 5; // Jumlah komentar per halaman
        let commentsData = JSON.parse(localStorage.getItem('commentsData')) || {};
        let likesData = JSON.parse(localStorage.getItem('likesData')) || {};
    
        // Load saved likes and comments for this recipe
        loadSavedData(recipeName);
    
        // Handle star ratings
        stars.forEach(star => {
            star.addEventListener('click', () => {
                selectedRating = star.getAttribute('data-value');
                highlightStars(selectedRating);
            });
        });
    
        function highlightStars(rating) {
            stars.forEach(star => {
                if (star.getAttribute('data-value') <= rating) {
                    star.classList.add('selected');
                } else {
                    star.classList.remove('selected');
                }
            });
        }
    
        // Handle comment submission
        submitComment.addEventListener('click', () => {
            const commentText = commentInput.value.trim();
            const userNameInput = document.getElementById('name-input').value.trim();
        
            if (!selectedRating) {
                showError('Silakan masukkan rating dan komentar.');
                return;
            }
        
            if (commentText === '') {
                showError('Silakan tulis komentar.');
                return;
            }
        
            if (userNameInput === '') {
                showError('Silakan masukkan nama Anda.');
                return;
            }
        
            // Tambahkan komentar ke daftar (prepend untuk menampilkan di atas)
            const commentItem = document.createElement('li');
            commentItem.innerHTML = ` 
                <strong>${userNameInput} - ⭐${selectedRating}</strong>
                <p>${commentText}</p>
            `;
            commentsList.prepend(commentItem); // Ubah dari appendChild ke prepend
        
            // Hapus pesan "Belum ada komentar" jika ada
            const noCommentsMessage = commentsList.querySelector('li');
            if (noCommentsMessage && noCommentsMessage.textContent === 'Belum ada komentar.') {
                noCommentsMessage.remove();
            }
        
            // Simpan komentar untuk resep
            saveComment(recipeName, userNameInput, selectedRating, commentText);
        
            // Bersihkan input
            commentInput.value = '';
            document.getElementById('name-input').value = '';
            selectedRating = 0;
            highlightStars(0);
            errorMessage.style.display = 'none';
        
            // Update pagination setelah komentar baru ditambahkan
            updatePagination();
        });
        
        
    
        // Show error message
        function showError(message) {
            errorMessage.textContent = message;
            errorMessage.style.display = 'block';
        }
    
        // Save comment to localStorage
        function saveComment(recipeName, userId, rating, comment) {
            if (!commentsData[recipeName]) {
                commentsData[recipeName] = [];
            }
            commentsData[recipeName].push({ userId, rating, comment });
            localStorage.setItem('commentsData', JSON.stringify(commentsData));
        }
    
        // Load saved data (likes and comments) for this recipe
        function loadSavedData(recipeName) {
            // Load comments for this specific recipe
            const savedComments = commentsData[recipeName] || [];
    
            // Check if there are no comments
            if (savedComments.length === 0) {
                const noCommentsMessage = document.createElement('li');
                noCommentsMessage.textContent = 'Belum ada komentar.';
                commentsList.appendChild(noCommentsMessage);
            } else {
                displayComments(savedComments);
            }
    
            // Load likes for this specific recipe
            const savedLikes = likesData[recipeName] || 0;
            const likeCountElement = document.getElementById('like-count');
            likeCountElement.textContent = savedLikes;
            
            // Handle like button click
            const likeButton = document.getElementById('like-heart');
            likeButton.addEventListener('click', () => {
                // Increment the like count
                likeButton.classList.toggle('liked');
                if (likeButton.classList.contains('liked')) {
                    likesData[recipeName] = savedLikes + 1;
                } else {
                    likesData[recipeName] = savedLikes;
                }
                
                localStorage.setItem('likesData', JSON.stringify(likesData));
    
                // Update the displayed like count
                likeCountElement.textContent = likesData[recipeName];
            });
        }
        // Fungsi untuk menampilkan komentar dengan pagination
        function displayComments(comments) {
            // Balik urutan komentar untuk memastikan komentar terbaru di atas
            const reversedComments = [...comments].reverse();

            // Tentukan komentar yang akan ditampilkan berdasarkan halaman
            const startIndex = (currentPage - 1) * commentsPerPage;
            const endIndex = currentPage * commentsPerPage;
            const commentsToDisplay = reversedComments.slice(startIndex, endIndex);

            // Clear komentar yang ada
            commentsList.innerHTML = '';

            // Tampilkan komentar yang sesuai dengan halaman
            commentsToDisplay.forEach(({ userId, rating, comment }) => {
                const commentItem = document.createElement('li');
                commentItem.innerHTML = `
                    <strong>${userId} - ⭐${rating}</strong>
                    <p>${comment}</p>
                `;
                commentsList.appendChild(commentItem);
            });

            // Update tombol prev/next visibility
            prevBtn.disabled = currentPage === 1;
            nextBtn.disabled = currentPage * commentsPerPage >= reversedComments.length;
        }

        // Fungsi untuk memperbarui pagination
        function updatePagination() {
            const allComments = commentsData[recipeName] || [];
            displayComments(allComments);
        }

        // Menangani tombol "Previous" dan "Next"
        prevBtn.addEventListener('click', () => {
            if (currentPage > 1) {
                currentPage--;
                updatePagination();
            }
        });

        nextBtn.addEventListener('click', () => {
            const allComments = commentsData[recipeName] || [];
            if (currentPage * commentsPerPage < allComments.length) {
                currentPage++;
                updatePagination();
            }
        });
    }
});
