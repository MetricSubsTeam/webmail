import {VercelRequest, VercelResponse} from '@vercel/node';
import {ImapFlow} from 'imapflow';
import {error} from '../helpers';
import type {Dict} from 'tslang';

const {IMAP_HOST, IMAP_PORT = '993', IMAP_SECURE = 'true'} = process.env;

type ActionFunction = (
  imap: ImapFlow,
  payload: any,
  response: VercelResponse,
) => Promise<void>;

const ACTION_MAP: Dict<ActionFunction> = {
  listMailBoxes,
};

export default async (request: VercelRequest, response: VercelResponse) => {
  if (!request.body) {
    error(response, 'Request body cannot be empty');
    return;
  }

  let {username, password, action, payload} = request.body;

  let port = Number(IMAP_PORT);

  if (isNaN(port)) {
    error(response, 'IMAP_PORT not configured');
    return;
  }

  if (!action) {
    error(response, 'Action cannot empty');
    return;
  }

  if (!(action in ACTION_MAP)) {
    error(response, `Invalid action: ${action}`);
    return;
  }

  let imap = new ImapFlow({
    host: IMAP_HOST,
    port,
    secure: IMAP_SECURE.toLocaleLowerCase() === 'true',
    auth: {
      user: username,
      pass: password,
    },
  });

  await imap.connect();

  await ACTION_MAP[action](imap, payload, response);

  imap.close();
};

async function listMailBoxes(
  imap: ImapFlow,
  _: any,
  response: VercelResponse,
): Promise<void> {
  let responses = await imap.list();
  response.json(responses);
}
