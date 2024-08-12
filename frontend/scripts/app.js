// frontend/scripts/app.js

document.getElementById('search-button').addEventListener('click', async () => {
    const fileName = document.getElementById('file-name').value;
    if (!fileName) {
        alert('Please enter a file name.');
        return;
    }

    try {
        // Use the correct URL to fetch data
        const response = await fetch(`http://127.0.0.1:5000/search?file_name=${encodeURIComponent(fileName)}`);
        const data = await response.json();

        if (response.ok) {
            displayResults(data);
        } else {
            alert(data.error || 'An error occurred');
        }
    } catch (error) {
        console.error('Error fetching data:', error);
    }
});

function displayResults(files) {
    const fileList = document.getElementById('file-list');
    fileList.innerHTML = '';

    if (files.length === 0) {
        fileList.innerHTML = '<li>No files found.</li>';
        return;
    }

    files.forEach(file => {
        const listItem = document.createElement('li');
        listItem.textContent = file;
        fileList.appendChild(listItem);
    });
}
