const dropdownList = document.getElementById('dropdown-list')
const tagContainer = document.querySelector('.autocomplete-wrapper');
const input = document.querySelector('.autocomplete-input');
let tags = [];
let itemstagsContent = [];

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
    tagsContent = result.map(item => item.name)
    renderList(tagsContent)
});

const clearListItems = () => {
    document.querySelectorAll('li').forEach(item => {
        item.parentElement.removeChild(item);
      });
}

const renderList = (items) => {
    items.forEach(item => {
        let listItem = document.createElement('li');
        listItem.id = item;
        listItem.textContent = item;
        listItem.addEventListener('click', (e) => (addEle(e.target.textContent.charAt(0).toLowerCase() + e.target.textContent.slice(1))));
        dropdownList.appendChild(listItem);
    });
}

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
    tagsContent.splice(tagsContent.indexOf(ele.charAt(0).toUpperCase() + ele.slice(1)),1)
    clearListItems()
    renderList(tagsContent)
    return createTag;
}

const clearTag = (ele) => {
    ele.parentElement.remove();
    tags.splice(tags.indexOf(ele.getAttribute('data-item')),1)
    tagsContent.push(ele.getAttribute('data-item').charAt(0).toUpperCase() + ele.getAttribute('data-item').slice(1))
    clearListItems()
    renderList(tagsContent);
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

const addEle = (val) => {
    if(tagsContent.includes(val.charAt(0).toUpperCase() + val.slice(1)
        )) {
            val.split(',').forEach(tag => {
                tags.push(tag);  
              });
            addTags();
            input.value = '';
        }
}
input.addEventListener('keyup', (e) => {
    if (e.key === 'Enter') {
        addEle(e.target.value)
    }
});