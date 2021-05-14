import {VercelRequest, VercelResponse} from '@vercel/node';

export default (request: VercelRequest, response: VercelResponse) => {
  let {name = 'world'} = request.query;

  response.json({
    message: `Hello, ${name}!`,
  });
};
