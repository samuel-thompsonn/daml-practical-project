import './NamePrompt.css'
import { TextField, Button } from '@material-ui/core'

export default function NamePrompt({ name, onNameChange, onSubmit, disabled=false }) {
    
    return (
        <div className="Name-prompt-container">
            <TextField label="User name" variant="outlined"
                value={name}
                onChange={(event) => onNameChange(event.target.value)}
            ></TextField>
            <Button variant="contained"
                onClick={onSubmit}
                disabled={name === "" || disabled}
            >
                Connect
            </Button>
        </div>
    )
}