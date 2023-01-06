// import axios from 'axios';

const http = {
  post: <Req, Res>(path: string, body: Req) =>
    fetch(`http://localhost:3000/${path}`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(body),
    }).then((v) => v.json() as Res),
};

export default http;
