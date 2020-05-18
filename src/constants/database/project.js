import Parse from 'parse';

const Projects = Parse.Object.extend('Projects');

export const newProject = (title, properties) => {
  const sessionToken = localStorage.getItem('session');
  let pr = new Projects();
  return pr.save({title, properties}, {sessionToken});
};

export const editProject = (id, title, properties) => {
  const sessionToken = localStorage.getItem('session');
  let pr = new Projects({id});
  return pr.save({title, properties}, {sessionToken});
};

export const getProjects = () => {
  const sessionToken = localStorage.getItem('session');
  let query = new Parse.Query(Projects);
  query.limit(500);
  return query.find({sessionToken});
};
