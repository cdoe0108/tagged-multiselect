const dropdownList = document.getElementById('dropdown-list')
const tagContainer = document.querySelector('.autocomplete-wrapper');
const input = document.querySelector('.autocomplete-input');
let tags = [];
let tagsContent = [];

const getData = () => {
    const apiURL = 'https://restcountries.eu/rest/v2/all';
	let http = new XMLHttpRequest();
	return new Promise((resolve, reject) => { 
		http.onreadystatechange = (e) => {
            if (http.readyState == 4 && http.status == 200) {
                resolve(JSON.parse(http.response));
            } else if (http.readyState == 4 && http.status != 200) {
                reject(http.response);
            }
        }
        http.open('GET', apiURL, true);
        http.setRequestHeader("Content-Type", "application/json");	
        http.send();	
	})
}

getData().then(result => {
    result.forEach(item => {
        let listItem = document.createElement('li');
        listItem.id = item.name;
        listItem.textContent = item.name;
        listItem.addEventListener('click', (e) => (
            addTags(e.target)
        ));
        dropdownList.appendChild(listItem);
        tagsContent.push(item.name)
      });
});

const createTag = (ele) => {
    let createTag = document.createElement('div');
    createTag.setAttribute('class', 'tag');
    const span = document.createElement('span');
    span.innerHTML = ele;
    const closeIcon = document.createElement('i');
    closeIcon.innerHTML = 'close';
    closeIcon.setAttribute('class', 'remove-icon');
    closeIcon.setAttribute('data-item', ele);
    closeIcon.addEventListener('click', (e) => (
        clearTag(e.target)
    ));
    createTag.appendChild(span);
    createTag.appendChild(closeIcon);
    return createTag;
}

const clearTag = (ele) => {
    ele.parentElement.remove();
    tags.splice(tags.indexOf(ele.getAttribute('data-item')),1,...tags)
}

const clearTags = () => {
    document.querySelectorAll('.tag').forEach(tag => {
      tag.parentElement.removeChild(tag);
    });
}

const addTags = () => {
    clearTags();
    tags.slice().reverse().forEach(tag => {
        tagContainer.prepend(createTag(tag));
    });
}


input.addEventListener('keyup', (e) => {
    if (e.key === 'Enter') {
        if(tagsContent.includes(e.target.value.charAt(0).toUpperCase() + e.target.value.slice(1)
        )) {
            e.target.value.split(',').forEach(tag => {
                tags.push(tag);  
              });
              addTags();
              input.value = '';
        }
    }
});