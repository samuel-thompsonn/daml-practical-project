import './NamePrompt.css'
import { TextField, Button, Paper } from '@material-ui/core'
import SimpleColorSelect from './SimpleColorSelect'

export default function ConnectionPrompt({ 
    name, 
    onNameChange, 
    onConnect, 
    onDisconnect,
    connected,
    colorOptions,
    color,
    onColorChange
}) {
    
    return (
        <div className="Name-prompt-container">
            <TextField label="User name" variant="outlined"
                value={name}
                onChange={(event) => onNameChange(event.target.value)}
                disabled={connected}
            />
            <SimpleColorSelect
                options={colorOptions}
                value={color}
                onChange={onColorChange}
                disabled={connected}
            />
            <div 
                styles={{ 
                    display: 'flex', 
                    flexDirection: 'column',
                    alignItems: 'center'
                }}
            >
                <Button variant="contained" style={{width: '100%'}}
                    onClick={onConnect}
                    disabled={name === "" || connected}
                >
                    Connect
                </Button>
                <Button variant="contained" style={{width: '100%'}}
                    onClick={onDisconnect}
                    disabled={!connected}
                >
                    Disconnect
                </Button>
            </div>

        </div>
    )
}