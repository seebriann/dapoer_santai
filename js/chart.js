document.addEventListener('DOMContentLoaded', () => {
    const commentsData = JSON.parse(localStorage.getItem('commentsData')) || {};
    const likesData = JSON.parse(localStorage.getItem('likesData')) || {};
    const visitsData = JSON.parse(localStorage.getItem('visitData')) || {};

    const recipeFilter = document.getElementById('recipeFilter');
    const allRecipeNames = [
        "Nasi Goreng",
        "Rendang",
        "Siomay Ayam",
        "Rawon",
        "Klepon",
        "Sate Buntel Solo",
        "Ketoprak",
        "Pecel",
        "Moaci Semarang",
        "Cilok",
        "Bakmi Goreng Jawa",
        "Perkedel Kentang"
    ];
    allRecipeNames.forEach(recipeName => {
        const option = document.createElement('option');
        option.value = recipeName;
        option.textContent = recipeName;
        recipeFilter.appendChild(option);
    });
    

    function getStatistics(recipeName) {
        const comments = commentsData[recipeName] || [];
        const likes = likesData[recipeName] || 0;
        const visits = visitsData[recipeName] || 0;
        const ratings = comments.map(comment => comment.rating);
    
        const commentCount = comments.length;
        const totalRatings = ratings.reduce((acc, rating) => acc + parseFloat(rating || 0), 0);
        const ratingAverage = ratings.length > 0 ? (totalRatings / ratings.length) : 0;
    
        return { likes, visits, commentCount, ratingAverage };
    }
    

    const recipeColors = {
        "Nasi Goreng": "#fee327",
        "Rendang": "#fdca54",
        "Siomay Ayam": "#f6a570",
        "Rawon": "#f1969b",
        "Klepon": "#f08ab1",
        "Sate Buntel Solo": "#c78dbd",
        "Ketoprak": "#927db6",
        "Pecel": "#5da0d7",
        "Moaci Semarang": "#00b3e1",
        "Cilok": "#50bcbf",
        "Bakmi Goreng Jawa": "#65bda5",
        "Perkedel Kentang": "#87bf54"
    };


    

    function getColorsForRecipes(recipeNames) {
        return recipeNames.map(name => recipeColors[name] || "#CCCCCC");
    }

    function updateCharts(filter) {
        const filteredRecipes = filter && filter !== "Semua Resep" ? [filter] : allRecipeNames;
    
        const likesDataForChart = [];
        const visitsDataForChart = [];
        const commentCountsForChart = [];
        const ratingAveragesForChart = [];
    
        let totalLikes = 0;
        let totalVisits = 0;
        let totalComments = 0;
        let totalRatings = 0;
    
        filteredRecipes.forEach(recipeName => {
            const stats = getStatistics(recipeName);
            likesDataForChart.push(stats.likes);
            visitsDataForChart.push(stats.visits);
            commentCountsForChart.push(stats.commentCount);
            ratingAveragesForChart.push(stats.ratingAverage);
    
            totalLikes += stats.likes;
            totalVisits += stats.visits;
            totalComments += stats.commentCount;
            totalRatings += stats.ratingAverage * stats.commentCount;
        });
    
        const colorsForFilteredRecipes = getColorsForRecipes(filteredRecipes);
    
        const commentPercentages = commentCountsForChart.map(count => {
            return totalComments > 0 ? ((count / totalComments) * 100).toFixed(1) : 0;
        });
    
        mixedChart.data.labels = filteredRecipes;
        mixedChart.data.datasets[0].data = likesDataForChart;
        mixedChart.data.datasets[1].data = visitsDataForChart;
        mixedChart.data.datasets[0].backgroundColor = colorsForFilteredRecipes;
        mixedChart.data.datasets[1].backgroundColor = colorsForFilteredRecipes;
        mixedChart.update();
    

        const commentLabelsWithPercent = filteredRecipes.map((name, index) => {
            return `${name} (${commentPercentages[index]}%)`;
        });
    
        commentChart.data.labels = commentLabelsWithPercent;
        commentChart.data.datasets[0].data = commentCountsForChart;
        commentChart.data.datasets[0].backgroundColor = colorsForFilteredRecipes;
        commentChart.update();
    

        ratingChart.data.labels = filteredRecipes;
        ratingChart.data.datasets[0].data = ratingAveragesForChart;
        ratingChart.data.datasets[0].backgroundColor = colorsForFilteredRecipes;
        ratingChart.update();

        const totalRecipes = filteredRecipes.length;
        const averageRating = totalComments > 0 ? (totalRatings / totalComments) : 0;
    
        document.getElementById('totalRecipes').textContent = totalRecipes;
        document.getElementById('totalLikes').textContent = totalLikes;
        document.getElementById('totalVisits').textContent = totalVisits;
        document.getElementById('averageRating').textContent = averageRating.toFixed(1);
    }
          

    const ctxMixed = document.getElementById('likeAndVisitChart').getContext('2d');
    const mixedChart = new Chart(ctxMixed, {
        data: {
            labels: allRecipeNames,
            datasets: [{
                type: 'bar',
                label: 'Banyaknya Like',
                data: []
            }, {
                type: 'line',
                label: 'Banyaknya Kunjungan',
                data: [],
                fill: false,
                borderColor: '#4e5adb',
                tension: 0.1,
                pointRadius: 5, 
                borderWidth: 2.5
            }]
        },
        options: {
            responsive: true,
            plugins: {
                legend: { display: true },
                title: {
                    display: true,
                    text: 'Grafik Like dan Kunjungan Resep',
                    font: {
                        size: 20,
                        weight: 'bold',
                        family:'Playfair Display'                    
                    },
                    color: 'black'
                }
            },
            scales: {
                y: {
                    beginAtZero: true,
                    title: {
                        display: true,
                        text: 'Jumlah'
                    }
                },
                x: {
                    title: {
                        display: true,
                        text: 'Resep' 
                    }
                }
            }
        }
    });

    const ctxComment = document.getElementById('commentChart').getContext('2d');
    const commentChart = new Chart(ctxComment, {
        type: 'pie',
        data: {
            labels: allRecipeNames,
            datasets: [{
                label: 'Banyaknya Komentar',
                data: [],
                backgroundColor: [],
                borderWidth: 0
            }]
        },
        options: {
            responsive: true,
            plugins: {
                legend: { display: false },
                title: {
                    display: true,
                    text: 'Proporsi Banyaknya Komentar per Resep',
                    font: {
                        size: 20,
                        weight: 'bold',
                        family:'Playfair Display'                   
                    },
                    color: 'black'
                }
            }
        }
    });

    const ctxRating = document.getElementById('ratingChart').getContext('2d');
    const ratingChart = new Chart(ctxRating, {
        type: 'doughnut',
        data: {
            labels: allRecipeNames,
            datasets: [{
                label: 'Rata-rata Rating',
                data: [],
                backgroundColor: [],
                borderWidth: 0
            }]
        },
        options: {
            responsive: true,
            plugins: {
                legend: { display: false },
                title: {
                    display: true,
                    text: 'Rata-rata Rating per Resep',
                    font: {
                        size: 20,
                        weight: 'bold',
                        family:'Playfair Display'                   
                    },
                    color: 'black'
                }
            }
        }
    });

    recipeFilter.addEventListener('change', (e) => {
        updateCharts(e.target.value);
    });

    updateCharts();
});