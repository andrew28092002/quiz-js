answer = {
    2: null,
    3: null,
    4: null,
    5: null
}

// Движение впреред
let btnNext = document.querySelectorAll('[data-nav="next"]')

for (let i=0; i<btnNext.length; i++){
    btnNext[i].addEventListener('click', function(){
        let thisCard = this.closest('[data-card]')
        let thisCardNumber = parseInt(thisCard.dataset.card)

        if (thisCard.dataset.validate === 'novalidate') {
            navigate('next', thisCard)
            updateProgressBar('next', thisCardNumber)
        } else if (thisCard.dataset.validate === 'validate'){
            
            saveData(thisCardNumber, gatherCardData(thisCardNumber))

            if (isFilled(thisCardNumber) && checkOnRequired(thisCardNumber)){
                navigate('next', thisCard)
                updateProgressBar('next', thisCardNumber)
            } else {
                alert('Сделайте ответ, прежде, чем переходить')
            }
            
        }

    })
}

// Движение назад
let btnPrev = document.querySelectorAll('[data-nav="prev"]')

for (let i=0; i<btnPrev.length; i++){
    btnPrev[i].addEventListener('click', function(){
        let thisCard = this.closest('[data-card]')
        let thisCardNumber = parseInt(thisCard.dataset.card)
        navigate('prev', thisCard)
        updateProgressBar('prev', thisCardNumber)

        if (thisCard.dataset.validate === 'novalidate') {
            console.log('novalidate')
        } else if (thisCard.dataset.validate === 'validate'){
            console.log('validate')
        }
    })
}

// Фукнция для поиска стороны премещения 
function navigate(direction, thisCard){
    thisCardNumber = parseInt(thisCard.dataset.card)
    let nextCard;

    if (direction === 'next'){
        nextCard = thisCardNumber + 1

    } else if(direction === 'prev'){
        nextCard = thisCardNumber - 1 
    }

    thisCard.classList.add('hidden')

    document.querySelector(`[data-card="${nextCard}"]`).classList.remove('hidden')
}

// Функция для получения ответов со страницы
function gatherCardData (num) {
    let question
    let result = []

    let currentCard = document.querySelector(`[data-card="${num}"]`)

    question = currentCard.querySelector('[data-question]').innerText
    
    let radioValue = currentCard.querySelectorAll('[type="radio"]')
    radioValue.forEach(function(item){
        if (item.checked){
            result.push({
                name: item.name,
                value: item.value
            })
        }
    })


    let checkboxValue = currentCard.querySelectorAll('[type="checkbox"]')
    checkboxValue.forEach(function(item){
        if (item.checked){
            result.push({
                name: item.name,
                value: item.value
            })
        }})


    let inputValue = currentCard.querySelectorAll('[type="text"], [type="number"], [type="email"]')
    inputValue.forEach(function(item){
        let itemValue = item.value
        if (itemValue.trim() != ''){
            result.push({
                name: item.name,
                value: item.value
            })
        }})
    


    let data = {
        question: question,
        answer: result
    }

    return data
}

// Функция записи данных
function saveData(num, data){
    answer[num] = data
}

// Функция для проверки заполнения страниц
function isFilled(num){
    if (answer[num].answer.length > 0){
        return true
    } else {
        return false
    }
}

function isValidEmail(email){
    let pattern = /^[\w-\.]+@[\w-]+\.[a-z]{2,4}$/i
    return pattern.test(email)
}

//Функция для проверки заполненности  require
function checkOnRequired(num){
    let currentCard = document.querySelector(`[data-card="${num}"]`)
    let requiredFileds = currentCard.querySelectorAll('[required]')

    let isValidArray = []

    requiredFileds.forEach(function(item){
        if (item.type === 'checkbox' && item.checked === false){
            isValidArray.push(false)
        } else if (item.type === 'email'){
            if (isValidEmail(item.value)){
                isValidArray.push(true)
            } else {
                isValidArray.push(false)
            }
        }
    })

    console.log(isValidArray)
    if (isValidArray.indexOf(false) == -1){
        return true
    } else{
        return false
    }
}

// Подсветка для radiobox
document.querySelectorAll('.radio-group').forEach(function(item){
    item.addEventListener('click', function(e){
        let label = e.target.closest('label')

        if (label){
            label.closest('.radio-group').querySelectorAll('label').forEach(function(item){
                item.classList.remove('radio-block--active')
            })
        }
        label.classList.add('radio-block--active')
    })
})  

// Подсветка для checkbox
document.querySelectorAll('label.checkbox-block input[type="checkbox"]').forEach(function(item){
    item.addEventListener('change', function(){
        let label = item.closest('label')

        // if (label){
        //     label.classList.toggle('checkbox-block--active')
        // }
        if (item.checked){
            label.classList.add('checkbox-block--active')
        } else {
            label.classList.remove('checkbox-block--active')
        }
    
    })
})

// Обновление прогресс бара
function updateProgressBar(direction, num){
    let cardsTotalNumber = document.querySelectorAll('[data-card]').length
    if (direction == 'next'){
        num = num + 1
    } else {
        num = num - 1
    }

    let currentProcent = (num/cardsTotalNumber*100).toFixed()
    let currentCard = document.querySelector(`[data-card="${num}"]`).querySelector('.progress')

    if (currentCard){
        currentCard.querySelector('.progress__label strong').innerText = `${currentProcent}%`
        currentCard.querySelector('.progress__line-bar').style = `width: ${currentProcent}%`
    }
    

}