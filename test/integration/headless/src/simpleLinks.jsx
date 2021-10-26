import {
  appHandlers,
  appReducers,
  bind,
  combineReducers,
  createApp,
  jsx,
} from '../../../../lib/jaxs.js';

const AreaData = [
  { path: '/simpleLinks', identifier: 'home', description: 'Home area' },
  { path: '/switchTabs', identifier: 'alt', description: 'Alternative view' },
];

const getAreaData = (path) =>
  AreaData.find((area) => area.path === path) || {
    path: 'unknown',
    identifier: 'not-found',
    description: 'huh?',
  };

const Link = ({ href, description }) => {
  return (
    <p>
      <a href={href} onClick='navigate'>{description}</a>
    </p>
  );
};

const NotLink = ({ description }) => {
  return <p>{description}</p>;
};

const TabHeaderTemplate = ({ currentPath, path }) => {
  const areaData = getAreaData(path);
  if (currentPath === path) {
    return <NotLink description={areaData.description} />;
  }
  return <Link href={path} description={areaData.description} />;
};

const currentPathViewModel = (state) => ({
  currentPath: state.location.path,
});

const TabHeader = bind(TabHeaderTemplate, currentPathViewModel);

const TabBodyTemplate = ({ currentPath }) => {
  const areaData = getAreaData(currentPath);
  const className = `tab-body ${areaData.identifier}`;
  return (
    <div class={className}>
      <hr />
      <h2>{areaData.description}</h2>
      <p>At path {areaData.path}</p>
    </div>
  );
};

const TabBody = bind(TabBodyTemplate, currentPathViewModel);

const Page = () => {
  return (
    <div class='page'>
      <h1>Where to go, what to do?</h1>
      <div class='tab-headers'>
        <TabHeader path='/simpleLinks' />
        <TabHeader path='/switchTabs' />
      </div>
      <TabBody />
    </div>
  );
};

const reducers = combineReducers(appReducers);

const app = createApp({ handlers: appHandlers, reducers });
const selector = '#app';
app.render({
  selector,
  Template: Page,
});
