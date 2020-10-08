# SEI-Project-2

Pik-a-Flik!


Chris Myers & Marissa Cadavid Berns

## App Description:

Pik-a-Flik is an app that allows users to find and keep track of movies as well as seeing which are popular with other users.

## MVP:

* App will make calls to OMDB movie API to populate movie information after a user searches for it by name. (http://www.omdbapi.com/)
* Users can log into an account (read)
* They can create an  account. (create)
* They can edit account information(update)
* They can delete their account (delete)
* They may look up movies (post/read)
* They may add movies to list of seen movies (create)
* They may add movies to list of want to see movies(create)
* They may move movies between list (edit)
* They may remove movies from lists (delete)


## Gold:

* Users can search by a movie using additional categories such as genre or year released, director, etc.
* Users can see what movies other users have seen.
* All time favorites movie page. - Complete!
* Users can have list of favorite movies made up of movies they have seen.
* More field in data model. Ratings, awards, country - Complete!
* A movie show page will link to a place to watch the movie on a streaming site
* Styling and animations for main login page - Complete!
* Users can rate movies out of 5 stars

## Technologies and Approach Used

The app is a full-stack application using Node.js, Postgres, Express and EJS.  All the movie data is populated using API calls to The Open Movie Database (OMDb API - http://www.omdbapi.com/).  The search algorithm always searches our database first and then calls the API if no results are returned or the user requests more results.  This was designed to use the fewest amount of API calls with a limited key.  Over time, the database will grow and require fewer API calls as users interact with the site.  The API calls are made using axios.  We have also incorporated some Bootstrap CSS/JS features.

With user security in mind, we have implemented password hashing utlizing the bcrypt algorithm and account authorization utilizing JSON Web Tokens.

## Technical Difficulties

* Learning curve with asynchronous calls/promises
* Nature of asynchronous calls and our need to chain together API and database calls
* Required expanded error handling due to inconsistent open source data


## Future Improvements

* Refactoring movie controller to be more DRY and less nested
* Adding more search criteria and better filtering and sorting options
* Expand the social aspect of the app (Recommend movies to friends, create lists to share, etc.)


## ERD:

![ERD](https://i.imgur.com/ZX2KarE.png)

*More fields have been added to the movie table for a richer experience

## Wireframes:

### Splash page:
![Splash Page](https://i.imgur.com/5PwX1nY.jpg)

### Main search page
![Main Search Page](https://i.imgur.com/AbF5dYI.jpg)

### User account page
![User account page](https://i.imgur.com/Q7gAOy8.jpg)

### Movie lists page
![Movie Lists page](https://i.imgur.com/Cj57cvg.jpg)

## User Stories

### User Account Stories
* As an unregistered user, I want to sign up for the website so that I can add track the movies I have watched and want to watch.
* As a registered user, I want to be able to log in to the website and view my account.
* As a user, I want to be able to delete my account so that I can be forgotten and my data can be erased.
* As a user, I want to be able to edit my account so that I can change my password or personal information.
* As a user, I want to be able to log out so that others can use my computer without accessing my account.

### User Movie Stories
* As a user, I want to search for movies so that I can add them to my lists.
* As a user, I want to be able to move movies from my picked list to watched list so that I can keep them organized.
* As a user, I want to be able to add movies to either my picked or watched list.
* As a user, I want to be able to favorite a movie from my watched list.
* As a user, I want to be able to filter either of my lists by genre, independently.
* As a user, I want to see the most favorited movies on the site.
* As a user, I want to be able to remove movies from either list.
* As a user, when I am searching for movies, I want to be able to bring up more results if I don't see what I am looking for.
* As a user, I want to be able to learn more information about any of the movies that I find.
