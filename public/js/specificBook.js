// ========================================
// SELECT ELEMENTS
// ========================================
const upVote = document.getElementById('thumbs__up')
const downVote = document.getElementById('thumbs__down')




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
        return data.json()
    })
    .then(res => {
        console.log(res)
    })
    .catch(err => {
        console.log(err)
    })
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



