document.getElementById('search-form').addEventListener('submit', function(event) {
    event.preventDefault();
    const query = document.getElementById('search-input').value;
    if (query) {
        fetchResults(query);
    }
});

function fetchResults(query) {
    // 关键改变：URL现在指向我们自己的Serverless Function
    // 注意，我们通过查询参数 ?query=... 来传递搜索词
    const url = `/api/search?query=${encodeURIComponent(query)}`;

    // API Key 和 Search Engine ID 已从前端代码中完全移除！
    
    fetch(url)
        .then(response => {
            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }
            return response.json();
        })
        .then(data => {
            // 注意：Google的搜索结果在 `data.items` 中
            displayResults(data.items);
        })
        .catch(error => {
            console.error('Error fetching search results:', error);
            const resultsContainer = document.getElementById('results-container');
            resultsContainer.innerHTML = '<p style="color: red;">Failed to load search results. Please try again later.</p>';
        });
}

// displayResults 函数保持不变
function displayResults(items) {
    const resultsContainer = document.getElementById('results-container');
    resultsContainer.innerHTML = ''; // 清除之前的结果

    if (items && items.length > 0) {
        items.forEach(item => {
            const resultElement = document.createElement('div');
            resultElement.classList.add('result-item');

            const titleElement = document.createElement('h3');
            const linkElement = document.createElement('a');
            linkElement.href = item.link;
            linkElement.textContent = item.title;
            linkElement.target = '_blank';
            titleElement.appendChild(linkElement);

            const snippetElement = document.createElement('p');
            snippetElement.textContent = item.snippet;

            resultElement.appendChild(titleElement);
            resultElement.appendChild(snippetElement);

            resultsContainer.appendChild(resultElement);
        });
    } else {
        resultsContainer.textContent = 'No results found.';
    }
}