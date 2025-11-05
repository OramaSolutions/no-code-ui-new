
import React from 'react';
import Tooltip from 'rc-tooltip';
// import Slider from 'rc-slider';
import 'rc-tooltip/assets/bootstrap.css';
import 'rc-slider/assets/index.css'; // Import tooltip styles

const CustomHandle = ({ value, dragging, index, suffix, ...restProps }) => (
  <Tooltip
    prefixCls="rc-slider-tooltip"
    overlay={`${value?.toFixed(1)}${suffix}`}
    visible={dragging}
    placement="top"
    key={index}
  >
  <div {...restProps} className="rc-slider-handle" />
  </Tooltip>
);

export default CustomHandle;
