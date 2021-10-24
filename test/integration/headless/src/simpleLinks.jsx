import {
  appHandlers,
  appReducers,
  bind,
  combineReducers,
  createApp,
  jsx,
} from '../../../../lib/jaxs.js';

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

const MaybeLink = ({ currentPath, href, description }) => {
  if (currentPath === href) return <NotLink description={description} />;
  return <Link href={href} description={description} />;
};

const linkViewModel = (state) => ({
  currentPath: state.location.path,
});

const TabHeader = bind(MaybeLink, linkViewModel);

const Page = () => {
  return (
    <div class='page'>
      <h1>Where to go, what to do?</h1>
      <div class='tab-headers'>
        <TabHeader href='/simpleLinks' description='Home area' />
        <TabHeader href='/switchTabs' description='Alternative view' />
      </div>
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
