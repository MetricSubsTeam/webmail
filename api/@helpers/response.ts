import {VercelResponse} from '@vercel/node';

export function error(
  response: VercelResponse,
  message = 'Internal error',
  statusCode = 500,
) {
  response.status(statusCode);
  response.json({
    error: message,
  });
}
