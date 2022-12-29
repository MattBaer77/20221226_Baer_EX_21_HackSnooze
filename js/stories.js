"use strict";

console.log('storiesJS')

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
  // console.debug("generateStoryMarkup", story);
  // console.log(currentUser);

  const hostName = story.getHostName();

  // If solid, use - <i class="fas fa-heart"></i>
  // If outline, use - <i class="far fa-heart"></i>
  let htmlHeart = '<i class="far fa-heart"></i>';
  // if (currentUser.favorites.some(s => s.storyId === story.storyId)) {console.log('fav'); htmlHeart = '<i class="fas fa-heart"></i>'};

  if (currentUser !== undefined){
    checkFavorite(story) ? htmlHeart = '<i class="fas fa-heart"></i>' : htmlHeart = '<i class="far fa-heart"></i>'
  };

  return $(`
      <li id="${story.storyId}">
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

  $allStoriesList.empty();
  $favoriteStoriesList.empty();
  $userStoriesList.empty();

  // loop through all of our stories and generate HTML for them
  for (let story of storyList.stories) {
    const $story = generateStoryMarkup(story);
    $allStoriesList.append($story);

  }

  if (currentUser !== undefined) {

    for (let story of storyList.stories) {

      if (checkFavorite(story)) {

        console.log("This was a favorite story")
        const $story = generateStoryMarkup(story);
        $favoriteStoriesList.append($story);

      }

    }

    for (let story of storyList.stories) {

      if (checkOwn(story)) {

        console.log("This was a my story")
        const $story = generateStoryMarkup(story);
        $userStoriesList.append($story);

      }

    }

  }

  $allStoriesList.show();
  // $favoriteStoriesList.show();
  // $userStoriesList.show();
}

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

function checkFavorite(story) {

  if (currentUser.favorites.some(s => s.storyId === story.storyId)) {
    console.log('fav'); return true
  }
  else {return false};

}

function checkOwn(story) {

  if (currentUser.ownStories.some(s => s.storyId === story.storyId)) {
    console.log('own'); return true
  }
  else {return false};

}

function getStoryFromStoryListById (storyIdToCheck) {

  return storyList.stories.filter(s => s.storyId === storyIdToCheck);

}