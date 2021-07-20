import React, { useEffect, useState } from 'react';
import PropTypes from 'prop-types';

import Main from './Main';

const Root = ({ plugin }) => {
  const [state, setState] = useState({
    developmentMode: plugin.parameters.global.developmentMode,
    fieldValue: plugin.getFieldValue(plugin.fieldPath),
    modularBlocks: plugin.parameters.instance.modular_blocks,
  });

  useEffect(() => {
    const unsubscribe = plugin.addFieldChangeListener(plugin.fieldPath, () => {
      setState({
        developmentMode: plugin.parameters.global.developmentMode,
        fieldValue: plugin.getFieldValue(plugin.fieldPath),
        modularBlocks: plugin.parameters.instance.modular_blocks,
      });
    });

    return () => {
      unsubscribe();
    };
  }, []);

  return <Main plugin={plugin} {...state} />;
};

Root.propTypes = {
  plugin: PropTypes.object.isRequired,
};

export default Root;
