const Movie = require('../models').Movie;
const User = require('../models').User;

const axios = require('axios');


const renderSearchPage = (req, res) => {
    res.render('movies/index.ejs');
}

const searchForMovie = (req, res) => {

    // search for movie in movies table
    
    // if found, return and render page with movie information
   
    // if not found make API call
    
    // if found in api call add to db

    // make db call
    // render page
    
    // not found 
    // return not found message




    axios({
        url: `http://www.omdbapi.com/?s=${req.body.title}&type=movie&apikey=${process.env.OMDB_API_KEY}`,
        method: 'get',
        headers: {
            'x-api-key': process.env.OMDB_API_KEY
        }
    }).then((response) => {
        const foundMovies = response.data.Search;
        console.log(foundMovies);

        for( let i = 0 ; i < foundMovies.length ; i ++ ) {
            
            /*
                data fields returned do not match:
                
                Title: 'Ratatouille', => title
                Year: '2007', => releaseYear string not integer
                imdbID => imdbId
                Poster => img

                director and plot not returned unless movie queried directly
            
            */
        }




        if(response.data) {
            res.render('movies/index.ejs', {
                movies: foundMovies
            });
        }
    }).catch((err) => {
        console.error(err);
    });


    // Movie.findAll()
    // .then(movies => {
    //     console.log(movies);
    //     if(movies) {
    //         res.render('movies/index.ejs', {
    //             movies: movies
    //         });
    //     } else {

    //     }
       
    // })
    // .catch(err => {
    //     console.log(err);
    //     res.send(err);
    // });




}


module.exports = {
    renderSearchPage,
    searchForMovie
}