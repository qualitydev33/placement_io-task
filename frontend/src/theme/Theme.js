import { createTheme } from '@mui/material/styles';

const green = "#0D4969";
const orange = "#FF7A2C";

export default createTheme({
    palette: {
        common: {
            blue: green,
            orange: orange,
        },
        primary: {
            main: green,
        },
        secondary: {
            main: orange,
        }
    }
})