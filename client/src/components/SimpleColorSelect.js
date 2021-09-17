import { Paper } from '@material-ui/core'
import { useState } from 'react';

export default function SimpleColorSelect({ options, value, onChange, disabled=false }) {

    const [currColor, setColor] = useState((value)? value :'red');
    const [hoverColor, setHoverColor] = useState(null);

    function determineHeight(color) {
        
        if (value) {
            if (color === value) {
                return 95;
            }
            if (!disabled && color === hoverColor) {
                return 85;
            }
            return 70;
        }
        if (color === currColor) {
            return 95;
        }
        if (!disabled && color === hoverColor) {
            return 85;
        }
        return 70;
    }

    function selectColor(color) {
        if (disabled) { return; }
        if (onChange) { onChange(color); }
        else { setColor(color) }
    }

    return (
            <div style={{
                width: '25%', 
                height: '100%',
                display: 'flex',
                flexDirection: 'row',
                alignItems: 'center'
            }}
            onMouseLeave={() => setHoverColor(null)}
        >
            {options.map((color, index) =>
                <Paper square
                    key={index}
                    onClick={() => selectColor(color)}
                    onMouseEnter={() => setHoverColor(color)}
                    style={{
                        width: `${100/options.length}%`, 
                        height: `${determineHeight(color)}%`, 
                        background: color
                    }}
                />
            )}
        </div>
    )
}