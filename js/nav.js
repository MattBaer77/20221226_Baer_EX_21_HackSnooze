"use strict";

/******************************************************************************
 * Handling navbar clicks and updating navbar
 */


/** Show main list of all stories when click site name */
function navAllStories(evt) {
  console.debug("navAllStories", evt);
  hidePageComponents();
  putStoriesOnPage();
}

$body.on("click", "#nav-all", navAllStories);


/** Show login/signup on click on "login" */
function navLoginClick(evt) {
  console.debug("navLoginClick", evt);
  hidePageComponents();
  $loginForm.show();
  $signupForm.show();
}

$navLogin.on("click", navLoginClick);


/** Show newstory-form on click on "Submit" */
function navSubmitClick(evt) {
  console.debug("navSubmitClick", evt);
  hidePageComponents();
  $newstoryForm.show();
}

$navSubmitNew.on("click", navSubmitClick);


/** Show favorite-stories-list on click on "Submit" */
function navFavoritesClick(evt) {
  console.debug("navFavoritesClick", evt);
  putStoriesOnPage();
  hidePageComponents();
  $favoriteStoriesList.show();
}

$navFavorites.on("click", navFavoritesClick);


/** Show user-stories-list on click on "Submit" */
function navUserStoriesClick(evt) {
  console.debug("navUserStoriesClick", evt);
  putStoriesOnPage();
  hidePageComponents();
  $userStoriesList.show();
}

$navUserStories.on("click", navUserStoriesClick);


/** When a user first logins in, update the navbar to reflect that. */
function updateNavOnLogin() {
  console.debug("updateNavOnLogin");
  $(".main-nav-links").show();
  $navLogin.hide();
  $navLogOut.show();
  $navSubmitNew.show();
  $navFavorites.show();
  $navUserStories.show();
  $navUserProfile.text(`${currentUser.username}`).show();
}


/** When a user clicks on a heart - 
 * add parent story -
 * call favoriteStory or unFavoriteStory method on that user to -
 * favorite story at the API
 * add story to 'favorites' array for currUser
 * toggle appearnce of heart
 * 
 * If already clicked, remove from both.  */

function toggleFavorite(evt) {

  console.debug('toggleFavorite');
  console.dir($(evt.target));
  console.log($(evt.target).parent().attr('id'));

  // select target and parent of target's id and save both to variables
  const $clickedHeart = $(evt.target)
  const storyIdToCheck = $(evt.target).parent().attr('id');

  // the parent of the target's id coorisponds with storyId of the favorited story
  // use the storyId to get the coorisponding story from storyList and save to variable storyCheck
  const storyCheck = getStoryFromStoryListById (storyIdToCheck);
  console.log(storyCheck);

  // use checkFavorite to determine if currentUser.favorites includes the story storyCheck
  if (checkFavorite(storyCheck)) {

    // if checkFavorite(storyCheck) returns true, then the target of the event is already favorited, so unfavorite with unFavoriteStory this story and toggle class to a heart outline
    currentUser.unFavoriteStory(storyCheck);
    $clickedHeart.removeClass('fas').addClass('far');

  }

  else {

    // if checkFavorite(storyCheck) returns false, then the target of the event is not already favorited, so favorite with favoriteStory this story and toggle class to a heart solid
    currentUser.favoriteStory(storyCheck);
    $clickedHeart.removeClass('far').addClass('fas')

  };

  console.log(currentUser);
}

// place listeners on the heart icons for all story lists
$allStoriesList.on("click", ".fa-heart", toggleFavorite);
$favoriteStoriesList.on("click", ".fa-heart", toggleFavorite);
$userStoriesList.on("click", ".fa-heart", toggleFavorite);
