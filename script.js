
var pageType = $(".container").attr("id")
const resultElement = document.createElement('span')

window.onload = () => {
    if (pageType == "details") {

        // Disable native form validation
        document.forms["playerForm"].setAttribute("novalidate", true)

        // Add custom validation as soon as user leaves focus from input field
        document.addEventListener('blur', function (event) {
            initiateValidation(event.target)
        }, true)

        // Submit form after validation of input
        // var form = $("form[name=playerForm]")
        $("form[name=playerForm]").on("submit", function (event) {
            event.preventDefault()
            var isValid = checkFormValidity()
            if (isValid) { this.submit() }
        })

        $(document).on('keydown', function (event) {
            if (event.target.nodeName == 'INPUT' && event.keyCode == 13) {
                initiateValidation(event.target)
            }
        })
    }

    else if (pageType == "game") {
        $("#roll-btn").on('click', () => {
            var urlObject = new URLSearchParams(window.location.search)
            playGame(urlObject)
        })
    }
}

function initiateValidation(target) {
    
    var errorElement = target.nextElementSibling

    // Take required action when blur event fires on input field 
    if (target.nodeName == "INPUT") {

        var validityState = target.validity
        var errorMsg = checkInputValidity(validityState)

        // Invalid input
        if (errorMsg) {
            displayError(errorMsg, target, errorElement)

            // Indicate to the caller that error exists in the form
            return true
        }

        // Valid input
        else {
            removeError(errorElement)
            return null
        }
    }

    // Do nothing when blur fires on any other element except the input fields
    return
}

function checkInputValidity(state) {

    // Return required error messages
    if (state.valid) return null;

    else if (state.valueMissing) {
        return "Player name field cannot be empty";
    }
    else if (state.patternMismatch) {
        return "Only letters and numbers are allowed";
    }
    else if (state.tooLong) {
        return "Please limit player name to 15 characters"
    }
     
    // Return generic invalid input error
    return "The value entered is invalid"
}

function displayError(error, target, errorElement) {
    
    // If error is not currently shown, then display it
    target.classList.add("style-invalid-input")
    errorElement.classList.add("show-error")
   
    // Update the error msg
    errorElement.lastElementChild.textContent = error

}

function removeError(errorElement) {

    // Remove the error fields
    var errorClasses = errorElement.classList
    errorClasses.remove("show-error")
    errorClasses.add("error-msg")
}

function checkFormValidity(form) {

    // Get all form input fields in an array 
    var inputFields = Array.from(document.querySelectorAll("#playerForm input"))

    // Initialise error counter
    var errorCounter = 0

    // Validate each input field. Update the error counter accordingly.
    inputFields.forEach(inputElement => {
        var hasError = initiateValidation(inputElement)
        if (hasError) { errorCounter++ }
    })

    // Submit form if no errors found
    if (errorCounter == 0) {
        // form.submit()
        return true
    }

    return null
}

function playGame(urlObject) {
    
    var trophyIconHTML = '<i class="fa fa-trophy" aria-hidden="true"></i>';
    var resultString;
    var roll1 = Math.ceil(Math.random() * 6)
    var roll2 = Math.ceil(Math.random() * 6)

    var rawPlayerArray = urlObject.getAll("player")

    var players = rawPlayerArray.map(player => {

        var formattedPlayerName = player.charAt(0).toUpperCase().concat(player.slice(1))
        return formattedPlayerName
    })

    document.querySelectorAll("img")[0].setAttribute("src", `images/dice${roll1}.png`)
    document.querySelectorAll("img")[1].setAttribute("src", `images/dice${roll2}.png`)
    $("#roll-btn").text("Roll Again") 

    if (roll1 > roll2) {
        resultString = players[0].concat(" Wins! ")
        resultElement.innerHTML = resultString.concat(trophyIconHTML)
    }
    else if (roll2 > roll1) {
        resultString = players[1].concat(" Wins! ")
        resultElement.innerHTML = resultString.concat(trophyIconHTML)
    }
    else {
        resultString = "Replay to Decide "
        resultElement.textContent = resultString
    }
    
    resultElement.className = "style-result"
    $("#game").append(resultElement)
}



