"use strict";

// So we do not have to keep typing the base url
const BASE_URL = "https://hack-or-snooze-v3.herokuapp.com";

/******************************************************************************
 * Story: a single story in the system
 */

class Story {

  /** Make instance of Story from data object about story:
   *   - {title, author, url, username, storyId, createdAt}
   */

  constructor({ storyId, title, author, url, username, createdAt }) {
    this.storyId = storyId;
    this.title = title;
    this.author = author;
    this.url = url;
    this.username = username;
    this.createdAt = createdAt;
  }

  /** Parses hostname out of URL and returns it. */

  getHostName() {
    // IMPLEMENTED: completed this function!

    return new URL(this.url).hostname; // MIKAEL - hostname insead of host - unneccessary to show port

  }
}


/******************************************************************************
 * List of Story instances: used by UI to show story lists in DOM.
 */

class StoryList {
  constructor(stories) {
    this.stories = stories;
  }


  /** Generate a new StoryList. It:
   *  - calls the API
   *  - builds an array of Story instances
   *  - makes a single StoryList instance out of that
   *  - returns the StoryList instance.
   */

  static async getStories() {

    // Question:
    // Note presence of `static` keyword: this indicates that getStories is
    //  **not** an instance method. Rather, it is a method that is called on the
    //  class directly. Why doesn't it make sense for getStories to be an
    //  instance method?

    // Answer:
    // The only time this would be called is when initially constructing a single instance of the class. Not on an instance of a class itself. Static allows the method to be used when generating a new instance but does not propogate the method to the instances.

    // query the /stories endpoint (no auth required)
    const response = await axios({
      url: `${BASE_URL}/stories`,
      method: "GET",
    });

    // turn plain old story objects from API into instances of Story class
    const stories = response.data.stories.map(story => new Story(story));

    // build an instance of our own class using the new array of stories
    return new StoryList(stories);
  }


  /** Adds story data to API, makes a Story instance, adds it to story list.
   * - only available if user logged in
   * 
   * accepts:
   * - user - the current instance of User who will post the story
   * - obj of {title, author, url}
   * 
   */

  async addStory( currentUser, newStory ) {

    // IMPLEMENTED: completed this function!

    console.debug('addStory');
    // console.log(currentUser);
    // console.log(newStory);

    // post to the /stories enpoint using currentUser loginToken
    const response = await axios({
      url: `${BASE_URL}/stories`,
      method: "POST",
      data: {
        "token": currentUser['loginToken'],
        "story": {
          "author": newStory['author'],
          "title": newStory['title'],
          "url": newStory['url']
        }
      }
    })

    // console.log(response.data);
    // console.log(response.data.story);
    
    // use the response data story to create a new instance of the Story class
    const story = new Story(response.data.story);

    // console.log(story);
    // console.log(this);
  }


  /** Deletes story data from API, deletes that story at storyList.stories and currUser.ownStories.
   * - only available if user logged in
   * - user only has option to delete ownStories
   * 
   * accepts:
   * - user - the current instance of User who will post the story
   * - obj of {title, author, url}
   *
   */

  async deleteStory( currentUser, storyToDelete ) {

    console.debug('deleteStory');
    // console.log(currentUser);
    // console.log(storyToDelete);
    // console.log(storyToDelete.storyId);

    // delete a story at the /stories endpoint using currentUser loginToken
    const response = await axios({
      url: `${BASE_URL}/stories/${storyToDelete.storyId}`,
      method: "DELETE",
      data: {
        "token": currentUser['loginToken'],
      }
    })

    // console.log(response);
    // console.log(response.data);

    // console.log(storyToDelete.storyId);

    // Delete storyToDelete from storyList - filter storyList.stories and return an array that excludes any stories with the same Id as storyToDelete
    const filteredStoryList = storyList.stories.filter(s => s.storyId !== storyToDelete.storyId);
    // console.log(filteredStoryList);
    storyList.stories = filteredStoryList;

    // Delete storyToDelete from currentUser - filter currentUser.ownStories and return an array that excludes any stories with the same Id as storyToDelete
    const filteredCurrentUserOwnStories = currentUser.ownStories.filter(s => s.storyId !== storyToDelete.storyId);
    // console.log(filteredCurrentUserOwnStories);
    currentUser.ownStories = filteredCurrentUserOwnStories;



    // A LOT OF QUESTIONS FOR MIKAEL HERE -

    // HIDE - WHAT I DID IN PREVIOUS VERSION
    // const indexOfDeletedStoryAtStoryList = storyList.stories.indexOf(storyToDelete);
    // console.log(indexOfDeletedStoryAtStoryList);
    // storyList.stories.splice(indexOfDeletedStoryAtStoryList, 1);
    // console.log(storyList);

    /** I intened to use the same technique I used above to find the index of storyToDelete within the currentUser.ownStories array. I would then use that index to delete it from storyList. Doesn't work - because storyToDelete is an object at storyList? */

    // console.log(currentUser);
    // const indexOfDeletedStoryAtStoryCurrentUserOwnStories = currentUser.ownStories.indexOf(storyToDelete);
    // console.log(indexOfDeletedStoryAtStoryCurrentUserOwnStories);

    // A LOT OF QUESTIONS FOR MIKAEL HERE -

  }
}


/******************************************************************************
 * User: a user in the system (only used to represent the current user)
 */

class User {
  /** Make user instance from obj of user data and a token:
   *   - {username, name, createdAt, favorites[], ownStories[]}
   *   - token
   */

  constructor({
                username,
                name,
                createdAt,
                favorites = [],
                ownStories = []
              },
              token) {
    this.username = username;
    this.name = name;
    this.createdAt = createdAt;

    // instantiate Story instances for the user's favorites and ownStories
    this.favorites = favorites.map(s => new Story(s));
    this.ownStories = ownStories.map(s => new Story(s));

    // store the login token on the user so it's easy to find for API calls.
    this.loginToken = token;
  }

  /** Register new user in API, make User instance & return it.
   * 
   * accepts:
   * - username: a new username
   * - password: a new password
   * - name: the user's full name
   */

  static async signup(username, password, name) {
    const response = await axios({
      url: `${BASE_URL}/signup`,
      method: "POST",
      data: { user: { username, password, name } },
    });

    let { user } = response.data

    return new User(
      {
        username: user.username,
        name: user.name,
        createdAt: user.createdAt,
        favorites: user.favorites,
        ownStories: user.stories
      },
      response.data.token
    );
  }

  
  /** Login in user with API, make User instance & return it.
   * 
   * accepts:
   * - username: an existing user's username
   * - password: an existing user's password
   */

  static async login(username, password) {
    const response = await axios({
      url: `${BASE_URL}/login`,
      method: "POST",
      data: { user: { username, password } },
    });

    let { user } = response.data;

    return new User(
      {
        username: user.username,
        name: user.name,
        createdAt: user.createdAt,
        favorites: user.favorites,
        ownStories: user.stories
      },
      response.data.token
    );
  }


  /** When we already have credentials (token & username) for a user, we can log them in automatically. This function does that.
   * 
   * accepts: token and a username to login
   */

  static async loginViaStoredCredentials(token, username) {
    try {
      const response = await axios({
        url: `${BASE_URL}/users/${username}`,
        method: "GET",
        params: { token },
      });

      let { user } = response.data;

      return new User(
        {
          username: user.username,
          name: user.name,
          createdAt: user.createdAt,
          favorites: user.favorites,
          ownStories: user.stories
        },
        token
      );
    } catch (err) {
      console.error("loginViaStoredCredentials failed", err);
      return null;
    }
  }


  /** Designate a story as a favorite,
   * - adds story data to user's favorites at API,
   * - adds favorited story to user's favorites array
   * 
   * accepts:
   * favoritedStory
   * 
   */
  async favoriteStory (favoritedStory) {

    // console.log(this.username);
    // console.log(username);

    console.debug('favoriteStory');
    // console.log(favoritedStory);
    // console.log(favoritedStory.storyId);

    const response = await axios({
      url: `${BASE_URL}/users/${this.username}/favorites/${favoritedStory.storyId}`,
      method: "POST",
      params: {token: this.loginToken}
    });

    // console.log(response);

    this.favorites.push(favoritedStory);

  }


  /** Designate a story as a favorite,
   * - DELETES story data to user's favorites at API,
   * - removes favorited story to user's favorites array
   * 
   * accepts:
   * unFavoritedStory
   * 
   */
  async unFavoriteStory (unFavoritedStory) {

    // console.log(this.username);
    // console.log(username);

    console.debug('unFavoritedStory');
    // console.log(unFavoritedStory);

    const response = await axios({
      url: `${BASE_URL}/users/${this.username}/favorites/${unFavoritedStory.storyId}`,
      method: "DELETE",
      params: {token: this.loginToken}
    });

    // console.log(response);

    this.favorites = this.favorites.filter((s) => s.storyId !== unFavoritedStory.storyId);

  }
}