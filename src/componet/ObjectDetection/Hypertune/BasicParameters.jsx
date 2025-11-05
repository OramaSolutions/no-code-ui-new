import React from 'react';
import { motion } from 'framer-motion';
import ParameterInput from './ParameterInput';
import ParameterSlider from './ParameterSlider';

function BasicParameters({ values, onValueChange }) {
    const parameters = [
        {
            name: 'imgsz',
            label: 'Image Size',
            type: 'number',
            tooltip: 'Increase the image size if objects to be detected are too small. Common sizes: 640, 1280, 1600 (only use with efficient).',
            value: values.imgsz,
        },
        {
            name: 'batch',
            label: 'Batch Size',
            type: 'number',
            tooltip: 'Number of images to pass in one go. If training gives errors, reduce the batch size.',
            value: values.batch,
        },
        {
            name: 'epochs',
            label: 'Epochs',
            type: 'number',
            tooltip: 'Maximum number of training iterations.',
            value: values.epochs,
        },
    ];

    const sliderParameters = [
        {
            name: 'mosaic',
            label: 'Mosaic',
            tooltip: 'Disable if images are similar and object size is small.',
            value: values.mosaic,
            min: 0,
            max: 1,
            step: 0.1,
        },
        {
            name: 'fliplr',
            label: 'Flip Left-Right',
            tooltip: 'Probability of images to flip left to right during training.',
            value: values.fliplr,
            min: 0,
            max: 1,
            step: 0.1,
        },
        {
            name: 'flipud',
            label: 'Flip Up-Down',
            tooltip: 'Probability of images to flip upside down during training.',
            value: values.flipud,
            min: 0,
            max: 1,
            step: 0.1,
        },
        {
            name: 'validation_conf',
            label: 'Validation Confidence',
            tooltip: 'Confidence threshold for validating training.',
            value: values.validation_conf,
            min: 0,
            max: 1,
            step: 0.1,
        },
    ];

    return (
        <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4 }}
            className="space-y-6"
        >
            <h3 className="text-lg font-bold text-slate-800 flex items-center gap-2">
                <div className="w-1 h-6 bg-gradient-to-b from-blue-600 to-indigo-600 rounded-full" />
                Basic Parameters
            </h3>

            {/* Number Inputs */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                {parameters.map((param) => (
                    <ParameterInput
                        key={param.name}
                        name={param.name}
                        label={param.label}
                        tooltip={param.tooltip}
                        value={param.value}
                        onChange={(value) => onValueChange(param.name, value)}
                    />
                ))}
            </div>

            {/* Sliders */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 pt-4">
                {sliderParameters.map((param) => (
                    <ParameterSlider
                        key={param.name}
                        name={param.name}
                        label={param.label}
                        tooltip={param.tooltip}
                        value={param.value}
                        min={param.min}
                        max={param.max}
                        step={param.step}
                        onChange={(value) => onValueChange(param.name, value)}
                    />
                ))}
            </div>
        </motion.div>
    );
}

export default BasicParameters;
