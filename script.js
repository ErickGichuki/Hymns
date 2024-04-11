//Add event listener to ensure that DOM is loaded before javascript is executed
document.addEventListener('DOMContentLoaded', function() {
    const searchInput = document.getElementById('searchInput');
    const searchBtn = document.getElementById('searchBtn');
    const hymnsList = document.getElementById('hymns-list');
    const previousButton = document.getElementById('previous');
    const homeButton = document.getElementById('home');
    const table = document.getElementById('hymnsTable');
    const comments = document.getElementById('comment');
    const commentForm = document.getElementById('comment-form');
    const commentList = document.getElementById('comments-list');
    const hymnLyrics = document.getElementById('hymn-lyrics');
    const hymnTitle = document.getElementById('hymn-title');
    const myHymns = new Request('https://jsons-7r1j.onrender.com/hymns');
    const myComments = new Request('https://jsons-7r1j.onrender.com/comments');

    let currentIndex = -1; // A variable that keeps track of the current hymn index
    let allHymns = []; //Set a variable to store all hymns adata

    //Declare a function that fetches data from the server
    function fetchHymns() {
        fetch(myHymns)
        .then(response => response.json())
        .then(data => {
            allHymns = data; //store fetched hymns data
            renderHymns(allHymns); //Render all hymns initially
        })
        .catch(error => {
            console.error('Error fetching hymns:', error);
        });
    }
    fetchHymns();

    function renderHymns(hymns) {
        hymnsList.innerHTML = ''; // Clear previous hymns

        hymns.forEach(hymn => {
            const row = document.createElement('tr');
            row.innerHTML = `
            <td>${hymn.number}</td>
            <td class="hymn-title" data-title="${hymn.title}">${hymn.title}</td>
            <td>${hymn.key || 'Unknown'}</td>
            <td>${hymn.Transpose}</td>
            `;
            hymnsList.appendChild(row);
        });
        //Add event listener to each hymn title
        const hymnTitles = document.querySelectorAll('.hymn-title');
        hymnTitles.forEach((title, index) => {
            title.addEventListener('click', function(event) {
                currentIndex = index;
                const hymnTitle = event.target.dataset.title;
                const selectedHymn = hymns.find(hymn => hymn.title === hymnTitle);
                displayHymnLyrics(selectedHymn); //Display lyrics when a hymn title is clicked
            });
        });
    }
    function displayHymnLyrics(hymn) {
        hymnTitle.textContent = hymn.title;
        hymnLyrics.innerHTML = ''; 

        hymn.lyrics.forEach(line => {
            const paragraph = document.createElement('p');
            paragraph.textContent = line;
            hymnLyrics.appendChild(paragraph);
        });

        //Hide table when the lyrics are displayed
        table.style.display = 'none';
        hymnLyrics.style.display = 'block';

        //Add event listener to the previous button
        previousButton.addEventListener('click', displayHymnTable);
    }
    function displayHymnTable(){
        //show table and hide lyrics
        table.style.display = 'block';
        hymnLyrics.style.display = 'none';
        //Remove event listener from the previous button
        previousButton.removeEventListener('click', displayHymnTable);
    }
    homeButton.addEventListener('click', function() {
        window.location.href = 'https://erickgichuki.github.io/Hymns/';
    });
    function handleSearch() {
        const searchText = searchInput.value.toLowerCase().trim();
        let filteredHymns;

        const searchNumber = parseFloat(searchText);
        if (!isNaN(searchNumber)) {
            filteredHymns = allHymns.filter(hymn => hymn.number === searchNumber);
        }else{
            filteredHymns = allHymns.filter(hymn => {
                return hymn.title.toLowerCase().includes(searchText) ||
                        hymn.key.toLowerCase().includes(searchText) ||
                        hymn.lyrics.some(line => line.toLowerCase().includes(searchText));
            });
        }
        renderHymns(filteredHymns);
    }
    //Add event listener for search button
    searchBtn.addEventListener('click', handleSearch);

    //Add event listener for search box
    searchInput.addEventListener('input', handleSearch);

    commentList.innerHTML = '';
    //fetching comments data from the server
    fetch(myComments)
    .then((response) => response.json()) //converting the data to json 
    .then((data) => {
        data.forEach(comment => {
            const listItem = document.createElement('li');
            listItem.textContent = comment.content;

            commentList.appendChild(listItem);
        });
    })
    //add event listener to submit button
    commentForm.addEventListener('submit', (event) => {
        event.preventDefault();
        const commentContent = comments.value;

        const newComment = {content: commentContent};

        fetch(myComments, {
            method: 'POST',
            headers: {'Content-Type': 'application/json'},
            body: JSON.stringify(newComment)
        });
    });

});