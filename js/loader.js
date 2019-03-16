(()=>{
    const param = 'file';
    const options = [
        {name: 'Main js file', value: 'main', file: 'main.js'}
    ];

    const url = new URL(location.href);
    const toLoad = url.searchParams.get(param);

    const body = document.querySelector('body');
    
    if (!toLoad) {
        const select = document.createElement('select');

        for (let data of options) {
            let element = document.createElement('option');
            element.innerHTML = data.name;
            element.value = data.value;
            select.append(element);
        }

        body.append(select);

        const loadButton = document.createElement('button');
        loadButton.innerHTML = 'Load';
        loadButton.addEventListener('click', e=>{
            e.preventDefault();
            location.href = url.origin + url.pathname + '?' + param + '=' + select.value;
        });

        body.append(loadButton);
    } else {
        for (let data of options) {
            if (data.value == toLoad) {
                const script = document.createElement('script');
                script.src = 'js/'+data.file;
                body.append(script);
                break;
            }
        }
    }
})();