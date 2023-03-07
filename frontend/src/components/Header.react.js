import React, { useState, useCallback } from "react";
import { Link } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux'
import PropTypes from 'prop-types';

import AppBar from '@mui/material/AppBar';
import Toolbar from '@mui/material/Toolbar';
import useScrollTrigger from '@mui/material/useScrollTrigger';
import Box from '@mui/material/Box';
import Menu from "@mui/material/Menu";
import MenuIcon from "@mui/icons-material/Menu";
import MenuItem from "@mui/material/MenuItem";
import Typography from '@mui/material/Typography';
import IconButton from "@mui/material/IconButton";
import Button from "@mui/material/Button";
import InputLabel from '@mui/material/InputLabel';
import FormControl from '@mui/material/FormControl';
import Select from '@mui/material/Select';

import { setCurrency, getCurrencyRate } from '../features/appSlice';

function ElevationScroll(props) {
    const { children } = props;
    const trigger = useScrollTrigger({
        disableHysteresis: true,
        threshold: 0,
    });

    return React.cloneElement(children, {
        elevation: trigger ? 4 : 0,
    });
}

ElevationScroll.propTypes = {
    children: PropTypes.element.isRequired,
};

const pages = ['campaigns', 'invoices'];

export default function Header(props) {
    const [anchorElNav, setAnchorElNav] = useState(null);
    const dispatch = useDispatch()

    const handleOpenNavMenu = useCallback((event) => {
        setAnchorElNav(event.currentTarget);
    }, []);

    const handleCloseNavMenu = useCallback(() => {
        setAnchorElNav(null);
    }, []);

    const currentCurrency = useSelector((state) => (state.app.currentCurrency));
    const handleCurrencyChange = useCallback((event) => {
        const currency = event.target.value;

        dispatch(setCurrency(currency));
        dispatch(getCurrencyRate(currency));
    }, [dispatch]);

    return (
        <>
            <ElevationScroll>
                <AppBar position="fixed" color="primary">
                    <Toolbar>
                        <Typography
                            variant="h5"
                            component="a"
                            href="/"
                            sx={{
                                mr: 2,
                                display: { xs: 'none', md: 'flex' },
                                letterSpacing: '.05rem',
                                color: 'inherit',
                                textDecoration: 'none'
                            }}
                        >
                            Campaign Invoice System
                        </Typography>
                        <Box sx={{ flexGrow: 1, display: { xs: 'flex', md: 'none' } }}>
                            <IconButton
                                size="large"
                                aria-label="account of current user"
                                aria-controls="menu-appbar"
                                aria-haspopup="true"
                                onClick={handleOpenNavMenu}
                                color="inherit"
                            >
                            <MenuIcon />
                            </IconButton>
                            <Menu
                                id="menu-appbar"
                                anchorEl={anchorElNav}
                                anchorOrigin={{
                                    vertical: "bottom",
                                    horizontal: "left"
                                }}
                                keepMounted
                                transformOrigin={{
                                    vertical: "top",
                                    horizontal: "left"
                                }}
                                open={Boolean(anchorElNav)}
                                onClose={handleCloseNavMenu}
                                sx={{
                                    display: { xs: "block", md: "none" }
                                }}
                            >
                                {pages.map((page) => (
                                    <MenuItem key={page} onClick={handleCloseNavMenu}>
                                        <Typography
                                            textAlign="center"
                                            sx={{
                                                textTransform: 'capitalize',
                                                textDecoration: 'none',
                                                color: 'inherit',
                                            }}
                                        >
                                            <Link style={{
                                                textDecoration: 'none',
                                                color: 'inherit',
                                            }} to={`/${page}`}>
                                                {page}
                                            </Link>
                                        </Typography>
                                    </MenuItem>
                                ))}
                            </Menu>
                        </Box>
                        <Typography
                            variant="h5"
                            component="a"
                            href="/"
                            sx={{
                                mr: 2,
                                display: { xs: "flex", md: "none" },
                                flexGrow: 1,
                                letterSpacing: ".05rem",
                                color: "inherit",
                                textDecoration: "none"
                            }}
                        >
                            Campaign Invoice System
                        </Typography>
                        <Box sx={{ flexGrow: 1, display: { xs: "none", md: "flex" } }}>
                            {pages.map((page) => (
                            <Button
                                key={page}
                                onClick={handleCloseNavMenu}
                                sx={{ my: 2, color: "white", display: "block" }}
                            >
                                <Link style={{
                                    textDecoration: 'none',
                                    color: 'inherit',
                                }} to={`/${page}`}>
                                    {page}
                                </Link>
                            </Button>
                            ))}
                        </Box>
                        <FormControl
                            size="small"
                            sx={{
                                width: '15%',
                            }}
                        >
                            <InputLabel sx={{ color: 'white'}} id="currency">Currency</InputLabel>
                            <Select
                                labelId="currency"
                                id="currency"
                                value={currentCurrency}
                                label="Currency"
                                onChange={handleCurrencyChange}
                                sx={{
                                    color: 'white',
                                }}
                            >
                                <MenuItem value="USD">USD</MenuItem>
                                <MenuItem value="EUR">EUR</MenuItem>
                            </Select>
                        </FormControl>
                    </Toolbar>

                </AppBar>
            </ElevationScroll>
            <Box
                sx={{
                    minHeight: (theme) => ({ ...theme.mixins.toolbar }),
                }}
            />
        </>
    )
}