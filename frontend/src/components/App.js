import React from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';

import { ThemeProvider } from '@mui/material/styles';

import CampaignPage from './pages/CampaignPage.react';
import InvoicePage from './pages/InvoicePage.react';
import LineItemPage from './pages/LineItemPage.react';

import theme from '../theme/Theme';

function App() {
    return (
        <ThemeProvider theme={theme}r>
            <BrowserRouter>
                <Routes>
                    <Route path="/" element={<CampaignPage/>} />
                    <Route path="/campaigns" element={<CampaignPage/>} />
                    <Route path="/line-items/campaign/:id" element={<LineItemPage/>} />
                    <Route path="/invoices" exact element={<InvoicePage/>} />
                </Routes>
            </BrowserRouter>
        </ThemeProvider>
    );
}

export default App;
