import React, { useEffect, useState } from 'react';
import axios from 'axios';
import './App.css';
import Ticket from './components/Ticket';
import Navbar from './components/Navbar';

function App() {
  const [toRestore, setToRestore] = useState(false);
  const [ticketsToShow, setTicketsToShow] = useState([]);
  const [allTickets, setAllTickets] = useState();
  const [doneTickets, setDoneTickets] = useState([]);
  const [undoneTickets, setUndoneTickets] = useState([]);
  const [searchText, setSearchText] = useState([]);
  const [numberOfHidden, setNumberOfHidden] = useState(0);
  const [numberOfDone, setNumberOfDone] = useState(0);
  const [numberOfUndone, setNumberOfUndone] = useState(0);

  // useEffect to load tickets from server
  useEffect(() => {
    axios.get(`/api/tickets?searchText=${searchText}`).then((res) => {
      setAllTickets(res.data);
      setTicketsToShow(res.data);
      const currDoneTickets = res.data.filter((ticket) => (ticket.done));
      const currUndoneTickets = res.data.filter((ticket) => (!ticket.done));
      setDoneTickets(currDoneTickets);
      setUndoneTickets(currUndoneTickets);
      setNumberOfDone(currDoneTickets.length);
      setNumberOfUndone(currUndoneTickets.length);
    });
  }, [searchText]);

  const onInputChange = (event) => {
    setSearchText(event.target.value);
  };

  return (
    <main>
      <section id="navBar">
        <Navbar
          onInputChange={onInputChange}
          numberOfHidden={numberOfHidden}
          setNumberOfHidden={setNumberOfHidden}
          toRestore={toRestore}
          setToRestore={setToRestore}
          numberOfDone={numberOfDone}
          numberOfUndone={numberOfUndone}
          ticketsToShow={ticketsToShow}
          setTicketsToShow={setTicketsToShow}
          doneTickets={doneTickets}
          undoneTickets={undoneTickets}
          allTickets={allTickets}
        />
      </section>
      <section id="ticketsSection">
        {ticketsToShow.map((ticket, i) => (
          <Ticket
            key={i}
            index={i}
            id={ticket.id}
            title={ticket.title}
            content={ticket.content}
            userEmail={ticket.userEmail}
            creationTime={ticket.creationTime}
            labels={ticket.labels}
            numberOfHidden={numberOfHidden}
            setNumberOfHidden={setNumberOfHidden}
            toRestore={toRestore}
            setToRestore={setToRestore}
            ticketsToShow={ticketsToShow}
            isDoneProp={ticket.done}
            doneTickets={doneTickets}
            setDoneTickets={setDoneTickets}
            undoneTickets={undoneTickets}
            setUndoneTickets={setUndoneTickets}
            setTicketsToShow={setTicketsToShow}
            numberOfDone={numberOfDone}
            numberOfUndone={numberOfUndone}
            setNumberOfDone={setNumberOfDone}
            setNumberOfUndone={setNumberOfUndone}
            allTickets={allTickets}
            setAllTickets={setAllTickets}
          />
        ))}
      </section>
    </main>
  );
}

export default App;
