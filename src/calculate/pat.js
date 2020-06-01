



            
            if (
              (typeOfShot2 === 'shotLobBackhandUnderSpin' &&
                l.layer === 'shotLobBackhandUnderSpin') ||
              (typeOfShot2 === 'shotGroundStrokes' &&
                l.layer === 'shotGroundStrokes')
            ) {
                if (
                  e.layer === 'ballPlacementTarget' &&
                  e.aBaseId === l.aBaseId
                ) {
                  if (e.localVertices[0].y === e.localVertices[1].y) {
                    let point = e.localVertices[0].y - testGround[2].ball.y;
                    result.push(
                      `Point for third in ground shot with ${l.layer} is ${point} and play is ${play}`
                    );
                    count = true;
                    play = entities2[o.id].play;
                  } else if (e.localVertices[0].x === e.localVertices[1].x) {
                    let point = e.localVertices[0].x - testGround[2].ball.x;
                    result.push(
                      `Point for third in ground shot with ${l.layer} is ${point} and play is ${play}`
                    );
                    count = true;
                    play = entities2[o.id].play;
                  }
                } else {
                  count = null;
                  play = null;
                }
              });
            } else if (
              typeOfShot2 === 'shotVolley' &&
              l.layer === 'shotVolley'
            ) {
              entities2[o.id].inside.map((e) => {
                if (
                  e.layer === 'ballPlacementTarget' &&
                  e.aBaseId === l.aBaseId
                ) {
                  if (e.localVertices[0].y === e.localVertices[1].y) {
                    let point = e.localVertices[0].y - testGround[2].ball.y;
                    result.push(
                      `Point for third in ground shot with ${l.layer} is ${point} and play is ${play}`
                    );
                  } else if (e.localVertices[0].x === e.localVertices[1].x) {
                    let point = e.localVertices[0].x - testGround[2].ball.x;
                    result.push(
                      `Point for third in ground shot with ${l.layer} is ${point} and play is ${play}`
                    );
                  }
                } else {
                  count = null;
                  play = null;
                }
              });
            } else if (
              l.layer === 'ballPlacementTarget' &&
              !typeOfShot2 &&
              count &&
              entities2[o.id].play === play
            ) {
              console.log(play);
              if (l.localVertices[0].y === l.localVertices[1].y) {
                let point = l.localVertices[0].y - testGround[2].ball.y;
                count = true;
                result.push(
                  `Point for third in ground shot is ${point} and play is ${play}`
                );
              } else if (l.localVertices[0].x === l.localVertices[1].x) {
                console.log(play);
                let point = l.localVertices[0].x - testGround[2].ball.x;
                count = true;
                result.push(
                  `Point for third in ground shot is ${point} and play is ${play}`
                );
              }
            }


























// Pattern Mid Court
if (o.pattern === 'patternMidCourt') {
  entities2[o.id].inside.map((l) => {
    let ballPosition = [testReturn[0].ball.x, testReturn[0].ball.y];
    //   if time is 0 and we have ball hitting position
    if (entities2[o.id].playRow === 1) {
      if (time === 0 && playerIsHitting) {
        if (l.layer === 'ballHittingPosition') {
          if (
            pointInPolygon(
              l.localVertices.map((p) => [p.x, p.y]),
              ballPosition
            ) < 1
          ) {
            console.log('You are hitting the ball ', entities2[o.id].play);
            play = entities2[o.id].play;
          }
        }
        // if time is 0 and we have ball placement position
      } else if (time === 0 && playerIsReciving) {
        if (l.layer === 'ballPlacementBoundry') {
          if (
            pointInPolygon(
              l.localVertices.map((p) => [p.x, p.y]),
              ballPosition
            ) < 1
          ) {
            console.log('find Ball hit the ground', entities2[o.id].play);
            play = entities2[o.id].play;
          }
        }
      }
      //   if time is 0 and we had ball hitting position
      if (time === 0 && playerIsHitting && entities2[o.id].play === play) {
        if (entities2[o.id].layer === shotType) {
          findshot = true;
        }
        if (findshot) {
          if (l.layer === 'ballPlacementTarget') {
            let point = l.localVertices[0].x - testReturn[2].ball.x;
            console.log(
              `you hit the ball and the Point is: ${point}`,
              entities2[o.id].play
            );
          }
        }
      }
    }
    //   if time is 1 and we had ball placement position
    if (time === 1 && playerIsReciving && entities2[o.id].play === play) {
      if (entities2[o.id].playRow === 2) {
        if (entities2[o.id].layer === shotType) {
          findshot = true;
        }
        if (findshot) {
          if (l.layer === 'ballPlacementTarget') {
            let point = l.localVertices[0].x - testReturn[2].ball.x;
            console.log(
              `you hit the ball Back and the Point is: ${point}`,
              entities2[o.id].play
            );
          }
        }
      }
    } else if (time === 2 && playerIsHitting && entities2[o.id].play === play) {
      if (entities2[o.id].playRow === 3) {
        if (entities2[o.id].layer === shotType) {
          findshot = true;
        }
        if (findshot) {
          if (l.layer === 'ballPlacementTarget') {
            let point = l.localVertices[0].x - testReturn[2].ball.x;
            console.log(
              `you recive and hit the ball Back and the Point is: ${point}`,
              entities2[o.id].play
            );
          }
        }
      }
    }
  });
}

// Pattern Net
if (o.pattern === 'patternNet') {
  entities2[o.id].inside.map((l) => {
    if (entities2[o.id].playRow === 1) {
      //   if time is 0 and player is hitting
      if (time === 0 && playerIsHitting) {
        if (ballPosition) {
          if (l.layer === 'ballHittingPosition') {
            if (
              pointInPolygon(
                l.localVertices.map((p) => [p.x, p.y]),
                ballPosition
              ) < 1
            ) {
              console.log('You are hitting the ball ', entities2[o.id].play);
              play = entities2[o.id].play;
            }
          }
        } else if (l.layer === 'ballPlacementTarget') {
          let point = l.localVertices[0].x - testReturn[2].ball.x;
          play = entities2[o.id].play;
          console.log(
            `you hit the ball and the Point is: ${point}`,
            entities2[o.id].play
          );
        } else if (ballPosition && playerPosition) {
          if (l.layer === 'playerPositionBeforeHitting') {
            if (
              pointInPolygon(
                l.localVertices.map((p) => [p.x, p.y]),
                playerPosition
              ) < 1
            ) {
              console.log('find Player', entities2[o.id].play);
              play = entities2[o.id].play;
            }
          }
          if (
            l.layer === 'ballHittingPosition' &&
            entities2[o.id].play === play
          ) {
            if (
              pointInPolygon(
                l.localVertices.map((p) => [p.x, p.y]),
                ballPosition
              ) < 1
            ) {
              console.log('find Ball', entities2[o.id].play);
            }
          }
        }
      } else if (time === 0 && playerIsReciving) {
        if (l.layer === 'ballHittingPosition') {
          if (
            pointInPolygon(
              l.localVertices.map((p) => [p.x, p.y]),
              ballPosition
            ) < 1
          ) {
            console.log('You are hitting the ball ', entities2[o.id].play);
            play = entities2[o.id].play;
          }
        }
        if (l.layer === 'ballPlacementBoundry') {
          if (
            pointInPolygon(
              l.localVertices.map((p) => [p.x, p.y]),
              ballPosition
            ) < 1
          ) {
            console.log('find Ball hit the ground', entities2[o.id].play);
            play = entities2[o.id].play;
          }
        }
      }
    }
    if (time === 1 && playerIsReciving) {
      if (entities2[o.id].playRow === 2) {
        if (l.layer === 'ballPlacementTarget') {
          let point = l.localVertices[0].x - testReturn[2].ball.x;
          console.log(
            `you hit the ball Back and Point is: ${point}`,
            entities2[o.id].play
          );
        }
      }
    }
    if (time === 2 && playerIsHitting) {
      if (entities2[o.id].playRow === 3) {
        if (l.layer === 'ballPlacementTarget') {
          let point = l.localVertices[0].x - testReturn[2].ball.x;
          console.log(
            `you hit the ball Back and Point is: ${point}`,
            entities2[o.id].play
          );
        }
      }
    }
  });
}
