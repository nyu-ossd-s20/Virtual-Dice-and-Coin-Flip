/**
 * CSS to hide everything on the page,
 * except for elements that have the "pick_game-image" class.
 */
const hidePage = `body > :not(.pick_game-image) {
                    display: none;
                  }`;

/**
 * Listen for clicks on the buttons, and send the appropriate message to
 * the content script in the page.
 */
function listenForClicks() {
  document.addEventListener("click", (e) => {

    /**
     * Given the name of a game, get the URL to the corresponding image.
     */
    function gameNameToURL(gameName) {
      switch (gameName) {
        case "Flip A Coin":
          var randomNumber = Math.floor((Math.random() * 2));
          if (randomNumber==0){
            return browser.extension.getURL("images/heads.png");
          }
          return browser.extension.getURL("images/tails.png");
          break;
       //TO DO: Logic for rolling a dice   
       case "Roll A Dice":
         var randomNumber = Math.floor((Math.random() * 6));
            if (randomNumber==1){
              rollDice(1);

              //return browser.extension.getURL("images/dice1.png");
            }
             if (randomNumber==2){
              rollDice(2);
              //return browser.extension.getURL("images/dice2.png");
            }
             if (randomNumber==3){
              rollDice(3);
              //return browser.extension.getURL("images/dice3.png");
            }
             if (randomNumber==4){
              rollDice(4);
              //return browser.extension.getURL("images/dice4.png");
            }
             if (randomNumber==5){
              rollDice(5);
              //return browser.extension.getURL("images/dice5.png");
            }
            if (randomNumber==6){
              rollDice(6);
            }
            //return browser.extension.getURL("images/dice6.png");
            break;
      }
    }
    
    function rollDice(num) {
        const dice = [...document.querySelectorAll(".die-list")];
        dice.forEach(die => {
            toggleClasses(die);
            die.dataset.roll = num;
        });
    }

    function toggleClasses(die) {
        die.classList.toggle("odd-roll");
        die.classList.toggle("even-roll");
    }
    /**
     * get the game URL and
     * send a "pick_game" message to the content script in the active tab.
     */
    function pick_game(tabs) {
      //browser.tabs.insertCSS({code: hidePage}).then(() => {
        let url = gameNameToURL(e.target.textContent);
        browser.tabs.sendMessage(tabs[0].id, {
          command: "pick_game",
          gameURL: url
        });
    }

    /**
     * Remove the page-hiding CSS from the active tab,
     * send a "reset" message to the content script in the active tab.
     */
    function reset(tabs) {
      browser.tabs.removeCSS({code: hidePage}).then(() => {
        browser.tabs.sendMessage(tabs[0].id, {
          command: "reset",
        });
      });
    }

    /**
     * Just log the error to the console.
     */
    function reportError(error) {
      console.error(`Could not pick_game: ${error}`);
    }

    /**
     * Get the active tab,
     * then call "pick_game()" or "reset()" as appropriate.
     */
    if (e.target.classList.contains("game")) {
      browser.tabs.query({active: true, currentWindow: true})
        .then(pick_game)
        .catch(reportError);
    }
    else if (e.target.classList.contains("reset")) {
      browser.tabs.query({active: true, currentWindow: true})
        .then(reset)
        .catch(reportError);
    }
  });
}





/**
 * There was an error executing the script.
 * Display the popup's error message, and hide the normal UI.
 */
function reportExecuteScriptError(error) {
  document.querySelector("#popup-content").classList.add("hidden");
  document.querySelector("#error-content").classList.remove("hidden");
  console.error(`Failed to execute pick_game content script: ${error.message}`);
}

/**
 * When the popup loads, inject a content script into the active tab,
 * and add a click handler.
 * If we couldn't inject the script, handle the error.
 */
browser.tabs.executeScript({file: "/content_scripts/pick_game.js"})
.then(listenForClicks)
.catch(reportExecuteScriptError);
