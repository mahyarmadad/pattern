import Parse from 'parse';

const DXFFiles = Parse.Object.extend('DXFFiles');
const Projects = Parse.Object.extend('Projects');

export const newDXFFile = (projectId, dxf, title, properties) => {
  const sessionToken = localStorage.getItem('session');
  let pr = new DXFFiles();
  return pr.save(
    {dxf, project: new Projects({id: projectId}), title, properties},
    {sessionToken}
  );
};

export const editDXFFile = (id, title, properties, objectProperties) => {
  const sessionToken = localStorage.getItem('session');
  let pr = new DXFFiles({id});
  pr.set('title', title);
  pr.set('properties', properties);
  pr.set('objectProperties', objectProperties);
  return pr.save(null, {sessionToken});
};

export const removeDXFFile = (id) => {
  const sessionToken = localStorage.getItem('session');
  let pr = new DXFFiles({id});
  return pr.destroy({sessionToken});
};

export const getDXFFiles = (projectId) => {
  const sessionToken = localStorage.getItem('session');
  let query = new Parse.Query(DXFFiles);
  query.equalTo('project', new Projects({id: projectId}));
  query.limit(500);
  return query.find({sessionToken});
};
