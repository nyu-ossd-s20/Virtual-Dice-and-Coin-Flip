(function() {
  /**
   * Check and set a global guard variable.
   * If this content script is injected into the same page again,
   * it will do nothing next time.
   */
  if (window.hasRun) {
    return;
  }
  window.hasRun = true;

  /**
   * Given a URL to a game image, remove all existing games, then
   * create and style an IMG node pointing to
   * that image, then insert the node into the document.
   */
  function insertgame(gameURL) {
    removeExistinggames();
    let gameImage = document.createElement("img");
    gameImage.setAttribute("src", gameURL);
    gameImage.style.height = "100vh";
    gameImage.className = "pick_game-image";
    document.body.appendChild(gameImage);
  }

  /**
   * Remove every game from the page.
   */
  function removeExistinggames() {
    let existinggames = document.querySelectorAll(".pick_game-image");
    for (let game of existinggames) {
      game.remove();
    }
  }

  /**
   * Listen for messages from the background script.
   * Call "pick_game()" or "reset()".
  */
  browser.runtime.onMessage.addListener((message) => {
    if (message.command === "pick_game") {
      insertgame(message.gameURL);
    } else if (message.command === "reset") {
      removeExistinggames();
    }
  });

})();