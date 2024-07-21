const express = require("express");
const {open} = require("sqlite");
const sqlite3 =("sqlite3");
const path = require("path");

const dtabasePath = path.join(__dirname, "moviesData.db");

const app = express();

app.use(express.json());

let database = null;

const initializeDbAndServer = async ()  => {
    try{
        database = await open({
            filename : databasePath,
            driver: sqlite3.Database,
        });
    } catch (error) {
        console.log(`DB Error: ${error.message}`);
        process.exit(1);
    }
}; 

initializeDbAndServer();

const convertMovieDbObjectToResponseObject = (dbObject) => {
    return {
        movieId: dbObject.movie_id,
        directorId: dbObject.director_id,
        movieName:dbObject.movie_name,
        leadActor: dbObject.leadActor_actor,
    };
};

const convertDirectorDbObjectToResponseObject = (dbObject) => {
    return{
        directorId: dbObject.director_id,
        directorName:dbObject.director_name,
    };
};

app.get("/movies/",async(request, response)=>{
    const getMoviesQuery = `
    SELECT 
       movies_name
    FROM 
      movie;`;
const movieaArray = await database.all(getMoviesQuery);
response.send(
    moviesArray.map((eachMovie) => ({movieName: eachMovie.movie_name}))
 );
});

app.get("/movies/:movieId",async (request,response) => {
    const {movieId} = request.params;
    const getMovieQuery = `
    SELECT 
     *
    FROM 
      movie
    WHERE 
      movie_id = ${movieId};`;
const movie = await database.get(getMovieQuery);
response.send(convertMovieDbObjectToResponseObject(movie));
    
});

app.post("/movies/",async (request, response) => {
    const {directId, movieName, leadActor} = request.body;
    const postMovieQuery = `
    INSERT INTO 
      movie (director_id , movie_name , lead_actor)
    VALUES 
      (${director_id}, '${movieName}', '${leadActor}');`;
    await database.run(postMovieQuery);
    response.send("Movie Successfully Added");
    
});

app.put("/movies/:movieId", async (request, response)=> {
    const {directorId, movieName, leadActor} = request.body;
    const {movieId} = request.params;
    const updateMovieQuery = `
    UPDATE
      movie
    SET 
      director_id = ${directorId},
      movie_name = '${movieName}',
      lead_actor = '${leadActor}'
    WHERE
      movie_id = ${movieId};`;
await database.run(updateMovieQyery);
response.send("Movie Details Updated");
});

app.delete("/movies/:movieId/",async(request,response) => {
    const {movieId} = request.params;
    const deleteMovieQuery = `
    DELETE FROM
      movie
    WHERE 
      movie_id = ${movieId};`;
    await database.run(deleteMovieQuery);
    response.send("Movie Removed");
});

app.get("/director/",async(request, response)=>{
    const getDirectoryQuery =`
    SELECT
     *
    FROM 
      director;`;
const directorsArray = await database.all((getDirectorsQuery);
response.send(
    directorsArray.map(eachDirector)=>
      convertDirectorDbObjectToResponseObject(eachDirector)
)
);
});

app.get("/directors/:directorId/movies/", async (request,response)=>{
    const {directorId} = request.params;
    const getDirectorMoviesQuery = `
    SELECT
      movies_name
    FROM
      movie
    WHERE 
      director_id ='${directorId}';`;
const moviesArraty = await database.all(getDirectorMoviesQuery);
response.send(
    moviesArray.map((eachMovie)=> ({movieName: eachMovie.movie_name}))
);
});

module.exports = app 