// ========================================
// SELECT ELEMENTS


// ========================================
const upVote = document.getElementById('thumbs__up')
const downVote = document.getElementById('thumbs__down')
const score = document.getElementById('score')



// ========================================
// HELPER FUNCTIONS
// ========================================
const sendVote = async (voteType) => {
    const options = {
        method: 'POST',
        headers: {
            'Content-Type' : 'application/json'
        },
    }
    if (voteType === 'up') {
        options.body = JSON.stringify({
            voteType: 'up',
            // how can we get the comicId that is passed to the ejs??
            // we can simply go to the ejs. create a script tag. and define a variable
            comicId
        })
    } else if (voteType === 'down') {
        options.body = JSON.stringify({
            voteType: 'down',
            comicId
        })
    } else {
        throw 'voteType must be "up" or "down" '
    }
    // Send fetch request
    await fetch('/comics/vote', options)
    .then(data => {
        console.log(data)
        return data.json()
    })
    .then(res => {
        console.log(res)
        handleVote(res.score, res.code)
    })
    .catch(err => {
        console.log(err)
    })
}


const handleVote = (newScore, code) => {
    score.innerText = newScore;

    // Update vote button colors

    switch (true) {
        case code === 0:
        upVote.classList.remove('btn-success')
        upVote.classList.add('btn-success-outline')
        downVote.classList.remove('btn-alert')
        downVote.classList.add('btn-alert-outline')

            break;
        case code === 1:
            upVote.classList.add('btn-success')
            upVote.classList.remove('btn-success-outline')
            downVote.classList.remove('btn-alert')
            downVote.classList.add('btn-alert-outline')
            break;
        case code === -1:
            upVote.classList.remove('btn-success')
            upVote.classList.add('btn-success-outline')
            downVote.classList.add('btn-alert')
            downVote.classList.remove('btn-alert-outline')
            break;
    }
}

// ========================================
// ADD EVENTS LISTENER
// ========================================
upVote.addEventListener('click', async () => {
    sendVote('up')
    

    
})

downVote.addEventListener('click', async () => {
    sendVote('down')
})



