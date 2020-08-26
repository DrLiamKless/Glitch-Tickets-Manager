const express = require('express');
const fs = require('fs');
const path = './data.json';
const app = express();


function checkHttps(request, response, next) {
  // Check the protocol — if http, redirect to https.
  if (request.get("X-Forwarded-Proto").indexOf("https") != -1) {
    return next();
  } else {
    response.redirect("https://" + request.hostname + request.url);
  }
}

app.all("*", checkHttps)
app.use(express.static('../client/build'));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.get('/api/tickets', async (req, res) => {
  const content = fs.readFileSync(path);
  const tickets = JSON.parse(content);
  if (req.query.searchText) {
    const filteredTickets = tickets.filter((ticket) => {
      const lowerCaseSearchText = req.query.searchText.toLowerCase();
      const lowerCaseTitle = ticket.title.toLowerCase();
      return lowerCaseTitle.includes(lowerCaseSearchText);
    });
    res.send(filteredTickets);
  } else {
    res.send(tickets);
  }
});

app.post('/api/tickets/:ticketId/done', async (req, res) => {
  const content = fs.readFileSync(path);
  const tickets = JSON.parse(content);
  tickets.forEach((ticket) => {
    if (`${ticket.id}` === req.params.ticketId) {
      ticket.done = true;
    }
  });
  fs.writeFileSync(path, JSON.stringify(tickets));
  res.send({ updated: true });
});

app.post('/api/tickets/:ticketId/undone', async (req, res) => {
  const content = fs.readFileSync(path);
  const tickets = JSON.parse(content);
  tickets.forEach((ticket) => {
    if (`${ticket.id}` === req.params.ticketId) {
      ticket.done = false;
    }
  });
  fs.writeFileSync(path, JSON.stringify(tickets));
  res.send({ updated: true });
});

let port;
console.log("❇️ NODE_ENV is", process.env.NODE_ENV);
if (process.env.NODE_ENV === "production") {
  port = process.env.PORT || 3000;
  app.use(express.static(path.join(__dirname, "../build")));
  app.get("*", (request, response) => {
    response.sendFile(path.join(__dirname, "../build", "index.html"));
  });
} else {
  port = 3001;
  console.log("⚠️ Not seeing your changes as you develop?");
  console.log(
    "⚠️ Do you need to set 'start': 'npm run development' in package.json?"
  );
}

// Start the listener!
const listener = app.listen(port, () => {
  console.log("❇️ Express server is running on port", listener.address().port);
});
