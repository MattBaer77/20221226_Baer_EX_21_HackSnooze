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

/** Show Newstory on click on "Submit" */

function navSubmitClick(evt) {
  console.debug("navSubmitClick", evt);
  hidePageComponents();
  $newstoryForm.show();
}

$navSubmitNew.on("click", navSubmitClick);

/** When a user first logins in, update the navbar to reflect that. */

function updateNavOnLogin() {
  console.debug("updateNavOnLogin");
  $(".main-nav-links").show();
  $navLogin.hide();
  $navLogOut.show();
  $navUserProfile.text(`${currentUser.username}`).show();
}

/** When a user clicks on a heart, add to favorites in the DOM and for currUser */

function toggleFavorite(evt) {
  console.dir($(evt.target));
  console.log($(evt.target).parent().attr('id'));

  const $clickedHeart = $(evt.target)

  const storyIdToCheck = $(evt.target).parent().attr('id');

  const storyCheck = getStoryFromStoryListById (storyIdToCheck);

  // const storyCheck = storyList.stories.filter(s => s.storyId === storyIdcheck);

  console.log(storyCheck);

  // checkFavorite(storyCheck[0]) ? currentUser.unFavoriteStory(storyCheck[0]) : currentUser.favoriteStory(storyCheck[0]);

  // $(evt.target).toggleClass('fas','far'); // This does not work if the user refreshes the page then changes state

  // $clickedHeart.removeClass('far').addClass('fas')
  // $clickedHeart.removeClass('fas').addClass('far')

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
