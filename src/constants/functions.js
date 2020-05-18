import Parse from 'parse';
import {setGlobal} from 'reactn';
import * as THREE from 'three';

setGlobal({
  user: {
    username: '',
    phone: '',
    verified: '',
  },
});

export const getUser = () => {
  const sessionToken = localStorage.getItem('session');
  if (sessionToken)
    return Parse._request(
      'GET',
      'users/me',
      {},
      {
        sessionToken,
      }
    )
      .then((user) => {
        if (!user.objectId) return Promise.reject();
        setGlobal({
          user: {
            username: user.username,
            phone: user.phone,
            verified: user.verified,
          },
        });
        return Promise.resolve(user);
      })
      .catch((e) => Promise.reject(e));
  else
    return Promise.reject({
      code: -1,
      message: 'there is no session',
    });
};

export const setUser = (user) => {
  localStorage.setItem('session', user.getSessionToken());
  setGlobal({
    user: {
      username: user.get('username'),
      phone: user.get('phone'),
      verified: user.get('verified'),
    },
  });
};

export const removeUser = () => {
  // localStorage.setItem('session', null);
  setGlobal({
    user: {
      username: '',
      phone: '',
      verified: '',
    },
  });
};

export const rayCast = (points, src, dst) => {
  let geometry = new THREE.Geometry();
  for (let p of points) {
    geometry.vertices.push(new THREE.Vector3(p[0], p[1], p[2]));
  }
  geometry.faces.push(new THREE.Face3(0, 1, 2));
  geometry.faces.push(new THREE.Face3(2, 1, 0));
  let redMat = new THREE.MeshBasicMaterial({color: 0xff0000});
  let triangle = new THREE.Mesh(geometry, redMat);
  let origin = new THREE.Vector3(src[0], src[1], src[2]);
  let direction = new THREE.Vector3(
    dst[0] - src[0],
    dst[1] - src[1],
    dst[2] - src[2]
  ).normalize();
  let raycaster = new THREE.Raycaster(origin, direction);
  return raycaster.intersectObject(triangle);
};

export const rayCasts = (objects, src, dst) => {
  let objs = [];
  for (let points of objects) {
    let geometry = new THREE.Geometry();
    for (let p of points) {
      geometry.vertices.push(new THREE.Vector3(p[0], p[1], p[2]));
    }
    geometry.faces.push(new THREE.Face3(0, 1, 2));
    geometry.faces.push(new THREE.Face3(2, 1, 0));
    let redMat = new THREE.MeshBasicMaterial({color: 0xff0000});
    objs.push(new THREE.Mesh(geometry, redMat));
  }
  let origin = new THREE.Vector3(src.x, src.y, src.z);
  let direction = new THREE.Vector3(
    dst.x - src.x,
    dst.y - src.y,
    dst.z - src.z
  ).normalize();
  let raycaster = new THREE.Raycaster(origin, direction);
  return raycaster.intersectObjects(objs);
};

export class Vector3D {
  constructor(x, y, z) {
    this.x = x;
    this.y = y;
    this.z = z;
  }
  plus = (v) => new Vector3D(this.x + v.x, this.y + v.y, this.z + v.z);
  minus = (v) => new Vector3D(this.x - v.x, this.y - v.y, this.z - v.z);
  times = (s) => new Vector3D(this.x * s, this.y * s, this.z * s);
  dot = (v) => new Vector3D(this.x * v.x, this.y * v.y, this.z * v.z);
  toString = () => `{x: ${this.x}, y: ${this.y}, z: ${this.z}}`;
}

export const intersectPoint = (
  rayVector,
  rayPoint,
  planeNormal,
  planePoint
) => {
  let diff = rayPoint.minus(planePoint);
  let prod1 = diff.dot(planeNormal);
  let prod2 = rayVector.dot(planeNormal);
  let prod3 = prod1 / prod2;
  return rayPoint.minus(rayVector.times(prod3));
};
