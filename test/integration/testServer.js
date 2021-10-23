import { listenAndServe } from 'https://deno.land/std/http/server.ts';

const handler = (request) => {
  return generateResponse(request.url);
};

const jaxsSource = await Deno.readTextFile(`${Deno.cwd()}/dist/jaxs.js`);
const htmlHome = await Deno.readTextFile(
  `${Deno.cwd()}/test/integration/headless/index.html`,
);

const testPaths = [
  'activeLinks',
];

const htmlFor = (filename) => {
  if (!testPaths.includes(filename)) return notFound();

  const body = htmlHome.replace('{{testSource}}', `/${filename}.js`).toString();
  return new Response(body, {
    status: 200,
    headers: { 'Content-Type': 'text/html' },
  });
};

const jsFor = (filename) => {
  if (!testPaths.includes(filename) && filename !== 'jaxs') return notFound();

  let body = jaxsSource;
  if (filename !== 'jaxs') {
    body = Deno.readTextFileSync(
      `${Deno.cwd()}/test/integration/headless/${filename}.js`,
    );
  }

  return new Response(body.toString(), {
    status: 200,
    headers: { 'Content-Type': 'text/javascript' },
  });
};

const notFound = () => {
  return new Response('Not found', { status: 404 });
};

const getHandler = (extension) => {
  return {
    html: htmlFor,
    js: jsFor,
  }[extension] || notFound;
};

const generateResponse = (url) => {
  console.log(`Request: ${url}`);
  const parts = url.split('/');
  const file = parts[parts.length - 1].split('.');
  let [filename, extension] = file;
  extension = extension || 'html';

  const handler = getHandler(extension);
  const response = handler(filename);
  return response;
};

await listenAndServe(':5000', handler);
