/** @jsx jsx */
import {useState, useGlobal, useMemo, useEffect} from 'reactn';
import {jsx, css} from '@emotion/core';
import {TextField, Button} from '@material-ui/core';

const mainStyle = css`
  position: relative;
  padding-top: 10px;
  .MuiFormControl-root.MuiTextField-root {
    width: calc(100% - 20px);
    margin: 5px 10px;
  }
  .MuiButton-containedSecondary {
    width: calc(100% - 20px);
    margin: 10px 10px 5px;
  }
  .MuiFormLabel-root {
    color: #777;
  }
  .separator {
    width: 100%;
    height: 1px;
  }
`;

const axisPropertiese = {
  'Top/right movement threshold': 'number',
  'Left/bottom movement threshold': 'number',
  step: 'number',
};

const midAxisPropertiese = {
  'Inner Segmentation': 'number',
  'Left/Top Margin': 'number',
  'Right/Bottom Margin': 'number',
  'Minimum axis distance': 'number',
  'Minimum axis': 'number',
  'Maximum axis': 'number',
};

const AxisEdit = ({selected}) => {
  const [params, setParams] = useState({});
  const [properties, setProperties] = useGlobal('objectProperties');

  const change = useMemo(
    () => (key) => (v) => {
      let clone = JSON.parse(JSON.stringify(params || {}));
      clone[key] = v.target.value;
      setParams(clone);
    },
    [params]
  );

  const apply = useMemo(
    () => () => {
      let clone = properties || {};
      clone[selected.id] = params;
      setProperties(clone);
    },
    [properties, setProperties, params, selected]
  );

  useEffect(() => {
    let clone = properties || {};
    if (selected && selected.id && clone[selected.id])
      setParams(clone[selected.id]);
    else setParams({});
  }, [properties, selected]);

  const props = useMemo(
    () => (selected.midAxis ? midAxisPropertiese : axisPropertiese),
    [selected]
  );

  const saveGen = useMemo(() => () => {}, []);

  return (
    <div>
      {Object.keys(props).map((k) => {
        if (props[k] === 'number' || props[k] === 'text') {
          return (
            <TextField
              key={k}
              label={k}
              value={params && params[k] ? params[k] : ''}
              onChange={change(k)}
              type={props[k]}
              variant="outlined"
            />
          );
        } else return <div></div>;
      })}
      <Button variant="contained" color="secondary" onClick={apply}>
        Apply
      </Button>
      <div className="separator"></div>

      <Button variant="contained" color="secondary" onClick={saveGen}>
        Save Gen
      </Button>
    </div>
  );
};
export const StructureEdit = ({selected}) => {
  return (
    <div css={mainStyle}>
      {selected && selected.objectTypes === 'axis' ? (
        <AxisEdit selected={selected} />
      ) : null}
    </div>
  );
};
