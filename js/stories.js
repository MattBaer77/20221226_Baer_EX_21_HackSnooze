"use strict";

// This is the global list of the stories, an instance of StoryList
let storyList;


/** Get and show stories when site first loads. */
async function getAndShowStoriesOnStart() {
  storyList = await StoryList.getStories();
  $storiesLoadingMsg.remove();

  putStoriesOnPage();
}

/**
 * A render method to render HTML for an individual Story instance
 * - story: an instance of Story
 *
 * Returns the markup for the story.
 */

function generateStoryMarkup(story) {

  console.debug("generateStoryMarkup");
  console.log(currentUser);

  // get the host name of the story and add save to variable hostName
  const hostName = story.getHostName();

  // set variable htmlTrashCan to empty string to be assigned later
  let htmlTrashCan = '';

  // if a user is logged in...
  if (currentUser !==undefined) {

    // and if checkOwn(story) returns true - which would determine that this story is in the currentUser.ownStories array
    // then set htmlTrashCan to html which will cause it to appear near the story
    if (checkOwn(story)) {htmlTrashCan = '<i class="fas fa-trash"></i>'};

  };

  // let htmlHeart = the html for an outlined heart icon
  let htmlHeart = '<i class="far fa-heart"></i>';

  // if a user is logged in...
  if (currentUser !== undefined){

    // and if checkFavorite(story) returns true - which would determine that the story is in the currentUser.favorites array
    // then set htmlHeart to htmml for a solid heart icon
    if (checkFavorite(story)) {htmlHeart = '<i class="fas fa-heart"></i>'};

  };

  // returns the html for that story's li on the page
  return $(`
    <li id="${story.storyId}">
    ${htmlTrashCan}
    ${htmlHeart}
      <a href="${story.url}" target="a_blank" class="story-link">
        ${story.title}
      </a>
      <small class="story-hostname">(${hostName})</small>
      <small class="story-author">by ${story.author}</small>
      <small class="story-user">posted by ${story.username}</small>
    </li>
  `);
}

/** Gets list of stories from server, generates their HTML, and puts on page. */
function putStoriesOnPage() {
  console.debug("putStoriesOnPage");

  // empties all story lists
  $allStoriesList.empty();
  $favoriteStoriesList.empty();
  $userStoriesList.empty();

  // loop through all of our stories and generate HTML for them
  for (let story of storyList.stories) {
    const $story = generateStoryMarkup(story);
    $allStoriesList.append($story);

  }

  // if a user is logged in...
  if (currentUser !== undefined) {

    // loop through every story of storyList.stories
    for (let story of storyList.stories) {

      // and if checkFavorite(story) returns true - which would determine that the story is in the currentUser.favorites array
      if (checkFavorite(story)) {

        // generate markup for this story and add it to favorite stories list
        console.log("This was a favorite story")
        const $story = generateStoryMarkup(story);
        $favoriteStoriesList.append($story);

      }

    }

    // loop through every story of storyList.stories
    for (let story of storyList.stories) {

      // and if checkOwn(story) returns true - which would determine that this story is in the currentUser.ownStories array
      if (checkOwn(story)) {

        // generate markup for this story and add it to own stories list
        console.log("This was a my story")
        const $story = generateStoryMarkup(story);
        $userStoriesList.append($story);

      }

    }

  }

  // show allStoriesList
  $allStoriesList.show();
}

/**Handle new story submisstion when the user submits a new story form
 * create an object to pass into storyList.addStory from the submitted fields
 * call storyList.addStory method to:
 * "Adds story data to API, makes a Story instance, adds it to story list."
 * reload page
 */

async function submitNewStory (evt) {
  evt.preventDefault();
  console.debug("submitNewStory");

  const newStorySubmissionObject = {
    title: $("#newstory-title").val(),
    author: $("#newstory-author").val(),
    url: $("#newstory-url").val()
  }

  console.log(newStorySubmissionObject);
  console.log(currentUser);

  await storyList.addStory(currentUser,newStorySubmissionObject);

  location.reload()

}

$newstoryForm.on('submit', submitNewStory);

/**Handle a story delete event when the user clicks the trash can html icon
 * 
 * get the id of the story to be deleted from the event target's parent attribute
 * passes the id into getStoryFromStoryListById to get the story object for that story
 * passes that story object and currentUser into and calls storyList.deleteStory method to:
 * Deletes story data from API, deletes that story at storyList.stories and currUser.ownStories.
 * calls hidePageComponents to hide all lists
 * logs the location at which the user deleted the story
 * navigates the user back to that location where the story is now deleted
 * 
 */
async function handleDeleteStory (evt) {
  
  console.debug("deleteStory");
  console.log(evt.target);

  // console.log($(evt.target).parent().parent().attr('id'));
  // console.log(fromLocation);
  // console.log($(evt.target).parent().attr('id'));

  // select the id from the parent element of the event target
  const storyToDeleteId = $(evt.target).parent().attr('id')

  // get story from storyList with id
  const storyToDelete = getStoryFromStoryListById(storyToDeleteId)

  // console.log(storyToDeleteId);
  // console.log(storyToDelete);
  // console.log(currentUser)

  // pass currentUser and storyToDelete into the storylist.deleteStory method
  await storyList.deleteStory(currentUser, storyToDelete);

  // hide page components
  hidePageComponents();

  // save the user's location - either $allStoriesList, $favoriteStorieList, or $userStoriesList
  const fromLocation = $(evt.target).parent().parent().attr('id'); // ASK MIKAEL - why this works here but not BELOW

  // puts updated stories on page
  putStoriesOnPage();

  // const fromLocation = $(evt.target).parent().parent().attr('id'); // (BELOW) - doesnt work

  console.log(fromLocation);

  // if user deleted story while on favorites list - navigate to favorites list
  if (fromLocation === 'favorite-stories-list'){
    console.log('from favs')
    $navFavorites.trigger('click')
  }

  // if user deleted story while on user stories list - navigate to user stories list
  else if (fromLocation === 'user-stories-list') {
    console.log('from userS')
    $navUserStories.trigger('click');
  };

}

// place listeners on the trash icons for all story lists
$allStoriesList.on("click", ".fa-trash", handleDeleteStory);
$favoriteStoriesList.on("click", ".fa-trash", handleDeleteStory);
$userStoriesList.on("click", ".fa-trash", handleDeleteStory);


/** Accepts an instance of story - checks currentUser.favorites if that story is pressent
 * returns true if that story is in currentUser.favorites
 * returns false if that story is not in currentUser.favorites
 */
function checkFavorite(story) {

  if (currentUser.favorites.some(s => s.storyId === story.storyId)) {
    console.log('fav'); return true
  }
  else {return false};

}

/** Accepts an instance of story - checks currentUser.ownStories if that story is present
 * returns true if that story is in currentUser.ownStories
 * returns false if that story is not in currentUser.ownStories
*/
function checkOwn(story) {

  if (currentUser.ownStories.some(s => s.storyId === story.storyId)) {
    console.log('own'); return true
  }
  else {return false};

}

/** Accepts a storyId - checks storyList.stories if a story containing that storyId is present
 * returns true if that story is in storyList.stories
 * returns false if that story is not in storyList.stories
 */
function getStoryFromStoryListById (storyIdToCheck) {

  return storyList.stories.filter(s => s.storyId === storyIdToCheck)[0];

}