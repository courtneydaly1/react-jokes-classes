import React, { useState, useEffect} from "react";
import axios from "axios";
import Joke from "./Joke";
import "./JokeList.css";

/** List of jokes. */

function JokeList({ numJokes = 5}) {
  const [jokes, setJokes] = useState([]);
  const [isLoading, setIsLoading]= useState(true);

  useEffect(function () {
    async function getJokes(){
      let jokes = [...jokes];
      let viewedJokes = new Set();
      try{
        while(jokes.length < numJokes){
          let result = await axios.get("https://icanhazdadjoke.com", {
            headers: { Accept: "application/json" }
          });

        let { ...jokeObj } = result.data;
        if(!viewedJokes.has(jokeObj.id)){
          viewedJokes.add(jokeObj.id);
          jokes.push({...jokeObj, votes:0 });
        } else{
          console.log("duplicate joke");
        }
      }
      setJokes(jokes);
      setIsLoading(false)
    }catch (e){
        console.error(e)
      }
    }

    if(jokes.length ===0) getJokes();
    }, [jokes, numJokes]);




    function generateNewJokes() {
      setJokes([]);
      setIsLoading(true);
    }
  
    /* change vote for this id by delta (+1 or -1) */
  
    function vote(id, delta) {
      setJokes(allJokes =>
        allJokes.map(j => (j.id === id ? { ...j, votes: j.votes + delta } : j))
      );
    }


  /* render: either loading spinner or list of sorted jokes. */

  if (isLoading) {
    return (
      <div className="loading">
        <i className="fas fa-4x fa-spinner fa-spin" />
      </div>
      )
  }

  let sortedJokes = [...jokes].sort((a, b) => b.votes - a.votes);

  return (
    <div className="JokeList">
      <button className="JokeList-getmore" onClick={generateNewJokes}>
        Get New Jokes
        </button>

      {sortedJokes.map(({joke, id, votes}) => (
        <Joke text={joke} key={id} id={id} votes={votes} vote={vote} />
      ))}
    </div>
  );
}

export default JokeList;
