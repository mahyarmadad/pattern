import {getGlobal} from 'reactn';
import pointInPolygon from 'robust-point-in-polygon';
import GetEnt from './entit';

// patternServe
//"playerPositionBeforeHitting" ,  ,
// "ballHittingPosition",
// 'ballPlacementBoundry',
// 'shotServe'
// ballPlacementTarget

// patternReturn
//'opponentPositionBeforeHitting'
// "ballHittingPosition",
// 'ballPlacementBoundry',
// 'shotServe'
// opponentPositionAfterHitting
// ballPlacementTarget

// patternGroundStroke
// shotForehand
// 'ballPlacementBoundry',
// "ballHittingPosition",
// shotForehandTopSpin
// shotGroundStrokes
// shotGroundStrokesTopSpin
// shotLobBackhandUnderSpin
// shotVolley
// ballPlacementTarget

// patternMidCourt
// "ballHittingPosition",
// 'ballPlacementBoundry',
// ballPlacementTarget

// patternNet
// "ballHittingPosition",
// 'ballPlacementBoundry',
// ballPlacementTarget
//"playerPositionBeforeHitting" ,  ,

// patternDefensive
// opponentPositionBeforeHitting
// '','condition',,'shotWithoutDrop','',
// 'shotGroundStrokesFlat',
// 'shotGroundStrokesUnderSpin','shotDrop','','shotVolleySmash','',
// ,'shotBackhand','shotLob','',,

const GetPlay = () => {
  GetEnt();
  let dxf = getGlobal().dxf.entities;
  let entities2 = getGlobal().entities2;
  //test play for Serve
  let testplay = [
    {
      id: 1,
      time: 0,
      ball: {x: 150, y: 620},
      player: {x: 180, y: 650},
    },
    {
      id: 2,
      time: 1,
      ball: {x: 1630, y: 420}, // x: 1402/1829 - y: 754/960 ; 1402/1829 - 342/548
    },
    {
      id: 3,
      time: 2,
      ball: {x: 500, y: 200},
    },
    {
      id: 4,
      time: 3,
      ball: {x: 1519, y: 400},
    },
  ];

  let testReturn = [
    //play0129
    {
      id: 1,
      time: 0,
      ball: {x: 2245, y: 315}, //x:2195/2561 - y:100/1000
      opponent: {x: 2240, y: 329}, //x:2195/2561 - y:137/548
    },
    {
      id: 2,
      time: 1,
      ball: {x: 987, y: 870}, //x:549/1189 - y: 548/960
      opponent: {x: 1990, y: 586}, //x:1189/2012 - y:274/822
    },
    {
      id: 3,
      time: 2,
      ball: {x: 1780, y: 800},
      shottype: 'shotGroundStrokes',
    },
  ];

  let testGround = [
    //play0129
    {
      id: 1,
      time: 0,
      ball: {x: 2136, y: 150}, //x:1829/2378 - y:137/960
      // shottype: 'shotGroundStrokesTopSpin', // shotGroundStrokesTopSpin // shotForehand
    },
    {
      id: 2,
      time: 1,
    },
    {
      id: 3,
      time: 2,
      ball: {x: 2375, y: 959}, // y:137 x: 1402/2378
      shottype: 'shotLobBackhandUnderSpin', // shotLobBackhandUnderSpin // shotVolley // shotGroundStrokes
    },
  ];

  let play,
    count,
    result = [] ,
    shotplay = [],
    shotplay0 = [],
    typeOfShot,
    typeOfShot1,
    typeOfShot2,
    ballPosition1;

  let playanalisys = dxf
    .filter((o) => o.layer === 'aBase')
    .map((o) => {
      entities2[o.id].inside.map((l) => {
          // for pattern Serve
        if (o.pattern === 'patternServe') {
          let playerPosition = [testplay[0].player.x, testplay[0].player.y];
          let ballPosition = [testplay[0].ball.x, testplay[0].ball.y];
          let ballPosition1 = [testplay[1].ball.x, testplay[1].ball.y];
          let ballPosition2 = [testplay[2].ball.x, testplay[2].ball.y];
          if (entities2[o.id].playRow === 1) {
            if (l.layer === 'playerPositionBeforeHitting') {
              if (
                pointInPolygon(
                  l.localVertices.map((p) => [p.x, p.y]),
                  playerPosition
                ) < 1
              ) {
                play = entities2[o.id].play;
                count = true;
              } else {
                count = false;
                play = null;
              }
            }
            if (
              l.layer === 'ballHittingPosition' &&
              entities2[o.id].play === play &&
              count
            ) {
              if (
                pointInPolygon(
                  l.localVertices.map((p) => [p.x, p.y]),
                  ballPosition
                ) < 1
              ) {
                count = true;
                // console.log('find Ball', entities2[o.id].play);
              } else {
                count = false;
                play = null;
              }
            }
            if (
              l.layer === 'ballPlacementBoundry' &&
              entities2[o.id].play === play &&
              count
            ) {
              if (
                pointInPolygon(
                  l.localVertices.map((p) => [p.x, p.y]),
                  ballPosition1
                ) < 1
              ) {
                // console.log('find Ball hit the ground', entities2[o.id].play);
                count = true;
              } else {
                count = false;
                play = null;
              }
            }
            if (
              l.layer === 'ballPlacementTarget' &&
              entities2[o.id].play === play &&
              count
            ) {
              let point = l.localVertices[0].y - testplay[1].ball.y;
              result.push(
                `Point for first shot is ${point} and play is ${play}`
              );
              // console.log(`Your Point is: ${point}`, entities2[o.id].play);
            }
          }
          if (
            entities2[o.id].playRow === 2 &&
            entities2[o.id].play === play &&
            count
          ) {
            if (l.layer === 'ballPlacementBoundry') {
              if (
                pointInPolygon(
                  l.localVertices.map((p) => [p.x, p.y]),
                  ballPosition2
                ) < 1
              ) {
                count = true;
                // console.log('Ball back and hit in', entities2[o.id].play);
              } else {
                count = false;
                play = null;
              }
              // console.log('Ball back and Went out', entities2[o.id].play);
            }
          }
          if (
            entities2[o.id].playRow === 3 &&
            entities2[o.id].play === play &&
            count
          ) {
            if (l.layer === 'ballPlacementTarget') {
              if (l.localVertices[0].y === l.localVertices[1].y) {
                let point = l.localVertices[0].y - testplay[3].ball.y;
                count = true;
                result.push(
                  `Point for second shot is ${point} and play is ${play}`
                );
              } else if (l.localVertices[0].x === l.localVertices[1].x) {
                let point = l.localVertices[0].x - testplay[3].ball.x;
                count = true;
                result.push(
                  `Point for second shot is ${point} and play is ${play}`
                );
              }
            }
          }
        }
        // for Pattern Return
        if (o.pattern === 'patternReturn') {
          let opponentPosition = [
            testReturn[0].opponent.x,
            testReturn[0].opponent.y,
          ];
          let opponentPosition1 = [
            testReturn[1].opponent.x,
            testReturn[1].opponent.y,
          ];
          let ballPosition = [testReturn[0].ball.x, testReturn[0].ball.y];
          let ballPosition1 = [testReturn[1].ball.x, testReturn[1].ball.y];
          let typeOfShot = testReturn[2].shottype;

          // if row is 1
          if (entities2[o.id].playRow === 1) {
            // if time is 0
            if (l.layer === 'opponentPositionBeforeHitting') {
              if (
                pointInPolygon(
                  l.localVertices.map((p) => [p.x, p.y]),
                  opponentPosition
                ) < 1
              ) {
                play = entities2[o.id].play;
                count = true;
              } else {
                count = false;
                play = null;
              }
            }
            if (
              l.layer === 'ballHittingPosition' &&
              entities2[o.id].play === play &&
              count
            ) {
              if (
                pointInPolygon(
                  l.localVertices.map((p) => [p.x, p.y]),
                  ballPosition
                ) < 1
              ) {
                count = true;
              } else {
                count = false;
                play = null;
              }
            }
            if (
              l.layer === 'ballPlacementBoundry' &&
              entities2[o.id].play === play &&
              count
            ) {
              if (
                pointInPolygon(
                  l.localVertices.map((p) => [p.x, p.y]),
                  ballPosition1
                ) < 1
              ) {
                count = true;
              } else {
                count = false;
                play = null;
              }
            }
            if (opponentPosition !== opponentPosition1) {
              play = null;
              if (l.layer === 'opponentPositionAfterHitting' && count) {
                play = entities2[o.id].play;
                if (l.localVertices.length > 3) {
                  if (
                    pointInPolygon(
                      l.localVertices.map((p) => [p.x, p.y]),
                      opponentPosition1
                    ) < 1
                  ) {
                    count = true;
                    play = entities2[o.id].play;
                  } else {
                    count = false;
                    play = null;
                  }
                }
              }
            }
          }

          if (
            entities2[o.id].playRow === 2 &&
            entities2[o.id].play === play &&
            count
          ) {
            if (l.layer === typeOfShot) {
              entities2[o.id].inside.map((e) => {
                if (
                  e.layer === 'ballPlacementTarget' &&
                  e.aBaseId === l.aBaseId
                ) {
                  if (e.localVertices[0].y === e.localVertices[1].y) {
                    let point = e.localVertices[0].y - testReturn[2].ball.y;
                    result.push(
                      `Point for return shot is ${point} and play is ${play}`
                    );
                  } else if (e.localVertices[0].x === e.localVertices[1].x) {
                    let point = e.localVertices[0].x - testReturn[2].ball.x;
                    result.push(
                      `Point for return shot is ${point} and play is ${play}`
                    );
                  }
                }
              });
            }
          }
        }
      // Pattern Ground Stroke
      if (o.pattern === 'patternGroundStroke') {
        entities2[o.id].inside.map((l) => {
          let ballPosition = [testGround[0].ball.x, testGround[0].ball.y];
          if (testGround[1].ball)
            ballPosition1 = [testGround[1].ball.x, testGround[1].ball.y];
          if (testGround[0].shottype) typeOfShot = testGround[0].shottype;
          if (testGround[1].shottype) typeOfShot1 = testGround[1].shottype;
          if (testGround[2].shottype) typeOfShot2 = testGround[2].shottype;

          // if time is 0 and row is 1
          if (entities2[o.id].playRow === 1) {
            if (l.layer === 'ballPlacementBoundry') {
              if (
                pointInPolygon(
                  l.localVertices.map((p) => [p.x, p.y]),
                  ballPosition
                ) < 1
              ) {
                count = true;
                play = entities2[o.id].play;
              } else {
                count = null;
                play = null;
              }
            }
            if (
              l.layer === 'shotGroundStrokesTopSpin' ||
              l.layer === 'shotGroundStrokesTopSpin' ||
              l.layer === 'shotForehand'
            ) {
              shotplay0.push(entities2[o.id].play);
              if (l.layer === typeOfShot) {
                entities2[o.id].inside.map((e) => {
                  if (
                    e.layer === 'ballPlacementTarget' &&
                    e.aBaseId === l.aBaseId &&
                    count
                  ) {
                    if (e.localVertices[0].y === e.localVertices[1].y) {
                      let point = e.localVertices[0].y - testGround[0].ball.y;
                      result.push(
                        `Point for first in ground shot with ${typeOfShot} is ${point} and play is ${play}`
                      );
                      count = true;
                      play = entities2[o.id].play;
                    } else if (e.localVertices[0].x === e.localVertices[1].x) {
                      let point = e.localVertices[0].x - testGround[0].ball.x;
                      result.push(
                        `Point for first in ground shot with ${typeOfShot} is ${point} and play is ${play}`
                      );
                      count = true;
                      play = entities2[o.id].play;
                    }
                  } else {
                    if (e.aBaseId === l.aBaseId && count) {
                      count = true;
                      play = entities2[o.id].play;
                    } else {
                      count = null;
                      play = null;
                    }
                  }
                });
              }
            } else if (!typeOfShot) {
              if (!shotplay0.includes(entities2[o.id].play)) {
                if (l.layer === 'ballPlacementTarget') {
                  if (l.localVertices[0].y === l.localVertices[1].y) {
                    let point = l.localVertices[0].y - testGround[0].ball.y;
                    result.push(
                      `Point for first in ground shot with no shottype is ${point} and play is ${play}`
                    );
                  } else if (l.localVertices[0].x === l.localVertices[1].x) {
                    let point = l.localVertices[0].x - testGround[0].ball.x;
                    result.push(
                      `Point for first in ground shot with no shottype is ${point} and play is ${play}`
                    );
                  }
                }
              }
            }
          }
          // if time is 1 and row is 2
          if (
            entities2[o.id].playRow === 2 &&
            entities2[o.id].play === play &&
            count
          ) {
            if (l.layer === 'ballPlacementBoundry') {
              if (ballPosition1) {
                if (
                  pointInPolygon(
                    l.localVertices.map((p) => [p.x, p.y]),
                    ballPosition1
                  ) < 1
                ) {
                  count = true;
                } else {
                  count = null;
                  play = null;
                }
              }
            } else if (l.layer === typeOfShot1) {
              entities2[o.id].inside.map((e) => {
                console.log('here2', e, play);
                if (
                  e.layer === 'ballPlacementTarget' &&
                  e.aBaseId === l.aBaseId &&
                  count
                ) {
                  if (e.localVertices[0].y === e.localVertices[1].y) {
                    let point = e.localVertices[0].y - testGround[1].ball.y;
                    result.push(
                      `Point for second in ground shot is ${point} and play is ${play}`
                    );
                    count = true;
                    play = entities2[o.id].play;
                  } else if (e.localVertices[0].x === e.localVertices[1].x) {
                    let point = e.localVertices[0].x - testGround[1].ball.x;
                    result.push(
                      `Point for second in ground shot is ${point} and play is ${play}`
                    );
                    count = true;
                    play = entities2[o.id].play;
                  }
                }
                // else {
                //   count = null;
                //   play = null;
                // }
              });
            }
          }

          // if time is 2 and row is 3
          if (
            entities2[o.id].playRow === 3 &&
            entities2[o.id].play === play &&
            count
          ) {
            if (
              l.layer === 'shotLobBackhandUnderSpin' ||
              l.layer === 'shotVolley' ||
              l.layer === 'shotGroundStrokes'
            ) {
              shotplay.push(entities2[o.id].play);
              if (typeOfShot2 === l.layer) {
                entities2[l.aBaseId].inside.map((k) => {
                  if (k.layer === 'ballPlacementTarget') {
                    if (k.localVertices[0].y === k.localVertices[1].y) {
                      let point = k.localVertices[0].y - testGround[2].ball.y;
                      result.push(
                        `Point for third in ground shot with ${typeOfShot2} is ${point} and play is ${play}`
                      );
                    } else if (k.localVertices[0].x === k.localVertices[1].x) {
                      let point = k.localVertices[0].x - testGround[2].ball.x;
                      result.push(
                        `Point for third in ground shot with ${typeOfShot2} is ${point} and play is ${play}`
                      );
                    }
                  }
                });
              }
            } else {
              if (
                l.layer !== 'shotLobBackhandUnderSpin' ||
                l.layer !== 'shotVolley' ||
                l.layer !== 'shotGroundStrokes'
              ) {
                if (!typeOfShot2) {
                  if (!shotplay.includes(entities2[o.id].play)) {
                    console.log(shotplay, entities2[o.id].play);
                    entities2[l.aBaseId].inside.map((k) => {
                      if (k.layer === 'ballPlacementTarget') {
                        if (k.localVertices[0].y === k.localVertices[1].y) {
                          let point =
                            k.localVertices[0].y - testGround[2].ball.y;
                          result.push(
                            `Point for third in ground shot with no shottype is ${point} and play is ${play}`
                          );
                        } else if (
                          k.localVertices[0].x === k.localVertices[1].x
                        ) {
                          let point =
                            k.localVertices[0].x - testGround[2].ball.x;
                          result.push(
                            `Point for third in ground shot with no shottype is ${point} and play is ${play}`
                          );
                        }
                      }
                    });
                  }
                }
              }
            }
          }
        });
      }
      });
    });
  return console.log(result);
};
export default GetPlay;
