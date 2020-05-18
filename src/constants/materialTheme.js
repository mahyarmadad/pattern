import {createMuiTheme} from '@material-ui/core';

export const materialTheme = createMuiTheme({
  //   breakpoints: {
  //     keys: ["xs", "sm", "md", "lg", "xl"],
  //     values: { xs: 0, sm: 600, md: 960, lg: 1280, xl: 1920 }
  //   },
  //   direction: "ltr",
  mixins: {
    toolbar: {
      // minHeight: 67,
      // "@media (min-width:0px) and (orientation: landscape)": { minHeight: 48 },
      // "@media (min-width:600px)": { minHeight: 64 }
    },
  },
  overrides: {
    MuiInputBase: {
      root: {
        height: 50,
        border: 'none',
      },
      input: {
        paddingLeft: 16,
      },
    },
    MuiTextField: {
      root: {
        backgroundColor: '#1E1E1E',
      },
    },
    MuiMenuItem: {
      root: {
        width: '100%',
        justifyContent: 'center',
      },
    },
    MuiOutlinedInput: {
      notchedOutline: {
        border: 'none',
      },
    },
    MuiSelect: {
      outlined: {
        borderRadius: 0,
        backgroundColor: '#1E1E1E',
      },
      root: {
        '&$disabled': {
          opacity: 0.5,
        },
      },
    },
    MuiStepper: {
      root: {
        padding: 0,
        display: 'flex',
        justifyContent: 'space-between',
      },
    },
    MuiButton: {
      root: {
        minWidth: 30,
      },
    },
    MuiSlider: {
      rail: {
        backgroundColor: '#464646',
      },
    },
    MuiContainer: {
      // root: {
      //   overflow: 'hidden',
      // },
    },
  },
  palette: {
    common: {
      black: '#000',
      white: '#fff',
      blue: '#42FFFF',
      orange: '#FFC043',
      red: '#FF4343',
      lime: '#D5FF43',
      green: '#9EBC34',
    },
    type: 'dark',
    primary: {
      main: '#D5FF43',
      //   light: "rgb(166, 212, 250)",
      //   dark: "rgb(100, 141, 174)",
      //   contrastText: "rgba(0, 0, 0, 0.87)"
    },
    secondary: {
      main: '#111111',
      //   light: "#",
      //   dark: "#959595"
      //   contrastText: "rgba(0, 0, 0, 0.87)"
    },
    selected: {
      main: '#1E1E1E',
      light: '#7B7B7B',
    },
    error: {
      light: '#e57373',
      main: '#f44336',
      dark: '#d32f2f',
      contrastText: '#fff',
    },
    warning: {
      light: '#ffb74d',
      main: '#ff9800',
      dark: '#f57c00',
      contrastText: 'rgba(0, 0, 0, 0.87)',
    },
    info: {
      light: '#64b5f6',
      main: '#2196f3',
      dark: '#1976d2',
      contrastText: '#fff',
    },
    success: {
      light: '#81c784',
      main: '#4caf50',
      dark: '#388e3c',
      contrastText: 'rgba(0, 0, 0, 0.87)',
    },
    grey: {
      '50': '#fafafa',
      '100': '#f5f5f5',
      '200': '#eeeeee',
      '300': '#e0e0e0',
      '400': '#bdbdbd',
      '500': '#9e9e9e',
      '600': '#757575',
      '700': '#616161',
      '800': '#424242',
      '900': '#212121',
      A100: '#d5d5d5',
      A200: '#aaaaaa',
      A400: '#303030',
      A700: '#616161',
    },
    contrastThreshold: 3,
    tonalOffset: 0.2,
    text: {
      primary: '#fff',
      secondary: '#AFAFAF',
      disabled: 'rgba(255, 255, 255, 0.5)',
      hint: '#464646',
      icon: 'rgba(255, 255, 255, 0.5)',
      dark: '#959595',
      darker: '#707070',
    },
    divider: '#464646',
    background: {
      paper: '#424242',
      default: '#121212',
      level2: '#333',
      level1: '#212121',
    },
    action: {
      active: '#fff',
      hover: 'rgba(255, 255, 255, 0.08)',
      hoverOpacity: 0.08,
      selected: 'rgba(255, 255, 255, 0.16)',
      selectedOpacity: 0.16,
      disabled: 'rgba(255, 255, 255, 0.3)',
      disabledBackground: 'rgba(255, 255, 255, 0.12)',
      disabledOpacity: 0.38,
      focus: 'rgba(255, 255, 255, 0.12)',
      focusOpacity: 0.12,
      activatedOpacity: 0.24,
    },
  },
  typography: {
    htmlFontSize: 16,
    fontFamily: '"Roboto", "Helvetica", "Arial", sans-serif',
    fontSize: 14,
    fontWeightLight: 300,
    fontWeightRegular: 400,
    fontWeightMedium: 500,
    fontWeightBold: 700,
    h1: {
      fontFamily: '"Roboto", "Helvetica", "Arial", sans-serif',
      fontWeight: 300,
      fontSize: '6rem',
      lineHeight: 1.167,
      letterSpacing: '-0.01562em',
    },
    h2: {
      fontFamily: '"Roboto", "Helvetica", "Arial", sans-serif',
      fontWeight: 300,
      fontSize: '3.75rem',
      lineHeight: 1.2,
      letterSpacing: '-0.00833em',
    },
    h3: {
      fontFamily: '"Roboto", "Helvetica", "Arial", sans-serif',
      fontWeight: 400,
      fontSize: '2.18rem',
      lineHeight: 1.167,
      letterSpacing: '0em',
    },
    h4: {
      fontFamily: '"Roboto", "Helvetica", "Arial", sans-serif',
      fontWeight: 400,
      fontSize: 20,
      lineHeight: 1.235,
      letterSpacing: '0.00735em',
    },
    h5: {
      fontFamily: '"Roboto", "Helvetica", "Arial", sans-serif',
      fontWeight: 'bold',
      fontSize: 14,
      lineHeight: 1.334,
      letterSpacing: '0em',
    },
    h6: {
      fontFamily: '"Roboto", "Helvetica", "Arial", sans-serif',
      fontWeight: 'bold',
      fontSize: 12,
      lineHeight: 1.6,
      letterSpacing: '0.0075em',
      textTransform: 'capitalize',
    },
    subtitle1: {
      fontFamily: '"Roboto", "Helvetica", "Arial", sans-serif',
      fontWeight: 400,
      fontSize: 9,
      lineHeight: 1.75,
      letterSpacing: '0.00938em',
    },
    subtitle2: {
      fontFamily: '"Roboto", "Helvetica", "Arial", sans-serif',
      fontWeight: 500,
      fontSize: 10,
      lineHeight: 1.57,
      letterSpacing: '0.00714em',
    },
    body1: {
      fontFamily: '"Roboto", "Helvetica", "Arial", sans-serif',
      fontWeight: 400,
      fontSize: 14,
      lineHeight: 1.5,
      letterSpacing: '0.00938em',
    },
    body2: {
      fontFamily: '"Roboto", "Helvetica", "Arial", sans-serif',
      fontWeight: 400,
      fontSize: 12,
      lineHeight: 1.43,
      letterSpacing: '0.01071em',
    },
    button: {
      fontFamily: '"Roboto", "Helvetica", "Arial", sans-serif',
      fontWeight: 'bold',
      fontSize: 14,
      lineHeight: 1.75,
      letterSpacing: '0.02857em',
      textTransform: 'uppercase',
    },
    caption: {
      fontFamily: '"Roboto", "Helvetica", "Arial", sans-serif',
      fontWeight: 400,
      fontSize: '0.75rem',
      lineHeight: 1.66,
      letterSpacing: '0.03333em',
    },
    overline: {
      fontFamily: '"Roboto", "Helvetica", "Arial", sans-serif',
      fontWeight: 400,
      fontSize: '0.75rem',
      lineHeight: 2.66,
      letterSpacing: '0.08333em',
      textTransform: 'uppercase',
    },
  },
});
