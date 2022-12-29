"use strict";

console.log('navJS')


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

/** When a user clicks on a heart, add to favorites in the DOM and for currUser */

function toggleFavorite(evt) {
  console.dir($(evt.target));
  console.log($(evt.target).parent().attr('id'));

  const $clickedHeart = $(evt.target)

  const storyIdToCheck = $(evt.target).parent().attr('id');

  const storyCheck = getStoryFromStoryListById (storyIdToCheck);

  console.log(storyCheck);

  if (checkFavorite(storyCheck[0])) {

    currentUser.unFavoriteStory(storyCheck[0]);
    $clickedHeart.removeClass('fas').addClass('far');

  }

  else {

    currentUser.favoriteStory(storyCheck[0]);
    $clickedHeart.removeClass('far').addClass('fas')

  };

  console.log(currentUser);

  // evt.target
}

$allStoriesList.on("click", "i", toggleFavorite);
$favoriteStoriesList.on("click", "i", toggleFavorite);
$userStoriesList.on("click", "i", toggleFavorite);
